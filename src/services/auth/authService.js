/**
 * Autenticação Service com Axios
 * 
 * Serviço para gerenciar autenticação e autorização
 */

import { apiClient } from '../api.js';

class AuthService {
  
  /**
   * Realiza login
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário e token
   */
  async login(email, senha) {
    try {
      const response = await apiClient.post('/auth/login', { email, senha });
      
      // Salva o token
      if (response.token) {
        apiClient.setAuthToken(response.token);
        
        // Salva dados do usuário
        if (response.usuario) {
          localStorage.setItem('user_data', JSON.stringify(response.usuario));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      throw error;
    }
  }

  /**
   * Realiza logout
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    } finally {
      // Limpa dados locais independente do resultado
      apiClient.clearAuthToken();
      window.location.href = '/login';
    }
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!apiClient.getAuthToken();
  }

  /**
   * Obtém dados do usuário atual
   * @returns {Object|null} Dados do usuário
   */
  getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Registra novo usuário
   * @param {Object} dados - Dados do usuário
   * @returns {Promise<Object>} Usuário criado
   */
  async registrar(dados) {
    try {
      return await apiClient.post('/auth/register', dados);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error.message);
      throw error;
    }
  }

  /**
   * Solicita recuperação de senha
   * @param {string} email - Email do usuário
   * @returns {Promise<Object>} Confirmação
   */
  async recuperarSenha(email) {
    try {
      return await apiClient.post('/auth/recuperar-senha', { email });
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error.message);
      throw error;
    }
  }

  /**
   * Redefine senha com token
   * @param {string} token - Token de recuperação
   * @param {string} novaSenha - Nova senha
   * @returns {Promise<Object>} Confirmação
   */
  async redefinirSenha(token, novaSenha) {
    try {
      return await apiClient.post('/auth/redefinir-senha', { token, novaSenha });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error.message);
      throw error;
    }
  }

  /**
   * Valida token JWT
   * @returns {Promise<boolean>} Token válido
   */
  async validarToken() {
    try {
      await apiClient.get('/auth/validar');
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();
export default AuthService;
