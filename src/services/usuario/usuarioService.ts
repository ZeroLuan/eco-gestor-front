import { apiClient } from '../api';

export interface Usuario {
  nomeCompleto: string;
  email: string;
}

class UsuarioService {
  async buscarUsuarioLogado(): Promise<Usuario> {
    try {
      const response = await apiClient.get<Usuario>('/usuario/buscar/usuario/logado');
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuário logado:', error);
      throw error;
    }
  }
}

export default new UsuarioService();
