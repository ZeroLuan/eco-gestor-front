/**
 * Pontos de Coleta Service com Axios
 *
 * Serviço para gerenciar pontos de coleta
 */

import { apiClient } from "../api.js";
import {
  PontoColetaRequest,
  PontoColetaResponse,
  PontoColetaFiltro,
  PaginacaoResponse,
} from "./pontoColetaTypes.js";

class PontosColetaService {
  /**
   * Lista todos os pontos de coleta com paginação e filtros
   * @param {PontoColetaFiltro} filtro - Filtros e paginação
   * @returns {Promise<PaginacaoResponse>} Lista paginada de pontos de coleta
   */
  async listarTodos(filtro = new PontoColetaFiltro()) {
    try {
      const queryString = filtro.toQueryString();
      const url = `/ponto-coleta${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get(url);
      return new PaginacaoResponse(response.data);
    } catch (error) {
      console.error("Erro ao listar pontos de coleta:", error.message);
      throw error;
    /**
     * Lista todos os pontos de coleta com paginação e filtros
     * @param {Object} params - Parâmetros de paginação (page, size, sort)
     * @returns {Promise<Object>} Lista paginada de pontos de coleta
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

            const url = `/ponto-coleta/busca/paginada?${queryParams.toString()}`;
            console.log('🔍 Buscando pontos de coleta:', url);

            const response = await apiClient.get(url);
            
            // O Spring Boot retorna um objeto Page com esta estrutura:
            // { content: [], totalElements, totalPages, number, size, etc }
            return response;
        } catch (error) {
            console.error('Erro ao listar pontos de coleta:', error.message);
            throw error;
        }
    }
  }

  /**
   * Busca um ponto de coleta por ID
   * @param {number} id - ID do ponto de coleta
   * @returns {Promise<PontoColetaResponse>} Dados do ponto de coleta
   */
  async buscarPorId(id) {
    try {
      const response = await apiClient.get(`/ponto-coleta/${id}`);
      return PontoColetaResponse.fromAPI(response);
    } catch (error) {
      console.error("Erro ao buscar ponto de coleta:", error.message);
      throw error;
    }
  }

  /**
   * Cria um novo ponto de coleta
   * @param {PontoColetaRequest|Object} dados - Dados do ponto de coleta
   * @returns {Promise<PontoColetaResponse>} Ponto de coleta criado
   */
  async criar(dados) {
    try {
      // Converte para PontoColetaRequest se necessário
      const request =
        dados instanceof PontoColetaRequest
          ? dados
          : new PontoColetaRequest(dados);

      // Valida os dados
      const validacao = request.validar();
      if (!validacao.isValid) {
        throw new Error(`Dados inválidos: ${validacao.errors.join(", ")}`);
      }

      const response = await apiClient.post(
        "/ponto-coleta/criar",
        request.toJSON()
      );

      if (!response) {
        throw new Error("Resposta da API inválida ou vazia");
      }

      return PontoColetaResponse.fromAPI(response);
    } catch (error) {
      console.error("Erro ao criar ponto de coleta:", error.message);
      throw error;
    }
  }

  /**
   * Atualiza um ponto de coleta
   * @param {number} id - ID do ponto de coleta
   * @param {PontoColetaRequest|Object} dados - Dados atualizados
   * @returns {Promise<PontoColetaResponse>} Ponto de coleta atualizado
   */
  async atualizar(id, dados) {
    try {
      // Converte para PontoColetaRequest se necessário
      const request =
        dados instanceof PontoColetaRequest
          ? dados
          : new PontoColetaRequest(dados);

      // Valida os dados
      const validacao = request.validar();
      if (!validacao.isValid) {
        throw new Error(`Dados inválidos: ${validacao.errors.join(", ")}`);
      }

      const response = await apiClient.put(
        `/ponto-coleta/${id}`,
        request.toJSON()
      );
      return PontoColetaResponse.fromAPI(response);
    } catch (error) {
      console.error("Erro ao atualizar ponto de coleta:", error.message);
      throw error;
    /**
     * Atualiza um ponto de coleta
     * @param {number} id - ID do ponto de coleta
     * @param {PontoColetaRequest|Object} dados - Dados atualizados
     * @returns {Promise<PontoColetaResponse>} Ponto de coleta atualizado
     */
    async atualizar(id, dados) {
        try {
            // Converte para PontoColetaRequest se necessário
            const request = dados instanceof PontoColetaRequest ? dados : new PontoColetaRequest(dados);

            // Valida os dados
            const validacao = request.validar();
            if (!validacao.isValid) {
                throw new Error(`Dados inválidos: ${validacao.errors.join(', ')}`);
            }

            console.log('📤 Editando ponto de coleta ID:', id, 'Dados:', request.toJSON());

            const response = await apiClient.put(`/ponto-coleta/editar/${id}`, request.toJSON());
            
            if (!response) {
                console.warn('⚠️ Backend retornou resposta vazia, assumindo sucesso');
                return { id, ...request.toJSON() };
            }
            
            return PontoColetaResponse.fromAPI(response);
        } catch (error) {
            console.error('❌ Erro ao atualizar ponto de coleta:', error.message);
            throw error;
        }
    }
  }

  /**
   * Remove um ponto de coleta
   * @param {number} id - ID do ponto de coleta
   * @returns {Promise<void>}
   */
  async remover(id) {
    try {
      await apiClient.delete(`/ponto-coleta/${id}`);
    } catch (error) {
      console.error("Erro ao remover ponto de coleta:", error.message);
      throw error;
    /**
     * Remove um ponto de coleta
     * @param {number} id - ID do ponto de coleta
     * @returns {Promise<void>}
     */
    async remover(id) {
        try {
            console.log('🗑️ Excluindo ponto de coleta ID:', id);
            await apiClient.delete(`/ponto-coleta/${id}`);
            console.log('✅ Ponto de coleta excluído com sucesso no backend');
        } catch (error) {
            console.error('❌ Erro ao remover ponto de coleta:', error.message);
            throw error;
        }
    }
  }

  /**
   * Busca pontos de coleta ativos
   * @returns {Promise<Array<PontoColetaResponse>>} Lista de pontos ativos
   */
  async buscarAtivos() {
    try {
      const response = await apiClient.get("/ponto-coleta/ativos");
      return response.map((item) => PontoColetaResponse.fromAPI(item));
    } catch (error) {
      console.error("Erro ao buscar pontos ativos:", error.message);
      throw error;
    }
  }

  /**
   * Ativa/desativa um ponto de coleta
   * @param {number} id - ID do ponto de coleta
   * @param {boolean} ativo - Status ativo/inativo
   * @returns {Promise<PontoColetaResponse>} Ponto de coleta atualizado
   */
  async alterarStatus(id, ativo) {
    try {
      const response = await apiClient.patch(`/ponto-coleta/${id}/status`, {
        ativo,
      });
      return PontoColetaResponse.fromAPI(response);
    } catch (error) {
      console.error(
        "Erro ao alterar status do ponto de coleta:",
        error.message
      );
      throw error;
    }
  }
}

export const pontosColetaService = new PontosColetaService();
export default PontosColetaService;
