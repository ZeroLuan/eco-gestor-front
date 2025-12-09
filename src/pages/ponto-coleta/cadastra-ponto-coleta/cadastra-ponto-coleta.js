// ===========================
// MODAL DE CADASTRO/EDIÇÃO DE PONTO DE COLETA
// ===========================

import { TIPOS_RESIDUO, ESTADOS_BRASIL, EnumUtils } from '../../../utils/constants.js';
import { pontosColetaService } from '../../../services/pontosColeta/pontosColetaService.js';
import { PontoColetaRequest } from '../../../services/pontosColeta/pontoColetaTypes.js';
import { EnderecoComponent } from '../../../components/endereco/endereco.js';

// Armazena o callback global para ser usado ao salvar
let callbackGlobal = null;

// Instância do componente de endereço
let enderecoComponent = null;

/**
 * Abre o modal para cadastrar um novo ponto de coleta ou editar existente
 * @param {Object|null} pontoData - Dados do ponto para edição, null para novo cadastro
 * @param {function} callback - Função de callback após salvar com sucesso
 */
export async function abrirModalCadastro(pontoData = null, callback = null) {
	// Armazena o callback para ser usado ao salvar
	callbackGlobal = callback;
	
	// Carrega o HTML do modal se ainda não estiver na página
	carregarModalCadastro().then(async () => {
		const modalElement = document.getElementById('modalCadastroPonto');
		
		if (!modalElement) {
			console.error('❌ Elemento modal não encontrado no DOM');
			return;
		}
		
		// Verifica se Bootstrap está disponível
		if (typeof bootstrap === 'undefined') {
			// Fallback: abre o modal manualmente com CSS
			modalElement.classList.add('show');
			modalElement.style.display = 'block';
			modalElement.setAttribute('aria-hidden', 'false');
			modalElement.setAttribute('aria-modal', 'true');
			document.body.classList.add('modal-open');
			
			// Cria o backdrop
			const backdrop = document.createElement('div');
			backdrop.className = 'modal-backdrop fade show';
			backdrop.id = 'modalBackdrop';
			document.body.appendChild(backdrop);
		} else {
			const modal = new bootstrap.Modal(modalElement);
			modal.show();
		}
		
		const titulo = document.getElementById('tituloModal');
		const textoBotao = document.getElementById('textoBotaoSalvar');
		
		if (pontoData) {
			// Modo edição
			titulo.textContent = 'Editar Ponto de Coleta';
			textoBotao.textContent = 'Salvar Alterações';
			await carregarDadosPonto(pontoData);
			bloquearFormularioPrincipal(false); // Já tem endereço salvo
		} else {
			// Modo cadastro
			titulo.textContent = 'Cadastrar Ponto de Coleta';
			textoBotao.textContent = 'Cadastrar';
			limparFormulario();
			bloquearFormularioPrincipal(true); // Bloqueia até salvar endereço
		}
	}).catch(error => {
		console.error('❌ Erro ao abrir modal:', error);
	});
}

/**
 * Carrega o HTML do modal de cadastro na página
 */
async function carregarModalCadastro() {
	// Verifica se o modal já existe
	if (document.getElementById('modalCadastroPonto')) {
		return;
	}
	
	try {
		const response = await fetch('./src/pages/ponto-coleta/cadastra-ponto-coleta/cadastra-ponto-coleta.html');
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const html = await response.text();
		
		// Adiciona o modal ao body
		const div = document.createElement('div');
		div.innerHTML = html;
		document.body.appendChild(div);
		
		// Configura o evento do botão salvar
		const btnSalvar = document.getElementById('btnSalvarPonto');
		if (btnSalvar) {
			btnSalvar.addEventListener('click', salvarPontoColeta);
		}
		
		// Popula os selects com os enums
		popularSelects();
		
		// Inicializa o componente de endereço
		await inicializarComponenteEndereco();
		
		// Configura o botão de fechar do modal
		const btnsFechar = document.querySelectorAll('[data-bs-dismiss="modal"]');
		btnsFechar.forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.preventDefault(); // Previne comportamento padrão
				fecharModal();
			});
		});
		
		// Configura o backdrop para fechar ao clicar fora
		const modalElement = document.getElementById('modalCadastroPonto');
		if (modalElement) {
			modalElement.addEventListener('click', function(e) {
				// Só fecha se clicou exatamente no modal (não em elementos filhos)
				if (e.target === modalElement) {
					e.preventDefault();
					fecharModal();
				}
			});
		}
		
		console.log('✅ Modal de cadastro carregado com sucesso');
		
	} catch (error) {
		console.error('❌ Erro ao carregar modal de cadastro:', error);
		alert('Erro ao carregar o formulário de cadastro. Verifique o console para mais detalhes.');
		throw error;
	}
}

/**
 * Inicializa o componente de endereço
 */
async function inicializarComponenteEndereco() {
	try {
		// Cria nova instância do componente
		enderecoComponent = new EnderecoComponent('enderecoContainer');
		
		// Inicializa o componente
		await enderecoComponent.inicializar();
		
		// Configura callback quando endereço for salvo
		enderecoComponent.onSave((enderecoSalvo) => {
			console.log('✅ Endereço validado, liberando formulário:', enderecoSalvo);
			bloquearFormularioPrincipal(false); // Libera o resto do formulário
		});
		
		console.log('✅ Componente de endereço inicializado com sucesso');
	} catch (error) {
		console.error('❌ Erro ao inicializar componente de endereço:', error);
		throw error;
	}
}

/**
 * Fecha o modal manualmente (fallback se Bootstrap não estiver disponível)
 */
function fecharModal() {
	const modalElement = document.getElementById('modalCadastroPonto');
	const backdrop = document.getElementById('modalBackdrop');

	// Move o foco para fora do modal antes de fechar para evitar problemas de acessibilidade
	// Isso previne o erro "Blocked aria-hidden on an element because its descendant retained focus"
	document.body.focus();
	document.body.setAttribute('tabindex', '-1'); // Permite que body receba foco temporariamente

	if (typeof bootstrap !== 'undefined') {
		const modal = bootstrap.Modal.getInstance(modalElement);
		if (modal) {
			modal.hide();
		}
	} else {
		// Fallback manual
		if (modalElement) {
			modalElement.classList.remove('show');
			modalElement.style.display = 'none';
			modalElement.setAttribute('aria-hidden', 'true');
			modalElement.removeAttribute('aria-modal');
			document.body.classList.remove('modal-open');
		}
		if (backdrop) {
			backdrop.remove();
		}
	}

	// Remove o tabindex temporário do body após um pequeno delay
	setTimeout(() => {
		document.body.removeAttribute('tabindex');
	}, 100);
}

/**
 * Popula os selects com os enums do sistema
 */
function popularSelects() {
	// Popula select de tipos de resíduo
	const selectTipoResiduo = document.getElementById('pontoTipoResiduo');
	if (selectTipoResiduo) {
		const opcoes = EnumUtils.toSelectOptions(TIPOS_RESIDUO);
		opcoes.forEach(opcao => {
			const option = document.createElement('option');
			option.value = opcao.value;
			option.textContent = opcao.label;
			selectTipoResiduo.appendChild(option);
		});
	}
	
	// Popula checkboxes de materiais aceitos
	const containerMateriais = document.getElementById('materiaisAceitosContainer');
	if (containerMateriais) {
		const opcoes = EnumUtils.toSelectOptions(TIPOS_RESIDUO);
		opcoes.forEach(opcao => {
			const div = document.createElement('div');
			div.className = 'form-check';
			
			const input = document.createElement('input');
			input.className = 'form-check-input';
			input.type = 'checkbox';
			input.value = opcao.value;
			input.id = `mat${opcao.value}`;
			
			const label = document.createElement('label');
			label.className = 'form-check-label';
			label.htmlFor = `mat${opcao.value}`;
			label.textContent = opcao.label;
			
			div.appendChild(input);
			div.appendChild(label);
			containerMateriais.appendChild(div);
		});
	}
}

/**
 * Carrega os dados do ponto no formulário para edição
 * @param {Object} pontoData - Dados do ponto de coleta
 */
async function carregarDadosPonto(pontoData) {
	if (!pontoData) return;
	
	// Preenche os campos básicos
	document.getElementById('pontoId').value = pontoData.id || '';
	document.getElementById('pontoNome').value = pontoData.nome || pontoData.nomePonto || '';
	document.getElementById('pontoTipoResiduo').value = pontoData.tipoResiduo || '';
	document.getElementById('pontoAtivo').checked = pontoData.ativo !== false;
	
	// Marca os checkboxes de materiais aceitos
	if (pontoData.materiaisAceitos && Array.isArray(pontoData.materiaisAceitos)) {
		pontoData.materiaisAceitos.forEach(material => {
			const materialTipo = material.tipo || material;
			const checkbox = document.getElementById(`mat${materialTipo}`);
			if (checkbox) {
				checkbox.checked = true;
			}
		});
	}
	
	// Carrega o endereço se existir
	if (enderecoComponent) {
		if (pontoData.endereco) {
			// Se tem objeto de endereço, carrega ele
			await enderecoComponent.carregarEndereco(pontoData.endereco);
		} else if (pontoData.enderecoId) {
			// Se tem apenas ID, busca do backend
			await enderecoComponent.carregarEndereco(pontoData.enderecoId);
		}
	}
}

function limparFormulario() {
	document.getElementById('pontoId').value = '';
	document.getElementById('pontoNome').value = '';
	document.getElementById('pontoTipoResiduo').value = '';
	document.getElementById('pontoAtivo').checked = true;
	
	// Limpa o componente de endereço
	if (enderecoComponent) {
		enderecoComponent.limpar();
	}
	
	// Desmarca todos os checkboxes de materiais
	document.querySelectorAll('[id^="mat"]').forEach(checkbox => {
		checkbox.checked = false;
	});
}

/**
 * Coleta os materiais aceitos selecionados
 */
function obterMateriaisAceitos() {
	const materiais = [];
	const checkboxes = document.querySelectorAll('[id^="mat"]:checked');
	checkboxes.forEach(checkbox => {
		materiais.push(checkbox.value);
	});
	return materiais;
}

/**
 * Salva o ponto de coleta (cadastro ou edição)
 */
export async function salvarPontoColeta() {
	const form = document.getElementById('formCadastroPonto');
	
	// Verifica se o endereço foi salvo (validado)
	if (!enderecoComponent || !enderecoComponent.estaSalvo()) {
		alert('Por favor, salve o endereço antes de cadastrar o ponto de coleta.');
		return;
	}
	
	// Valida o formulário
	if (!form.checkValidity()) {
		form.reportValidity();
		return;
	}

	const btnSalvar = document.getElementById('btnSalvarPonto');
	const textoBotao = document.getElementById('textoBotaoSalvar');
	const textoOriginal = textoBotao.textContent;
	
	try {
		// Desabilita o botão e mostra loading
		if (btnSalvar) {
			btnSalvar.disabled = true;
			textoBotao.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Salvando...';
		}

		// PASSO 1: Persiste o endereço no banco de dados
		console.log('📍 Passo 1: Persistindo endereço no banco...');
		const enderecoResponse = await enderecoComponent.persistirEndereco();
		
		if (!enderecoResponse || !enderecoResponse.id) {
			throw new Error('Falha ao salvar endereço. Não foi possível obter o ID.');
		}
		
		const enderecoId = enderecoResponse.id;
		console.log('✅ Endereço persistido com ID:', enderecoId);
		
		// PASSO 2: Coleta os dados do ponto de coleta
		const pontoId = document.getElementById('pontoId').value;
		const dados = {
			id: pontoId || null,
			nomePonto: document.getElementById('pontoNome').value,
			tipoResiduo: document.getElementById('pontoTipoResiduo').value,
			ativo: document.getElementById('pontoAtivo').checked,
			materiaisAceitos: obterMateriaisAceitos(),
			enderecoId: enderecoId // ID do endereço que acabou de ser salvo
		};
		
		console.log('📦 Passo 2: Dados do ponto de coleta:', dados);
		
		// PASSO 3: Salva ou atualiza o ponto de coleta
		let response;
		if (pontoId) {
			// Modo edição - atualiza ponto existente
			console.log('🔄 Passo 3: Atualizando ponto de coleta existente...');
			response = await pontosColetaService.atualizar(pontoId, dados);
			console.log('✅ Ponto de coleta atualizado:', response);
		} else {
			// Modo cadastro - cria novo ponto
			console.log('➕ Passo 3: Criando novo ponto de coleta...');
			response = await pontosColetaService.criar(dados);
			console.log('✅ Ponto de coleta criado:', response);
		}
		
		// Fecha o modal
		fecharModal();
		
		// Executa callback se fornecido (para atualizar a tabela na tela principal)
		if (callbackGlobal && typeof callbackGlobal === 'function') {
			callbackGlobal(dados);
		}
		
	} catch (error) {
		console.error('❌ Erro ao salvar ponto de coleta:', error);
		alert(`Erro ao salvar: ${error.message}`);
		
		// Reabilita o botão em caso de erro
		if (btnSalvar) {
			btnSalvar.disabled = false;
			textoBotao.textContent = textoOriginal;
		}
	}
}

/**
 * Bloqueia ou desbloqueia os campos principais do formulário
 */
function bloquearFormularioPrincipal(bloquear) {
	const btnSalvar = document.getElementById('btnSalvarPonto');
	const campos = ['pontoNome', 'pontoTipoResiduo', 'pontoAtivo'];
	
	// Campos ficam sempre liberados para edição
	campos.forEach(campoId => {
		const campo = document.getElementById(campoId);
		if (campo) {
			campo.disabled = false;
			campo.classList.remove('bg-light');
		}
	});
	
	// Checkboxes de materiais ficam sempre liberados
	const checkboxes = document.querySelectorAll('[id^="mat"]');
	checkboxes.forEach(checkbox => {
		checkbox.disabled = false;
	});
	
	// Só bloqueia/desbloqueia o botão salvar
	if (btnSalvar) {
		btnSalvar.disabled = bloquear;
	}
	
	// Mostra/esconde alerta
	const alertaInfo = document.getElementById('enderecoAlerta');
	const alertaTexto = document.getElementById('enderecoAlertaTexto');
	
	if (alertaInfo && alertaTexto) {
		if (bloquear) {
			alertaInfo.classList.remove('d-none', 'alert-success', 'alert-danger');
			alertaInfo.classList.add('alert-info');
			alertaTexto.innerHTML = '<i class="bi bi-info-circle me-2"></i>Salve o endereço para liberar o botão de cadastrar.';
		} else {
			// Alerta será escondido pelo componente de endereço
		}
	}
}
