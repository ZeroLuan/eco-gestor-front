/**
 * Dashboard Service com Axios
 * 
 * Serviço para buscar dados do dashboard
 */

import { apiClient } from '../api.js';

class DashboardService {
  
  /**
   * Busca estatísticas gerais do dashboard
   * @returns {Promise<Object>} Dados estatísticos
   */
  async getStatistics() {
    try {
      return await apiClient.get('/dashboard/statistics');
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error.message);
      throw error;
    }
  }

  /**
   * Busca dados de resíduos coletados
   * @param {Object} filters - Filtros (período, tipo, etc)
   * @returns {Promise<Object>} Dados de resíduos
   */
  async getResiduosColetados(filters = {}) {
    try {
      return await apiClient.get('/dashboard/residuos', filters);
    } catch (error) {
      console.error('Erro ao buscar resíduos coletados:', error.message);
      throw error;
    }
  }

  /**
   * Busca atividades recentes
   * @param {number} limit - Quantidade de atividades
   * @returns {Promise<Array>} Lista de atividades
   */
  async getAtividadesRecentes(limit = 10) {
    try {
      return await apiClient.get('/dashboard/atividades', { limit });
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error.message);
      throw error;
    }
  }

  /**
   * Busca alertas do sistema
   * @returns {Promise<Array>} Lista de alertas
   */
  async getAlertas() {
    try {
      return await apiClient.get('/dashboard/alertas');
    } catch (error) {
      console.error('Erro ao buscar alertas:', error.message);
      throw error;
    }
  }

  /**
   * Busca dados para gráficos
   * @param {string} tipo - Tipo do gráfico (barras, pizza, etc)
   * @param {Object} params - Parâmetros adicionais
   * @returns {Promise<Object>} Dados do gráfico
   */
  async getGraficoData(tipo, params = {}) {
    try {
      return await apiClient.get(`/dashboard/graficos/${tipo}`, params);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error.message);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
export default DashboardService;
