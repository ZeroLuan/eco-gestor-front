/**
 * Interface para criação de Licença Ambiental
 */
export class LicencaAmbientalRequest {
  constructor(data = {}) {
    this.tipoLicenca = data.tipoLicenca || ""; // LP, LI, L0
    this.numeroLicenca = data.numeroLicenca || "";
    this.statusLicenca = data.statusLicenca || ""; // ATIVA, VENCIDA, PENDENTE, INATIVA
    this.validade = data.validade || null;
    this.dataInicio = data.dataInicio || null;
    this.dataFim = data.dataFim || null;
  }

  /**
   * Valida os dados obrigatórios
   * @returns {Object} {isValid: boolean, errors: string[]}
   */
  validar() {
    const errors = [];

    if (!this.tipoLicenca?.trim()) {
      errors.push("Tipo de licença é obrigatório");
    }

    if (!this.numeroLicenca?.trim()) {
      errors.push("Número da licença é obrigatório");
    }

    if (!this.statusLicenca?.trim()) {
      errors.push("Status da licença é obrigatório");
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
      tipoLicenca: this.tipoLicenca,
      numeroLicenca: this.numeroLicenca,
      statusLicenca: this.statusLicenca,
      validade: this.validade,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
    };
  }
}

/**
 * Interface para resposta da API de Licença Ambiental
 */
export class LicencaAmbientalResponse {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tipoLicenca = data.tipoLicenca || "";
    this.numeroLicenca = data.numeroLicenca || "";
    this.statusLicenca = data.statusLicenca || "";
    this.validade = data.validade || null;
    this.dataInicio = data.dataInicio || null;
    this.dataFim = data.dataFim || null;
  }

  /**
   * Converte dados da API para o formato usado no frontend
   * @param {Object} apiData - Dados vindos da API
   * @returns {LicencaAmbientalResponse}
   */
  static fromAPI(apiData) {
    if (!apiData) {
      throw new Error("Resposta da API está vazia ou inválida");
    }

    return new LicencaAmbientalResponse({
      ...apiData,
      tipoLicenca: apiData.tipoLicenca || "",
      numeroLicenca: apiData.numeroLicenca || "",
      statusLicenca: apiData.statusLicenca || "",
      validade: apiData.validade || null,
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
      tipoLicenca: this.tipoLicenca,
      numeroLicenca: this.numeroLicenca,
      status: this.statusLicenca,
      validade: this.validade,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
    };
  }
}

/**
 * Interface para filtros de busca de Licença Ambiental
 */
export class LicencaAmbientalFiltro {
  constructor(data = {}) {
    this.tipoLicenca = data.tipoLicenca || "";
    this.numeroLicenca = data.numeroLicenca || "";
    this.statusLicenca = data.statusLicenca || "";
    this.pagina = data.pagina || 0;
    this.tamanho = data.tamanho || 10;
    this.ordenacao = data.ordenacao || "numeroLicenca";
    this.direcao = data.direcao || "ASC";
  }

  /**
   * Converte para parâmetros de query string
   */
  toQueryString() {
    const params = new URLSearchParams();

    if (this.tipoLicenca) params.append("tipoLicenca", this.tipoLicenca);
    if (this.numeroLicenca) params.append("numeroLicenca", this.numeroLicenca);
    if (this.statusLicenca) params.append("statusLicenca", this.statusLicenca);
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
   * Converte dados da API para lista de LicencaAmbientalResponse
   */
  getItems() {
    return this.content.map((item) => LicencaAmbientalResponse.fromAPI(item));
  }
}
