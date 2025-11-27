/**
 * Endereço Service com Axios
 *
 * Serviço para gerenciar endereços
 */

import { apiClient } from '../api.js';
import { EnderecoRequest, EnderecoResponse } from './enderecoTypes.js';

class EnderecoService {

    /**
     * Helper para processar resposta da API
     * Nota: O interceptor do axios já retorna response.data diretamente,
     * então aqui 'response' já são os dados da API
     * @param {any} response - Resposta do apiClient
     * @returns {Object} Dados processados
     */
    _processarResposta(response) {
        return response;
    }

    /**
     * Busca um endereço por ID
     * @param {number} id - ID do endereço
     * @returns {Promise<EnderecoResponse>} Dados do endereço
     */
    async buscarPorId(id) {
        try {
            const response = await apiClient.get(`/enderecos/${id}`);
            const dadosResposta = this._processarResposta(response);
            return EnderecoResponse.fromAPI(dadosResposta);
        } catch (error) {
            console.error('Erro ao buscar endereço:', error.message);
            throw error;
        }
    }

    /**
     * Cria um novo endereço
     * @param {EnderecoRequest|Object} dados - Dados do endereço
     * @returns {Promise<EnderecoResponse>} Endereço criado
     */
    async criar(dados) {
        try {
            // Converte para EnderecoRequest se necessário
            const request = dados instanceof EnderecoRequest ? dados : new EnderecoRequest(dados);

            // Valida os dados
            const validacao = request.validar();
            if (!validacao.isValid) {
                throw new Error(`Dados inválidos: ${validacao.errors.join(', ')}`);
            }

            console.log('📤 Enviando dados para API:', request.toJSON());

            const response = await apiClient.post('/endereco/criar', request.toJSON());
            const dadosResposta = this._processarResposta(response);

            if (!dadosResposta) {
                throw new Error('Resposta da API está vazia');
            }

            return EnderecoResponse.fromAPI(dadosResposta);
        } catch (error) {
            console.error('❌ Erro ao criar endereço:', error.message);
            throw error;
        }
    }

    /**
     * Atualiza um endereço
     * @param {number} id - ID do endereço
     * @param {EnderecoRequest|Object} dados - Dados atualizados
     * @returns {Promise<EnderecoResponse>} Endereço atualizado
     */
    async atualizar(id, dados) {
        try {
            // Converte para EnderecoRequest se necessário
            const request = dados instanceof EnderecoRequest ? dados : new EnderecoRequest(dados);

            // Valida os dados
            const validacao = request.validar();
            if (!validacao.isValid) {
                throw new Error(`Dados inválidos: ${validacao.errors.join(', ')}`);
            }

            const response = await apiClient.put(`/endereco/editar/${id}`, request.toJSON());
            const dadosResposta = this._processarResposta(response);
            return EnderecoResponse.fromAPI(dadosResposta);
        } catch (error) {
            console.error('Erro ao atualizar endereço:', error.message);
            throw error;
        }
    }
}

export const enderecoService = new EnderecoService();
export default EnderecoService;
