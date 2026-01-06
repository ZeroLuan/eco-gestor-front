// ===========================
// INTERFACES DE REQUEST/RESPONSE PARA COOPERATIVA
// ===========================

/**
 * Interface para criação de cooperativa
 */
export class CooperativaRequest {
  constructor(data = {}) {
    this.nomeEmpresa = data.nomeEmpresa || "";
    this.nomeFantasia = data.nomeFantasia || "";
    this.cnpj = data.cnpj || "";
    this.telefone = data.telefone || "";
    this.email = data.email || "";
    this.naturezaJuridica = data.naturezaJuridica || "";
    this.cnae = data.cnae || "";
    this.nomeResponsavel = data.nomeResponsavel || "";
    this.enderecoId = data.enderecoId || null;
  }

  /**
   * Valida os dados obrigatórios
   * @returns {Object} {isValid: boolean, errors: string[]}
   */
  validar() {
    const errors = [];

    if (!this.nomeEmpresa?.trim()) {
      errors.push("Nome da empresa é obrigatório");
    }

    if (!this.nomeResponsavel?.trim()) {
      errors.push("Responsável é obrigatório");
    }

    if (!this.cnpj?.trim()) {
      errors.push("CNPJ é obrigatório");
    }

    if (!this.enderecoId) {
      errors.push("Endereço é obrigatório");
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
      nomeEmpresa: this.nomeEmpresa,
      nomeFantasia: this.nomeFantasia,
      cnpj: this.cnpj,
      telefone: this.telefone,
      email: this.email,
      naturezaJuridica: this.naturezaJuridica,
      cnae: this.cnae,
      nomeResponsavel: this.nomeResponsavel,
      enderecoId: this.enderecoId,
    };
  }
}

/**
 * Interface para resposta da API de cooperativa
 */
export class CooperativaResponse {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nomeEmpresa = data.nomeEmpresa || data.nome || "";
    this.responsavel = data.responsavel || "";
    this.telefone = data.telefone || "";
    this.cnpj = data.cnpj || "";
    this.endereco = data.endereco || null;
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
      nomeEmpresa: apiData.nomeEmpresa || apiData.nome || "",
      responsavel: apiData.responsavel || "",
      telefone: apiData.telefone || "",
      cnpj: apiData.cnpj || "",
      endereco: apiData.endereco || null,
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
      nomeEmpresa: this.nomeEmpresa,
      responsavel: this.responsavel,
      telefone: this.telefone,
      cnpj: this.cnpj,
      endereco: this.endereco,
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
    this.nomeEmpresa = data.nomeEmpresa || data.nome || "";
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
