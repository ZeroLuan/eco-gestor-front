// -----------------------------------
//    MODAL DE REGISTRO DE RESIDUOS
// -----------------------------------

import { residuosService } from "../../../services/residuos/residuosService";
import { pontosColetaService } from "../../../services/pontosColeta/pontosColetaService";

// Armazena o callback global para ser usado ao salvar
let callbackGlobal = null;

export function abrirModalColeta(coletaId = null, callback = null) {
  callbackGlobal = callback;

  // Carrega o HTML do modal se ainda não estiver na página
  carregarModalColeta()
    .then(() => {
      const modalElement = document.getElementById("modalRegistroColeta");
      if (!modalElement) {
        console.error("❌ Elemento modal de coleta não encontrado no DOM");
        return;
      }

      // Verifica se Bootstrap está disponível
      if (typeof bootstrap === "undefined") {
        // Fallback: abre o modal manualmente com CSS
        modalElement.classList.add("show");
        modalElement.style.display = "block";
        modalElement.setAttribute("aria-hidden", "false");
        modalElement.setAttribute("aria-modal", "true");
        document.body.classList.add("modal-open");

        // cria o backdrop
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

      if (coletaId) {
        titulo.textContent = "Editar Coleta";
        textoBotao.textContent = "Salvar Alterações";
        // TODO: carregar dados da coleta para edição
      } else {
        titulo.textContent = "Registrar Coleta";
        textoBotao.textContent = "Registrar";
        limparFormularioColeta();
      }
    })
    .catch((error) => {
      console.error("❌ Erro ao abrir modal de coleta:", error);
    });
}

/**
 * Carrega o HTML do modal de registro na página
 */
async function carregarModalColeta() {
  if (document.getElementById("modalRegistroColeta")) {
    return;
  }

  try {
    const response = await fetch(
      "./src/pages/residuos/registra-coleta-residuos/registra-coleta-residuos.html"
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Adiciona o modal ao body
    const html = await response.text();
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);

    // Configura evento do botão salvar
    const btnSalvar = document.getElementById("btnSalvarColeta");
    if (btnSalvar) {
      btnSalvar.addEventListener("click", salvarColeta);
    }

    // Configura event listener para o select de tipo de resíduo
    const selectTipoResiduo = document.getElementById("coletaTipoResiduo");
    if (selectTipoResiduo) {
      selectTipoResiduo.addEventListener("change", async function() {
        const tipo = this.value;
        if (tipo) {
          try {
            const pontos = await pontosColetaService.buscarPorTipoResiduo(tipo);
            popularSelectLocal(pontos);
          } catch (error) {
            console.error("Erro ao carregar pontos de coleta:", error);
            popularSelectLocal([]);
          }
        } else {
          popularSelectLocal([]);
        }
      });
    }

    // Configura botões de fechar
    const btnsFechar = document.querySelectorAll('[data-bs-dismiss="modal"]');
    btnsFechar.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        fecharModal();
      });
    });
  } catch (error) {
    console.error("❌ Erro ao carregar modal de coleta:", error);
  }
}

function fecharModal() {
  const modalElement = document.getElementById("modalRegistroColeta");
  const backdrop = document.getElementById("modalBackdrop");

  // Move o foco para fora do modal antes de fechar para evitar problemas de acessibilidade
  // Isso previne o erro "Blocked aria-hidden on an element because its descendant retained focus"
  document.body.focus();
  document.body.setAttribute("tabindex", "-1"); // Permite que body receba foco temporariamente

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
}

/**
 * Limpa o formulário de coleta
 */
function limparFormularioColeta() {
  document.getElementById("coletaId").value = "";
  document.getElementById("coletaTipoResiduo").value = "";
  document.getElementById("coletaPeso").value = "";
  document.getElementById("coletaLocal").value = "";
  document.getElementById("coletaNomeResponsavel").value = "";
  document.getElementById("coletaData").value = "";
}

/**
 * Popula o select de local/ponto de coleta com os pontos retornados
 * @param {Array} pontos - Lista de pontos de coleta
 */
function popularSelectLocal(pontos) {
  const select = document.getElementById("coletaLocal");
  select.innerHTML = '<option value="">Selecione...</option>';
  if (pontos && pontos.length > 0) {
    pontos.forEach(ponto => {
      const option = document.createElement("option");
      option.value = ponto.id;
      option.textContent = ponto.nomePonto;
      select.appendChild(option);
    });
  }
}

/**
 * Salva a coleta de resíduos (registro ou edição)
 */
export async function salvarColeta() {
  const form = document.getElementById("formRegistroColeta");

  // Valida o formulário
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Coleta os dados do formulário e adapta para ResiduosRequest
  const dados = {
    idPontoColeta: parseInt(document.getElementById("coletaLocal").value),
    tipoResiduo: document.getElementById("coletaTipoResiduo").value,
    peso: parseFloat(document.getElementById("coletaPeso").value),
    nomeResponsavel: document.getElementById("coletaNomeResponsavel").value,
    dataColeta: document.getElementById("coletaData").value,
  };

  // await residuosService.criar(dados);

  console.log("Dados da coleta a serem salvos:", dados);

  try {
    // integração com o service de coletas
    const response = await residuosService.criar(dados);
    console.log("Coleta registrada:", response);

    // Fecha o modal
    fecharModal();

    // Executa callback se fornecido (para atualizar a tabela na tela principal)
    if (callbackGlobal && typeof callbackGlobal === "function") {
      callbackGlobal(dados);
    }
  } catch (error) {
    console.error("Erro ao salvar coleta:", error);
    alert(`Erro ao salvar: ${error.message}`);
  }
}
