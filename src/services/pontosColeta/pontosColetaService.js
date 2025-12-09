/**
 * Pontos de Coleta Service com Axios
 *
 * Serviço para gerenciar pontos de coleta
 */

import { apiClient } from '../api.js';
import {
    PontoColetaRequest,
    PontoColetaResponse
} from './pontoColetaTypes.js';

class PontosColetaService {

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

    /**
     * Busca pontos de coleta com filtros
     * @param {Object} filtros - Objeto com filtros (nomePonto, tipoResiduo, endereco)
     * @param {Object} params - Parâmetros de paginação (page, size, sort)
     * @returns {Promise<Object>} Lista paginada de pontos de coleta filtrados
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

            // Monta o body da requisição no formato esperado pelo backend
            const requestBody = {
                nomePonto: filtros.nomePonto || null,
                tipoResiduo: filtros.tipoResiduo || null,
                ativo: filtros.ativo !== undefined ? filtros.ativo : null,
                endereco: filtros.endereco ? {
                    logradouro: filtros.endereco.logradouro || null,
                    bairro: filtros.endereco.bairro || null,
                    cidade: filtros.endereco.cidade || null,
                    estado: filtros.endereco.estado || null,
                    cep: filtros.endereco.cep || null
                } : null
            };

            const url = `/ponto-coleta/busca/filtro?${queryParams.toString()}`;
            console.log('🔍 Buscando pontos de coleta com filtros:', url, requestBody);

            const response = await apiClient.post(url, requestBody);
            
            return response;
        } catch (error) {
            console.error('Erro ao buscar pontos de coleta com filtros:', error.message);
            throw error;
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
            console.error('Erro ao buscar ponto de coleta:', error.message);
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
            const request = dados instanceof PontoColetaRequest ? dados : new PontoColetaRequest(dados);

            // Valida os dados
            const validacao = request.validar();
            if (!validacao.isValid) {
                throw new Error(`Dados inválidos: ${validacao.errors.join(', ')}`);
            }

            const response = await apiClient.post('/ponto-coleta/criar', request.toJSON());
            
            if (!response) {
                throw new Error('Resposta da API inválida ou vazia');
            }
            
            return PontoColetaResponse.fromAPI(response);
        } catch (error) {
            console.error('Erro ao criar ponto de coleta:', error.message);
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

    /**
     * Remove um ponto de coleta
     * @param {number} id - ID do ponto de coleta
     * @returns {Promise<void>}
     */
    async remover(id) {
        try {
            console.log('🗑️ Excluindo ponto de coleta ID:', id);
            await apiClient.delete(`/ponto-coleta/remove/${id}`);
            console.log('✅ Ponto de coleta excluído com sucesso no backend');
        } catch (error) {
            console.error('❌ Erro ao remover ponto de coleta:', error.message);
            throw error;
        }
    }

    /**
     * Busca pontos de coleta ativos
     * @returns {Promise<Array<PontoColetaResponse>>} Lista de pontos ativos
     */
    async buscarAtivos() {
        try {
            const response = await apiClient.get('/ponto-coleta/ativos');
            return response.map(item => PontoColetaResponse.fromAPI(item));
        } catch (error) {
            console.error('Erro ao buscar pontos ativos:', error.message);
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
            const response = await apiClient.patch(`/ponto-coleta/${id}/status`, { ativo });
            return PontoColetaResponse.fromAPI(response);
        } catch (error) {
            console.error('Erro ao alterar status do ponto de coleta:', error.message);
            throw error;
        }
    }
}

export const pontosColetaService = new PontosColetaService();
export default PontosColetaService;
