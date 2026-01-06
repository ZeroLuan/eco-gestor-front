/*
 * Gerenciar cooperativas
 */

import { abrirModalCadastroCooperativa } from "./cadastra-cooperativa/cadastra-cooperativa.js";
import { cooperativaService } from "../../services/cooperativa/cooperativaService.js";
import { PaginacaoComponent } from '../../components/paginacao/paginacao.js';
import { criarBotaoAcoesPadrao, adicionarEventListeners } from '../../components/common/botao-acoes/botao-acoes.js';

// ===========================
// CARREGAMENTO DE DADOS DO BACKEND
// ===========================

// Array para armazenar os dados carregados do backend
let cooperativasDados = [];

// Componente de paginação reutilizável
let paginacao = null;

/**
 * Inicializa elementos e eventos imediatamente (SPA já carregou o HTML)
 */
async function inicializarCooperativas() {
  const btnPesquisar = document.getElementById("btnPesquisar");
  const btnLimpar = document.getElementById("btnLimpar");
  const btnNovo = document.getElementById("btnNovo");

  if (!btnPesquisar || !btnLimpar || !btnNovo) {
    console.error("❌ Elementos não encontrados na página de cooperativas");
    return;
  }

  // Inicializa o componente de paginação reutilizável
  paginacao = new PaginacaoComponent({
    containerId: 'paginacao',
    totalRegistrosId: 'totalRegistros',
    tamanhoPagina: 10,
    onPageChange: (numeroPagina) => {
      carregarCooperativas(numeroPagina);
    }
  });

  btnPesquisar.addEventListener('click', function() {
    aplicarFiltros();
  });

  btnLimpar.addEventListener('click', function() {
    limparFiltros();
  });

  // Novo cadastro
  btnNovo.addEventListener("click", () => {
    abrirModalCadastroCooperativa(null, () => {
      // Callback após salvar - recarrega os dados do backend
      carregarCooperativas(paginacao.getPaginaAtual());
    });
  });

  // Carrega dados iniciais do backend
  await carregarCooperativas(0);
  console.log("✅ Cooperativas inicializadas");
}

setTimeout(inicializarCooperativas, 100);

/**
 * Carrega as cooperativas do backend
 */
async function carregarCooperativas(pagina = 0) {
  try {
    console.log(`🔄 Carregando cooperativas - Página ${pagina + 1}...`);
    
    // Captura os filtros ativos
    const filtros = obterFiltrosAtivos();
    const temFiltros = Object.keys(filtros).length > 0;
    
    // Se houver filtros, usa buscarComFiltros, senão usa buscarPaginado
    let response = temFiltros
      ? await cooperativaService.buscarComFiltros(filtros, {
          page: pagina,
          size: paginacao.getTamanhoPagina(),
          sort: 'id,desc'
        })
      : await cooperativaService.buscarPaginado({
          page: pagina,
          size: paginacao.getTamanhoPagina(),
          sort: 'nomeEmpresa,asc'
        });
    
    // Se filtrou mas não encontrou nada, busca todos
    if (temFiltros && (!response || !response.content || response.content.length === 0)) {
      console.log('⚠️ Filtro não retornou resultados. Buscando todos...');
      response = await cooperativaService.buscarPaginado({
        page: 0,
        size: paginacao.getTamanhoPagina(),
        sort: 'id,desc'
      });
    }
    
    if (response && response.content) {
      cooperativasDados = response.content;
      
      // Adapta a estrutura do Spring para o formato esperado
      const paginaInfo = {
        content: response.content,
        number: response.number || 0,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
        size: response.size || 10
      };
      
      // Atualiza o componente de paginação
      paginacao.atualizar(paginaInfo);
      
      // Renderiza a tabela
      renderizarTabela(cooperativasDados);
      
      console.log(`✅ ${cooperativasDados.length} cooperativas carregadas - Página ${paginaInfo.number + 1}/${paginaInfo.totalPages}`);
    } else {
      cooperativasDados = [];
      paginacao.limpar();
      renderizarTabela(cooperativasDados);
      console.log('⚠️ Nenhuma cooperativa encontrada');
    }
  } catch (error) {
    console.error('❌ Erro ao carregar cooperativas:', error);
    cooperativasDados = [];
    paginacao.limpar();
    renderizarTabela(cooperativasDados);
    alert('Erro ao carregar cooperativas. Por favor, tente novamente.');
  }
}

/**
 * Aplica filtros (recarrega dados do backend)
 */
function aplicarFiltros() {
  // Recarrega a primeira página com os filtros ativos
  paginacao.voltarParaPrimeiraPagina();
}

/**
 * Limpa filtros
 */
async function limparFiltros() {
  const filterNome = document.getElementById("filterNome");
  const filterCnpj = document.getElementById("filterCnpj");

  if (filterNome) filterNome.value = "";
  if (filterCnpj) filterCnpj.value = "";
  
  // Recarrega todos os registros da primeira página
  await carregarCooperativas(0);
}

/**
 * Renderiza a tabela com os dados fornecidos
 */
function renderizarTabela(dados) {
  const tbody = document.querySelector("#tabelaCooperativas tbody");

  if (!tbody) return;
  tbody.innerHTML = "";

  if (!dados || dados.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
    return;
  }

  dados.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nomeEmpresa || ""}</td>
      <td>${item.cnpj || ""}</td>
      <td>${item.responsavel || ""}</td>
      <td>${item.telefone || ""}</td>
      <td>
        <span class="badge bg-secondary">-</span>
      </td>
      <td>
        ${criarBotaoAcoesPadrao(item.id)}
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Adiciona event listeners aos botões de ação
  adicionarEventListeners(tbody, (action, id) => {
    const cooperativaId = parseInt(id);
    const cooperativaData = dados.find(c => c.id === cooperativaId);
    
    if (action === 'editar') {
      abrirModalCadastroCooperativa(cooperativaData, () => {
        carregarCooperativas(paginacao.getPaginaAtual());
      });
    } else if (action === 'excluir') {
      excluirCooperativa(cooperativaId, cooperativaData.nomeEmpresa);
    }
  });
}

/**
 * Exclui uma cooperativa
 */
async function excluirCooperativa(id, nome) {
  // Confirmação antes de excluir
  const confirmacao = confirm(`Tem certeza que deseja excluir a cooperativa "${nome}"?\n\nEsta ação não pode ser desfeita.`);
  
  if (!confirmacao) {
    return;
  }
  
  try {
    console.log('🗑️ Excluindo cooperativa ID:', id);
    
    // Chama o serviço para excluir
    await cooperativaService.remover(id);
    
    console.log('✅ Cooperativa excluída com sucesso');
    
    // Mostra mensagem de sucesso
    alert('Cooperativa excluída com sucesso!');
    
    // Recarrega a tabela
    await carregarCooperativas(paginacao.getPaginaAtual());
    
  } catch (error) {
    console.error('❌ Erro ao excluir cooperativa:', error);
    alert(`Erro ao excluir cooperativa: ${error.message}`);
  }
}

/**
 * Captura os filtros ativos dos campos de input
 */
function obterFiltrosAtivos() {
  const filtros = {};
  
  const nomeEmpresa = document.getElementById('filterNome')?.value.trim();
  const cnpj = document.getElementById('filterCnpj')?.value.trim();
  
  if (nomeEmpresa) filtros.nomeEmpresa = nomeEmpresa;
  if (cnpj) filtros.cnpj = cnpj;
  
  return filtros;
}
