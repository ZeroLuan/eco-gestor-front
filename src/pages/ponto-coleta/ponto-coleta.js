// Corrige o caminho do service para refletir a estrutura atual (pasta: pontosColeta)
import { pontosColetaService } from '../../services/pontosColeta/pontosColetaService.js';

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
	{ id: 1, nome: 'Coleta Central', data: '2026-12-12', tipo: 'Municipal' },
	{ id: 2, nome: 'Ponto Norte', data: '2026-05-20', tipo: 'Privado' },
	{ id: 3, nome: 'Cooperativa Verde', data: '2025-11-13', tipo: 'Cooperativa' },
	{ id: 4, nome: 'Coleta Sul', data: '2026-01-08', tipo: 'Municipal' }
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
		// Em produção: abrir modal / rota para criar novo ponto
		alert('Implementar criação de novo ponto de coleta (modal/rota)');
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
		tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
		totalEl.textContent = 'Total de registros: 0';
		return;
	}

	dados.forEach(item => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${item.nome}</td>
			<td>${formatarDataBR(item.data)}</td>
			<td>${item.tipo}</td>
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
 * Aplicar filtro simples com base nos campos Nome, Tipo e Data
 */
function aplicarFiltros() {
	const nome = document.getElementById('filterNome').value.trim().toLowerCase();
	const tipo = document.getElementById('filterTipo').value;
	const data = document.getElementById('filterData').value; // Formato ISO yyyy-mm-dd

	const filtrados = dadosExemplo.filter(item => {
		const matchNome = nome ? item.nome.toLowerCase().includes(nome) : true;
		const matchTipo = tipo ? (item.tipo === tipo) : true;
		const matchData = data ? (item.data === data) : true;
		return matchNome && matchTipo && matchData;
	});

	renderizarTabela(filtrados);
}

/**
 * Limpa filtros e reseta para a lista completa
 */
function limparFiltros() {
	document.getElementById('filterNome').value = '';
	document.getElementById('filterTipo').value = '';
	document.getElementById('filterData').value = '';
}

/**
 * Formata data YYYY-MM-DD para DD/MM/YYYY (visual)
 */
function formatarDataBR(isoDate) {
	if (!isoDate) return '';
	const d = new Date(isoDate);
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
}

