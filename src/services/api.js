/**
 * API Client com Axios - Configuração base para comunicação com o backend Java
 *
 * Este arquivo contém a configuração central para todas as requisições HTTP
 * ao backend Spring Boot usando Axios
 */

import axios from "axios";

// ===========================
// CONFIGURAÇÃO DA API
// ===========================

// URL base do seu backend Java (ajuste conforme necessário)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Timeout padrão para requisições (em milissegundos)
const DEFAULT_TIMEOUT = 30000;

/**
 * Cria instância do Axios com configurações padrão
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ===========================
// INTERCEPTORS - REQUEST
// ===========================

/**
 * Interceptor para adicionar token JWT em todas as requisições
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtém o token do localStorage
    const token = localStorage.getItem("auth_token");

    // Adiciona o token no header se existir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// ===========================
// INTERCEPTORS - RESPONSE
// ===========================

/**
 * Interceptor para tratar respostas e erros globalmente
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Sucesso - retorna apenas os dados
    console.log(
      `✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${
        response.status
      }`
    );
    return response.data;
  },
  (error) => {
    // Tratamento de erros
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Erro na requisição";

      console.error(`❌ Erro ${status}:`, message);

      // Erro 401 - Não autorizado (token inválido/expirado)
      if (status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        window.location.href = "/login";
        return Promise.reject(
          new Error("Sessão expirada. Faça login novamente.")
        );
      }

      // Erro 403 - Sem permissão
      if (status === 403) {
        return Promise.reject(
          new Error("Você não tem permissão para acessar este recurso.")
        );
      }

      // Erro 404 - Não encontrado
      if (status === 404) {
        return Promise.reject(new Error("Recurso não encontrado."));
      }

      // Erro 500+ - Erro no servidor
      if (status >= 500) {
        return Promise.reject(
          new Error("Erro no servidor. Tente novamente mais tarde.")
        );
      }

      return Promise.reject(new Error(message));
    }

    // Erro de rede ou timeout
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Requisição expirou. Tente novamente."));
    }

    if (error.message === "Network Error") {
      return Promise.reject(
        new Error(
          "Erro de conexão. Verifique sua internet ou se o backend está rodando."
        )
      );
    }

    return Promise.reject(error);
  }
);

// ===========================
// CLASSE API CLIENT
// ===========================

/**
 * Classe principal para gerenciar requisições HTTP
 */
class ApiClient {
  /**
   * Obtém o token de autenticação do localStorage
   * @returns {string|null} Token JWT
   */
  getAuthToken() {
    return localStorage.getItem("auth_token");
  }

  /**
   * Salva o token de autenticação no localStorage
   * @param {string} token - Token JWT
   */
  setAuthToken(token) {
    localStorage.setItem("auth_token", token);
  }

  /**
   * Remove o token de autenticação
   */
  clearAuthToken() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }

  /**
   * Requisição GET
   * @param {string} endpoint - Endpoint da API
   * @param {Object} params - Parâmetros de query string
   * @returns {Promise} Resposta da API
   */
  async get(endpoint, params = {}) {
    return axiosInstance.get(endpoint, { params });
  }

  /**
   * Requisição POST
   * @param {string} endpoint - Endpoint da API
   * @param {Object} data - Dados a serem enviados
   * @returns {Promise} Resposta da API
   */
  async post(endpoint, data = {}) {
    return axiosInstance.post(endpoint, data);
  }

  /**
   * Requisição PUT
   * @param {string} endpoint - Endpoint da API
   * @param {Object} data - Dados a serem enviados
   * @returns {Promise} Resposta da API
   */
  async put(endpoint, data = {}) {
    return axiosInstance.put(endpoint, data);
  }

  /**
   * Requisição PATCH
   * @param {string} endpoint - Endpoint da API
   * @param {Object} data - Dados a serem enviados
   * @returns {Promise} Resposta da API
   */
  async patch(endpoint, data = {}) {
    return axiosInstance.patch(endpoint, data);
  }

  /**
   * Requisição DELETE
   * @param {string} endpoint - Endpoint da API
   * @returns {Promise} Resposta da API
   */
  async delete(endpoint) {
    return axiosInstance.delete(endpoint);
  }
}

// Exporta instância única do client
export const apiClient = new ApiClient();

// Exporta instância do axios para casos especiais
export { axiosInstance };

// Exporta classe para casos especiais
export default ApiClient;
