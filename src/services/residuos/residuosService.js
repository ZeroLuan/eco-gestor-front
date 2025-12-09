import { apiClient } from "../api.js";
import {
  ResiduosRequest,
  ResiduosResponse,
  ResiduosFiltro,
  PaginacaoResponse,
} from "./residuosTypes.js";

class ResiduosService {
  /**
   * Lista todas as coletas de resíduos com paginação e filtros
   * @param {ResiduosFiltro} filtro - Filtros e paginação
   * @returns {Promise<PaginacaoResponse>} Lista paginada de coletas
   */
  async listarTodos(filtro = new ColetaFiltro()) {
    try {
      const queryString = filtro.toQueryString();
      const url = `/coleta-residuos${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get(url);
      return new PaginacaoResponse(response.data);
    } catch (error) {
      console.error("Erro ao listar coletas de resíduos:", error.message);
      throw error;
    }
  }

  /**
   * Busca uma coleta por ID
   * @param {number} id - ID da coleta
   * @returns {Promise<ColetaResponse>} Dados da coleta
   */
  async buscarPorId(id) {
    try {
      const response = await apiClient.get(`/coleta-residuos/${id}`);
      return ResiduosResponse.fromAPI(response);
    } catch (error) {
      console.error("Erro ao buscar coleta:", error.message);
      throw error;
    }
  }

  /**
   * Cria um novo registro de coleta
   * @param { ResiduosRequest|Object} dados - Dados da coleta
   * @returns {Promise< ResiduosResponse>} Coleta criada
   */
  async criar(dados) {
    try {
      const request =
        dados instanceof ResiduosRequest ? dados : new ResiduosRequest(dados);

      const validacao = request.validar();
      if (!validacao.isValid) {
        throw new Error(`Dados inválidos: ${validacao.errors.join(", ")}`);
      }
      const response = await apiClient.post(
        "/residuos/criar",
        request.toJSON()
      );

      if (!response) {
        throw new Error("Resposta da API inválida ou vazia");
      }

      return ResiduosResponse.fromAPI(response);
    } catch (error) {
      console.error("Erro ao criar coleta:", error.message);
      throw error;
    }
  }

  /**
   * Atualiza uma coleta existente
   * @param {number} id - ID da coleta
   * @param { ResiduosRequest|Object} dados - Dados atualizados
   * @returns {Promise< ResiduosResponse>} Coleta atualizada
   */
  async atualizar(id, dados) {
    try {
      const request =
        dados instanceof ResiduosRequest ? dados : new ResiduosRequest(dados);

      const validacao = request.validar();
      if (!validacao.isValid) {
        throw new Error(`Dados inválidos: ${validacao.errors.join(", ")}`);
      }

      const response = await apiClient.put(
        `/coleta-residuos/${id}`,
        request.toJSON()
      );
      return ResiduosResponse.fromAPI(response);
    } catch (error) {
      console.error("Erro ao atualizar coleta:", error.message);
      throw error;
    }
  }

  /**
   * Remove uma coleta
   * @param {number} id - ID da coleta
   * @returns {Promise<void>}
   */
  async remover(id) {
    try {
      await apiClient.delete(`/coleta-residuos/${id}`);
    } catch (error) {
      console.error("Erro ao remover coleta:", error.message);
      throw error;
    }
  }

  /**
   * Lista coletas filtradas por tipo de resíduo
   * @param {string} tipoResiduo - Tipo de resíduo
   * @returns {Promise<Array<ColetaResponse>>}
   */
  async buscarPorTipo(tipoResiduo) {
    try {
      const response = await apiClient.get(
        `/coleta-residuos/tipo/${tipoResiduo}`
      );
      return response.map((item) => ResiduosResponse.fromAPI(item));
    } catch (error) {
      console.error("Erro ao buscar coletas por tipo:", error.message);
      throw error;
    }
  }
}

export const residuosService = new ResiduosService();
export default ResiduosService;
