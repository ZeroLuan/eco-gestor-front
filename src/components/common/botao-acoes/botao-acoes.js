/**
 * Componente reutilizável para botão de ações com dropdown
 * 
 * Cria um botão de 3 pontinhos com menu dropdown de ações (Editar, Excluir, etc.)
 */

/**
 * Cria o HTML de um botão de ações com dropdown
 * @param {number|string} id - ID do item
 * @param {Array<Object>} acoes - Array de objetos com as ações disponíveis
 * @param {string} acoes[].tipo - Tipo da ação ('editar', 'excluir', 'visualizar', 'custom')
 * @param {string} acoes[].label - Texto a ser exibido
 * @param {string} acoes[].icone - Classe do ícone Bootstrap Icons
 * @param {string} acoes[].classe - Classes CSS adicionais (opcional)
 * @returns {string} HTML do botão com dropdown
 * 
 * @example
 * const html = BotaoAcoesComponent.criar(123, [
 *   { tipo: 'editar', label: 'Editar', icone: 'bi-pencil-square' },
 *   { tipo: 'excluir', label: 'Excluir', icone: 'bi-trash', classe: 'text-danger' }
 * ]);
 */
export function criarBotaoAcoes(id, acoes) {
    if (!acoes || acoes.length === 0) {
        return '';
    }

    const itensDropdown = acoes.map((acao, index) => {
        const { tipo, label, icone, classe = '' } = acao;
        
        // Adiciona divisor antes da última ação se for excluir
        const divisor = (index === acoes.length - 1 && tipo === 'excluir') 
            ? '<li><hr class="dropdown-divider"></li>' 
            : '';
        
        return `
            ${divisor}
            <li>
                <a class="dropdown-item ${classe}" href="#" data-action="${tipo}" data-id="${id}">
                    <i class="${icone} me-2"></i>${label}
                </a>
            </li>
        `;
    }).join('');

    return `
        <div class="dropdown">
            <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Ações">
                <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                ${itensDropdown}
            </ul>
        </div>
    `;
}

/**
 * Adiciona event listeners aos botões de ação dentro de um elemento
 * @param {HTMLElement} container - Elemento container que contém os botões
 * @param {Function} callback - Função callback que recebe (action, id, event)
 * 
 * @example
 * adicionarEventListeners(tbody, (action, id, event) => {
 *   if (action === 'editar') {
 *     editarItem(id);
 *   } else if (action === 'excluir') {
 *     excluirItem(id);
 *   }
 * });
 */
export function adicionarEventListeners(container, callback) {
    if (!container || typeof callback !== 'function') {
        console.error('❌ Container e callback são obrigatórios');
        return;
    }

    const botoesAcao = container.querySelectorAll('[data-action]');
    
    botoesAcao.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');
            const id = this.getAttribute('data-id');
            callback(action, id, e);
        });
    });
}

/**
 * Ações padrão pré-configuradas
 */
export const AcoesPadrao = {
    EDITAR: {
        tipo: 'editar',
        label: 'Editar',
        icone: 'bi-pencil-square',
        classe: ''
    },
    EXCLUIR: {
        tipo: 'excluir',
        label: 'Excluir',
        icone: 'bi-trash',
        classe: 'text-danger'
    },
    VISUALIZAR: {
        tipo: 'visualizar',
        label: 'Visualizar',
        icone: 'bi-eye',
        classe: ''
    },
    ATIVAR: {
        tipo: 'ativar',
        label: 'Ativar',
        icone: 'bi-check-circle',
        classe: 'text-success'
    },
    DESATIVAR: {
        tipo: 'desativar',
        label: 'Desativar',
        icone: 'bi-x-circle',
        classe: 'text-warning'
    }
};

/**
 * Cria botão com ações padrão (Editar + Excluir)
 * @param {number|string} id - ID do item
 * @returns {string} HTML do botão
 */
export function criarBotaoAcoesPadrao(id) {
    return criarBotaoAcoes(id, [
        AcoesPadrao.EDITAR,
        AcoesPadrao.EXCLUIR
    ]);
}
