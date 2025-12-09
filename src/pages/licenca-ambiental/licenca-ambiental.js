/**
 * Licenças Ambientais - JavaScript
 * Gerenciamento de licenças ambientais
 */

import { abrirModalCadastroLicenca } from "../licenca-ambiental/cadastra-licenca-ambiental/cadastra-licenca-ambiental.js";
import { criarBotaoAcoesPadrao, adicionarEventListeners } from '../../components/common/botao-acoes/botao-acoes.js';

// Exemplo de dados de teste
const dadosExemplo = [
  {
    id: 1,
    empresa: "Empresa ABC Ltda",
    tipo: "LO",
    numero: "001/2024",
    emissao: "2024-01-15",
    validade: "2027-01-15",
    status: "Ativa",
  },
  {
    id: 2,
    empresa: "Indústria XYZ S.A.",
    tipo: "LI",
    numero: "002/2024",
    emissao: "2024-03-10",
    validade: "2026-03-10",
    status: "Ativa",
  },
  {
    id: 3,
    empresa: "Cooperativa Verde",
    tipo: "LP",
    numero: "003/2023",
    emissao: "2023-06-20",
    validade: "2024-06-20",
    status: "Vencida",
  },
  {
    id: 4,
    empresa: "EcoTech Solutions",
    tipo: "LO",
    numero: "004/2024",
    emissao: "2024-09-05",
    validade: "2029-09-05",
    status: "Ativa",
  },
  {
    id: 5,
    empresa: "Reciclagem Brasil",
    tipo: "LI",
    numero: "005/2024",
    emissao: "2024-11-01",
    validade: "2025-11-01",
    status: "Pendente",
  },
];

// Inicializa elementos e eventos imediatamente (SPA já carregou o HTML)
function inicializarLicencas() {
  const btnPesquisar = document.getElementById("btnPesquisar");
  const btnLimpar = document.getElementById("btnLimpar");
  const btnNovo = document.getElementById("btnNovo");

  if (!btnPesquisar || !btnLimpar || !btnNovo) {
    console.error("❌ Elementos não encontrados na página de licenças");
    return;
  }

  if (btnPesquisar) {
    btnPesquisar.addEventListener("click", function () {
      aplicarFiltros();
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener("click", function () {
      limparFiltros();
      renderizarTabela(dadosExemplo);
    });
  }

  btnNovo.addEventListener("click", function () {
    abrirModalCadastroLicenca(null, (novaLicenca) => {
      // Callback após salvar - adiciona aos dados de exemplo e atualiza tabela
      if (!novaLicenca.id) {
        novaLicenca.id = dadosExemplo.length + 1;
        dadosExemplo.push(novaLicenca);
      }
      renderizarTabela(dadosExemplo);
    });
  });

  // Exibe dados iniciais
  renderizarTabela(dadosExemplo);
  console.log("✅ Licenças Ambientais inicializadas");
}

// Executa após um pequeno delay para garantir que o HTML foi injetado
setTimeout(inicializarLicencas, 100);

/**
 * Renderiza a tabela com os dados fornecidos
 */
function renderizarTabela(dados) {
  const tbody = document.querySelector("#tabelaLicencas tbody");
  const totalEl = document.getElementById("totalRegistros");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!dados || dados.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
    if (totalEl) totalEl.textContent = "Total de registros: 0";
    return;
  }

  dados.forEach((item) => {
    const statusClass =
      item.status === "Ativa"
        ? "success"
        : item.status === "Vencida"
        ? "danger"
        : "warning";
    const tr = document.createElement("tr");
    tr.innerHTML = `
			<td>${item.empresa}</td>
			<td><span class="badge bg-info">${item.tipo}</span></td>
			<td>${item.numero}</td>
			<td>${formatarDataBR(item.emissao)}</td>
			<td>${formatarDataBR(item.validade)}</td>
			<td><span class="badge bg-${statusClass}">${item.status}</span></td>
			<td>
				${criarBotaoAcoesPadrao(item.id)}
			</td>
		`;
    tbody.appendChild(tr);
  });

  if (totalEl) totalEl.textContent = `Total de registros: ${dados.length}`;
	// Adiciona event listeners aos botões de ação
	adicionarEventListeners(tbody, (action, id) => {
		if (action === 'editar') {
			alert(`Editar licença ID: ${id}`);
		} else if (action === 'excluir') {
			if (confirm('Tem certeza que deseja excluir esta licença?')) {
				alert(`Excluir licença ID: ${id}`);
			}
		}
	});

	if (totalEl) totalEl.textContent = `Total de registros: ${dados.length}`;
}

/**
 * Aplicar filtro
 */
function aplicarFiltros() {
  const empresa =
    document.getElementById("filterEmpresa")?.value.trim().toLowerCase() || "";
  const status = document.getElementById("filterStatus")?.value || "";
  const vencimento = document.getElementById("filterVencimento")?.value || "";
  const tipo = document.getElementById("filterTipo")?.value || "";

  const filtrados = dadosExemplo.filter((item) => {
    const matchEmpresa = empresa
      ? item.empresa.toLowerCase().includes(empresa)
      : true;
    const matchStatus = status ? item.status === status : true;
    const matchVencimento = vencimento ? item.validade === vencimento : true;
    const matchTipo = tipo ? item.tipo === tipo : true;
    return matchEmpresa && matchStatus && matchVencimento && matchTipo;
  });

  renderizarTabela(filtrados);
}

/**
 * Limpa filtros
 */
function limparFiltros() {
  const filterEmpresa = document.getElementById("filterEmpresa");
  const filterStatus = document.getElementById("filterStatus");
  const filterVencimento = document.getElementById("filterVencimento");
  const filterTipo = document.getElementById("filterTipo");

  if (filterEmpresa) filterEmpresa.value = "";
  if (filterStatus) filterStatus.value = "";
  if (filterVencimento) filterVencimento.value = "";
  if (filterTipo) filterTipo.value = "";
}

/**
 * Formata data YYYY-MM-DD para DD/MM/YYYY
 */
function formatarDataBR(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
