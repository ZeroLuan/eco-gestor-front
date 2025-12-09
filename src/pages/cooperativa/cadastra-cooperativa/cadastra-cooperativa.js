// ===========================
// MODAL DE CADASTRO DE COOPERATIVA
// ===========================

import { cooperativaService } from "../../../services/cooperativa/cooperativaService.js";
import { CooperativaRequest } from "../../../services/cooperativa/cooperativaTypes.js";

// Armazena o callback global para ser usado ao salvar
let callbackGlobal = null;

/**
 * Abre o modal para cadastrar uma nova cooperativa
 * @param {function} callback - Função de callback após salvar com sucesso
 */
export function abrirModalCadastroCooperativa(callback = null) {
  callbackGlobal = callback;

  carregarModalCadastroCooperativa()
    .then(() => {
      const modalElement = document.getElementById("modalCadastroCooperativa");

      if (!modalElement) {
        console.error("❌ Elemento modal não encontrado no DOM");
        return;
      }

      if (typeof bootstrap === "undefined") {
        modalElement.classList.add("show");
        modalElement.style.display = "block";
        modalElement.setAttribute("aria-hidden", "false");
        modalElement.setAttribute("aria-modal", "true");
        document.body.classList.add("modal-open");

        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop fade show";
        backdrop.id = "modalBackdrop";
        document.body.appendChild(backdrop);
      } else {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }

      const titulo = document.getElementById("tituloModalCooperativa");
      const textoBotao = document.getElementById("textoBotaoSalvarCooperativa");

      titulo.textContent = "Cadastrar Cooperativa";
      textoBotao.textContent = "Cadastrar";
      limparFormularioCooperativa();
    })
    .catch((error) => {
      console.error("❌ Erro ao abrir modal:", error);
    });
}

/**
 * Carrega o HTML do modal de cadastro de cooperativa na página
 */
async function carregarModalCadastroCooperativa() {
  if (document.getElementById("modalCadastroCooperativa")) {
    return;
  }

  try {
    const response = await fetch(
      "../src/pages/cooperativa/cadastra-cooperativa/cadastra-cooperativa.html"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);

    const btnSalvar = document.getElementById("btnSalvarCooperativa");
    if (btnSalvar) {
      btnSalvar.addEventListener("click", salvarCooperativa);
    }

    const btnsFechar = document.querySelectorAll('[data-bs-dismiss="modal"]');
    btnsFechar.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        fecharModalCooperativa();
      });
    });

    const modalElement = document.getElementById("modalCadastroCooperativa");
    if (modalElement) {
      modalElement.addEventListener("click", function (e) {
        if (e.target === modalElement) {
          e.preventDefault();
          fecharModalCooperativa();
        }
      });
    }
  } catch (error) {
    console.error("❌ Erro ao carregar modal de cooperativa:", error);
  }
}

function fecharModalCooperativa() {
  const modalElement = document.getElementById("modalCadastroCooperativa");
  const backdrop = document.getElementById("modalBackdrop");

  document.body.focus();
  document.body.setAttribute("tabindex", "-1");

  if (typeof bootstrap !== "undefined") {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  } else {
    if (modalElement) {
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      modalElement.setAttribute("aria-hidden", "true");
      modalElement.removeAttribute("aria-modal");
      document.body.classList.remove("modal-open");
    }
    if (backdrop) {
      backdrop.remove();
    }
  }
}

/**
 * Limpa o formulário de cooperativa
 */
function limparFormularioCooperativa() {
  document.getElementById("cooperativaId").value = "";
  document.getElementById("cooperativaNome").value = "";
  document.getElementById("cooperativaCnpj").value = "";
  document.getElementById("cooperativaResponsavel").value = "";
  document.getElementById("statusCooperativa").value = "";
  document.getElementById("dataInicio").value = "";
  document.getElementById("dataFim").value = "";
}

/**
 * Salva cooperativa (apenas criar)
 */

async function salvarCooperativa() {
  try {
    const responsavel = document
      .getElementById("cooperativaResponsavel")
      ?.value.trim();
    const nome = document.getElementById("cooperativaNome").value;
    const cnpj = document.getElementById("cooperativaCnpj").value;
    const status = document.getElementById("statusCooperativa")?.value; // ATIVA, VENCIDA, PENDENTE, INATIVA
    const dataInicio = document.getElementById("dataInicio")?.value;
    const dataFim = document.getElementById("dataFim")?.value;

    const request = new CooperativaRequest({
      nome,
      responsavel,
      cnpj,
      statusCooperativa: status, // já vem no formato correto
      dataInicio: dataInicio ? new Date(dataInicio).toISOString() : null,
      dataFim: dataFim ? new Date(dataFim).toISOString() : null,
    });

    const validacao = request.validar();
    if (!validacao.isValid) {
      alert("⚠️ Erros: " + validacao.errors.join(", "));
      return;
    }

    const response = await cooperativaService.criar(request);

    fecharModalCooperativa();
    if (callbackGlobal) callbackGlobal(response);
  } catch (error) {
    console.error("❌ Erro ao salvar cooperativa:", error.message);
    alert("Erro ao salvar cooperativa");
  }
}
