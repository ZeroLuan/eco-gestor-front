/*
 * Gerenciar Licenças Ambientais
 */

import { apiClient } from "../api.js";
import {
  LicencaAmbientalRequest,
  LicencaAmbientalResponse,
  LicencaAmbientalFiltro,
  PaginacaoResponse,
} from "./licencaAmbientalTypes.js";

class LicencaAmbientalService {
  /**
   * Lista todas as licenças ambientais com paginação e filtros
   * @param {LicencaAmbientalFiltro} filtro - Filtros e paginação
   * @returns {Promise<PaginacaoResponse>} Lista paginada de licenças ambientais
   */
  async listarTodos(filtro = new LicencaAmbientalFiltro()) {
    try {
      const queryString = filtro.toQueryString();
      const url = `/licencas-ambientais${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get(url);
      return new PaginacaoResponse(response.data);
    } catch (error) {
      console.error("❌ Erro ao listar licenças ambientais:", error.message);
      throw error;
    }
  }

  /**
   * Busca uma licença ambiental por ID
   * @param {number} id - ID da licença
   * @returns {Promise<LicencaAmbientalResponse>} Dados da licença
   */
  async buscarPorId(id) {
    try {
      const response = await apiClient.get(`/licencas-ambientais/${id}`);
      return LicencaAmbientalResponse.fromAPI(response.data);
    } catch (error) {
      console.error("❌ Erro ao buscar licença ambiental:", error.message);
      throw error;
    }
  }

  /**
   * Cria uma nova licença ambiental
   * @param {LicencaAmbientalRequest|Object} dados - Dados da licença
   * @returns {Promise<LicencaAmbientalResponse>} Licença criada
   */
  async criar(dados) {
    try {
      const request =
        dados instanceof LicencaAmbientalRequest
          ? dados
          : new LicencaAmbientalRequest(dados);

      const validacao = request.validar();
      if (!validacao.isValid) {
        throw new Error(`Dados inválidos: ${validacao.errors.join(", ")}`);
      }

      const response = await apiClient.post(
        "/licencas-ambientais",
        request.toJSON()
      );

      if (!response) {
        throw new Error("Resposta da API inválida ou vazia");
      }

      return LicencaAmbientalResponse.fromAPI(response.data);
    } catch (error) {
      console.error("❌ Erro ao criar licença ambiental:", error.message);
      throw error;
    }
  }

  /**
   * Atualiza uma licença ambiental existente
   * @param {number} id - ID da licença
   * @param {LicencaAmbientalRequest|Object} dados - Dados atualizados
   * @returns {Promise<LicencaAmbientalResponse>} Licença atualizada
   */
  async atualizar(id, dados) {
    try {
      const request =
        dados instanceof LicencaAmbientalRequest
          ? dados
          : new LicencaAmbientalRequest(dados);

      const validacao = request.validar();
      if (!validacao.isValid) {
        throw new Error(`Dados inválidos: ${validacao.errors.join(", ")}`);
      }

      const response = await apiClient.put(
        `/licencas-ambientais/${id}`,
        request.toJSON()
      );

      return LicencaAmbientalResponse.fromAPI(response.data);
    } catch (error) {
      console.error("❌ Erro ao atualizar licença ambiental:", error.message);
      throw error;
    }
  }

  /**
   * Remove uma licença ambiental
   * @param {number} id - ID da licença
   * @returns {Promise<void>}
   */
  async remover(id) {
    try {
      await apiClient.delete(`/licencas-ambientais/${id}`);
    } catch (error) {
      console.error("❌ Erro ao remover licença ambiental:", error.message);
      throw error;
    }
  }

  /**
   * Lista licenças ambientais filtradas por status
   * @param {string} status - Status da licença (ATIVA, VENCIDA, PENDENTE, INATIVA)
   * @returns {Promise<Array<LicencaAmbientalResponse>>}
   */
  async buscarPorStatus(status) {
    try {
      const response = await apiClient.get(
        `/licencas-ambientais/status/${status}`
      );
      return response.data.map((item) =>
        LicencaAmbientalResponse.fromAPI(item)
      );
    } catch (error) {
      console.error(
        "❌ Erro ao buscar licenças ambientais por status:",
        error.message
      );
      throw error;
    }
  }
}

export const licencaAmbientalService = new LicencaAmbientalService();
export default LicencaAmbientalService;
