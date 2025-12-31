// -----------------------------------
//    MODAL DE REGISTRO DE RESIDUOS
// -----------------------------------

import { residuosService } from "../../../services/residuos/residuosService";
import { pontosColetaService } from "../../../services/pontosColeta/pontosColetaService";
import { ResiduosRequest } from "../../../services/residuos/residuosTypes";

// Armazena o callback global para ser usado ao salvar
let callbackGlobal = null;
// Armazena os dados da coleta em edição (null para criação)
let coletaDataEdicao = null;

export function abrirModalColeta(coletaData = null, callback = null) {
  coletaDataEdicao = coletaData;
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

      if (coletaData) {
        titulo.textContent = "Editar Coleta";
        textoBotao.textContent = "Salvar Alterações";
        // Carrega dados da coleta para edição
        carregarDadosParaEdicao(coletaData);
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

  // Reseta o estado de edição
  coletaDataEdicao = null;
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
 * Carrega dados da coleta para edição
 * @param {Object} coletaData - Dados da coleta
 */
async function carregarDadosParaEdicao(coletaData) {
  if (!coletaData) return;

  console.log("📝 Carregando dados para edição:", coletaData);

  // Preenche o formulário com os dados
  document.getElementById("coletaId").value = coletaData.id || "";
  document.getElementById("coletaTipoResiduo").value = coletaData.tipoResiduo || "";
  document.getElementById("coletaPeso").value = coletaData.peso || "";
  document.getElementById("coletaNomeResponsavel").value = coletaData.nomeResponsavel || "";
  document.getElementById("coletaData").value = coletaData.dataColeta ? coletaData.dataColeta.split('T')[0] : "";

  console.log(`📝 Preenchendo formulário - Tipo: ${coletaData.tipoResiduo}, Ponto: ${coletaData.idPontoColeta}`);

  // Se há tipo de resíduo, carrega os pontos de coleta correspondentes
  if (coletaData.tipoResiduo) {
    try {
      console.log(`🔍 Carregando pontos de coleta para tipo: ${coletaData.tipoResiduo}`);
      const pontos = await pontosColetaService.buscarPorTipoResiduo(coletaData.tipoResiduo);
      console.log(`✅ ${pontos.length} pontos encontrados`);
      await popularSelectLocal(pontos);
      // Após popular, define o valor selecionado
      document.getElementById("coletaLocal").value = coletaData.idPontoColeta || "";
      console.log(`📍 Ponto selecionado: ${coletaData.idPontoColeta}`);
    } catch (error) {
      console.error("❌ Erro ao carregar pontos de coleta:", error);
      await popularSelectLocal([]);
    }
  } else {
    console.log("⚠️ Nenhum tipo de resíduo definido");
    await popularSelectLocal([]);
  }
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
  return Promise.resolve(); // Retorna uma promise para permitir await
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

  // Cria instância do ResiduosRequest para validação
  const request = new ResiduosRequest(dados);

  // Valida os dados
  const validacao = request.validar();
  if (!validacao.isValid) {
    alert(`Dados inválidos: ${validacao.errors.join(', ')}`);
    return;
  }

  console.log("Dados da coleta a serem salvos:", dados);

  try {
    let response;
    if (coletaDataEdicao) {
      // Edição
      response = await residuosService.atualizar(coletaDataEdicao.id, request);
      console.log("Coleta atualizada:", response);
      alert("Coleta atualizada com sucesso!");
    } else {
      // Criação
      response = await residuosService.criar(request);
      console.log("Coleta registrada:", response);
      alert("Coleta registrada com sucesso!");
    }

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
