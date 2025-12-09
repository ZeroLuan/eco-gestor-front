/*
 * Gerenciar cooperativas
 */

import { abrirModalCadastroCooperativa } from "./cadastra-cooperativa/cadastra-cooperativa.js";
import { cooperativaService } from "../../services/cooperativa/cooperativaService.js";

let cooperativas = [];

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
  btnLimpar.addEventListener("click", () => {
    limparFiltros();
    renderizarTabela(cooperativas);
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

  renderizarTabela(filtrados);
}

/**
 * Limpa filtros
 */
function limparFiltros() {
  const filterNome = document.getElementById("filterNome");
  const filterCnpj = document.getElementById("filterCnpj");
  const filterStatus = document.getElementById("filterStatus");

  if (filterNome) filterNome.value = "";
  if (filterCnpj) filterCnpj.value = "";
  if (filterStatus) filterStatus.value = "";
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
