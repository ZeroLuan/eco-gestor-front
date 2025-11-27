// ===========================
// COMPONENTE DE ENDEREÇO
// ===========================

import { ESTADOS_BRASIL, EnumUtils } from '../../utils/constants.js';
import { enderecoService } from '../../services/endereco/enderecoService.js';

/**
 * Classe para gerenciar o componente de endereço
 */
export class EnderecoComponent {
    constructor(containerId = 'enderecoComponent') {
        this.containerId = containerId;
        this.enderecoId = null;
        this.enderecoSalvo = false;
        this.onSaveCallback = null;
        this.onChangeCallback = null;
    }

    /**
     * Inicializa o componente carregando o HTML e configurando eventos
     */
    async inicializar(enderecoId = null) {
        this.enderecoId = enderecoId;
        
        // Carrega o HTML do componente se ainda não estiver carregado
        const container = document.getElementById(this.containerId);
        if (!container || !container.querySelector('#enderecoCep')) {
            await this.carregarHTML();
        }
        
        // Configura os eventos
        this.configurarEventos();
        
        // Popula o select de estados
        this.popularEstados();
        
        // Se tem ID, carrega os dados
        if (this.enderecoId) {
            await this.carregarEndereco(this.enderecoId);
        }
    }

    /**
     * Carrega o HTML do componente
     */
    async carregarHTML() {
        try {
            const response = await fetch('./src/components/endereco/endereco.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            const container = document.getElementById(this.containerId);
            
            if (container) {
                container.innerHTML = html;
            } else {
                console.error(`Container ${this.containerId} não encontrado`);
            }
        } catch (error) {
            console.error('Erro ao carregar componente de endereço:', error);
            throw error;
        }
    }

    /**
     * Configura os eventos do componente
     */
    configurarEventos() {
        // Máscara para CEP
        const cepInput = document.getElementById('enderecoCep');
        if (cepInput) {
            cepInput.addEventListener('input', this.aplicarMascaraCep.bind(this));
            cepInput.addEventListener('blur', () => {
                // Só busca se o CEP estiver completo
                const cepValue = cepInput.value.replace(/\D/g, '');
                if (cepValue.length === 8) {
                    this.buscarCep();
                }
            });
        }

        // Botão de buscar CEP
        const btnBuscarCep = document.getElementById('btnBuscarCep');
        if (btnBuscarCep) {
            btnBuscarCep.addEventListener('click', () => this.buscarCep());
        }

        // Botão de salvar endereço
        const btnSalvarEndereco = document.getElementById('btnSalvarEndereco');
        if (btnSalvarEndereco) {
            btnSalvarEndereco.addEventListener('click', () => this.salvarEndereco());
        }

        // Notifica mudanças (marca como não salvo)
        const inputs = ['enderecoCep', 'enderecoLogradouro', 'enderecoNumero', 
                       'enderecoComplemento', 'enderecoBairro', 'enderecoCidade', 'enderecoEstado'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.marcarComoNaoSalvo();
                    if (this.onChangeCallback) {
                        this.onChangeCallback(this.obterDados());
                    }
                });
            }
        });
    }

    /**
     * Aplica máscara no campo de CEP
     */
    aplicarMascaraCep(event) {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        event.target.value = value;
    }

    /**
     * Busca endereço pela API do ViaCEP
     */
    async buscarCep() {
        const cepInput = document.getElementById('enderecoCep');
        const cep = cepInput?.value.replace(/\D/g, '');

        // Validações básicas do CEP
        if (!cep) {
            return;
        }

        if (cep.length !== 8) {
            this.mostrarErroCep('CEP deve ter 8 dígitos.');
            return;
        }

        // Verifica se não é um CEP sequencial (ex: 00000000, 11111111)
        if (/^(\d)\1{7}$/.test(cep)) {
            this.mostrarErroCep('CEP inválido. Digite um CEP válido.');
            return;
        }

        const carregando = document.getElementById('cepCarregando');
        const btnBuscar = document.getElementById('btnBuscarCep');

        try {
            // Mostra loading
            if (carregando) carregando.classList.remove('d-none');
            if (btnBuscar) btnBuscar.disabled = true;

            console.log(`🔍 Buscando CEP: ${cep}`);

            // Faz a requisição para a API ViaCEP
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                // Timeout de 10 segundos
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Verifica se a resposta é válida
            if (typeof data !== 'object' || data === null) {
                throw new Error('Resposta inválida da API');
            }

            // Verifica se o CEP foi encontrado
            if (data.erro === true) {
                this.mostrarErroCep('CEP não encontrado. Verifique se o CEP está correto.');
                return;
            }

            // Verifica se tem pelo menos os campos básicos
            if (!data.logradouro && !data.bairro && !data.localidade) {
                this.mostrarErroCep('CEP encontrado, mas dados incompletos. Preencha manualmente os campos faltantes.');
            }

            // Preenche os campos com os dados da API
            this.preencherCampos({
                cep: data.cep || cep.replace(/(\d{5})(\d{3})/, '$1-$2'), // Formata CEP se necessário
                logradouro: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.uf || '',
                complemento: data.complemento || '',
                // Campos adicionais que podem ser úteis
                ddd: data.ddd || '',
                ibge: data.ibge || '',
                gia: data.gia || '',
                siafi: data.siafi || ''
            });

            // Mostra mensagem de sucesso
            this.mostrarSucessoCep('Endereço encontrado e preenchido automaticamente!');

            // Notifica mudança
            if (this.onChangeCallback) {
                this.onChangeCallback(this.obterDados());
            }

            console.log('✅ CEP encontrado:', data);

        } catch (error) {
            console.error('❌ Erro ao buscar CEP:', error);

            if (error.name === 'TimeoutError') {
                this.mostrarErroCep('Timeout: A busca demorou muito. Tente novamente.');
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.mostrarErroCep('Erro de conexão. Verifique sua internet e tente novamente.');
            } else if (error.message.includes('404')) {
                this.mostrarErroCep('Serviço ViaCEP indisponível. Tente novamente mais tarde.');
            } else {
                this.mostrarErroCep(`Erro ao buscar CEP: ${error.message}`);
            }
        } finally {
            // Esconde loading
            if (carregando) carregando.classList.add('d-none');
            if (btnBuscar) btnBuscar.disabled = false;
        }
    }    /**
     * Mostra mensagem de erro para busca de CEP
     */
    mostrarErroCep(mensagem) {
        const alerta = document.getElementById('enderecoAlerta');
        const alertaTexto = document.getElementById('enderecoAlertaTexto');

        if (alerta && alertaTexto) {
            alerta.classList.remove('d-none', 'alert-info', 'alert-success');
            alerta.classList.add('alert-warning');
            alertaTexto.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${mensagem}`;

            // Remove a mensagem após 5 segundos
            setTimeout(() => {
                alerta.classList.add('d-none');
            }, 5000);
        }
    }

    /**
     * Mostra mensagem de sucesso para busca de CEP
     */
    mostrarSucessoCep(mensagem) {
        const alerta = document.getElementById('enderecoAlerta');
        const alertaTexto = document.getElementById('enderecoAlertaTexto');

        if (alerta && alertaTexto) {
            alerta.classList.remove('d-none', 'alert-info', 'alert-warning', 'alert-danger');
            alerta.classList.add('alert-success');
            alertaTexto.innerHTML = `<i class="bi bi-check-circle me-2"></i>${mensagem}`;

            // Remove a mensagem após 3 segundos
            setTimeout(() => {
                alerta.classList.add('d-none');
            }, 3000);
        }
    }

    /**
     * Popula o select de estados
     */
    popularEstados() {
        const selectEstado = document.getElementById('enderecoEstado');
        if (!selectEstado) return;

        // Limpa opções existentes (exceto a primeira)
        while (selectEstado.options.length > 1) {
            selectEstado.remove(1);
        }

        const opcoes = EnumUtils.toSelectOptions(ESTADOS_BRASIL);
        opcoes.forEach(opcao => {
            const option = document.createElement('option');
            option.value = opcao.value;
            option.textContent = opcao.label;
            selectEstado.appendChild(option);
        });
    }

    /**
     * Preenche os campos com dados
     */
    preencherCampos(dados) {
        // CEP
        if (dados.cep) {
            const cepInput = document.getElementById('enderecoCep');
            if (cepInput) cepInput.value = dados.cep;
        }

        // Logradouro
        if (dados.logradouro) {
            const logradouroInput = document.getElementById('enderecoLogradouro');
            if (logradouroInput) logradouroInput.value = dados.logradouro;
        }

        // Número (não preenchido automaticamente pela API)
        if (dados.numero) {
            const numeroInput = document.getElementById('enderecoNumero');
            if (numeroInput) numeroInput.value = dados.numero;
        }

        // Complemento
        if (dados.complemento) {
            const complementoInput = document.getElementById('enderecoComplemento');
            if (complementoInput) complementoInput.value = dados.complemento;
        }

        // Bairro
        if (dados.bairro) {
            const bairroInput = document.getElementById('enderecoBairro');
            if (bairroInput) bairroInput.value = dados.bairro;
        }

        // Cidade (localidade na API ViaCEP)
        if (dados.cidade) {
            const cidadeInput = document.getElementById('enderecoCidade');
            if (cidadeInput) cidadeInput.value = dados.cidade;
        }

        // Estado (uf na API ViaCEP)
        if (dados.estado) {
            const estadoSelect = document.getElementById('enderecoEstado');
            if (estadoSelect) estadoSelect.value = dados.estado;
        }

        // Campos adicionais da API (armazenados para uso futuro se necessário)
        if (dados.ddd) this.ddd = dados.ddd;
        if (dados.ibge) this.ibge = dados.ibge;
        if (dados.gia) this.gia = dados.gia;
        if (dados.siafi) this.siafi = dados.siafi;
    }

    /**
     * Obtém os dados do formulário
     */
    obterDados() {
        return {
            id: this.enderecoId,
            cep: (document.getElementById('enderecoCep')?.value || '').toString(),
            logradouro: (document.getElementById('enderecoLogradouro')?.value || '').toString(),
            numero: (document.getElementById('enderecoNumero')?.value || '').toString(),
            complemento: (document.getElementById('enderecoComplemento')?.value || '').toString(),
            bairro: (document.getElementById('enderecoBairro')?.value || '').toString(),
            cidade: (document.getElementById('enderecoCidade')?.value || '').toString(),
            estado: (document.getElementById('enderecoEstado')?.value || '').toString()
        };
    }

    /**
     * Limpa todos os campos
     */
    limpar() {
        this.enderecoId = null;
        this.enderecoSalvo = false;
        document.getElementById('enderecoId').value = '';
        document.getElementById('enderecoCep').value = '';
        document.getElementById('enderecoLogradouro').value = '';
        document.getElementById('enderecoNumero').value = '';
        document.getElementById('enderecoComplemento').value = '';
        document.getElementById('enderecoBairro').value = '';
        document.getElementById('enderecoCidade').value = '';
        document.getElementById('enderecoEstado').value = '';
        this.marcarComoNaoSalvo();
        
        // Reseta o texto do botão
        const textoBtn = document.getElementById('textoBtnSalvarEndereco');
        if (textoBtn) {
            textoBtn.textContent = 'Salvar Endereço';
        }
    }

    /**
     * Valida os campos obrigatórios
     */
    validar() {
        const dados = this.obterDados();
        const erros = [];

        if (!dados.cep.trim()) erros.push('CEP é obrigatório');
        if (!dados.logradouro.trim()) erros.push('Logradouro é obrigatório');
        if (!dados.numero.trim()) erros.push('Número é obrigatório');
        if (!dados.bairro.trim()) erros.push('Bairro é obrigatório');
        if (!dados.cidade.trim()) erros.push('Cidade é obrigatória');
        if (!dados.estado.trim()) erros.push('Estado é obrigatório');

        return {
            isValid: erros.length === 0,
            errors: erros
        };
    }

    async salvarEndereco() {
        try {
            // Obtém os dados primeiro
            const dados = this.obterDados();
            console.log('📝 Dados obtidos para salvar:', dados);

            // Valida os dados
            const validacao = this.validar();
            if (!validacao.isValid) {
                alert(`Erros no endereço:\n${validacao.errors.join('\n')}`);
                return null;
            }

            const btnSalvar = document.getElementById('btnSalvarEndereco');
            const textoBtn = document.getElementById('textoBtnSalvarEndereco');
            const alerta = document.getElementById('enderecoAlerta');
            const alertaTexto = document.getElementById('enderecoAlertaTexto');

            // Mostra loading
            if (btnSalvar) {
                btnSalvar.disabled = true;
                textoBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Salvando...';
            }

            let response;

            if (this.enderecoId) {
                // Atualiza endereço existente
                console.log('🔄 Atualizando endereço existente ID:', this.enderecoId);
                response = await enderecoService.atualizar(this.enderecoId, dados);
            } else {
                // Cria novo endereço
                console.log('➕ Criando novo endereço');
                response = await enderecoService.criar(dados);
            }

            console.log('✅ Resposta da API:', response);

            // Verifica se a resposta é válida
            if (!response || typeof response !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            // Armazena o ID retornado
            this.enderecoId = response.id;
            this.enderecoSalvo = true;

            // Atualiza o campo hidden
            const campoId = document.getElementById('enderecoId');
            if (campoId) {
                campoId.value = response.id || '';
            }

            // Marca como salvo visualmente
            this.marcarComoSalvo();

            // Mostra mensagem de sucesso
            if (alerta && alertaTexto) {
                alerta.classList.remove('d-none', 'alert-info');
                alerta.classList.add('alert-success');
                alertaTexto.innerHTML = '<i class="bi bi-check-circle me-2"></i>Endereço salvo com sucesso!';
                
                setTimeout(() => {
                    alerta.classList.add('d-none');
                }, 3000);
            }

            // Chama callback se fornecido
            if (this.onSaveCallback) {
                this.onSaveCallback(response);
            }

            console.log('✅ Endereço salvo com sucesso:', response);
            return response;

        } catch (error) {
            console.error('❌ Erro ao salvar endereço:', error);
            
            const alerta = document.getElementById('enderecoAlerta');
            const alertaTexto = document.getElementById('enderecoAlertaTexto');
            
            if (alerta && alertaTexto) {
                alerta.classList.remove('d-none', 'alert-info', 'alert-success');
                alerta.classList.add('alert-danger');
                alertaTexto.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>Erro ao salvar: ${error.message}`;
            }

            return null;
        } finally {
            // Restaura botão
            const btnSalvar = document.getElementById('btnSalvarEndereco');
            const textoBtn = document.getElementById('textoBtnSalvarEndereco');
            
            if (btnSalvar) {
                btnSalvar.disabled = false;
                textoBtn.textContent = this.enderecoId ? 'Atualizar Endereço' : 'Salvar Endereço';
            }
        }
    }    /**
     * Marca visualmente que o endereço foi salvo
     */
    marcarComoSalvo() {
        this.enderecoSalvo = true;
        
        const indicador = document.getElementById('enderecoSalvoIndicador');
        if (indicador) {
            indicador.classList.remove('d-none');
        }

        // Campos permanecem editáveis após salvar
    }

    /**
     * Marca que o endereço precisa ser salvo novamente
     */
    marcarComoNaoSalvo() {
        if (this.enderecoSalvo) {
            this.enderecoSalvo = false;
            
            const indicador = document.getElementById('enderecoSalvoIndicador');
            if (indicador) {
                indicador.classList.add('d-none');
            }

            // Campos permanecem editáveis
        }
    }

    /**
     * Verifica se o endereço está salvo
     */
    estaSalvo() {
        return this.enderecoSalvo && this.enderecoId !== null;
    }

    /**
     * Retorna o ID do endereço salvo
     */
    getEnderecoId() {
        return this.enderecoId;
    }

    /**
     * Carrega dados de um endereço existente
     */
    async carregarEndereco(id) {
        try {
            // TODO: Integrar com enderecoService quando estiver pronto
            console.log('Carregando endereço ID:', id);
            // const endereco = await enderecoService.buscarPorId(id);
            // this.preencherCampos(endereco);
        } catch (error) {
            console.error('Erro ao carregar endereço:', error);
            throw error;
        }
    }

    /**
     * Define callback para mudanças nos dados
     */
    onChange(callback) {
        this.onChangeCallback = callback;
    }

    /**
     * Define callback para quando o endereço for salvo
     */
    onSave(callback) {
        this.onSaveCallback = callback;
    }
}

// Exporta uma instância padrão
export const enderecoComponent = new EnderecoComponent();
