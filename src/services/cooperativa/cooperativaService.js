
 /*
 * Gerenciar cooperativas
 */

import { apiClient } from "../api.js";
import {
  CooperativaRequest,
  CooperativaResponse,
  CooperativaFiltro,
  PaginacaoResponse,
} from "./cooperativaTypes.js";

class CooperativaService {
  /**
   * Lista todas as cooperativas com paginação e filtros
   * @param {CooperativaFiltro} filtro - Filtros e paginação
   * @returns {Promise<PaginacaoResponse>} Lista paginada de cooperativas
   */
  async listarTodos(filtro = new CooperativaFiltro()) {
    try {
      const queryString = filtro.toQueryString();
      const url = `/cooperativas${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get(url);
      return new PaginacaoResponse(response.data);
    } catch (error) {
      console.error("❌ Erro ao listar cooperativas:", error.message);
      throw error;
    }
  }

  /**
   * Busca cooperativas paginadas
   * @param {Object} params - Parâmetros de paginação {page, size, sort}
   * @returns {Promise<Object>} Dados paginados
   */
  async buscarPaginado(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sort) queryParams.append('sort', params.sort);

      const url = `/cooperativas/busca/paginada${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      
      return response;
    } catch (error) {
      console.error("❌ Erro ao buscar cooperativas paginadas:", error.message);
      throw error;
    }
  }

  /**
   * Busca uma cooperativa por ID
   * @param {number} id - ID da cooperativa
   * @returns {Promise<CooperativaResponse>} Dados da cooperativa
   */
  async buscarPorId(id) {
    try {
      const response = await apiClient.get(`/cooperativas/${id}`);
      return CooperativaResponse.fromAPI(response);
    } catch (error) {
      console.error("❌ Erro ao buscar cooperativa:", error.message);
      throw error;
    }
  }

  /**
   * Cria uma nova cooperativa
   * @param {CooperativaRequest|Object} dados - Dados da cooperativa
   * @returns {Promise<CooperativaResponse>} Cooperativa criada
   */
  async criar(dados) {
    try {
      const request =
        dados instanceof CooperativaRequest
          ? dados
          : new CooperativaRequest(dados);

      const validacao = request.validar();
      if (!validacao.isValid) {
        throw new Error(`Dados inválidos: ${validacao.errors.join(", ")}`);
      }

      const response = await apiClient.post("/cooperativas/criar", request.toJSON());

      if (!response) {
        throw new Error("Resposta da API inválida ou vazia");
      }

      return CooperativaResponse.fromAPI(response);
    } catch (error) {
      console.error("❌ Erro ao criar cooperativa:", error.message);
      throw error;
    }
  }

  /**
   * Atualiza uma cooperativa existente
   * @param {number} id - ID da cooperativa
   * @param {CooperativaRequest|Object} dados - Dados atualizados
   * @returns {Promise<CooperativaResponse>} Cooperativa atualizada
   */
  async atualizar(id, dados) {
    try {
      const request =
        dados instanceof CooperativaRequest
          ? dados
          : new CooperativaRequest(dados);

      const validacao = request.validar();
      if (!validacao.isValid) {
        throw new Error(`Dados inválidos: ${validacao.errors.join(", ")}`);
      }

      const response = await apiClient.put(
        `/cooperativas/editar/${id}`,
        request.toJSON()
      );
      return CooperativaResponse.fromAPI(response);
    } catch (error) {
      console.error("❌ Erro ao atualizar cooperativa:", error.message);
      throw error;
    }
  }

  /**
   * Remove uma cooperativa
   * @param {number} id - ID da cooperativa
   * @returns {Promise<void>}
   */
  async remover(id) {
    try {
      await apiClient.delete(`/cooperativas/remove/${id}`);
    } catch (error) {
      console.error("❌ Erro ao remover cooperativa:", error.message);
      throw error;
    }
  }

  /**
   * Busca cooperativas com filtros
   * @param {CooperativaRequest|Object} filtro - Filtros a aplicar
   * @param {Object} params - Parâmetros de paginação {page, size, sort}
   * @returns {Promise<Object>} Dados paginados filtrados
   */
  async buscarComFiltros(filtro = {}, params = {}) {
    try {
      const request =
        filtro instanceof CooperativaRequest
          ? filtro
          : new CooperativaRequest(filtro);

      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sort) queryParams.append('sort', params.sort);

      const url = `/cooperativas/busca/filtro${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.post(url, request.toJSON());
      
      return response;
    } catch (error) {
      console.error("❌ Erro ao buscar cooperativas com filtros:", error.message);
      throw error;
    }
  }
}

export const cooperativaService = new CooperativaService();
export default CooperativaService;
