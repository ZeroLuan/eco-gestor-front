// ===========================
// MODAL DE CADASTRO/EDIÇÃO DE LICENÇA AMBIENTAL
// ===========================

//import { EnumUtils } from "../../../utils/constants.js";

// Armazena o callback global para ser usado ao salvar
let callbackGlobal = null;

/**
 * Abre o modal para cadastrar uma nova licença ambiental ou editar existente
 * @param {number|null} licencaId - ID da licença para edição, null para novo cadastro
 * @param {function} callback - Função de callback após salvar com sucesso
 */
export function abrirModalCadastroLicenca(licencaId = null, callback = null) {
  callbackGlobal = callback;

  carregarModalCadastroLicenca()
    .then(() => {
      const modalElement = document.getElementById("modalCadastroLicenca");

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

      const titulo = document.getElementById("tituloModal");
      const textoBotao = document.getElementById("textoBotaoSalvar");

      if (licencaId) {
        titulo.textContent = "Editar Licença Ambiental";
        textoBotao.textContent = "Salvar Alterações";
        // TODO: Carregar dados da licença para edição
      } else {
        titulo.textContent = "Cadastrar Licença Ambiental";
        textoBotao.textContent = "Cadastrar";
        limparFormularioLicenca();
      }
    })
    .catch((error) => {
      console.error("❌ Erro ao abrir modal:", error);
    });
}

/**
 * Carrega o HTML do modal de cadastro na página
 */
async function carregarModalCadastroLicenca() {
  if (document.getElementById("modalCadastroLicenca")) {
    return;
  }

  try {
    const response = await fetch(
      "./src/pages/licenca-ambiental/cadastra-licenca-ambiental/cadastra-licenca-ambiental.html"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);

    /*  const btnSalvar = document.getElementById("btnSalvarLicenca");
    if (btnSalvar) {
      btnSalvar.addEventListener("click", salvarLicencaAmbiental);
    }*/


    const btnsFechar = document.querySelectorAll('[data-bs-dismiss="modal"]');
    btnsFechar.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        fecharModalLicenca();
      });
    });

    const modalElement = document.getElementById("modalCadastroLicenca");
    if (modalElement) {
      modalElement.addEventListener("click", function (e) {
        if (e.target === modalElement) {
          e.preventDefault();
          fecharModalLicenca();
        }
      });
    }
  } catch (error) {
    console.error("❌ Erro ao carregar modal:", error);
  }
}

function fecharModalLicenca() {
  const modalElement = document.getElementById("modalCadastroLicenca");
  const backdrop = document.getElementById("modalBackdrop");

  // Move o foco para fora do modal antes de fechar (acessibilidade)
  document.body.focus();
  document.body.setAttribute("tabindex", "-1");

  if (typeof bootstrap !== "undefined") {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  } else {
    // Fallback manual
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

  // Remove o tabindex temporário do body após um pequeno delay
  setTimeout(() => {
    document.body.removeAttribute("tabindex");
  }, 100);
}
