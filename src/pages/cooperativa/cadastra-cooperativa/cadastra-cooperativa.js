// ===========================
// MODAL DE CADASTRO DE COOPERATIVA
// ===========================

import { cooperativaService } from "../../../services/cooperativa/cooperativaService.js";
import { CooperativaRequest } from "../../../services/cooperativa/cooperativaTypes.js";
import { EnderecoComponent } from '../../../components/endereco/endereco.js';

// Armazena o callback global para ser usado ao salvar
let callbackGlobal = null;

// Instância do componente de endereço
let enderecoComponent = null;

/**
 * Abre o modal para cadastrar uma nova cooperativa
 * @param {function} callback - Função de callback após salvar com sucesso
 */
export function abrirModalCadastroCooperativa(callback = null) {
  callbackGlobal = callback;

  carregarModalCadastroCooperativa()
    .then(async () => {
      const modalElement = document.getElementById("modalCadastroCooperativa");

      if (!modalElement) {
        console.error("❌ Elemento modal não encontrado no DOM");
        return;
      }

      // Reinicializa o componente de endereço toda vez que o modal abre
      await inicializarComponenteEndereco();

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
        const modal = new bootstrap.Modal(modalElement, {
          backdrop: 'static',
          keyboard: false
        });
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

    console.log('✅ Modal de cooperativa carregado');
  } catch (error) {
    console.error("❌ Erro ao carregar modal de cooperativa:", error);
  }
}

/**
 * Inicializa o componente de endereço
 */
async function inicializarComponenteEndereco() {
  try {
    // Remove instância anterior se existir
    if (enderecoComponent) {
      enderecoComponent.limpar();
      enderecoComponent = null;
    }

    // Cria nova instância do componente
    enderecoComponent = new EnderecoComponent('enderecoContainerCooperativa');
    
    // Inicializa o componente
    await enderecoComponent.inicializar();
    
    // Configura callback quando endereço for salvo
    enderecoComponent.onSave((enderecoSalvo) => {
      console.log('✅ Endereço validado, liberando botão de salvar:', enderecoSalvo);
      bloquearBotaoSalvar(false); // Libera o botão de salvar
    });
    
    console.log('✅ Componente de endereço inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar componente de endereço:', error);
    throw error;
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

  // Limpar componente de endereço
  if (enderecoComponent) {
    enderecoComponent.limpar();
  }
}

/**
 * Bloqueia ou desbloqueia o botão de salvar cooperativa
 */
function bloquearBotaoSalvar(bloquear) {
  const btnSalvar = document.getElementById('btnSalvarCooperativa');
  
  if (btnSalvar) {
    btnSalvar.disabled = bloquear;
    
    if (bloquear) {
      btnSalvar.classList.add('disabled');
      btnSalvar.title = 'Salve o endereço primeiro';
    } else {
      btnSalvar.classList.remove('disabled');
      btnSalvar.title = '';
    }
  }
}

/**
 * Limpa o formulário de cooperativa
 */
function limparFormularioCooperativa() {
  document.getElementById("cooperativaId").value = "";
  document.getElementById("cooperativaNome").value = "";
  document.getElementById("nomeFantasia").value = "";
  document.getElementById("cooperativaCnpj").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("naturezaJuridica").value = "";
  document.getElementById("cnae").value = "";
  document.getElementById("cooperativaResponsavel").value = "";

  // Limpar endereço
  if (enderecoComponent) {
    enderecoComponent.limpar();
  }
  
  // Bloquear botão de salvar até que o endereço seja salvo
  bloquearBotaoSalvar(true);
}

/**
 * Salva cooperativa (apenas criar)
 */

async function salvarCooperativa() {
  const btnSalvar = document.getElementById('btnSalvarCooperativa');
  const textoBotao = document.getElementById('textoBotaoSalvarCooperativa');
  const textoOriginal = textoBotao ? textoBotao.textContent : 'Cadastrar';
  
  try {
    // Verificar se o endereço foi salvo
    if (!enderecoComponent || !enderecoComponent.estaSalvo()) {
      alert("⚠️ Por favor, salve o endereço antes de cadastrar a cooperativa.");
      return;
    }

    // Desabilita o botão e mostra loading
    if (btnSalvar) {
      btnSalvar.disabled = true;
      textoBotao.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Salvando...';
    }

    // PASSO 1: Persiste o endereço no banco de dados
    console.log('📍 Passo 1: Persistindo endereço no banco...');
    const enderecoResponse = await enderecoComponent.persistirEndereco();
    
    if (!enderecoResponse || !enderecoResponse.id) {
      throw new Error('Falha ao salvar endereço. Não foi possível obter o ID.');
    }
    
    const enderecoId = enderecoResponse.id;
    console.log('✅ Endereço persistido com ID:', enderecoId);

    // PASSO 2: Coleta os dados da cooperativa
    const responsavel = document
      .getElementById("cooperativaResponsavel")
      ?.value.trim();
    const nome = document.getElementById("cooperativaNome").value;
    const nomeFantasia = document.getElementById("nomeFantasia").value;
    const cnpj = document.getElementById("cooperativaCnpj").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const naturezaJuridica = document.getElementById("naturezaJuridica").value;
    const cnae = document.getElementById("cnae").value;

    console.log('📦 Passo 2: Dados da cooperativa coletados');

    // PASSO 3: Cria o request da cooperativa
    const request = new CooperativaRequest({
      nomeEmpresa: nome,
      nomeFantasia,
      enderecoId: enderecoId,
      cnpj,
      telefone,
      email,
      naturezaJuridica,
      cnae,
      nomeResponsavel: responsavel,
    });

    const validacao = request.validar();
    if (!validacao.isValid) {
      alert("⚠️ Erros: " + validacao.errors.join(", "));
      // Reabilita o botão em caso de erro
      if (btnSalvar) {
        btnSalvar.disabled = false;
        textoBotao.textContent = textoOriginal;
      }
      return;
    }

    // PASSO 4: Salva a cooperativa
    console.log('➕ Passo 3: Criando cooperativa...');
    const response = await cooperativaService.criar(request);
    console.log('✅ Cooperativa criada:', response);

    // Fecha o modal
    fecharModalCooperativa();
    
    // Executa callback se fornecido (para atualizar a tabela na tela principal)
    if (callbackGlobal && typeof callbackGlobal === 'function') {
      callbackGlobal(response);
    }
    
  } catch (error) {
    console.error("❌ Erro ao salvar cooperativa:", error);
    alert(`Erro ao salvar: ${error.message}`);
    
    // Reabilita o botão em caso de erro
    if (btnSalvar) {
      btnSalvar.disabled = false;
      textoBotao.textContent = textoOriginal;
    }
  }
}
