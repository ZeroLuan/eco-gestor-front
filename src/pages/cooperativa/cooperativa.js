/*
 * Gerenciar cooperativas
 */

import { abrirModalCadastroCooperativa } from "./cadastra-cooperativa/cadastra-cooperativa.js";
import { cooperativaService } from "../../services/cooperativa/cooperativaService.js";

let cooperativas = [];
import { criarBotaoAcoesPadrao, adicionarEventListeners } from '../../components/common/botao-acoes/botao-acoes.js';

// Exemplo de dados de teste
const dadosExemplo = [
	{ id: 1, nome: 'Cooperativa Verde', cnpj: '12.345.678/0001-90', responsavel: 'João Silva', telefone: '(74) 3641-1234', status: 'Ativa' },
	{ id: 2, nome: 'CoopRecicla Irecê', cnpj: '98.765.432/0001-10', responsavel: 'Maria Santos', telefone: '(74) 3641-5678', status: 'Ativa' },
	{ id: 3, nome: 'EcoCooperativa BA', cnpj: '11.222.333/0001-44', responsavel: 'Carlos Oliveira', telefone: '(74) 3641-9999', status: 'Pendente' },
	{ id: 4, nome: 'Reciclar & Renovar', cnpj: '55.666.777/0001-88', responsavel: 'Ana Paula', telefone: '(74) 3641-4321', status: 'Ativa' },
	{ id: 5, nome: 'Coop Sustentável', cnpj: '33.444.555/0001-22', responsavel: 'Pedro Costa', telefone: '(74) 3641-8765', status: 'Inativa' }
];

/**
 * Inicializa elementos e eventos imediatamente (SPA já carregou o HTML)
 */
function inicializarCooperativas() {
  const btnPesquisar = document.getElementById("btnPesquisar");
  const btnLimpar = document.getElementById("btnLimpar");
  const btnNovo = document.getElementById("btnNovo");

  if (!btnPesquisar || !btnLimpar || !btnNovo) {
    console.error("❌ Elementos não encontrados na página de cooperativas");
    return;
  }

  // Filtro simples em memória
  btnPesquisar.addEventListener("click", aplicarFiltros);

  // Limpa filtros e mostra todos os registros em memória
  btnLimpar.addEventListener("click", async () => {
    await limparFiltros();
  });

  // Novo cadastro
  btnNovo.addEventListener("click", () => {
    abrirModalCadastroCooperativa(null, async (novaCooperativa) => {
      try {
        const response = await cooperativaService.criar(novaCooperativa);
        cooperativas.push(response);
        renderizarTabela(cooperativas);
      } catch (error) {
        console.error("❌ Erro ao criar cooperativa:", error.message);
      }
    });
  });

  // Inicializa tabela vazia
  renderizarTabela(cooperativas);
  console.log("✅ Cooperativas inicializadas");
}

setTimeout(inicializarCooperativas, 100);

/**
 * Aplica filtros em memória
 */
function aplicarFiltros() {
  const nome =
    document.getElementById("filterNome")?.value.trim().toLowerCase() || "";
  const cnpj = document.getElementById("filterCnpj")?.value.trim() || "";
  const status = document.getElementById("filterStatus")?.value || "";

  const filtrados = cooperativas.filter((item) => {
    const matchNome = nome ? item.nome.toLowerCase().includes(nome) : true;
    const matchCnpj = cnpj ? item.cnpj.includes(cnpj) : true;
    const matchStatus = status ? item.statusCooperativa === status : true;
    return matchNome && matchCnpj && matchStatus;
  });

  // Se não encontrou nada com filtros, mostra todos
  if (filtrados.length === 0) {
    console.log('⚠️ Filtro não retornou resultados. Mostrando todos...');
    renderizarTabela(cooperativas);
  } else {
    renderizarTabela(filtrados);
  }
function renderizarTabela(dados) {
	const tbody = document.querySelector('#tabelaCooperativas tbody');
	const totalEl = document.getElementById('totalRegistros');
	
	if (!tbody) return;
	
	tbody.innerHTML = '';

	if (!dados || dados.length === 0) {
		tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
		if (totalEl) totalEl.textContent = 'Total de registros: 0';
		return;
	}

	dados.forEach(item => {
		const statusClass = item.status === 'Ativa' ? 'success' : (item.status === 'Inativa' ? 'danger' : 'warning');
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${item.nome}</td>
			<td>${item.cnpj}</td>
			<td>${item.responsavel}</td>
			<td>${item.telefone}</td>
			<td><span class="badge bg-${statusClass}">${item.status}</span></td>
			<td>
				${criarBotaoAcoesPadrao(item.id)}
			</td>
		`;
		tbody.appendChild(tr);
	});

	// Adiciona event listeners aos botões de ação
	adicionarEventListeners(tbody, (action, id) => {
		if (action === 'editar') {
			alert(`Editar cooperativa ID: ${id}`);
		} else if (action === 'excluir') {
			if (confirm('Tem certeza que deseja excluir esta cooperativa?')) {
				alert(`Excluir cooperativa ID: ${id}`);
			}
		}
	});

	if (totalEl) totalEl.textContent = `Total de registros: ${dados.length}`;
}

/**
 * Limpa filtros
 */
async function limparFiltros() {
  const filterNome = document.getElementById("filterNome");
  const filterCnpj = document.getElementById("filterCnpj");
  const filterStatus = document.getElementById("filterStatus");

  if (filterNome) filterNome.value = "";
  if (filterCnpj) filterCnpj.value = "";
  if (filterStatus) filterStatus.value = "";
  
  // Recarrega todos os registros
  renderizarTabela(cooperativas);
}

/**
 * Renderiza a tabela com os dados fornecidos
 */
function renderizarTabela(dados) {
  const tbody = document.querySelector("#tabelaCooperativas tbody");
  const totalEl = document.getElementById("totalRegistros");

  if (!tbody) return;
  tbody.innerHTML = "";

  if (!dados || dados.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
    if (totalEl) totalEl.textContent = "Total de registros: 0";
    return;
  }

  dados.forEach((item) => {
    const statusClass =
      item.statusCooperativa === "ATIVA"
        ? "success"
        : item.statusCooperativa === "INATIVA"
        ? "danger"
        : "warning";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.cnpj || ""}</td>
      <td>${item.responsavel}</td>
      <td>${item.nome}</td>
      <td>
        <span class="badge bg-${statusClass}">
          ${item.statusCooperativa}
        </span>
      </td>
      <td>
        <button class="btn btn-outline-secondary btn-sm" title="Mais ações">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (totalEl) {
    totalEl.textContent = `Total de registros: ${dados.length}`;
  }
}
