import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import authService from "../services/auth/authService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Checkbox } from "../components/ui/Checkbox";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email.trim()) {
      toast.error('Por favor, informe seu e-mail');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Por favor, informe sua senha');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fazer login com a API
      await authService.login({ email, password });
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }
      
      toast.success('Login realizado com sucesso!');
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Mensagens de erro específicas
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || 'Erro ao fazer login. Verifique suas credenciais.';
      
      if (errorMessage.includes('Usuário ou Senha Inválidos')) {
        toast.error('E-mail ou senha incorretos');
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('E-mail ou senha incorretos');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Lado esquerdo - Branding */}
      <div className="login-branding">
        {/* Padrão de fundo decorativo */}
        <div className="login-pattern">
          <svg className="w-100 h-100" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="leaf-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="8" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill="url(#leaf-pattern)" />
          </svg>
        </div>
        
        {/* Conteúdo do branding */}
        <div className="login-branding-content">
          <div>
            <div className="login-logo-container">
              <div className="login-logo-box">
                <i className="bi bi-recycle" style={{ fontSize: '1.75rem' }}></i>
              </div>
              <span className="login-logo-text">EcoGestor</span>
            </div>
            <p className="login-subtitle">
              Sistema Integrado de Gestão Ambiental
            </p>
          </div>
          
          <div className="login-stats-section">
            <div>
              <h1 className="login-hero-title">
                Gestão ambiental inteligente para um futuro sustentável
              </h1>
              <p className="login-hero-description">
                Monitore resíduos, gerencie licenças, acompanhe denúncias e fortaleça cooperativas em uma única plataforma.
              </p>
            </div>
            
            <div className="login-stats-grid">
              <div className="login-stat-card">
                <p className="login-stat-number">847</p>
                <p className="login-stat-label">Toneladas coletadas</p>
              </div>
              <div className="login-stat-card">
                <p className="login-stat-number">156</p>
                <p className="login-stat-label">Licenças ativas</p>
              </div>
              <div className="login-stat-card">
                <p className="login-stat-number">42</p>
                <p className="login-stat-label">Pontos de coleta</p>
              </div>
              <div className="login-stat-card">
                <p className="login-stat-number">12</p>
                <p className="login-stat-label">Cooperativas</p>
              </div>
            </div>
          </div>
          
          <div className="login-footer-text">
            <p>Secretaria de Meio Ambiente</p>
            <p>Prefeitura Municipal de Irecê - BA</p>
          </div>
        </div>
      </div>
      
      {/* Lado direito - Formulário de login */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          {/* Logo mobile */}
          <div className="login-mobile-logo">
            <div className="login-logo-box-mobile">
              <i className="bi bi-recycle" style={{ fontSize: '1.75rem' }}></i>
            </div>
            <span className="login-logo-text-mobile">EcoGestor</span>
          </div>
          
          <Card className="login-card">
            <CardHeader className="login-card-header">
              <CardTitle className="login-card-title">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="login-card-description">
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="mb-3">
                  <Label htmlFor="email" className="fw-medium">
                    E-mail
                  </Label>
                  <div className="position-relative">
                    <i className="bi bi-envelope position-absolute login-input-icon"></i>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@irece.ba.gov.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-input ps-5"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Label htmlFor="password" className="fw-medium mb-0">
                      Senha
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="btn btn-link btn-sm text-primary p-0"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="position-relative">
                    <i className="bi bi-lock position-absolute login-input-icon"></i>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input ps-5 pe-5"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn btn-link position-absolute login-password-toggle"
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="form-check mb-4">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="form-check-label text-muted fw-normal"
                    style={{ cursor: 'pointer' }}
                  >
                    Manter-me conectado
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-100 login-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      Entrando...
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      Entrar no sistema
                      <i className="bi bi-arrow-right"></i>
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-4 pt-4 border-top">
                <p className="text-center text-muted small mb-0">
                  Não tem uma conta?{" "}
                  <Link to="/register" className="text-primary text-decoration-none fw-medium">
                    Criar conta
                  </Link>
                </p>
                <p className="text-center text-muted small mt-2 mb-0">
                  Precisa de ajuda?{" "}
                  <a href="#" className="text-primary text-decoration-none fw-medium">
                    Entre em contato com o suporte
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-muted login-terms" style={{ fontSize: '0.75rem' }}>
            Ao acessar, você concorda com os{" "}
            <a href="#" className="text-decoration-underline">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-decoration-underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
