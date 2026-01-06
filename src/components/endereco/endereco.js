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
        
        // Gera IDs únicos baseados no containerId para evitar conflitos
        this.ids = {
            component: `${containerId}_component`,
            enderecoId: `${containerId}_enderecoId`,
            cep: `${containerId}_cep`,
            btnBuscarCep: `${containerId}_btnBuscarCep`,
            cepCarregando: `${containerId}_cepCarregando`,
            logradouro: `${containerId}_logradouro`,
            numero: `${containerId}_numero`,
            complemento: `${containerId}_complemento`,
            bairro: `${containerId}_bairro`,
            cidade: `${containerId}_cidade`,
            estado: `${containerId}_estado`,
            btnSalvar: `${containerId}_btnSalvar`,
            textoBtnSalvar: `${containerId}_textoBtnSalvar`,
            alerta: `${containerId}_alerta`,
            alertaTexto: `${containerId}_alertaTexto`,
            salvoIndicador: `${containerId}_salvoIndicador`
        };
    }

    /**
     * Inicializa o componente carregando o HTML e configurando eventos
     */
    async inicializar(enderecoId = null) {
        this.enderecoId = enderecoId;
        
        // Carrega o HTML do componente se ainda não estiver carregado
        const container = document.getElementById(this.containerId);
        if (!container || !container.querySelector(`#${this.ids.cep}`)) {
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
            console.log('📄 Carregando HTML do componente de endereço...');
            
            // HTML do componente incluído diretamente com IDs únicos
            const html = `
<div class="endereco-component" id="${this.ids.component}">
	<input type="hidden" id="${this.ids.enderecoId}" value="">
	
	<div class="d-flex justify-content-between align-items-center mb-3">
		<h6 class="mb-0">Endereço</h6>
		<span class="badge bg-success d-none" id="${this.ids.salvoIndicador}">
			<i class="bi bi-check-circle me-1"></i>
			Endereço Salvo
		</span>
	</div>
	
	<div class="row">
		<!-- CEP -->
		<div class="col-md-4 mb-3">
			<label for="${this.ids.cep}" class="form-label">CEP <span class="text-danger">*</span></label>
			<div class="input-group">
				<input type="text" class="form-control" id="${this.ids.cep}" placeholder="00000-000" maxlength="9" required>
				<button class="btn btn-outline-secondary" type="button" id="${this.ids.btnBuscarCep}" title="Buscar CEP">
					<i class="bi bi-search"></i>
				</button>
			</div>
			<small class="text-muted d-none" id="${this.ids.cepCarregando}">
				<span class="spinner-border spinner-border-sm" role="status"></span>
				Buscando...
			</small>
		</div>
		
		<!-- Logradouro -->
		<div class="col-md-8 mb-3">
			<label for="${this.ids.logradouro}" class="form-label">Logradouro <span class="text-danger">*</span></label>
			<input type="text" class="form-control" id="${this.ids.logradouro}" placeholder="Rua, Avenida, etc." required>
		</div>
	</div>
	
	<div class="row">
		<!-- Número -->
		<div class="col-md-3 mb-3">
			<label for="${this.ids.numero}" class="form-label">Número <span class="text-danger">*</span></label>
			<input type="text" class="form-control" id="${this.ids.numero}" placeholder="123" required>
		</div>
		
		<!-- Complemento -->
		<div class="col-md-5 mb-3">
			<label for="${this.ids.complemento}" class="form-label">Complemento</label>
			<input type="text" class="form-control" id="${this.ids.complemento}" placeholder="Apto, Bloco, etc.">
		</div>
		
		<!-- Bairro -->
		<div class="col-md-4 mb-3">
			<label for="${this.ids.bairro}" class="form-label">Bairro <span class="text-danger">*</span></label>
			<input type="text" class="form-control" id="${this.ids.bairro}" placeholder="Centro" required>
		</div>
	</div>
	
	<div class="row">
		<!-- Cidade -->
		<div class="col-md-8 mb-3">
			<label for="${this.ids.cidade}" class="form-label">Cidade <span class="text-danger">*</span></label>
			<input type="text" class="form-control" id="${this.ids.cidade}" placeholder="São Paulo" required>
		</div>
		
		<!-- Estado -->
		<div class="col-md-4 mb-3">
			<label for="${this.ids.estado}" class="form-label">Estado <span class="text-danger">*</span></label>
			<select class="form-select" id="${this.ids.estado}" required>
				<option value="">Selecione...</option>
			</select>
		</div>
	</div>
	
	<!-- Botão Salvar Endereço -->
	<div class="d-flex justify-content-end mb-3">
		<button type="button" class="btn btn-success" id="${this.ids.btnSalvar}">
			<i class="bi bi-save me-1"></i>
			<span id="${this.ids.textoBtnSalvar}">Salvar Endereço</span>
		</button>
	</div>
	
	<div class="alert alert-info d-none" id="${this.ids.alerta}">
		<i class="bi bi-info-circle me-2"></i>
		<span id="${this.ids.alertaTexto}">Salve o endereço antes de continuar.</span>
	</div>
</div>`;
            
            const container = document.getElementById(this.containerId);
            
            if (container) {
                container.innerHTML = html;
                console.log('📄 HTML inserido no container');
            } else {
                console.error(`❌ Container ${this.containerId} não encontrado`);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar componente de endereço:', error);
            throw error;
        }
    }

    /**
     * Configura os eventos do componente
     */
    configurarEventos() {
        console.log('🔧 Configurando eventos do componente de endereço');
        // Máscara para CEP
        const cepInput = document.getElementById(this.ids.cep);
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
        const btnBuscarCep = document.getElementById(this.ids.btnBuscarCep);
        if (btnBuscarCep) {
            console.log('✅ Botão buscar CEP encontrado, adicionando event listener');
            btnBuscarCep.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                console.log('🔍 Botão buscar CEP clicado');
                this.buscarCep();
            });
            console.log('✅ Event listener adicionado ao botão buscar CEP');
        } else {
            console.error('❌ Botão buscar CEP não encontrado');
        }

        // Botão de salvar endereço
        const btnSalvarEndereco = document.getElementById(this.ids.btnSalvar);
        if (btnSalvarEndereco) {
            btnSalvarEndereco.addEventListener('click', () => this.salvarEndereco());
        }

        // Notifica mudanças (marca como não salvo)
        const inputIds = [this.ids.cep, this.ids.logradouro, this.ids.numero, 
                       this.ids.complemento, this.ids.bairro, this.ids.cidade, this.ids.estado];
        
        inputIds.forEach(inputId => {
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
        console.log('🔍 Método buscarCep chamado');
        const cepInput = document.getElementById(this.ids.cep);
        const cep = cepInput?.value.replace(/\D/g, '');

        console.log('📝 CEP digitado:', cep);

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

        const carregando = document.getElementById(this.ids.cepCarregando);
        const btnBuscar = document.getElementById(this.ids.btnBuscarCep);

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
        const alerta = document.getElementById(this.ids.alerta);
        const alertaTexto = document.getElementById(this.ids.alertaTexto);

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
        const alerta = document.getElementById(this.ids.alerta);
        const alertaTexto = document.getElementById(this.ids.alertaTexto);

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
        const selectEstado = document.getElementById(this.ids.estado);
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
            const cepInput = document.getElementById(this.ids.cep);
            if (cepInput) cepInput.value = dados.cep;
        }

        // Logradouro
        if (dados.logradouro) {
            const logradouroInput = document.getElementById(this.ids.logradouro);
            if (logradouroInput) logradouroInput.value = dados.logradouro;
        }

        // Número (não preenchido automaticamente pela API)
        if (dados.numero) {
            const numeroInput = document.getElementById(this.ids.numero);
            if (numeroInput) numeroInput.value = dados.numero;
        }

        // Complemento
        if (dados.complemento) {
            const complementoInput = document.getElementById(this.ids.complemento);
            if (complementoInput) complementoInput.value = dados.complemento;
        }

        // Bairro
        if (dados.bairro) {
            const bairroInput = document.getElementById(this.ids.bairro);
            if (bairroInput) bairroInput.value = dados.bairro;
        }

        // Cidade (localidade na API ViaCEP)
        if (dados.cidade) {
            const cidadeInput = document.getElementById(this.ids.cidade);
            if (cidadeInput) cidadeInput.value = dados.cidade;
        }

        // Estado (uf na API ViaCEP)
        if (dados.estado) {
            const estadoSelect = document.getElementById(this.ids.estado);
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
            cep: (document.getElementById(this.ids.cep)?.value || '').toString(),
            logradouro: (document.getElementById(this.ids.logradouro)?.value || '').toString(),
            numero: (document.getElementById(this.ids.numero)?.value || '').toString(),
            complemento: (document.getElementById(this.ids.complemento)?.value || '').toString(),
            bairro: (document.getElementById(this.ids.bairro)?.value || '').toString(),
            cidade: (document.getElementById(this.ids.cidade)?.value || '').toString(),
            estado: (document.getElementById(this.ids.estado)?.value || '').toString()
        };
    }

    /**
     * Limpa todos os campos
     */
    limpar() {
        this.enderecoId = null;
        this.enderecoSalvo = false;
        const campoId = document.getElementById(this.ids.enderecoId);
        if (campoId) campoId.value = '';
        
        const camposIds = [
            this.ids.cep, this.ids.logradouro, this.ids.numero,
            this.ids.complemento, this.ids.bairro, this.ids.cidade, this.ids.estado
        ];
        
        camposIds.forEach(fieldId => {
            const campo = document.getElementById(fieldId);
            if (campo) campo.value = '';
        });
        
        this.marcarComoNaoSalvo();
        
        // Reseta o texto do botão
        const textoBtn = document.getElementById(this.ids.textoBtnSalvar);
        if (textoBtn) {
            textoBtn.textContent = 'Salvar Endereço';
        }
        
        // Limpa alertas
        const alerta = document.getElementById(this.ids.alerta);
        if (alerta) {
            alerta.classList.add('d-none');
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
            console.log('📝 Dados obtidos para validar:', dados);

            // Valida os dados
            const validacao = this.validar();
            if (!validacao.isValid) {
                alert(`Erros no endereço:\n${validacao.errors.join('\n')}`);
                return null;
            }

            const btnSalvar = document.getElementById(this.ids.btnSalvar);
            const textoBtn = document.getElementById(this.ids.textoBtnSalvar);
            const alerta = document.getElementById(this.ids.alerta);
            const alertaTexto = document.getElementById(this.ids.alertaTexto);

            // Mostra loading brevemente
            if (btnSalvar) {
                btnSalvar.disabled = true;
                textoBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Validando...';
            }

            // Simula um pequeno delay para feedback visual
            await new Promise(resolve => setTimeout(resolve, 500));

            // Marca como salvo (em memória)
            this.enderecoSalvo = true;
            console.log('✅ Endereço validado e salvo em memória');

            // Marca como salvo visualmente
            this.marcarComoSalvo();

            // Mostra mensagem de sucesso
            if (alerta && alertaTexto) {
                alerta.classList.remove('d-none', 'alert-info', 'alert-warning', 'alert-danger');
                alerta.classList.add('alert-success');
                alertaTexto.innerHTML = '<i class="bi bi-check-circle me-2"></i>Endereço validado! Será salvo junto com o cadastro.';
                
                setTimeout(() => {
                    alerta.classList.add('d-none');
                }, 4000);
            }

            // Chama callback se fornecido
            if (this.onSaveCallback) {
                this.onSaveCallback(dados);
            }

            return dados;

        } catch (error) {
            console.error('❌ Erro ao validar endereço:', error);
            
            const alerta = document.getElementById(this.ids.alerta);
            const alertaTexto = document.getElementById(this.ids.alertaTexto);
            
            if (alerta && alertaTexto) {
                alerta.classList.remove('d-none', 'alert-info', 'alert-success');
                alerta.classList.add('alert-danger');
                alertaTexto.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>Erro ao validar: ${error.message}`;
            }

            return null;
        } finally {
            // Restaura botão
            const btnSalvar = document.getElementById(this.ids.btnSalvar);
            const textoBtn = document.getElementById(this.ids.textoBtnSalvar);
            
            if (btnSalvar) {
                btnSalvar.disabled = false;
                textoBtn.textContent = this.enderecoId ? 'Atualizar Endereço' : 'Salvar Endereço';
            }
        }
    }    /**
     * Persiste o endereço no banco de dados (chamado ao cadastrar/editar ponto de coleta)
     * @returns {Promise<Object>} Resposta da API com o ID do endereço salvo
     */
    async persistirEndereco() {
        try {
            const dados = this.obterDados();
            console.log('💾 Persistindo endereço no banco:', dados);

            // Valida os dados antes de persistir
            const validacao = this.validar();
            if (!validacao.isValid) {
                throw new Error(`Dados inválidos: ${validacao.errors.join(', ')}`);
            }

            let response;

            if (this.enderecoId) {
                // Atualiza endereço existente
                console.log('🔄 Atualizando endereço existente ID:', this.enderecoId);
                response = await enderecoService.atualizar(this.enderecoId, dados);
            } else {
                // Cria novo endereço
                console.log('➕ Criando novo endereço no banco');
                response = await enderecoService.criar(dados);
            }

            console.log('✅ Resposta da API:', response);

            // Verifica se a resposta é válida
            if (!response || typeof response !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            // Armazena o ID retornado
            this.enderecoId = response.id;

            // Atualiza o campo hidden
            const campoId = document.getElementById(this.ids.enderecoId);
            if (campoId) {
                campoId.value = response.id || '';
            }

            console.log('✅ Endereço persistido com sucesso no banco:', response);
            return response;

        } catch (error) {
            console.error('❌ Erro ao persistir endereço:', error);
            throw error;
        }
    }

    /**
     * Retorna os dados validados do endereço para serem salvos
     * @returns {Object|null} Dados do endereço ou null se inválido
     */
    getDadosParaSalvar() {
        const validacao = this.validar();
        if (!validacao.isValid) {
            console.error('❌ Endereço inválido:', validacao.errors);
            return null;
        }
        return this.obterDados();
    }

    /**
     * Marca visualmente que o endereço foi salvo
     */
    marcarComoSalvo() {
        this.enderecoSalvo = true;
        
        const indicador = document.getElementById(this.ids.salvoIndicador);
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
            
            const indicador = document.getElementById(this.ids.salvoIndicador);
            if (indicador) {
                indicador.classList.add('d-none');
            }

            // Campos permanecem editáveis
        }
    }

    /**
     * Verifica se o endereço está salvo (validado e pronto para persistir)
     */
    estaSalvo() {
        return this.enderecoSalvo;
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
    async carregarEndereco(enderecoData) {
        try {
            // Se receber um ID numérico, busca do backend
            if (typeof enderecoData === 'number') {
                console.log('Carregando endereço do backend, ID:', enderecoData);
                const endereco = await enderecoService.buscarPorId(enderecoData);
                this.preencherCampos(endereco);
                this.enderecoId = enderecoData;
                this.enderecoSalvo = true;
                this.marcarComoSalvo();
            } 
            // Se receber um objeto com os dados, preenche diretamente
            else if (typeof enderecoData === 'object' && enderecoData !== null) {
                console.log('Carregando endereço de objeto:', enderecoData);
                this.preencherCampos(enderecoData);
                
                // Se o objeto tem ID, marca como já salvo no banco
                if (enderecoData.id) {
                    this.enderecoId = enderecoData.id;
                    this.enderecoSalvo = true;
                    this.marcarComoSalvo();
                } else {
                    // Dados sem ID, apenas preenche mas não marca como salvo
                    this.enderecoId = null;
                    this.enderecoSalvo = false;
                }
            }
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
