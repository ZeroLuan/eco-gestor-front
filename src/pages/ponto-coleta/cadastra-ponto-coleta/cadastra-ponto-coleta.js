// ===========================
// MODAL DE CADASTRO/EDIÇÃO DE PONTO DE COLETA
// ===========================

import {
  TIPOS_RESIDUO,
  ESTADOS_BRASIL,
  EnumUtils,
} from "../../../utils/constants.js";
import { pontosColetaService } from "../../../services/pontosColeta/pontosColetaService.js";
import { PontoColetaRequest } from "../../../services/pontosColeta/pontoColetaTypes.js";
import { EnderecoComponent } from "../../../components/endereco/endereco.js";

// Armazena o callback global para ser usado ao salvar
let callbackGlobal = null;

// Instância do componente de endereço
let enderecoComponent = null;

/**
 * Abre o modal para cadastrar um novo ponto de coleta ou editar existente
 * @param {number|null} pontoId - ID do ponto para edição, null para novo cadastro
 * @param {function} callback - Função de callback após salvar com sucesso
 */
export function abrirModalCadastro(pontoId = null, callback = null) {
  // Armazena o callback para ser usado ao salvar
  callbackGlobal = callback;

  // Carrega o HTML do modal se ainda não estiver na página
  carregarModalCadastro()
    .then(() => {
      const modalElement = document.getElementById("modalCadastroPonto");

      if (!modalElement) {
        console.error("❌ Elemento modal não encontrado no DOM");
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

        // Cria o backdrop
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

      if (pontoId) {
        // Modo edição
        titulo.textContent = "Editar Ponto de Coleta";
        textoBotao.textContent = "Salvar Alterações";
        // TODO: Carregar dados do ponto para edição
      } else {
        // Modo cadastro
        titulo.textContent = "Cadastrar Ponto de Coleta";
        textoBotao.textContent = "Cadastrar";
        limparFormulario();
        bloquearFormularioPrincipal(true); // Bloqueia até salvar endereço
      }
    })
    .catch((error) => {
      console.error("❌ Erro ao abrir modal:", error);
    });
}

/**
 * Carrega o HTML do modal de cadastro na página
 */
async function carregarModalCadastro() {
  // Verifica se o modal já existe
  if (document.getElementById("modalCadastroPonto")) {
    return;
  }

  try {
    const response = await fetch(
      "./src/pages/ponto-coleta/cadastra-ponto-coleta/cadastra-ponto-coleta.html"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Adiciona o modal ao body
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);

    // Configura o evento do botão salvar
    const btnSalvar = document.getElementById("btnSalvarPonto");
    if (btnSalvar) {
      btnSalvar.addEventListener("click", salvarPontoColeta);
    }

    // Popula os selects com os enums
    popularSelects();

    // Inicializa o componente de endereço
    await inicializarComponenteEndereco();

    // Configura o botão de fechar do modal
    const btnsFechar = document.querySelectorAll('[data-bs-dismiss="modal"]');
    btnsFechar.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault(); // Previne comportamento padrão
        fecharModal();
      });
    });

    // Configura o backdrop para fechar ao clicar fora
    const modalElement = document.getElementById("modalCadastroPonto");
    if (modalElement) {
      modalElement.addEventListener("click", function (e) {
        // Só fecha se clicou exatamente no modal (não em elementos filhos)
        if (e.target === modalElement) {
          e.preventDefault();
          fecharModal();
        }
      });
    }

    // Máscara para CEP
    const cepInput = document.getElementById("pontoCep");
    if (cepInput) {
      cepInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 5) {
          value = value.substring(0, 5) + "-" + value.substring(5, 8);
        }
        e.target.value = value;
      });
    }
  } catch (error) {
    console.error("❌ Erro ao carregar modal de cadastro:", error);
    alert(
      "Erro ao carregar o formulário de cadastro. Verifique o console para mais detalhes."
    );
    throw error;
  }
}

/**
 * Inicializa o componente de endereço
 */
async function inicializarComponenteEndereco() {
  try {
    // Cria nova instância do componente
    enderecoComponent = new EnderecoComponent("enderecoContainer");

    // Inicializa o componente
    await enderecoComponent.inicializar();

    // Configura callback quando endereço for salvo
    enderecoComponent.onSave((enderecoSalvo) => {
      console.log("✅ Endereço salvo, liberando formulário:", enderecoSalvo);
      bloquearFormularioPrincipal(false); // Libera o resto do formulário
    });

    console.log("✅ Componente de endereço inicializado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao inicializar componente de endereço:", error);
    throw error;
  }
}

/**
 * Fecha o modal manualmente (fallback se Bootstrap não estiver disponível)
 */
function fecharModal() {
  const modalElement = document.getElementById("modalCadastroPonto");
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

  // Remove o tabindex temporário do body após um pequeno delay
  setTimeout(() => {
    document.body.removeAttribute("tabindex");
  }, 100);
}

/**
 * Popula os selects com os enums do sistema
 */
function popularSelects() {
  // Popula select de tipos de resíduo
  const selectTipoResiduo = document.getElementById("pontoTipoResiduo");
  if (selectTipoResiduo) {
    const opcoes = EnumUtils.toSelectOptions(TIPOS_RESIDUO);
    opcoes.forEach((opcao) => {
      const option = document.createElement("option");
      option.value = opcao.value;
      option.textContent = opcao.label;
      selectTipoResiduo.appendChild(option);
    });
  }

  // Popula select de estados
  const selectEstado = document.getElementById("pontoEstado");
  if (selectEstado) {
    const opcoes = EnumUtils.toSelectOptions(ESTADOS_BRASIL);
    opcoes.forEach((opcao) => {
      const option = document.createElement("option");
      option.value = opcao.value;
      option.textContent = opcao.label;
      selectEstado.appendChild(option);
    });
  }

  // Popula checkboxes de materiais aceitos
  const containerMateriais = document.getElementById(
    "materiaisAceitosContainer"
  );
  if (containerMateriais) {
    const opcoes = EnumUtils.toSelectOptions(TIPOS_RESIDUO);
    opcoes.forEach((opcao) => {
      const div = document.createElement("div");
      div.className = "form-check";

      const input = document.createElement("input");
      input.className = "form-check-input";
      input.type = "checkbox";
      input.value = opcao.value;
      input.id = `mat${opcao.value}`;

      const label = document.createElement("label");
      label.className = "form-check-label";
      label.htmlFor = `mat${opcao.value}`;
      label.textContent = opcao.label;

      div.appendChild(input);
      div.appendChild(label);
      containerMateriais.appendChild(div);
    });
  }
}
function limparFormulario() {
  document.getElementById("pontoId").value = "";
  document.getElementById("pontoNome").value = "";
  document.getElementById("pontoTipoResiduo").value = "";
  document.getElementById("pontoAtivo").checked = true;

  // Limpa o componente de endereço
  if (enderecoComponent) {
    enderecoComponent.limpar();
  }

  // Desmarca todos os checkboxes de materiais
  document.querySelectorAll('[id^="mat"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
}

/**
 * Coleta os materiais aceitos selecionados
 */
function obterMateriaisAceitos() {
  const materiais = [];
  const checkboxes = document.querySelectorAll('[id^="mat"]:checked');
  checkboxes.forEach((checkbox) => {
    materiais.push(checkbox.value);
  });
  return materiais;
}

/**
 * Salva o ponto de coleta (cadastro ou edição)
 */
export async function salvarPontoColeta() {
  const form = document.getElementById("formCadastroPonto");

  // Verifica se o endereço foi salvo
  if (!enderecoComponent || !enderecoComponent.estaSalvo()) {
    alert("Por favor, salve o endereço antes de cadastrar o ponto de coleta.");
    return;
  }

  // Valida o formulário
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Obtém o ID do endereço salvo
  const enderecoId = enderecoComponent.getEnderecoId();

  // Coleta os dados do formulário
  const dados = {
    id: document.getElementById("pontoId").value || null,
    nomePonto: document.getElementById("pontoNome").value,
    tipoResiduo: document.getElementById("pontoTipoResiduo").value,
    ativo: document.getElementById("pontoAtivo").checked,
    materiaisAceitos: obterMateriaisAceitos(),
    // ID do endereço que já está salvo no banco
    enderecoId: enderecoId,
  };

  console.log("Dados a serem salvos:", dados);

  try {
    const response = await pontosColetaService.criar(dados);
    console.log("Ponto de coleta criado:", response);

    // Fecha o modal
    fecharModal();

    // Executa callback se fornecido (para atualizar a tabela na tela principal)
    if (callbackGlobal && typeof callbackGlobal === "function") {
      callbackGlobal(dados);
    }
  } catch (error) {
    console.error("Erro ao salvar ponto de coleta:", error);
    alert(`Erro ao salvar: ${error.message}`);
  }
}

/**
 * Bloqueia ou desbloqueia os campos principais do formulário
 */
function bloquearFormularioPrincipal(bloquear) {
  const btnSalvar = document.getElementById("btnSalvarPonto");
  const campos = ["pontoNome", "pontoTipoResiduo", "pontoAtivo"];

  // Campos ficam sempre liberados para edição
  campos.forEach((campoId) => {
    const campo = document.getElementById(campoId);
    if (campo) {
      campo.disabled = false;
      campo.classList.remove("bg-light");
    }
  });

  // Checkboxes de materiais ficam sempre liberados
  const checkboxes = document.querySelectorAll('[id^="mat"]');
  checkboxes.forEach((checkbox) => {
    checkbox.disabled = false;
  });

  // Só bloqueia/desbloqueia o botão salvar
  if (btnSalvar) {
    btnSalvar.disabled = bloquear;
  }

  // Mostra/esconde alerta
  const alertaInfo = document.getElementById("enderecoAlerta");
  const alertaTexto = document.getElementById("enderecoAlertaTexto");

  if (alertaInfo && alertaTexto) {
    if (bloquear) {
      alertaInfo.classList.remove("d-none", "alert-success", "alert-danger");
      alertaInfo.classList.add("alert-info");
      alertaTexto.innerHTML =
        '<i class="bi bi-info-circle me-2"></i>Salve o endereço para liberar o botão de cadastrar.';
    } else {
      // Alerta será escondido pelo componente de endereço
    }
  }
}
