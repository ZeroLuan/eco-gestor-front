/**
 * EcoGestor Dashboard - JavaScript
 * Controles de interatividade para o dashboard
 */

// Importa serviços (usando Axios)
import { dashboardService } from '../../services/dashboard/dashboardService.js';

// ===========================
// CARREGAMENTO DE DADOS DO BACKEND
// ===========================

/**
 * Carrega todos os dados do dashboard do backend
 */
async function carregarDadosDashboard() {
    try {
        console.log('📊 Carregando dados do dashboard...');
        
        // Busca dados em paralelo do backend (com Axios!)
        const [estatisticas, atividades, alertas, totalPontosAtivos, totalPesoMes] = await Promise.all([
            dashboardService.getStatistics().catch(err => {
                console.error('Erro ao carregar estatísticas:', err.message);
                return null;
            }),
            dashboardService.getAtividadesRecentes(4).catch(err => {
                console.error('Erro ao carregar atividades:', err.message);
                return [];
            }),
            dashboardService.getAlertas().catch(err => {
                console.error('Erro ao carregar alertas:', err.message);
                return [];
            }),
            dashboardService.getTotalPontosAtivos().catch(err => {
                console.error('Erro ao carregar total de pontos ativos:', err.message);
                return null;
            }),
            dashboardService.getTotalPesoMes().catch(err => {
                console.error('Erro ao carregar total de peso do mês:', err.message);
                return null;
            })
        ]);

        // Atualiza a interface com os dados recebidos
        if (estatisticas) {
            atualizarEstatisticas(estatisticas);
        }
        
        if (totalPesoMes !== null) {
            atualizarTotalPesoMes(totalPesoMes);
        }
        
        if (totalPontosAtivos !== null) {
            atualizarTotalPontosAtivos(totalPontosAtivos);
        }
        
        if (atividades && atividades.length > 0) {
            atualizarAtividades(atividades);
        }
        
        if (alertas && alertas.length > 0) {
            atualizarAlertas(alertas);
        }

        console.log('✅ Dashboard carregado com sucesso!');
    } catch (error) {
        console.error('❌ Erro PROPOSITAL ao carregar dashboard:', error.message);
    }
}

/**
 * Atualiza cards de estatísticas com dados do backend
 */
function atualizarEstatisticas(dados) {
    if (dados.residuosColetados) {
        const card = document.querySelector('.row.g-3.mb-4 .col-12:nth-child(1) h3');
        if (card) {
            card.textContent = `${dados.residuosColetados.valor} ${dados.residuosColetados.unidade || 'ton'}`;
        }
    }

    if (dados.pontosColeta) {
        const card = document.querySelector('.row.g-3.mb-4 .col-12:nth-child(2) h3');
        if (card) {
            card.textContent = dados.pontosColeta.valor;
        }
    }

    if (dados.licencasAtivas) {
        const card = document.querySelector('.row.g-3.mb-4 .col-12:nth-child(3) h3');
        if (card) {
            card.textContent = dados.licencasAtivas.valor;
        }
    }

    if (dados.denunciasPendentes) {
        const card = document.querySelector('.row.g-3.mb-4 .col-12:nth-child(4) h3');
        if (card) {
            card.textContent = dados.denunciasPendentes.valor;
        }
    }
}

/**
 * Atualiza o card com o total de peso de resíduos coletados no mês
 */
function atualizarTotalPesoMes(peso) {
    console.log('🔄 Atualizando total de peso do mês:', peso);
    const card = document.querySelector('.row.g-3.mb-4 .col-12:nth-child(1) h3');
    console.log('🎯 Card encontrado:', card);
    if (card) {
        card.textContent = `${peso.toFixed(2)} ton`;
        console.log(`✅ Total de peso do mês atualizado: ${peso} ton`);
    } else {
        console.error('❌ Card de resíduos coletados não encontrado no DOM');
    }
}

/**
 * Atualiza o card com o total de pontos de coleta ativos
 */
function atualizarTotalPontosAtivos(total) {
    console.log('🔄 Atualizando total de pontos ativos:', total);
    const card = document.querySelector('.row.g-3.mb-4 .col-12:nth-child(2) h3');
    console.log('🎯 Card encontrado:', card);
    if (card) {
        card.textContent = total;
        console.log(`✅ Total de pontos ativos atualizado: ${total}`);
    } else {
        console.error('❌ Card de pontos ativos não encontrado no DOM');
    }
}

/**
 * Atualiza lista de atividades recentes
 */
function atualizarAtividades(atividades) {
    const lista = document.querySelector('.list-group');
    if (!lista) return;

    lista.innerHTML = atividades.map(atividade => `
        <li class="list-group-item d-flex align-items-center">
            <i class="bi ${getIconeAtividade(atividade.tipo)} me-3"></i>
            <div>
                <p class="mb-0 fw-semibold">${atividade.titulo}</p>
                <small class="text-muted">${atividade.descricao} - ${formatarTempo(atividade.data)}</small>
            </div>
        </li>
    `).join('');
}

/**
 * Atualiza alertas do sistema
 */
function atualizarAlertas(alertas) {
    const container = document.querySelector('.col-12.col-lg-4:last-child .card');
    if (!container) return;

    const alertasHTML = alertas.map(alerta => `
        <div class="alert alert-${alerta.tipo} d-flex align-items-center" role="alert">
            <i class="bi ${getIconeAlerta(alerta.tipo)} me-2"></i>
            <small>${alerta.mensagem}</small>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="p-4">
            <h5 class="fw-bold mb-3">Alertas do Sistema</h5>
            ${alertasHTML}
        </div>
    `;
}

/**
 * Retorna ícone baseado no tipo de atividade
 */
function getIconeAtividade(tipo) {
    const icones = {
        'licenca': 'bi-check-circle-fill text-success',
        'ponto': 'bi-geo-alt-fill text-primary',
        'denuncia': 'bi-exclamation-triangle-fill text-warning',
        'coleta': 'bi-recycle text-info'
    };
    return icones[tipo] || 'bi-info-circle text-secondary';
}

/**
 * Retorna ícone baseado no tipo de alerta
 */
function getIconeAlerta(tipo) {
    const icones = {
        'warning': 'bi-exclamation-triangle-fill',
        'info': 'bi-info-circle-fill',
        'danger': 'bi-x-circle-fill',
        'success': 'bi-check-circle-fill'
    };
    return icones[tipo] || 'bi-info-circle-fill';
}

/**
 * Formata tempo relativo (ex: "Há 2 horas")
 */
function formatarTempo(data) {
    const agora = new Date();
    const dataAtividade = new Date(data);
    const diff = agora - dataAtividade;
    
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);
    
    if (minutos < 60) return `Há ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    if (horas < 24) return `Há ${horas} hora${horas !== 1 ? 's' : ''}`;
    return `Há ${dias} dia${dias !== 1 ? 's' : ''}`;
}

// ===========================
// INICIALIZAÇÃO DO DASHBOARD
// ===========================
export function inicializarDashboard() {
    // Carrega dados do backend usando Axios
    carregarDadosDashboard();
    console.log('✅ Dashboard inicializado');
}

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

// ===========================
// INICIALIZAÇÃO
// ===========================
inicializarDashboard();
