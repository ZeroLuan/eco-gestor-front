/**
 * Resíduos - JavaScript
 * Gerenciamento de coleta de resíduos
 */

import { criarBotaoAcoesPadrao, adicionarEventListeners } from '../../components/common/botao-acoes/botao-acoes.js';

// Exemplo de dados de teste
const dadosExemplo = [
	{ id: 1, data: '2024-11-10', tipo: 'Plástico', quantidade: 150, local: 'Centro', responsavel: 'João Silva' },
	{ id: 2, data: '2024-11-09', tipo: 'Papel', quantidade: 200, local: 'Bairro Norte', responsavel: 'Maria Santos' },
	{ id: 3, data: '2024-11-08', tipo: 'Metal', quantidade: 80, local: 'Zona Industrial', responsavel: 'Carlos Oliveira' },
	{ id: 4, data: '2024-11-07', tipo: 'Vidro', quantidade: 120, local: 'Centro', responsavel: 'Ana Paula' },
	{ id: 5, data: '2024-11-06', tipo: 'Orgânico', quantidade: 300, local: 'Zona Rural', responsavel: 'Pedro Costa' },
	{ id: 6, data: '2024-11-05', tipo: 'Eletrônico', quantidade: 45, local: 'Centro', responsavel: 'Lucas Ferreira' }
];

// Inicializa elementos e eventos imediatamente (SPA já carregou o HTML)
function inicializarResiduos() {
	const btnPesquisar = document.getElementById('btnPesquisar');
	const btnLimpar = document.getElementById('btnLimpar');
	const btnNovo = document.getElementById('btnNovo');

	if (!btnPesquisar || !btnLimpar || !btnNovo) {
		console.error('❌ Elementos não encontrados na página de resíduos');
		return;
	}

	if (btnPesquisar) {
		btnPesquisar.addEventListener('click', function() {
			aplicarFiltros();
		});
	}

	if (btnLimpar) {
		btnLimpar.addEventListener('click', function() {
			limparFiltros();
			renderizarTabela(dadosExemplo);
		});
	}

	if (btnNovo) {
		btnNovo.addEventListener('click', function() {
			alert('Implementar registro de nova coleta (modal/rota)');
		});
	}

	// Exibe dados iniciais
	renderizarTabela(dadosExemplo);
	console.log('✅ Resíduos inicializados');
}

// Executa após um pequeno delay para garantir que o HTML foi injetado
setTimeout(inicializarResiduos, 100);

/**
 * Renderiza a tabela com os dados fornecidos
 */
function renderizarTabela(dados) {
	const tbody = document.querySelector('#tabelaResiduos tbody');
	const totalEl = document.getElementById('totalRegistros');
	
	if (!tbody) return;
	
	tbody.innerHTML = '';

	if (!dados || dados.length === 0) {
		tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
		if (totalEl) totalEl.textContent = 'Total de registros: 0';
		return;
	}

	// Cores por tipo de resíduo
	const coresTipo = {
		'Plástico': 'danger',
		'Papel': 'primary',
		'Metal': 'secondary',
		'Vidro': 'info',
		'Orgânico': 'success',
		'Eletrônico': 'warning'
	};

	dados.forEach(item => {
		const corTipo = coresTipo[item.tipo] || 'secondary';
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${formatarDataBR(item.data)}</td>
			<td><span class="badge bg-${corTipo}">${item.tipo}</span></td>
			<td>${item.quantidade} kg</td>
			<td>${item.local}</td>
			<td>${item.responsavel}</td>
			<td>
				${criarBotaoAcoesPadrao(item.id)}
			</td>
		`;
		tbody.appendChild(tr);
	});

	// Adiciona event listeners aos botões de ação
	adicionarEventListeners(tbody, (action, id) => {
		if (action === 'editar') {
			alert(`Editar resíduo ID: ${id}`);
		} else if (action === 'excluir') {
			if (confirm('Tem certeza que deseja excluir este registro?')) {
				alert(`Excluir resíduo ID: ${id}`);
			}
		}
	});

	if (totalEl) totalEl.textContent = `Total de registros: ${dados.length}`;
}

/**
 * Aplicar filtro
 */
function aplicarFiltros() {
	const tipo = document.getElementById('filterTipo')?.value || '';
	const dataInicio = document.getElementById('filterDataInicio')?.value || '';
	const dataFim = document.getElementById('filterDataFim')?.value || '';
	const local = document.getElementById('filterLocal')?.value.trim().toLowerCase() || '';

	const filtrados = dadosExemplo.filter(item => {
		const matchTipo = tipo ? (item.tipo === tipo) : true;
		const matchDataInicio = dataInicio ? (item.data >= dataInicio) : true;
		const matchDataFim = dataFim ? (item.data <= dataFim) : true;
		const matchLocal = local ? item.local.toLowerCase().includes(local) : true;
		return matchTipo && matchDataInicio && matchDataFim && matchLocal;
	});

	renderizarTabela(filtrados);
}

/**
 * Limpa filtros
 */
function limparFiltros() {
	const filterTipo = document.getElementById('filterTipo');
	const filterDataInicio = document.getElementById('filterDataInicio');
	const filterDataFim = document.getElementById('filterDataFim');
	const filterLocal = document.getElementById('filterLocal');
	
	if (filterTipo) filterTipo.value = '';
	if (filterDataInicio) filterDataInicio.value = '';
	if (filterDataFim) filterDataFim.value = '';
	if (filterLocal) filterLocal.value = '';
}

/**
 * Formata data YYYY-MM-DD para DD/MM/YYYY
 */
function formatarDataBR(isoDate) {
	if (!isoDate) return '';
	const d = new Date(isoDate);
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
}
