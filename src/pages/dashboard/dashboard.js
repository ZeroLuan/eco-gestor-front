/**
 * EcoGestor Dashboard - JavaScript
 * Controles de interatividade para o dashboard
 */

// ===========================
// TOGGLE DA SIDEBAR (MOBILE)
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    // Toggle da sidebar em dispositivos móveis
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Fechar sidebar ao clicar fora dela (mobile)
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle && sidebarToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // Fechar sidebar ao clicar em um link do menu (mobile)
    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                sidebar.classList.remove('show');
            }
        });
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

});

// ===========================
// ANIMAÇÕES DE SCROLL
// ===========================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar-top');
    
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
    }
});

// ===========================
// ACTIVE STATE DOS LINKS
// ===========================
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    if (linkPath === currentPath) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// ===========================
// ANIMAÇÃO DE NÚMEROS (CONTADORES)
// ===========================
function animateCounter(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animar contadores quando visíveis (opcional)
const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent.trim();
            const numbers = text.match(/\d+/);
            
            if (numbers) {
                const value = parseInt(numbers[0]);
                target.dataset.animated = 'true';
                // Você pode descomentar a linha abaixo para ativar a animação
                // animateCounter(target, value);
            }
            
            counterObserver.unobserve(target);
        }
    });
}, observerOptions);

// Observar todos os h3 dentro dos cards de estatísticas
document.querySelectorAll('.card h3').forEach(counter => {
    if (!counter.dataset.animated) {
        counterObserver.observe(counter);
    }
});

// ===========================
// TOOLTIPS E POPOVERS (BOOTSTRAP)
// ===========================
// Inicializar tooltips do Bootstrap (se houver)
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// ===========================
// CAMPO DE BUSCA
// ===========================
const searchInput = document.querySelector('.search-container input');

if (searchInput) {
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 2px 8px rgba(25, 135, 84, 0.15)';
    });

    searchInput.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = 'none';
    });

    // Placeholder para funcionalidade de busca
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                console.log('Buscar por:', searchTerm);
                // Aqui você implementaria a lógica de busca real
            }
        }
    });
}

// ===========================
// NOTIFICAÇÕES
// ===========================
const notificationBtn = document.querySelector('.notifications .btn-link');

if (notificationBtn) {
    notificationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Abrir painel de notificações');
        // Aqui você implementaria um dropdown ou modal de notificações
    });
}

// ===========================
// RESPONSIVIDADE - REDIMENSIONAMENTO
// ===========================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const sidebar = document.getElementById('sidebar');
        
        // Remover classe 'show' da sidebar em telas grandes
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
        }
    }, 250);
});

// ===========================
// CONSOLE LOG DE BOAS-VINDAS
// ===========================
console.log('%c🌿 EcoGestor Dashboard v1.0', 'color: #198754; font-size: 16px; font-weight: bold;');
console.log('%cSistema de Gestão Ambiental - Irecê, BA', 'color: #6c757d; font-size: 12px;');
