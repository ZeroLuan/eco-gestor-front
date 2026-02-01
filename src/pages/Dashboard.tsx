import { useEffect, useState } from 'react';
import { dashboardService, DashboardStatistics, AtividadeRecente, Alerta } from '../services/dashboard/dashboardService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
    const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [licencasProximasVencer, setLicencasProximasVencer] = useState<any[]>([]);
    const [totalPesoMes, setTotalPesoMes] = useState<number | null>(null);
    const [totalPontosAtivos, setTotalPontosAtivos] = useState<number | null>(null);
    const [totalLicencasAtivas, setTotalLicencasAtivas] = useState<number | null>(null);
    const [totalCooperativasAtivas, setTotalCooperativasAtivas] = useState<number | null>(null);
    const [residuosPorTipo, setResiduosPorTipo] = useState<{ [key: string]: number }>({});
    const [residuosUltimosMeses, setResiduosUltimosMeses] = useState<Array<{ mes: number; ano: number; peso: number }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            console.log('📊 Carregando dados do dashboard...');
            const [stats, activities, alerts, points, weight, licenses, cooperativas, porTipo, ultimos, licencasVencer] = await Promise.all([
                dashboardService.getStatistics().catch(err => { console.error(err); return null; }),
                dashboardService.getAtividadesRecentes(4).catch(err => { console.error(err); return []; }),
                dashboardService.getAlertas().catch(err => { console.error(err); return []; }),
                dashboardService.getTotalPontosAtivos().catch(err => { console.error(err); return null; }),
                dashboardService.getTotalPesoMes().catch(err => { console.error(err); return null; }),
                dashboardService.getTotalLicencasAtivas().catch(err => { console.error(err); return null; }),
                dashboardService.getTotalCooperativasAtivas().catch(err => { console.error(err); return null; }),
                dashboardService.getResiduosPorTipo().catch(err => { console.error(err); return {}; }),
                dashboardService.getResiduosUltimosMeses().catch(err => { console.error(err); return []; }),
                dashboardService.getLicencasProximasVencer().catch(err => { console.error(err); return []; })
            ]);

            if (stats) setStatistics(stats);
            if (activities) setAtividades(activities);
            if (alerts) setAlertas(alerts);
            if (points !== null) setTotalPontosAtivos(points);
            if (weight !== null) setTotalPesoMes(weight);
            if (licenses !== null) setTotalLicencasAtivas(licenses);
            if (cooperativas !== null) setTotalCooperativasAtivas(cooperativas);
            if (porTipo) setResiduosPorTipo(porTipo);
            if (ultimos) setResiduosUltimosMeses(ultimos);
            if (licencasVencer) setLicencasProximasVencer(licencasVencer);
        } catch (error) {
            console.error('Erro ao carregar dashboard', error);
        } finally {
            setLoading(false);
        }
    };

    const getIconeAtividade = (tipo: string) => {
        const icones: Record<string, string> = {
            'licenca': 'bi-check-circle-fill text-success',
            'ponto': 'bi-geo-alt-fill text-primary',
            'denuncia': 'bi-exclamation-triangle-fill text-warning',
            'coleta': 'bi-recycle text-info'
        };
        return icones[tipo] || 'bi-info-circle text-secondary';
    };

    const getIconeAlerta = (tipo: string) => {
        const icones: Record<string, string> = {
            'warning': 'bi-exclamation-triangle-fill',
            'info': 'bi-info-circle-fill',
            'danger': 'bi-x-circle-fill',
            'success': 'bi-check-circle-fill'
        };
        return icones[tipo] || 'bi-info-circle-fill';
    };

    const formatarTempo = (data: string) => {
        const agora = new Date().getTime();
        const dataAtividade = new Date(data).getTime();
        const diff = agora - dataAtividade;

        const minutos = Math.floor(diff / 60000);
        const horas = Math.floor(diff / 3600000);
        const dias = Math.floor(diff / 86400000);

        if (minutos < 60) return `Há ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
        if (horas < 24) return `Há ${horas} hora${horas !== 1 ? 's' : ''}`;
        return `Há ${dias} dia${dias !== 1 ? 's' : ''}`;
    };

    const calcularDiasAteVencimento = (dataValidade: string) => {
        const hoje = new Date();
        const vencimento = new Date(dataValidade);
        const diff = vencimento.getTime() - hoje.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const formatarData = (isoDate: string) => {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        return d.toLocaleDateString('pt-BR');
    };

    const getTipoAlerta = (dias: number) => {
        if (dias <= 7) return 'danger';
        if (dias <= 30) return 'warning';
        return 'info';
    };

    // Configuração do gráfico de pizza (Resíduos por Tipo)
    const tiposLabels = {
        'PLASTICO': 'Plástico',
        'PAPEL': 'Papel',
        'VIDRO': 'Vidro',
        'METAL': 'Metal',
        'ORGANICO': 'Orgânico',
        'ELETRONICO': 'Eletrônico',
        'MISTO': 'Misto'
    };

    const tiposCores = {
        'PLASTICO': 'rgba(220, 53, 69, 0.8)',
        'PAPEL': 'rgba(13, 110, 253, 0.8)',
        'VIDRO': 'rgba(13, 202, 240, 0.8)',
        'METAL': 'rgba(108, 117, 125, 0.8)',
        'ORGANICO': 'rgba(25, 135, 84, 0.8)',
        'ELETRONICO': 'rgba(255, 193, 7, 0.8)',
        'MISTO': 'rgba(33, 37, 41, 0.8)'
    };

    const pieData = {
        labels: Object.keys(residuosPorTipo).map((tipo: string) => tiposLabels[tipo as keyof typeof tiposLabels] || tipo),
        datasets: [{
            data: Object.values(residuosPorTipo),
            backgroundColor: Object.keys(residuosPorTipo).map((tipo: string) => tiposCores[tipo as keyof typeof tiposCores] || 'rgba(128, 128, 128, 0.8)'),
            borderColor: Object.keys(residuosPorTipo).map(() => 'rgba(255, 255, 255, 1)'),
            borderWidth: 2,
        }]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return `${label}: ${value.toFixed(2)} kg`;
                    }
                }
            }
        }
    };

    // Configuração do gráfico de barras (Últimos 6 meses)
    const nomeMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const barData = {
        labels: residuosUltimosMeses.map(item => `${nomeMeses[item.mes - 1]}/${item.ano}`),
        datasets: [{
            label: 'Peso Coletado (kg)',
            data: residuosUltimosMeses.map(item => item.peso),
            backgroundColor: 'rgba(25, 135, 84, 0.8)',
            borderColor: 'rgba(25, 135, 84, 1)',
            borderWidth: 1,
        }]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return `${context.parsed.y.toFixed(2)} kg`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value: any) {
                        return value.toFixed(1) + ' kg';
                    }
                }
            }
        }
    };

    return (
        <>
            <div className="content-header mb-4">
                <h2 className="fw-bold mb-1">Dashboard</h2>
                <p className="text-muted">Visão geral do sistema de gestão ambiental de Irecê</p>
            </div>

            <div className="row g-3 mb-4">
                {/* Card 1: Resíduos Coletados */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm p-3 h-100">
                        <h6 className="text-muted mb-3">Resíduos Coletados</h6>
                        <h3 className="fw-bold mb-2">
                            {totalPesoMes !== null ? `${totalPesoMes.toFixed(2)} kg` : (statistics?.residuosColetados?.valor ? `${statistics.residuosColetados.valor} ${statistics.residuosColetados.unidade || 'kg'}` : (loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : '0 kg'))}
                        </h3>
                        <p className="text-success small mb-0">
                            <i className="bi bi-arrow-up"></i> Total no mês atual
                        </p>
                    </div>
                </div>

                {/* Card 2: Pontos de Coleta */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm p-3 h-100">
                        <h6 className="text-muted mb-3">Pontos de Coleta</h6>
                        <h3 className="fw-bold mb-2">
                            {totalPontosAtivos !== null ? totalPontosAtivos : (statistics?.pontosColeta?.valor ?? (loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 0))}
                        </h3>
                        <p className="text-primary small mb-0">
                            <i className="bi bi-info-circle"></i> Ativos no município
                        </p>
                    </div>
                </div>

                {/* Card 3: Licenças Ativas */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm p-3 h-100">
                        <h6 className="text-muted mb-3">Licenças Ativas</h6>
                        <h3 className="fw-bold mb-2">
                            {totalLicencasAtivas !== null ? totalLicencasAtivas : (statistics?.licencasAtivas?.valor ?? (loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 0))}
                        </h3>
                        <p className="text-success small mb-0">
                            <i className="bi bi-check-circle"></i> Válidas e regulares
                        </p>
                    </div>
                </div>

                {/* Card 4: Cooperativas Ativas */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm p-3 h-100">
                        <h6 className="text-muted mb-3">Cooperativas Ativas</h6>
                        <h3 className="fw-bold mb-2">
                            {totalCooperativasAtivas !== null ? totalCooperativasAtivas : (loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 0)}
                        </h3>
                        <p className="text-success small mb-0">
                            <i className="bi bi-people-fill"></i> Em operação
                        </p>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Coleta de Resíduos - Últimos Meses</h5>
                        <div style={{ height: '300px' }}>
                            {residuosUltimosMeses.length > 0 ? (
                                <Bar data={barData} options={barOptions} />
                            ) : (
                                <div className="chart-placeholder d-flex flex-column align-items-center justify-content-center h-100">
                                    <i className="bi bi-bar-chart-fill text-muted" style={{ fontSize: '4rem' }}></i>
                                    <p className="text-muted mt-3">Nenhum dado disponível</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Distribuição por Tipo de Resíduo</h5>
                        <div style={{ height: '300px' }}>
                            {Object.keys(residuosPorTipo).length > 0 ? (
                                <Pie data={pieData} options={pieOptions} />
                            ) : (
                                <div className="chart-placeholder d-flex flex-column align-items-center justify-content-center h-100">
                                    <i className="bi bi-pie-chart-fill text-muted" style={{ fontSize: '4rem' }}></i>
                                    <p className="text-muted mt-3">Nenhum dado disponível</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mt-3">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Atividades Recentes</h5>
                        <ul className="list-group list-group-flush">
                            {atividades.map((atividade, index) => (
                                <li key={index} className="list-group-item d-flex align-items-center">
                                    <i className={`bi ${getIconeAtividade(atividade.tipo)} me-3`}></i>
                                    <div>
                                        <p className="mb-0 fw-semibold">{atividade.titulo}</p>
                                        <small className="text-muted">{atividade.descricao} - {formatarTempo(atividade.data)}</small>
                                    </div>
                                </li>
                            ))}
                            {atividades.length === 0 && !loading && (
                                <li className="list-group-item text-muted">Nenhuma atividade recente.</li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card shadow-sm p-4">
                        <h5 className="fw-bold mb-3">
                            <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                            Licenças Próximas do Vencimento
                        </h5>
                        {licencasProximasVencer.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {licencasProximasVencer.map((licenca, index) => {
                                    const diasRestantes = calcularDiasAteVencimento(licenca.dataValidade);
                                    const tipoAlerta = getTipoAlerta(diasRestantes);
                                    return (
                                        <div key={index} className={`list-group-item py-3 ps-3 pe-0 border-start border-${tipoAlerta} border-3`}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="flex-grow-1 ms-2">
                                                    <p className="mb-1 fw-semibold small">
                                                        <i className="bi bi-file-earmark-text me-2"></i>
                                                        {licenca.numeroLicenca}
                                                    </p>
                                                    <p className="mb-1 text-muted small">
                                                        Tipo: {licenca.tipoLicenca}
                                                    </p>
                                                    <p className="mb-0 small">
                                                        <i className="bi bi-calendar-event me-1"></i>
                                                        Vence em: <strong>{formatarData(licenca.dataValidade)}</strong>
                                                    </p>
                                                </div>
                                                <span className={`badge bg-${tipoAlerta} ms-1 me-2`}>
                                                    {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                {loading ? (
                                    <div className="spinner-border spinner-border-sm text-muted" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
                                        <p className="text-muted small mt-2 mb-0">Nenhuma licença próxima do vencimento</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
