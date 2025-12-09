// Corrige o caminho do service para refletir a estrutura atual (pasta: pontosColeta)
import { pontosColetaService } from '../../services/pontosColeta/pontosColetaService.js';
import { abrirModalCadastro, salvarPontoColeta } from './cadastra-ponto-coleta/cadastra-ponto-coleta.js';
import { EnumUtils } from '../../utils/constants.js';
import { PaginacaoComponent } from '../../components/paginacao/paginacao.js';
import { criarBotaoAcoesPadrao, adicionarEventListeners } from '../../components/common/botao-acoes/botao-acoes.js';

// ===========================
// CARREGAMENTO DE DADOS DO BACKEND
// ===========================

/**
 * Carrega todos os dados do ponto de coleta do backend com paginação
 */

// Array para armazenar os dados carregados do backend
let pontosDados = [];

// Componente de paginação reutilizável
let paginacao = null;

// Inicializa elementos e eventos imediatamente (SPA já carregou o HTML)
async function inicializarPontoColeta() {
	const btnPesquisar = document.getElementById('btnPesquisar');
	const btnLimpar = document.getElementById('btnLimpar');
	const btnNovo = document.getElementById('btnNovo');

	if (!btnPesquisar || !btnLimpar || !btnNovo) {
		console.error('❌ Elementos não encontrados na página');
		return;
	}

	// Inicializa o componente de paginação reutilizável
	paginacao = new PaginacaoComponent({
		containerId: 'paginacao',
		totalRegistrosId: 'totalRegistros',
		tamanhoPagina: 10,
		onPageChange: (numeroPagina) => {
			carregarPontosColeta(numeroPagina);
		}
	});

	btnPesquisar.addEventListener('click', function() {
		aplicarFiltros();
	});

	btnLimpar.addEventListener('click', function() {
		limparFiltros();
		// Apenas limpa os campos, não faz requisição ao backend
	});

	btnNovo.addEventListener('click', function() {
		abrirModalCadastro(null, () => {
			// Callback após salvar - recarrega os dados do backend
			carregarPontosColeta(paginacao.getPaginaAtual());
		});
	});

	// Carrega dados iniciais do backend
	await carregarPontosColeta(0);
	console.log('✅ Ponto de Coleta inicializado');
}

/**
 * Carrega os pontos de coleta do backend
 */
async function carregarPontosColeta(pagina = 0) {
	try {
		console.log(`🔄 Carregando pontos de coleta - Página ${pagina + 1}...`);
		
		// Captura os filtros ativos
		const filtros = obterFiltrosAtivos();
		const temFiltros = Object.keys(filtros).length > 0;
		
		// Se houver filtros, usa buscarComFiltros, senão usa listarTodos
		let response = temFiltros
			? await pontosColetaService.buscarComFiltros(filtros, {
				page: pagina,
				size: paginacao.getTamanhoPagina(),
				sort: 'id,desc'
			})
			: await pontosColetaService.listarTodos({
				page: pagina,
				size: paginacao.getTamanhoPagina(),
				sort: 'id,desc'
			});
		
		// Se filtrou mas não encontrou nada, busca todos
		if (temFiltros && (!response || !response.content || response.content.length === 0)) {
			console.log('⚠️ Filtro não retornou resultados. Buscando todos...');
			response = await pontosColetaService.listarTodos({
				page: 0,
				size: paginacao.getTamanhoPagina(),
				sort: 'id,desc'
			});
		}
		
		if (response && response.content) {
			pontosDados = response.content;
			
			// Adapta a estrutura VIA_DTO do Spring para o formato esperado
			const paginaInfo = {
				content: response.content,
				number: response.page?.number || 0,
				totalPages: response.page?.totalPages || 0,
				totalElements: response.page?.totalElements || 0,
				size: response.page?.size || 10
			};
			
			// Atualiza o componente de paginação com os dados adaptados
			paginacao.atualizar(paginaInfo);
			
			// Renderiza a tabela
			renderizarTabela(pontosDados);
			
			console.log(`✅ ${pontosDados.length} pontos carregados - Página ${paginaInfo.number + 1}/${paginaInfo.totalPages}`);
		} else {
			pontosDados = [];
			paginacao.limpar();
			renderizarTabela(pontosDados);
			console.log('⚠️ Nenhum ponto de coleta encontrado');
		}
	} catch (error) {
		console.error('❌ Erro ao carregar pontos de coleta:', error);
		pontosDados = [];
		paginacao.limpar();
		renderizarTabela(pontosDados);
		alert('Erro ao carregar pontos de coleta. Por favor, tente novamente.');
	}
}

// Executa após um pequeno delay para garantir que o HTML foi injetado
setTimeout(inicializarPontoColeta, 100);

/**
 * Renderiza a tabela com os dados fornecidos
 */
function renderizarTabela(dados) {
	const tbody = document.querySelector('#tabelaPontos tbody');
	tbody.innerHTML = '';

	if (!dados || dados.length === 0) {
		tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
		return;
	}

	dados.forEach(item => {
		// Formata o endereço (pode vir como string ou objeto)
		let enderecoTexto = '';
		if (typeof item.endereco === 'string') {
			enderecoTexto = item.endereco;
		} else if (item.endereco && typeof item.endereco === 'object') {
			enderecoTexto = `${item.endereco.logradouro || ''} ${item.endereco.numero || ''}, ${item.endereco.bairro || ''} - ${item.endereco.cidade || ''}/${item.endereco.estado || ''}`;
		} else {
			enderecoTexto = 'Endereço não informado';
		}
		
		// Formata a lista de materiais aceitos
		// O backend retorna materiaisAceitos como array de strings: ["PAPEL", "PLASTICO"]
		const materiaisHtml = item.materiaisAceitos && item.materiaisAceitos.length > 0
			? item.materiaisAceitos.map(material => {
				// Se for string, usa diretamente; se for objeto, pega a propriedade tipo
				const tipoMaterial = typeof material === 'string' ? material : (material.tipo || material);
				return `<span class="badge bg-${EnumUtils.getCorTipoResiduo(tipoMaterial)} me-1">${EnumUtils.formatarTipoResiduo(tipoMaterial)}</span>`;
			}).join('')
			: '<span class="text-muted">Nenhum</span>';

		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${item.nome || item.nomePonto || 'Sem nome'}</td>
			<td><small>${enderecoTexto}</small></td>
			<td><span class="badge bg-primary">${EnumUtils.formatarTipoResiduo(item.tipoResiduo)}</span></td>
			<td>${materiaisHtml}</td>
			<td class="text-center">
				<input type="checkbox" class="form-check-input" ${item.ativo ? 'checked' : ''} disabled readonly>
			</td>
			<td>
				${criarBotaoAcoesPadrao(item.id)}
			</td>
		`;
		tbody.appendChild(tr);
	});

	// Adiciona event listeners aos botões de ação
	adicionarEventListeners(tbody, (action, id) => {
		const pontoId = parseInt(id);
		const pontoData = dados.find(p => p.id === pontoId);
		
		if (action === 'editar') {
			abrirModalCadastro(pontoData, () => {
				carregarPontosColeta(paginacao.getPaginaAtual());
			});
		} else if (action === 'excluir') {
			excluirPontoColeta(pontoId, pontoData.nome || pontoData.nomePonto);
		}
	});
}

/**
 * Exclui um ponto de coleta
 * @param {number} id - ID do ponto de coleta
 * @param {string} nome - Nome do ponto de coleta
 */
async function excluirPontoColeta(id, nome) {
	// Confirmação antes de excluir
	const confirmacao = confirm(`Tem certeza que deseja excluir o ponto de coleta "${nome}"?\n\nEsta ação não pode ser desfeita.`);
	
	if (!confirmacao) {
		return;
	}
	
	try {
		console.log('🗑️ Excluindo ponto de coleta ID:', id);
		
		// Chama o serviço para excluir
		await pontosColetaService.remover(id);
		
		console.log('✅ Ponto de coleta excluído com sucesso');
		
		// Mostra mensagem de sucesso
		alert('Ponto de coleta excluído com sucesso!');
		
		// Recarrega a tabela
		await carregarPontosColeta(paginacao.getPaginaAtual());
		
	} catch (error) {
		console.error('❌ Erro ao excluir ponto de coleta:', error);
		alert(`Erro ao excluir ponto de coleta: ${error.message}`);
	}
}

/**
 * Captura os filtros ativos dos campos de input
 */
function obterFiltrosAtivos() {
	const filtros = {};
	
	const nome = document.getElementById('filterNome')?.value.trim();
	const tipoResiduo = document.getElementById('filterTipoResiduo')?.value.trim();
	const endereco = document.getElementById('filterEndereco')?.value.trim();
	
	if (nome) {
		filtros.nomePonto = nome;
	}
	
	if (tipoResiduo) {
		filtros.tipoResiduo = tipoResiduo;
	}
	
	if (endereco) {
		// Se tiver filtro de endereço, envia como objeto
		filtros.endereco = {
			logradouro: endereco
		};
	}
	
	return filtros;
}

/**
 * Aplicar filtro simples com base nos campos Nome, Tipo de Resíduo e Endereço
 * Nota: Para filtros mais complexos, seria ideal implementar no backend
 */
function aplicarFiltros() {
	// Recarrega a primeira página com os filtros ativos
	paginacao.voltarParaPrimeiraPagina();
}

/**
 * Limpa filtros e reseta para a lista completa
 */
async function limparFiltros() {
	document.getElementById('filterNome').value = '';
	document.getElementById('filterTipoResiduo').value = '';
	document.getElementById('filterEndereco').value = '';
	
	// Recarrega todos os registros sem filtros
	await carregarPontosColeta(0);
}

