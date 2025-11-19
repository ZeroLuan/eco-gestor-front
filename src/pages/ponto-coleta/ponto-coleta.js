// Corrige o caminho do service para refletir a estrutura atual (pasta: pontosColeta)
import { pontosColetaService } from '../../services/pontosColeta/pontosColetaService.js';
import { abrirModalCadastro, salvarPontoColeta } from './cadastra-ponto-coleta/cadastra-ponto-coleta.js';
import { EnumUtils } from '../../utils/constants.js';

// ===========================
// CARREGAMENTO DE DADOS DO BACKEND
// ===========================

/**
 * Carrega todos os dados do ponto de coleta do backend
 * - Este arquivo contém lógica mínima para demonstração:
 *   - Renderizar linhas fictícias
 *   - Filtrar por Nome / Tipo / Data
 *   - Limpar filtros
 *   - Simular ações de novo/editar
 */

// Exemplo de dados de teste (serão substituídos pelos dados vindos do backend)
const dadosExemplo = [
	{ 
		id: 1, 
		nome: 'Ecoponto Central', 
		tipoResiduo: 'MISTO', 
		endereco: 'Av. Principal, 100 - Centro',
		ativo: true,
		materiaisAceitos: [
			{ id: 1, tipo: 'PLASTICO', nome: 'Plástico' },
			{ id: 2, tipo: 'PAPEL', nome: 'Papel' },
			{ id: 3, tipo: 'VIDRO', nome: 'Vidro' }
		]
	},
	{ 
		id: 2, 
		nome: 'Coleta Seletiva Norte', 
		tipoResiduo: 'PLASTICO', 
		endereco: 'Rua das Flores, 250 - Bairro Norte',
		ativo: true,
		materiaisAceitos: [
			{ id: 1, tipo: 'PLASTICO', nome: 'Plástico' }
		]
	},
	{ 
		id: 3, 
		nome: 'Cooperativa Verde', 
		tipoResiduo: 'MISTO', 
		endereco: 'Rua Reciclar, 45 - Zona Industrial',
		ativo: false,
		materiaisAceitos: [
			{ id: 1, tipo: 'PLASTICO', nome: 'Plástico' },
			{ id: 2, tipo: 'PAPEL', nome: 'Papel' },
			{ id: 4, tipo: 'METAL', nome: 'Metal' },
			{ id: 6, tipo: 'ELETRONICO', nome: 'Eletrônico' }
		]
	},
	{ 
		id: 4, 
		nome: 'Ponto de Coleta Orgânica', 
		tipoResiduo: 'ORGANICO', 
		endereco: 'Fazenda Boa Vista - Zona Rural',
		ativo: true,
		materiaisAceitos: [
			{ id: 5, tipo: 'ORGANICO', nome: 'Orgânico' }
		]
	}
];

// Inicializa elementos e eventos imediatamente (SPA já carregou o HTML)
function inicializarPontoColeta() {
	const btnPesquisar = document.getElementById('btnPesquisar');
	const btnLimpar = document.getElementById('btnLimpar');
	const btnNovo = document.getElementById('btnNovo');

	if (!btnPesquisar || !btnLimpar || !btnNovo) {
		console.error('❌ Elementos não encontrados na página');
		return;
	}

	btnPesquisar.addEventListener('click', function() {
		aplicarFiltros();
	});

	btnLimpar.addEventListener('click', function() {
		limparFiltros();
		renderizarTabela(dadosExemplo);
	});

	btnNovo.addEventListener('click', function() {
		abrirModalCadastro(null, (novosDados) => {
			// Callback após salvar - adiciona aos dados de exemplo e atualiza tabela
			if (!novosDados.id) {
				novosDados.id = dadosExemplo.length + 1;
				dadosExemplo.push(novosDados);
			}
			renderizarTabela(dadosExemplo);
		});
	});

	// Exibe dados iniciais
	renderizarTabela(dadosExemplo);
	console.log('✅ Ponto de Coleta inicializado');
}

// Executa após um pequeno delay para garantir que o HTML foi injetado
setTimeout(inicializarPontoColeta, 100);

/**
 * Renderiza a tabela com os dados fornecidos
 */
function renderizarTabela(dados) {
	const tbody = document.querySelector('#tabelaPontos tbody');
	const totalEl = document.getElementById('totalRegistros');
	tbody.innerHTML = '';

	if (!dados || dados.length === 0) {
		tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
		totalEl.textContent = 'Total de registros: 0';
		return;
	}

	dados.forEach(item => {
		// Formata a lista de materiais aceitos
		const materiaisHtml = item.materiaisAceitos && item.materiaisAceitos.length > 0
			? item.materiaisAceitos.map(material => 
				`<span class="badge bg-${EnumUtils.getCorTipoResiduo(material.tipo)} me-1">${EnumUtils.formatarTipoResiduo(material.tipo)}</span>`
			).join('')
			: '<span class="text-muted">Nenhum</span>';

		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${item.nome}</td>
			<td><small>${item.endereco}</small></td>
			<td><span class="badge bg-primary">${EnumUtils.formatarTipoResiduo(item.tipoResiduo)}</span></td>
			<td>${materiaisHtml}</td>
			<td class="text-center">
				<input type="checkbox" class="form-check-input" ${item.ativo ? 'checked' : ''} disabled readonly>
			</td>
			<td>
				<button class="btn btn-outline-secondary btn-sm" title="Mais ações">
					<i class="bi bi-three-dots-vertical"></i>
				</button>
			</td>
		`;
		tbody.appendChild(tr);
	});

	totalEl.textContent = `Total de registros: ${dados.length}`;
}

/**
 * Aplicar filtro simples com base nos campos Nome, Tipo de Resíduo e Endereço
 */
function aplicarFiltros() {
	const nome = document.getElementById('filterNome').value.trim().toLowerCase();
	const tipoResiduo = document.getElementById('filterTipoResiduo').value;
	const endereco = document.getElementById('filterEndereco').value.trim().toLowerCase();

	const filtrados = dadosExemplo.filter(item => {
		const matchNome = nome ? item.nome.toLowerCase().includes(nome) : true;
		const matchTipo = tipoResiduo ? (item.tipoResiduo === tipoResiduo) : true;
		const matchEndereco = endereco ? item.endereco.toLowerCase().includes(endereco) : true;
		return matchNome && matchTipo && matchEndereco;
	});

	renderizarTabela(filtrados);
}

/**
 * Limpa filtros e reseta para a lista completa
 */
function limparFiltros() {
	document.getElementById('filterNome').value = '';
	document.getElementById('filterTipoResiduo').value = '';
	document.getElementById('filterEndereco').value = '';
}

/**
 * Formata o tipo de resíduo do enum para texto legível
 */
function formatarTipoResiduo(tipo) {
	return EnumUtils.formatarTipoResiduo(tipo);
}

/**
 * Retorna a cor do badge baseado no tipo de resíduo
 */
function getCorTipo(tipo) {
	return EnumUtils.getCorTipoResiduo(tipo);
}

