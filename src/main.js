// importa o Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// biblioteca de icones do Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
// importa os estilos globais da aplicação
import './app.css';
// importa o js do Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// ===========================
// SISTEMA DE NAVEGAÇÃO (SPA)
// ===========================

/**
 * Router simples para carregar páginas dinamicamente
 * - Carrega HTML e JS de cada página conforme navegação
 * - Atualiza classe 'active' nos links da sidebar
 */

// Mapeamento de rotas para arquivos
const routes = {
  'dashboard': {
    html: '/src/pages/dashboard/dashboard-content.html',
    js: '/src/pages/dashboard/dashboard.js',
    title: 'Dashboard'
  },
  'pontos-coleta': {
    html: '/src/pages/ponto-coleta/ponto-coleta.html',
    js: '/src/pages/ponto-coleta/ponto-coleta.js',
    title: 'Pontos de Coleta'
  },
  'licencas': {
    html: '/src/pages/licenca-ambiental/licenca-ambiental.html',
    js: '/src/pages/licenca-ambiental/licenca-ambiental.js',
    title: 'Licenças Ambientais'
  },
  'cooperativas': {
    html: '/src/pages/cooperativa/cooperativa.html',
    js: '/src/pages/cooperativa/cooperativa.js',
    title: 'Cooperativas'
  },
  'residuos': {
    html: '/src/pages/residuos/residuos.html',
    js: '/src/pages/residuos/residuos.js',
    title: 'Resíduos'
  },
  'relatorios': {
    html: '/src/pages/relatorio/relatorio.html',
    js: '/src/pages/relatorio/relatorio.js',
    title: 'Relatórios'
  }
};

// Container onde o conteúdo será inserido
const appContent = document.getElementById('app-content');

/**
 * Carrega uma página no container principal
 * @param {string} pageName - Nome da página (ex: 'dashboard', 'pontos-coleta')
 */
async function loadPage(pageName) {
  const route = routes[pageName];
  
  if (!route) {
    console.error(`Rota não encontrada: ${pageName}`);
    return;
  }

  try {
    // Carrega o HTML da página
    const response = await fetch(route.html);
    if (!response.ok) {
      throw new Error(`Erro ao carregar ${route.html}`);
    }
    
    const html = await response.text();
    appContent.innerHTML = html;

    // Atualiza o título da página
    document.title = `EcoGestor - ${route.title}`;

    // Carrega o JavaScript da página (se existir)
    if (route.js) {
      // Remove script anterior se existir
      const oldScript = document.querySelector(`script[data-page="${pageName}"]`);
      if (oldScript) {
        oldScript.remove();
      }

      // Adiciona timestamp para forçar recarregamento do módulo
      const timestamp = new Date().getTime();
      const script = document.createElement('script');
      script.type = 'module';
      script.src = `${route.js}?t=${timestamp}`;
      script.dataset.page = pageName;
      document.body.appendChild(script);
    }

  } catch (error) {
    console.error(`❌ Erro ao carregar página ${pageName}:`, error);
    appContent.innerHTML = `
      <div class="alert alert-danger m-4">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        Erro ao carregar a página. Tente novamente.
      </div>
    `;
  }
}

/**
 * Atualiza a classe 'active' nos links da sidebar
 */
function updateActiveLink(pageName) {
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
    if (link.dataset.page === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Inicializa o controle da sidebar mobile
 */
function initSidebar() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (!sidebarToggle || !sidebar) return;

  // Toggle da sidebar em dispositivos móveis
  sidebarToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    sidebar.classList.toggle('show');
  });

  // Fechar sidebar ao clicar fora dela (mobile)
  document.addEventListener('click', function(event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = sidebarToggle.contains(event.target);
    
    if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('show')) {
      sidebar.classList.remove('show');
    }
  });

  // Adicionar overlay quando sidebar estiver aberta (mobile)
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1039;
    display: none;
  `;
  document.body.appendChild(overlay);

  // Mostrar/esconder overlay com a sidebar
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        if (sidebar.classList.contains('show') && window.innerWidth < 992) {
          overlay.style.display = 'block';
        } else {
          overlay.style.display = 'none';
        }
      }
    });
  });

  observer.observe(sidebar, { attributes: true });

  // Fechar sidebar ao clicar no overlay
  overlay.addEventListener('click', function() {
    sidebar.classList.remove('show');
  });

  console.log('✅ Sidebar inicializada');
}

/**
 * Inicializa o sistema de navegação
 */
function initRouter() {
  // Adiciona event listeners nos links da sidebar
  document.querySelectorAll('.sidebar-nav .nav-link[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageName = this.dataset.page;
      loadPage(pageName);
      updateActiveLink(pageName);
      
      // Fecha sidebar no mobile após clicar
      const sidebar = document.getElementById('sidebar');
      if (window.innerWidth < 992) {
        sidebar.classList.remove('show');
      }
    });
  });

  // Carrega a página inicial (dashboard)
  // Como o HTML inicial já tem o dashboard, só precisamos carregar o JS
  console.log('✅ Router inicializado');
}

/**
 * Inicializa quando o DOM estiver pronto
 */
function initApp() {
  initRouter();
  initSidebar();
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initApp);

// importa o JavaScript do dashboard (carregado por padrão)
import './pages/dashboard/dashboard.js';