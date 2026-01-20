import { useEffect, useState } from 'react';
import { dashboardService, DashboardStatistics, AtividadeRecente, Alerta } from '../services/dashboard/dashboardService';

const Dashboard = () => {
    const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
    const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [totalPesoMes, setTotalPesoMes] = useState<number | null>(null);
    const [totalPontosAtivos, setTotalPontosAtivos] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            console.log('📊 Carregando dados do dashboard...');
            const [stats, activities, alerts, points, weight] = await Promise.all([
                dashboardService.getStatistics().catch(err => { console.error(err); return null; }),
                dashboardService.getAtividadesRecentes(4).catch(err => { console.error(err); return []; }),
                dashboardService.getAlertas().catch(err => { console.error(err); return []; }),
                dashboardService.getTotalPontosAtivos().catch(err => { console.error(err); return null; }),
                dashboardService.getTotalPesoMes().catch(err => { console.error(err); return null; })
            ]);

            if (stats) setStatistics(stats);
            if (activities) setAtividades(activities);
            if (alerts) setAlertas(alerts);
            if (points !== null) setTotalPontosAtivos(points);
            if (weight !== null) setTotalPesoMes(weight);
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
                            {totalPesoMes !== null ? `${totalPesoMes.toFixed(2)} ton` : (statistics?.residuosColetados?.valor ? `${statistics.residuosColetados.valor} ${statistics.residuosColetados.unidade || 'ton'}` : (loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : '0 ton'))}
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
                            {statistics?.licencasAtivas?.valor ?? (loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 0)}
                        </h3>
                        <p className="text-success small mb-0">
                            <i className="bi bi-check-circle"></i> Válidas e regulares
                        </p>
                    </div>
                </div>

                {/* Card 4: Denúncias Pendentes */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm p-3 h-100">
                        <h6 className="text-muted mb-3">Denúncias Pendentes</h6>
                        <h3 className="fw-bold mb-2">
                            {statistics?.denunciasPendentes?.valor ?? (loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 0)}
                        </h3>
                        <p className="text-danger small mb-0">
                            <i className="bi bi-exclamation-circle"></i> Aguardando análise
                        </p>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Coleta de Resíduos por Tipo</h5>
                        <div className="chart-placeholder">
                            <i className="bi bi-bar-chart-fill text-muted" style={{ fontSize: '4rem' }}></i>
                            <p className="text-muted mt-3">Gráfico de barras - Visualização de dados por categoria</p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Distribuição por Tipo</h5>
                        <div className="chart-placeholder">
                            <i className="bi bi-pie-chart-fill text-muted" style={{ fontSize: '4rem' }}></i>
                            <p className="text-muted mt-3">Gráfico de pizza - Proporção entre categorias</p>
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
                        <h5 className="fw-bold mb-3">Alertas do Sistema</h5>
                        {alertas.map((alerta, index) => (
                            <div key={index} className={`alert alert-${alerta.tipo} d-flex align-items-center`} role="alert">
                                <i className={`bi ${getIconeAlerta(alerta.tipo)} me-2`}></i>
                                <small>{alerta.mensagem}</small>
                            </div>
                        ))}
                        {alertas.length === 0 && !loading && (
                            <p className="text-muted small">Nenhum alerta.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
