// ===========================
// INTERFACES DE REQUEST/RESPONSE PARA COOPERATIVA
// ===========================

/**
 * Interface para criação de cooperativa
 */
export class CooperativaRequest {
  constructor(data = {}) {
    this.nome = data.nome || "";
    this.responsavel = data.responsavel || "";
    this.cnpj = data.cnpj || "";
    //  this.pontoColetas = data.pontoColetas || []; // Lista de PontoColetaRequest
    this.statusCooperativa = data.statusCooperativa || "";
  }

  /**
   * Valida os dados obrigatórios
   * @returns {Object} {isValid: boolean, errors: string[]}
   */
  validar() {
    const errors = [];

    if (!this.nome?.trim()) {
      errors.push("Nome é obrigatório");
    }

    if (!this.responsavel?.trim()) {
      errors.push("Responsável é obrigatório");
    }

    if (!this.cnpj?.trim()) {
      errors.push("CNPJ é obrigatório");
    }

    if (!this.statusCooperativa?.trim()) {
      errors.push("Status da cooperativa é obrigatório");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Converte para JSON para envio à API
   */
  toJSON() {
    return {
      nome: this.nome,
      responsavel: this.responsavel,
      cnpj: this.cnpj,
      // pontoColetas: this.pontoColetas,
      statusCooperativa: this.statusCooperativa,
    };
  }
}

/**
 * Interface para resposta da API de cooperativa
 */
export class CooperativaResponse {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || "";
    this.responsavel = data.responsavel || "";
    this.cnpj = data.cnpj || "";
    //  this.pontoColetas = data.pontoColetas || []; // Lista de PontoColetaResponse
    this.statusCooperativa = data.statusCooperativa || "";
    this.dataInicio = data.dataInicio || null;
    this.dataFim = data.dataFim || null;
  }

  /**
   * Converte dados da API para o formato usado no frontend
   * @param {Object} apiData - Dados vindos da API
   * @returns {CooperativaResponse}
   */
  static fromAPI(apiData) {
    if (!apiData) {
      throw new Error("Resposta da API está vazia ou inválida");
    }

    return new CooperativaResponse({
      ...apiData,
      nome: apiData.nome || "",
      responsavel: apiData.responsavel || "",
      cnpj: apiData.cnpj || "",
      //  pontoColetas: apiData.pontoColetas || [],
      statusCooperativa: apiData.statusCooperativa || "",
      dataInicio: apiData.dataInicio || null,
      dataFim: apiData.dataFim || null,
    });
  }

  /**
   * Converte para formato usado na tabela
   */
  toTableRow() {
    return {
      id: this.id,
      nome: this.nome,
      responsavel: this.responsavel,
      cnpj: this.cnpj,
      status: this.statusCooperativa,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
    };
  }
}

/**
 * Interface para filtros de busca de cooperativas
 */
export class CooperativaFiltro {
  constructor(data = {}) {
    this.nome = data.nome || "";
    this.responsavel = data.responsavel || "";
    this.statusCooperativa = data.statusCooperativa || "";
    this.cnpj = data.cnpj || "";
    this.pagina = data.pagina || 0;
    this.tamanho = data.tamanho || 10;
    this.ordenacao = data.ordenacao || "responsavel";
    this.direcao = data.direcao || "ASC";
  }

  /**
   * Converte para parâmetros de query string
   */
  toQueryString() {
    const params = new URLSearchParams();

    if (this.nome) params.append("nome", this.nome);
    if (this.responsavel) params.append("responsavel", this.responsavel);
    if (this.statusCooperativa)
      params.append("statusCooperativa", this.statusCooperativa);
    if (this.cnpj) params.append("cnpj", this.cnpj);
    if (this.pagina !== undefined) params.append("pagina", this.pagina);
    if (this.tamanho !== undefined) params.append("tamanho", this.tamanho);
    if (this.ordenacao) params.append("ordenacao", this.ordenacao);
    if (this.direcao) params.append("direcao", this.direcao);

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
   * Converte dados da API para lista de CooperativaResponse
   */
  getItems() {
    return this.content.map((item) => CooperativaResponse.fromAPI(item));
  }
}
