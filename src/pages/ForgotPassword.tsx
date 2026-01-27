import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import "./Login.css";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error('Digite seu e-mail');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implementar chamada à API para recuperação de senha
      // await authService.forgotPassword(email);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Erro ao recuperar senha:', error);
      toast.error(error.response?.data?.message || 'Erro ao enviar e-mail. Tente novamente.');
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
                Recupere o acesso à sua conta
              </h1>
              <p className="login-hero-description">
                Não se preocupe! Digite seu e-mail e enviaremos instruções para redefinir sua senha.
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
      
      {/* Lado direito - Formulário de recuperação */}
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
                {emailSent ? 'E-mail enviado!' : 'Esqueceu sua senha?'}
              </CardTitle>
              <CardDescription className="login-card-description">
                {emailSent 
                  ? 'Verifique sua caixa de entrada e siga as instruções'
                  : 'Digite seu e-mail para receber o link de recuperação'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!emailSent ? (
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="mb-4">
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
                  
                  <Button
                    type="submit"
                    className="w-100 login-submit-btn mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                        Enviando...
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        Enviar link de recuperação
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    )}
                  </Button>

                  <Link to="/login" className="btn btn-outline-primary w-100">
                    <i className="bi bi-arrow-left me-2"></i>
                    Voltar ao login
                  </Link>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <p className="text-muted mb-4">
                    Enviamos um e-mail para <strong>{email}</strong> com instruções para redefinir sua senha.
                  </p>
                  <p className="text-muted small mb-4">
                    Não recebeu o e-mail? Verifique sua caixa de spam ou{" "}
                    <button 
                      type="button"
                      onClick={() => setEmailSent(false)}
                      className="btn btn-link p-0 text-primary"
                    >
                      tente novamente
                    </button>
                  </p>
                  <Link to="/login" className="btn btn-primary w-100">
                    <i className="bi bi-arrow-left me-2"></i>
                    Voltar ao login
                  </Link>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-top">
                <p className="text-center text-muted small mb-0">
                  Precisa de ajuda?{" "}
                  <a href="#" className="text-primary text-decoration-none fw-medium">
                    Entre em contato com o suporte
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
