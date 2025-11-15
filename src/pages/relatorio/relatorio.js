/**
 * Relatórios - JavaScript
 * Gerenciamento e geração de relatórios
 */

// Exemplo de dados de teste
const dadosExemplo = [
	{ id: 1, titulo: 'Relatório Mensal - Novembro/2024', tipo: 'Mensal', periodo: '01/11/2024 - 30/11/2024', geracao: '2024-11-30', status: 'Disponível' },
	{ id: 2, titulo: 'Relatório Mensal - Outubro/2024', tipo: 'Mensal', periodo: '01/10/2024 - 31/10/2024', geracao: '2024-10-31', status: 'Disponível' },
	{ id: 3, titulo: 'Relatório Trimestral - 3º Tri/2024', tipo: 'Trimestral', periodo: '01/07/2024 - 30/09/2024', geracao: '2024-09-30', status: 'Disponível' },
	{ id: 4, titulo: 'Relatório Anual - 2023', tipo: 'Anual', periodo: '01/01/2023 - 31/12/2023', geracao: '2024-01-15', status: 'Disponível' },
	{ id: 5, titulo: 'Análise Coleta Seletiva', tipo: 'Personalizado', periodo: '01/08/2024 - 31/10/2024', geracao: '2024-11-05', status: 'Em Processamento' }
];

// Inicializa elementos e eventos imediatamente (SPA já carregou o HTML)
function inicializarRelatorios() {
	const btnPesquisar = document.getElementById('btnPesquisar');
	const btnLimpar = document.getElementById('btnLimpar');
	const btnNovo = document.getElementById('btnNovo');

	if (!btnPesquisar || !btnLimpar || !btnNovo) {
		console.error('❌ Elementos não encontrados na página de relatórios');
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
			alert('Implementar geração de novo relatório (modal/rota)');
		});
	}

	// Exibe dados iniciais
	renderizarTabela(dadosExemplo);
	console.log('✅ Relatórios inicializados');
}

// Executa após um pequeno delay para garantir que o HTML foi injetado
setTimeout(inicializarRelatorios, 100);

/**
 * Renderiza a tabela com os dados fornecidos
 */
function renderizarTabela(dados) {
	const tbody = document.querySelector('#tabelaRelatorios tbody');
	const totalEl = document.getElementById('totalRegistros');
	
	if (!tbody) return;
	
	tbody.innerHTML = '';

	if (!dados || dados.length === 0) {
		tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
		if (totalEl) totalEl.textContent = 'Total de registros: 0';
		return;
	}

	dados.forEach(item => {
		const statusClass = item.status === 'Disponível' ? 'success' : 'warning';
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${item.titulo}</td>
			<td><span class="badge bg-info">${item.tipo}</span></td>
			<td>${item.periodo}</td>
			<td>${formatarDataBR(item.geracao)}</td>
			<td><span class="badge bg-${statusClass}">${item.status}</span></td>
			<td>
				<button class="btn btn-sm btn-outline-primary me-1" title="Visualizar">
					<i class="bi bi-eye"></i>
				</button>
				<button class="btn btn-sm btn-outline-success" title="Download PDF">
					<i class="bi bi-download"></i>
				</button>
			</td>
		`;
		tbody.appendChild(tr);
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

	const filtrados = dadosExemplo.filter(item => {
		const matchTipo = tipo ? (item.tipo === tipo) : true;
		const matchDataInicio = dataInicio ? (item.geracao >= dataInicio) : true;
		const matchDataFim = dataFim ? (item.geracao <= dataFim) : true;
		return matchTipo && matchDataInicio && matchDataFim;
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
	
	if (filterTipo) filterTipo.value = '';
	if (filterDataInicio) filterDataInicio.value = '';
	if (filterDataFim) filterDataFim.value = '';
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
