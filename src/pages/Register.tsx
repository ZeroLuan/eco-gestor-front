import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import authService from "../services/auth/authService";
import "./Login.css";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações
    if (!formData.nome || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Preencha todos os campos obrigatórios');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      await authService.register({
        nomeCompleto: formData.nome,
        email: formData.email,
        senha: formData.password,
        confirmarSenha: formData.confirmPassword
      });
      
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate("/login");
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      // O interceptor já transforma os erros, então usamos error.message
      const errorMessage = error.message || 'Erro ao criar conta. Tente novamente.';
      
      // Verificar mensagens específicas do backend
      if (errorMessage.includes('email') && errorMessage.includes('existe')) {
        toast.error('Este email já está cadastrado. Tente fazer login.');
      } else if (errorMessage.includes('Senhas não conferem')) {
        toast.error('As senhas não conferem.');
      } else if (errorMessage.includes('servidor')) {
        toast.error('Erro interno do servidor. Contate o administrador.');
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
        <div className="login-pattern">
          <svg className="w-100 h-100" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="leaf-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="8" fill="currentColor" />
            </pattern>
            <rect width="100" height="100" fill="url(#leaf-pattern)" />
          </svg>
        </div>
        
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
                Junte-se à transformação ambiental
              </h1>
              <p className="login-hero-description">
                Crie sua conta e comece a contribuir para um futuro mais sustentável em Irecê.
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
      
      {/* Lado direito - Formulário de cadastro */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-mobile-logo">
            <div className="login-logo-box-mobile">
              <i className="bi bi-recycle" style={{ fontSize: '1.75rem' }}></i>
            </div>
            <span className="login-logo-text-mobile">EcoGestor</span>
          </div>
          
          <Card className="login-card">
            <CardHeader className="login-card-header">
              <CardTitle className="login-card-title">
                Criar nova conta
              </CardTitle>
              <CardDescription className="login-card-description">
                Preencha os dados abaixo para se cadastrar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="mb-3">
                  <Label htmlFor="nome" className="fw-medium">
                    Nome completo
                  </Label>
                  <div className="position-relative">
                    <i className="bi bi-person position-absolute login-input-icon"></i>
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={formData.nome}
                      onChange={handleChange}
                      className="login-input ps-5"
                      required
                    />
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={handleChange}
                      className="login-input ps-5"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <Label htmlFor="password" className="fw-medium">
                    Senha
                  </Label>
                  <div className="position-relative">
                    <i className="bi bi-lock position-absolute login-input-icon"></i>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
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

                <div className="mb-4">
                  <Label htmlFor="confirmPassword" className="fw-medium">
                    Confirmar senha
                  </Label>
                  <div className="position-relative">
                    <i className="bi bi-lock-fill position-absolute login-input-icon"></i>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Digite a senha novamente"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="login-input ps-5 pe-5"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="btn btn-link position-absolute login-password-toggle"
                    >
                      <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
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
                      Criando conta...
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      Criar conta
                      <i className="bi bi-arrow-right"></i>
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-4 pt-4 border-top">
                <p className="text-center text-muted small mb-0">
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-primary text-decoration-none fw-medium">
                    Fazer login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-muted login-terms" style={{ fontSize: '0.75rem' }}>
            Ao criar uma conta, você concorda com os{" "}
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
