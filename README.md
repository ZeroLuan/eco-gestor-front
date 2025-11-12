# 🌿 EcoGestor - Frontend

Sistema de Gestão Ambiental Municipal de Irecê, Bahia

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-5.x-646CFF.svg)](https://vitejs.dev/)

## 📋 Sobre o Projeto

O **EcoGestor** é um sistema web moderno para gestão ambiental municipal, desenvolvido para auxiliar na administração de:

- 📊 **Dashboard** - Visão geral com estatísticas em tempo real
- 📍 **Pontos de Coleta** - Gerenciamento de locais de coleta seletiva
- 📄 **Licenças Ambientais** - Controle de licenças e regularizações
- 👥 **Cooperativas** - Cadastro e gestão de cooperativas
- ♻️ **Resíduos** - Monitoramento de coleta e reciclagem
- ⚠️ **Denúncias** - Sistema de registro e acompanhamento

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- ⚡ **[Vite](https://vitejs.dev/)** - Build tool moderna e rápida
- 🎨 **[Bootstrap 5](https://getbootstrap.com/)** - Framework CSS responsivo
- 🎯 **[Bootstrap Icons](https://icons.getbootstrap.com/)** - Biblioteca de ícones
- 🔌 **[Axios](https://axios-http.com/)** - Cliente HTTP para requisições
- 💻 **JavaScript ES6+** - Linguagem de programação moderna
- 🎨 **CSS3** - Estilização customizada

## 📦 Estrutura do Projeto

```
eco-gestor-front/
├── public/              # Arquivos públicos estáticos
├── src/
│   ├── assets/         # Imagens, fontes e recursos
│   │   ├── css/
│   │   ├── fonts/
│   │   └── images/
│   ├── components/     # Componentes reutilizáveis
│   │   ├── common/     # Botões, inputs, etc
│   │   └── js/
│   ├── pages/          # Páginas da aplicação
│   │   ├── dashboard/  # Dashboard principal
│   │   └── autenticacao/
│   ├── services/       # Serviços e integrações API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   └── pontosColetaService.js
│   ├── utils/          # Funções utilitárias
│   ├── main.js         # Arquivo principal
│   └── style.css       # Estilos globais
├── .env                # Variáveis de ambiente
├── index.html          # Página principal
├── package.json        # Dependências do projeto
└── vite.config.js      # Configuração do Vite
```

## 🔧 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🎯 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/ZeroLuan/eco-gestor-front.git
cd eco-gestor-front
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
VITE_APP_ENV=development
```

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Gera build de produção
npm run preview      # Visualiza build de produção

# Linting (se configurado)
npm run lint         # Verifica código
```

## 🔌 Integração com Backend

O projeto está configurado para se comunicar com um backend Java Spring Boot.

### Configuração do Backend

1. Configure a URL do backend no arquivo `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

2. Configure o CORS no seu backend Java:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:5174")
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

### Endpoints Esperados

O frontend consome os seguintes endpoints:

- `GET /api/dashboard/statistics` - Estatísticas gerais
- `GET /api/dashboard/atividades` - Atividades recentes
- `GET /api/dashboard/alertas` - Alertas do sistema
- `POST /api/auth/login` - Autenticação
- `GET /api/pontos-coleta` - Pontos de coleta
- E mais...

## 🎨 Funcionalidades

### Dashboard
- ✅ Cards de estatísticas em tempo real
- ✅ Gráficos de visualização de dados
- ✅ Lista de atividades recentes
- ✅ Alertas do sistema
- ✅ Responsivo para mobile

### Sidebar
- ✅ Menu de navegação lateral
- ✅ Colapsável em dispositivos móveis
- ✅ Indicador de página ativa
- ✅ Informações do usuário

### Autenticação
- ✅ Login com JWT
- ✅ Armazenamento seguro de token
- ✅ Redirecionamento automático em caso de token expirado

## 🌐 Navegadores Suportados

- Chrome (última versão)
- Firefox (última versão)
- Safari (última versão)
- Edge (última versão)

## 📱 Responsividade

O sistema é totalmente responsivo e adaptável para:

- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 991px)
- 💻 Desktop (≥ 992px)

## 🔒 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:

1. Usuário faz login
2. Backend retorna token JWT
3. Token é armazenado no `localStorage`
4. Todas as requisições incluem o token automaticamente
5. Token expirado = redirecionamento para login

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se o backend está rodando
- Confirme a configuração de CORS no backend
- Verifique a URL no arquivo `.env`

### Erro 401 (Não autorizado)
- Token pode estar expirado
- Faça login novamente

### Página em branco
- Verifique o console do navegador (F12)
- Confirme se todas as dependências foram instaladas
- Tente limpar o cache e recarregar

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Desenvolvido por:** [ZeroLuan](https://github.com/ZeroLuan)

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique a [documentação](docs/)
2. Abra uma [issue](https://github.com/ZeroLuan/eco-gestor-front/issues)
3. Entre em contato com a equipe

---

<p align="center">
  Feito com 💚 para Irecê - BA
</p>

<p align="center">
  🌿 EcoGestor - Gestão Ambiental Inteligente
</p>