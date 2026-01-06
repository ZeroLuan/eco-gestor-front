// ===========================
// INTERFACES DE REQUEST/RESPONSE PARA PONTO DE COLETA
// ===========================

/**
 * Interface para criação de ponto de coleta
 */
export class PontoColetaRequest {
    constructor(data = {}) {
        this.nomePonto = data.nomePonto || '';
        this.tipoResiduo = data.tipoResiduo || '';
        this.enderecoId = data.enderecoId || null;
        this.cooperativaId = data.cooperativaId || null;
        this.ativo = data.ativo !== undefined ? data.ativo : true;
        this.materiaisAceitos = data.materiaisAceitos || [];
    }

    /**
     * Valida os dados obrigatórios
     * @returns {Object} {isValid: boolean, errors: string[]}
     */
    validar() {
        const errors = [];

        if (!this.nomePonto?.trim()) {
            errors.push('Nome é obrigatório');
        }

        if (!this.tipoResiduo?.trim()) {
            errors.push('Tipo de resíduo é obrigatório');
        }

        if (!this.enderecoId) {
            errors.push('Endereço é obrigatório');
        }

        if (!this.cooperativaId) {
            errors.push('Cooperativa é obrigatória');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Converte para JSON para envio à API
     */
    toJSON() {
        return {
            nomePonto: this.nomePonto,
            tipoResiduo: this.tipoResiduo,
            enderecoId: this.enderecoId,
            cooperativaId: this.cooperativaId,
            ativo: this.ativo,
            materiaisAceitos: this.materiaisAceitos
        };
    }
}

/**
 * Interface para resposta da API de ponto de coleta
 */
export class PontoColetaResponse {
    constructor(data = {}) {
        this.id = data.id || null;
        this.nomePonto = data.nomePonto || '';
        this.endereco = data.endereco || null; // Objeto EnderecoResponse
        this.cooperativa = data.cooperativa || null; // Objeto CooperativaResponse
        this.tipoResiduo = data.tipoResiduo || '';
        this.materiaisAceitos = data.materiaisAceitos || [];
        this.ativo = data.ativo !== undefined ? data.ativo : true;
        this.dataInicio = data.dataInicio || null;
        this.dataFim = data.dataFim || null;
    }

    /**
     * Converte dados da API para o formato usado no frontend
     * @param {Object} apiData - Dados vindos da API
     * @returns {PontoColetaResponse}
     */
    static fromAPI(apiData) {
        if (!apiData) {
            throw new Error('Resposta da API está vazia ou inválida');
        }
        
        return new PontoColetaResponse({
            ...apiData
        });
    }

    /**
     * Converte para formato usado na tabela
     */
    toTableRow() {
        return {
            id: this.id,
            nomePonto: this.nomePonto,
            tipoResiduo: this.tipoResiduo,
            endereco: this.endereco ? this.endereco.toString() : '',
            ativo: this.ativo,
            materiaisAceitos: this.materiaisAceitos
        };
    }
}

/**
 * Interface para filtros de busca
 */
export class PontoColetaFiltro {
    constructor(data = {}) {
        this.nomePonto = data.nomePonto || '';
        this.tipoResiduo = data.tipoResiduo || '';
        this.enderecoNome = data.enderecoNome || '';
        this.ativo = data.ativo;
        this.pagina = data.pagina || 0;
        this.tamanho = data.tamanho || 10;
        this.ordenacao = data.ordenacao || 'nomePonto';
        this.direcao = data.direcao || 'ASC';
    }

    /**
     * Converte para parâmetros de query string
     */
    toQueryString() {
        const params = new URLSearchParams();

        if (this.nomePonto) params.append('nomePonto', this.nomePonto);
        if (this.tipoResiduo) params.append('tipoResiduo', this.tipoResiduo);
        if (this.enderecoNome) params.append('enderecoNome', this.enderecoNome);
        if (this.ativo !== undefined) params.append('ativo', this.ativo);
        if (this.pagina !== undefined) params.append('pagina', this.pagina);
        if (this.tamanho !== undefined) params.append('tamanho', this.tamanho);
        if (this.ordenacao) params.append('ordenacao', this.ordenacao);
        if (this.direcao) params.append('direcao', this.direcao);

        return params.toString();
    }
}

/**
 * Interface para resposta paginada da API
 */
export class PaginacaoResponse {
    constructor(data = {}) {
        this.content = data.content || [];
        this.totalElements = data.totalElements || 0;
        this.totalPages = data.totalPages || 0;
        this.size = data.size || 10;
        this.number = data.number || 0;
        this.first = data.first || false;
        this.last = data.last || false;
        this.empty = data.empty || true;
    }

    /**
     * Converte dados da API para lista de PontoColetaResponse
     */
    getItems() {
        return this.content.map(item => PontoColetaResponse.fromAPI(item));
    }
}