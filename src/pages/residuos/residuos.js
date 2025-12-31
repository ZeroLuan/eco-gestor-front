/**
 * Resíduos - JavaScript
 * Gerenciamento de coleta de resíduos
 */

import { abrirModalColeta } from "./registra-coleta-residuos/registra-coleta-residuos.js";
import { apiClient } from "../../services/api.js";
import { ResiduosResponse } from "../../services/residuos/residuosTypes.js";
import { residuosService } from "../../services/residuos/residuosService.js";
import { PaginacaoComponent } from '../../components/paginacao/paginacao.js';

let dados = [];
import { criarBotaoAcoesPadrao, adicionarEventListeners } from '../../components/common/botao-acoes/botao-acoes.js';

// Componente de paginação reutilizável
let paginacao = null;

// Inicializa elementos e eventos imediatamente (SPA já carregou o HTML)
function inicializarResiduos() {
  const btnPesquisar = document.getElementById("btnPesquisar");
  const btnLimpar = document.getElementById("btnLimpar");
  const btnNovo = document.getElementById("btnNovo");

  if (!btnPesquisar || !btnLimpar || !btnNovo) {
    console.error("❌ Elementos não encontrados na página de resíduos");
    return;
  }

  // Inicializa o componente de paginação reutilizável
  paginacao = new PaginacaoComponent({
    containerId: 'paginacao',
    totalRegistrosId: 'totalRegistros',
    tamanhoPagina: 10,
    onPageChange: (numeroPagina) => {
      carregarResiduos(numeroPagina);
    }
  });

  if (btnPesquisar) {
    btnPesquisar.addEventListener("click", function () {
      aplicarFiltros();
    });
  }
  if (btnLimpar) {
    btnLimpar.addEventListener("click", async function () {
      await limparFiltros();
    });
  }

  btnNovo.addEventListener("click", function () {
    abrirModalColeta(null, (novaColeta) => {
      // Callback após salvar - recarrega os dados do backend
      carregarResiduos(paginacao.getPaginaAtual());
    });
  });

  // Carrega dados iniciais do backend
  carregarResiduos(0);
  console.log("✅ Resíduos inicializados");
}

// Executa após um pequeno delay para garantir que o HTML foi injetado
setTimeout(inicializarResiduos, 100);

async function carregarResiduos(pagina = 0) {
  try {
    console.log(`🔄 Carregando resíduos - Página ${pagina + 1}...`);
    
    // Captura os filtros ativos
    const filtros = obterFiltrosAtivos();
    const temFiltros = Object.keys(filtros).length > 0;
    
    // Se houver filtros, usa buscarComFiltros, senão usa listarTodos
    let response = temFiltros
      ? await residuosService.buscarComFiltros(filtros, {
        page: pagina,
        size: paginacao.getTamanhoPagina(),
        sort: 'id,desc'
      })
      : await residuosService.listarTodos({
        page: pagina,
        size: paginacao.getTamanhoPagina(),
        sort: 'id,desc'
      });
    
    // Se filtrou mas não encontrou nada, busca todos
    if (temFiltros && (!response || !response.content || response.content.length === 0)) {
      console.log('⚠️ Filtro não retornou resultados. Buscando todos...');
      response = await residuosService.listarTodos({
        page: 0,
        size: paginacao.getTamanhoPagina(),
        sort: 'id,desc'
      });
    }
    
    if (response && response.content) {
      dados = response.content;
      
      // Adapta a estrutura VIA_DTO do Spring para o formato esperado
      const paginaInfo = {
        content: response.content,
        number: response.page?.number || 0,
        totalPages: response.page?.totalPages || 0,
        totalElements: response.page?.totalElements || 0,
        size: response.page?.size || 10
      };
      
      // Atualiza o componente de paginação com os dados adaptados
      paginacao.atualizar(paginaInfo);
      
      // Renderiza a tabela
      renderizarTabela(dados);
      
      console.log(`✅ ${dados.length} resíduos carregados - Página ${paginaInfo.number + 1}/${paginaInfo.totalPages}`);
    } else {
      dados = [];
      paginacao.limpar();
      renderizarTabela(dados);
      console.log('⚠️ Nenhum resíduo encontrado');
    }
  } catch (error) {
    console.error('❌ Erro ao carregar resíduos:', error);
    dados = [];
    paginacao.limpar();
    renderizarTabela(dados);
    alert('Erro ao carregar resíduos. Por favor, tente novamente.');
  }
}
/**
 * Renderiza a tabela com os dados fornecidos
 */
function renderizarTabela(dados) {
  const tbody = document.querySelector("#tabelaResiduos tbody");
  const totalEl = document.getElementById("totalRegistros");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!dados || dados.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center text-muted">Nenhum registro encontrado</td></tr>';
    if (totalEl) totalEl.textContent = "Total de registros: 0";
    return;
  }

  // Cores por tipo de resíduo (ajustado para maiúsculo do back-end)
  const coresTipo = {
    PLASTICO: "danger",
    PAPEL: "primary",
    METAL: "secondary",
    VIDRO: "info",
    ORGANICO: "success",
    ELETRONICO: "warning",
  };

  dados.forEach((item) => {
    const corTipo = coresTipo[item.tipoResiduo] || "secondary";
    const tr = document.createElement("tr");
    tr.innerHTML = `
			<td>${formatarDataBR(item.dataColeta || item.dataInicio)}</td>
			<td><span class="badge bg-${corTipo}">${item.tipoResiduo}</span></td>
			<td>${item.peso} kg</td>
			<td>${item.local}</td>
			<td>${item.nomeResponsavel}</td>
			<td>
				${criarBotaoAcoesPadrao(item.id)}
			</td>
		`;
    tbody.appendChild(tr);
  });

  if (totalEl) totalEl.textContent = `Total de registros: ${dados.length}`;
	// Adiciona event listeners aos botões de ação
	adicionarEventListeners(tbody, async (action, id) => {
		if (action === 'editar') {
			// Busca os dados do resíduo para edição
			try {
				const residuoData = await residuosService.buscarPorId(id);
				abrirModalColeta(residuoData, () => {
					// Callback após salvar - recarrega os dados do backend
					carregarResiduos(paginacao.getPaginaAtual());
				});
			} catch (error) {
				console.error('Erro ao buscar dados para edição:', error);
				alert('Erro ao carregar dados para edição. Tente novamente.');
			}
		} else if (action === 'excluir') {
			if (confirm('Tem certeza que deseja excluir este registro?')) {
				try {
					await residuosService.remover(id);
					alert('Resíduo excluído com sucesso!');
					carregarResiduos(paginacao.getPaginaAtual());
				} catch (error) {
					console.error('Erro ao excluir resíduo:', error);
					alert('Erro ao excluir resíduo. Tente novamente.');
				}
			}
		}
	});

	if (totalEl) totalEl.textContent = `Total de registros: ${dados.length}`;
}

/**
 * Aplicar filtro
 */
function aplicarFiltros() {
  // Apenas recarrega com filtros ativos
  carregarResiduos(0);
}

/**
 * Limpa filtros
 */
async function limparFiltros() {
  const filterTipo = document.getElementById("filterTipo");
  const filterNomeResponsavel = document.getElementById("filterNomeResponsavel");
  const filterDataInicio = document.getElementById("filterDataInicio");
  const filterDataFim = document.getElementById("filterDataFim");
  const filterLocal = document.getElementById("filterLocal");

  if (filterTipo) filterTipo.value = "";
  if (filterNomeResponsavel) filterNomeResponsavel.value = "";
  if (filterDataInicio) filterDataInicio.value = "";
  if (filterDataFim) filterDataFim.value = "";
  if (filterLocal) filterLocal.value = "";
  
  // Recarrega todos os registros
  carregarResiduos(0);
}

/**
 * Obtém os filtros ativos dos campos de entrada
 */
function obterFiltrosAtivos() {
  const filtros = {};

  const tipo = document.getElementById("filterTipo")?.value;
  if (tipo) filtros.tipoResiduo = tipo;

  const nomeResponsavel = document.getElementById("filterNomeResponsavel")?.value.trim();
  if (nomeResponsavel) filtros.nomeResponsavel = nomeResponsavel;

  const dataInicio = document.getElementById("filterDataInicio")?.value;
  if (dataInicio) filtros.dataInicio = dataInicio;

  const dataFim = document.getElementById("filterDataFim")?.value;
  if (dataFim) filtros.dataFim = dataFim;

  const local = document.getElementById("filterLocal")?.value.trim();
  if (local) filtros.local = local;

  return filtros;
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
