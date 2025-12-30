import { apiClient } from "../api.js";
import {
  ResiduosRequest,
  ResiduosResponse,
  ResiduosFiltro,
  PaginacaoResponse,
} from "./residuosTypes.js";

class ResiduosService {
  /**
   * Lista todas as coletas de resíduos com paginação
   * @param {Object} params - Parâmetros de paginação (page, size, sort)
   * @returns {Promise<Object>} Lista paginada de coletas
   */
  async listarTodos(params = {}) {
    try {
      // Define valores padrão para paginação
      const page = params.page || 0;
      const size = params.size || 10;
      const sort = params.sort || 'id,asc';

      // Monta query string no formato Spring Boot
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: sort
      });

      const url = `/residuos/busca/paginada?${queryParams.toString()}`;
      console.log('🔍 Buscando resíduos:', url);

      const response = await apiClient.get(url);

      // O Spring Boot retorna um objeto Page com esta estrutura:
      // { content: [], totalElements, totalPages, number, size, etc }
      return response;
    } catch (error) {
      console.error('Erro ao listar resíduos:', error.message);
      throw error;
    }
  }

  /**
   * Busca resíduos com filtros
   * @param {Object} filtros - Objeto com filtros
   * @param {Object} params - Parâmetros de paginação (page, size, sort)
   * @returns {Promise<Object>} Lista paginada de resíduos filtrados
   */
  async buscarComFiltros(filtros = {}, params = {}) {
    try {
      // Define valores padrão para paginação
      const page = params.page || 0;
      const size = params.size || 10;
      const sort = params.sort || 'id,desc';

      // Monta query string no formato Spring Boot
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: sort
      });

      // Monta o body da requisição
      const requestBody = {
        tipoResiduo: filtros.tipoResiduo || null,
        nomeResponsavel: filtros.nomeResponsavel || null,
        dataColeta: filtros.dataColeta || null,
        // Adicione outros filtros conforme necessário
      };

      const url = `/residuos/busca/filtro?${queryParams.toString()}`;
      console.log('🔍 Buscando resíduos com filtros:', url, requestBody);

      const response = await apiClient.post(url, requestBody);

      return response;
    } catch (error) {
      console.error('Erro ao buscar resíduos com filtros:', error.message);
      throw error;
    }
  }

  /**
   * Busca uma coleta por ID
   * @param {number} id - ID da coleta
   * @returns {Promise<ResiduosResponse>} Dados da coleta
   */
  async buscarPorId(id) {
    try {
      const response = await apiClient.get(`/residuos/${id}`);
      return ResiduosResponse.fromAPI(response);
    } catch (error) {
      console.error('Erro ao buscar resíduo:', error.message);
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
        `/residuos/editar/${id}`,
        request.toJSON()
      );
      return ResiduosResponse.fromAPI(response);
    } catch (error) {
      console.error("Erro ao atualizar resíduo:", error.message);
      throw error;
    }
  }

  /**
   * Remove uma coleta
   * @param {number} id - ID da coleta
   * @returns {Promise<ResiduosResponse>}
   */
  async remover(id) {
    try {
      const response = await apiClient.delete(`/residuos/remove/${id}`);
      return response; // Pode retornar o response ou apenas confirmar
    } catch (error) {
      console.error("Erro ao remover resíduo:", error.message);
      throw error;
    }
  }
}

export const residuosService = new ResiduosService();
export default ResiduosService;
