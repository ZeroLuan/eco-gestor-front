/**
 * Componente de Paginação Reutilizável
 * 
 * Gerencia a paginação de dados e renderiza os controles de navegação
 */

export class PaginacaoComponent {
    /**
     * @param {Object} config - Configurações do componente
     * @param {string} config.containerId - ID do elemento onde a paginação será renderizada
     * @param {string} config.totalRegistrosId - ID do elemento para exibir total de registros (opcional)
     * @param {number} config.tamanhoPagina - Número de itens por página (padrão: 10)
     * @param {Function} config.onPageChange - Callback quando a página mudar
     */
    constructor(config) {
        this.containerId = config.containerId || 'paginacao';
        this.totalRegistrosId = config.totalRegistrosId || null;
        this.tamanhoPagina = config.tamanhoPagina || 10;
        this.onPageChangeCallback = config.onPageChange || null;
        
        // Estado da paginação
        this.paginaAtual = 0;
        this.totalPaginas = 0;
        this.totalElementos = 0;
        this.maxBotoes = 5; // Máximo de botões de página visíveis
    }

    /**
     * Atualiza o estado da paginação com dados do backend
     * @param {Object} responseData - Resposta do backend (formato Spring Boot Page)
     */
    atualizar(responseData) {
        if (!responseData) {
            this.limpar();
            return;
        }

        this.paginaAtual = responseData.number || 0;
        this.totalPaginas = responseData.totalPages || 0;
        this.totalElementos = responseData.totalElements || 0;
        
        this.renderizar();
        this.atualizarTotalRegistros();
    }

    /**
     * Renderiza os controles de paginação
     */
    renderizar() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`❌ Container de paginação não encontrado: ${this.containerId}`);
            return;
        }

        container.innerHTML = '';

        // Não mostra paginação se houver apenas 1 página ou nenhuma
        if (this.totalPaginas <= 1) {
            return;
        }

        // Botão Anterior
        this.criarBotaoAnterior(container);

        // Botões de páginas numerados
        this.criarBotoesPaginas(container);

        // Botão Próxima
        this.criarBotaoProxima(container);
    }

    /**
     * Cria o botão "Anterior"
     */
    criarBotaoAnterior(container) {
        const li = document.createElement('li');
        li.className = `page-item ${this.paginaAtual === 0 ? 'disabled' : ''}`;
        
        const link = document.createElement('a');
        link.className = 'page-link';
        link.href = '#';
        link.textContent = 'Anterior';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.paginaAtual > 0) {
                this.irParaPagina(this.paginaAtual - 1);
            }
        });
        
        li.appendChild(link);
        container.appendChild(li);
    }

    /**
     * Cria os botões de páginas numerados
     */
    criarBotoesPaginas(container) {
        // Calcula quais páginas mostrar
        let inicio = Math.max(0, this.paginaAtual - Math.floor(this.maxBotoes / 2));
        let fim = Math.min(this.totalPaginas, inicio + this.maxBotoes);

        // Ajusta o início se estiver no final
        if (fim - inicio < this.maxBotoes) {
            inicio = Math.max(0, fim - this.maxBotoes);
        }

        // Cria os botões
        for (let i = inicio; i < fim; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === this.paginaAtual ? 'active' : ''}`;
            
            const link = document.createElement('a');
            link.className = 'page-link';
            link.href = '#';
            link.textContent = i + 1;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.irParaPagina(i);
            });
            
            li.appendChild(link);
            container.appendChild(li);
        }
    }

    /**
     * Cria o botão "Próxima"
     */
    criarBotaoProxima(container) {
        const li = document.createElement('li');
        li.className = `page-item ${this.paginaAtual >= this.totalPaginas - 1 ? 'disabled' : ''}`;
        
        const link = document.createElement('a');
        link.className = 'page-link';
        link.href = '#';
        link.textContent = 'Próxima';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.paginaAtual < this.totalPaginas - 1) {
                this.irParaPagina(this.paginaAtual + 1);
            }
        });
        
        li.appendChild(link);
        container.appendChild(li);
    }

    /**
     * Navega para uma página específica
     */
    irParaPagina(numeroPagina) {
        if (numeroPagina < 0 || numeroPagina >= this.totalPaginas) {
            return;
        }

        this.paginaAtual = numeroPagina;

        // Chama o callback se fornecido
        if (this.onPageChangeCallback && typeof this.onPageChangeCallback === 'function') {
            this.onPageChangeCallback(numeroPagina);
        }
    }

    /**
     * Atualiza o texto com total de registros
     */
    atualizarTotalRegistros() {
        if (!this.totalRegistrosId) return;

        const elemento = document.getElementById(this.totalRegistrosId);
        if (elemento) {
            elemento.textContent = `Total de registros: ${this.totalElementos}`;
        }
    }

    /**
     * Limpa a paginação
     */
    limpar() {
        this.paginaAtual = 0;
        this.totalPaginas = 0;
        this.totalElementos = 0;
        
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
        
        this.atualizarTotalRegistros();
    }

    /**
     * Retorna o número da página atual
     */
    getPaginaAtual() {
        return this.paginaAtual;
    }

    /**
     * Retorna o tamanho da página
     */
    getTamanhoPagina() {
        return this.tamanhoPagina;
    }

    /**
     * Retorna os parâmetros de paginação para enviar ao backend
     */
    getParams(sort = 'id,asc') {
        return {
            page: this.paginaAtual,
            size: this.tamanhoPagina,
            sort: sort
        };
    }

    /**
     * Define o callback para mudança de página
     */
    onPageChange(callback) {
        this.onPageChangeCallback = callback;
    }

    /**
     * Volta para a primeira página
     */
    voltarParaPrimeiraPagina() {
        this.irParaPagina(0);
    }

    /**
     * Define um novo tamanho de página
     */
    setTamanhoPagina(tamanho) {
        this.tamanhoPagina = tamanho;
        this.voltarParaPrimeiraPagina();
    }
}
