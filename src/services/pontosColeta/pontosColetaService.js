/**
 * Pontos de Coleta Service com Axios
 * 
 * Serviço para gerenciar pontos de coleta
 */

import { apiClient } from '../api.js';

class PontosColetaService {
  
    /**
     * Lista todos os pontos de coleta
     * @param {Object} params - Parâmetros de paginação e filtros
     * @returns {Promise<Object>} Lista de pontos de coleta
     */
    async listarTodos(params = {}) {
      try {
        return await apiClient.get('/pontos-coleta', params);
      } catch (error) {
        console.error('Erro ao listar pontos de coleta:', error.message);
        throw error;
      }
    }

    /**
     * Busca um ponto de coleta por ID
     * @param {number} id - ID do ponto de coleta
     * @returns {Promise<Object>} Dados do ponto de coleta
     */
    async buscarPorId(id) {
      try {
        return await apiClient.get(`/pontos-coleta/${id}`);
      } catch (error) {
        console.error('Erro ao buscar ponto de coleta:', error.message);
        throw error;
      }
    }

  /**
   * Cria um novo ponto de coleta
   * @param {Object} dados - Dados do ponto de coleta
   * @returns {Promise<Object>} Ponto de coleta criado
   */
  async criar(dados) {
    try {
      return await apiClient.post('/pontos-coleta', dados);
    } catch (error) {
      console.error('Erro ao criar ponto de coleta:', error.message);
      throw error;
    }
  }

  /**
   * Atualiza um ponto de coleta
   * @param {number} id - ID do ponto de coleta
   * @param {Object} dados - Dados atualizados
   * @returns {Promise<Object>} Ponto de coleta atualizado
   */
  async atualizar(id, dados) {
    try {
      return await apiClient.put(`/pontos-coleta/${id}`, dados);
    } catch (error) {
      console.error('Erro ao atualizar ponto de coleta:', error.message);
      throw error;
    }
  }

  /**
   * Remove um ponto de coleta
   * @param {number} id - ID do ponto de coleta
   * @returns {Promise<void>}
   */
  async remover(id) {
    try {
      return await apiClient.delete(`/pontos-coleta/${id}`);
    } catch (error) {
      console.error('Erro ao remover ponto de coleta:', error.message);
      throw error;
    }
  }

  /**
   * Busca pontos de coleta ativos
   * @returns {Promise<Array>} Lista de pontos ativos
   */
  async buscarAtivos() {
    try {
      return await apiClient.get('/pontos-coleta/ativos');
    } catch (error) {
      console.error('Erro ao buscar pontos ativos:', error.message);
      throw error;
    }
  }
}

export const pontosColetaService = new PontosColetaService();
export default PontosColetaService;
