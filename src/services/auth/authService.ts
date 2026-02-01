import { apiClient } from '../api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
}

export interface RegisterData {
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface ForgotPasswordData {
  email: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly EXPIRES_KEY = 'token_expires';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Endpoint correto conforme o backend: /token/login
      // O backend espera "senha" em vez de "password"
      const payload = {
        email: credentials.email,
        senha: credentials.password
      };
      
      console.log('🔑 Tentando fazer login com:', { email: payload.email });
      
      const response = await apiClient.post<AuthResponse>('/token/login', payload);
      
      console.log('📦 Resposta do servidor:', response);
      
      if (response.accessToken) {
        this.setToken(response.accessToken);
        
        // Calcular e armazenar quando o token expira
        const expiresAt = Date.now() + (response.expiresIn * 1000);
        localStorage.setItem(this.EXPIRES_KEY, expiresAt.toString());
        
        // Decodificar o token para obter informações do usuário
        const userInfo = this.decodeToken(response.accessToken);
        if (userInfo) {
          this.setUser(userInfo);
          console.log('👤 Informações do usuário:', userInfo);
        }
        
        console.log('✅ Login realizado com sucesso!');
      } else {
        console.error('❌ Resposta não contém accessToken:', response);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  /**
   * Decodifica o JWT para extrair informações do usuário
   * (simples decode - não valida assinatura, apenas lê o payload)
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRES_KEY);
    localStorage.removeItem('remember_me');
  }

  /**
   * Verifica se o token está expirado
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(this.EXPIRES_KEY);
    if (!expiresAt) return true;
    
    return Date.now() >= parseInt(expiresAt);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Verifica se o token expirou
    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }
    
    return true;
  }

  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      // Fazer uma requisição para verificar se o token ainda é válido
      await apiClient.get('/auth/verify');
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  async register(data: RegisterData): Promise<void> {
    try {
      await apiClient.post('/usuario/criar', data);
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
