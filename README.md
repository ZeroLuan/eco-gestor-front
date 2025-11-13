# 🌿 EcoGestor - Frontend

Sistema de Gestão Ambiental Municipal de Irecê, Bahia

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22.12.0-brightgreen.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-7.x-646CFF.svg)](https://vitejs.dev/)

## 📋 Sobre o Projeto

O **EcoGestor** é um sistema web moderno para gestão ambiental municipal, desenvolvido para auxiliar na administração de:

- 📊 **Dashboard** - Visão geral com estatísticas em tempo real
- 📍 **Pontos de Coleta** - Gerenciamento de locais de coleta seletiva
- 📄 **Licenças Ambientais** - Controle de licenças e regularizações
- 👥 **Cooperativas** - Cadastro e gestão de cooperativas
- ♻️ **Resíduos** - Monitoramento de coleta e reciclagem
- 📈 **Relatórios** - Geração e visualização de relatórios

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- ⚡ **[Vite](https://vitejs.dev/)** - Build tool moderna e rápida (v7.2.2)
- 🎨 **[Bootstrap 5](https://getbootstrap.com/)** - Framework CSS responsivo (v5.3.8)
- 🎯 **[Bootstrap Icons](https://icons.getbootstrap.com/)** - Biblioteca de ícones (v1.13.1)
- 🔌 **[Axios](https://axios-http.com/)** - Cliente HTTP para requisições (v1.13.2)
- 💻 **JavaScript ES6+** - Linguagem de programação moderna
- 🎨 **CSS3** - Estilização customizada com variáveis
- 🛣️ **SPA Router** - Roteamento personalizado para navegação dinâmica

## 📦 Estrutura do Projeto

```
eco-gestor-front/
├── public/                    # Arquivos públicos estáticos
├── src/
│   ├── assets/               # Imagens, fontes e recursos
│   │   ├── css/
│   │   ├── fonts/
│   │   └── images/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── common/          # Botões, inputs, etc
│   │   └── js/
│   ├── pages/                # Páginas da aplicação SPA
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── ponto-coleta/    # Gestão de pontos de coleta
│   │   ├── licenca-ambiental/ # Licenças ambientais
│   │   ├── cooperativa/     # Cooperativas
│   │   ├── residuos/        # Resíduos
│   │   └── relatorio/       # Relatórios
│   ├── services/            # Serviços e integrações API
│   │   ├── api.js
│   │   ├── index.js
│   │   ├── auth/
│   │   │   └── authService.js
│   │   ├── dashboard/
│   │   │   └── dashboardService.js
│   │   └── pontosColeta/
│   │       └── pontosColetaService.js
│   ├── utils/               # Funções utilitárias
│   ├── app.css              # Estilos globais consolidados
│   ├── main.js              # Arquivo principal com router
│   └── index.html           # Template base
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências do projeto
├── vite.config.js           # Configuração do Vite
└── README.md
```

## 🔧 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 22.12 ou superior)
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

O projeto estará disponível em `http://localhost:5173` (ou porta alternativa se ocupada)

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento com hot reload

# Produção
npm run build        # Gera build otimizado para produção
npm run preview      # Visualiza build de produção localmente
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
- `GET /api/licencas-ambientais` - Licenças ambientais
- `GET /api/cooperativas` - Cooperativas
- `GET /api/residuos` - Resíduos
- `GET /api/relatorios` - Relatórios

## 🎨 Funcionalidades

### Dashboard

- ✅ Cards de estatísticas em tempo real
- ✅ Gráficos de visualização de dados
- ✅ Lista de atividades recentes
- ✅ Alertas do sistema
- ✅ Responsivo para mobile

### Navegação SPA

- ✅ Router personalizado sem reload de página
- ✅ Carregamento dinâmico de conteúdo
- ✅ Indicador de página ativa na sidebar
- ✅ Navegação fluida entre módulos

### Páginas Interativas

- ✅ **Pontos de Coleta**: Filtros, tabela dinâmica, busca em tempo real
- ✅ **Licenças Ambientais**: Status coloridos, filtros por validade
- ✅ **Cooperativas**: Busca por CNPJ, listagem organizada
- ✅ **Resíduos**: Categorização por tipo com cores distintas
- ✅ **Relatórios**: Geração e download de relatórios

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

### Erro de versão do Node.js

- Vite 7.2.2 requer Node.js 22.12+
- Atualize sua versão do Node.js se estiver usando uma inferior

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

### Hot Reload não funciona

- Certifique-se de que o servidor `npm run dev` está rodando
- Verifique se a versão do Node.js é compatível
- Recarregue a página manualmente se necessário

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
