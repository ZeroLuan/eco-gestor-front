// ===========================
// INTERFACES DE REQUEST/RESPONSE PARA REGISTRO DE RESÍDUOS
// ===========================

/**
 * Interface para criação de coleta de resíduos
 */
export class ResiduosRequest {
  constructor(data = {}) {
    this.tipoResiduo = data.tipoResiduo || "";
    this.peso = data.peso || 0;
    this.pontoColetaId = data.pontoColetaId || "";
    this.nomeResponsavel = data.nomeResponsavel || "";
    this.dataColeta = data.dataColeta || null;
  }

  /**
   * Valida os dados obrigatórios
   * @returns {Object} {isValid: boolean, errors: string[]}
   */
  validar() {
    const errors = [];

    if (!this.tipoResiduo?.trim()) {
      errors.push("Tipo de resíduo é obrigatório");
    }

    if (!this.peso || this.peso <= 0) {
      errors.push("Quantidade deve ser maior que zero");
    }

    if (!this.pontoColetaId) {
      errors.push("Local é obrigatório");
    }

    if (!this.nomeResponsavel?.trim()) {
      errors.push("Responsável é obrigatório");
    }

    if (!this.dataColeta) {
      errors.push("Data da coleta é obrigatória");
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
      tipoResiduo: this.tipoResiduo,
      peso: this.peso,
      pontoColetaId: this.pontoColetaId,
      nomeResponsavel: this.nomeResponsavel,
      dataColeta: this.dataColeta,
    };
  }
}

/**
 * Interface para resposta da API de coleta de resíduos
 */
export class ResiduosResponse {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tipoResiduo = data.tipoResiduo || "";
    this.peso = data.peso || 0;
    this.pontoColetaId = data.pontoColetaId || "";
    this.nomeResponsavel = data.nomeResponsavel || "";
    this.dataColeta = data.dataColeta || null;
  }

  /**
   * Converte dados da API para o formato usado no frontend
   * @param {Object} apiData - Dados vindos da API
   * @returns {ResiduosResponse}
   */
  static fromAPI(apiData) {
    if (!apiData) {
      throw new Error("Resposta da API está vazia ou inválida");
    }

    return new ResiduosResponse({
      ...apiData,
      tipoResiduo: apiData.tipoResiduo || "",
      peso: apiData.peso || 0,
      pontoColetaId: apiData.pontoColetaId || "",
      nomeResponsavel: apiData.nomeResponsavel || "",
      dataColeta: apiData.dataColeta || null,
    });
  }

  /**
   * Converte para formato usado na tabela
   */
  toTableRow() {
    return {
      id: this.id,
      tipoResiduo: this.tipoResiduo,
      peso: this.peso,
      pontoColetaId: this.pontoColetaId,
      nomeResponsavel: this.nomeResponsavel,
      dataColeta: this.dataColeta,
    };
  }
}

/**
 * Interface para filtros de busca de coletas
 */
export class ResiduosFiltro {
  constructor(data = {}) {
    this.tipoResiduo = data.tipoResiduo || "";
    this.pontoColetaId = data.pontoColetaId || "";
    this.nomeResponsavel = data.nomeResponsavel || "";
    this.dataInicio = data.dataInicio || null;
    this.dataFim = data.dataFim || null;
    this.pagina = data.pagina || 0;
    this.tamanho = data.tamanho || 10;
    this.ordenacao = data.ordenacao || "data";
    this.direcao = data.direcao || "DESC";
  }

  /**
   * Converte para parâmetros de query string
   */
  toQueryString() {
    const params = new URLSearchParams();

    if (this.tipoResiduo) params.append("tipoResiduo", this.tipoResiduo);
    if (this.pontoColetaId) params.append("local", this.pontoColetaId);
    if (this.nomeResponsavel)
      params.append("responsavel", this.nomeResponsavel);
    if (this.dataInicio) params.append("dataInicio", this.dataInicio);
    if (this.dataFim) params.append("dataFim", this.dataFim);
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
   * Converte dados da API para lista de ColetaResponse
   */
  getItems() {
    return this.content.map((item) => ResiduosResponse.fromAPI(item));
  }
}
