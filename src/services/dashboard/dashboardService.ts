import { apiClient } from '../api';

export interface ResiduosColetados {
    valor: number;
    unidade?: string;
}

export interface StatItem {
    valor: number;
}

export interface DashboardStatistics {
    residuosColetados?: ResiduosColetados;
    pontosColeta?: StatItem;
    licencasAtivas?: StatItem;
    denunciasPendentes?: StatItem;
}

export interface AtividadeRecente {
    tipo: 'licenca' | 'ponto' | 'denuncia' | 'coleta' | string;
    titulo: string;
    descricao: string;
    data: string; // ISO date string
}

export interface Alerta {
    tipo: 'warning' | 'info' | 'danger' | 'success';
    mensagem: string;
}

class DashboardService {

    async getStatistics(): Promise<DashboardStatistics> {
        try {
            return await apiClient.get<DashboardStatistics>('/dashboard/statistics');
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            throw error;
        }
    }

    async getResiduosColetados(filters = {}): Promise<any> {
        try {
            return await apiClient.get('/dashboard/residuos', filters);
        } catch (error) {
            console.error('Erro ao buscar resíduos coletados:', error);
            throw error;
        }
    }

    async getAtividadesRecentes(limit = 10): Promise<AtividadeRecente[]> {
        try {
            return await apiClient.get<AtividadeRecente[]>('/dashboard/atividades', { limit });
        } catch (error) {
            console.error('Erro ao buscar atividades recentes:', error);
            throw error;
        }
    }

    async getTotalPontosAtivos(): Promise<number> {
        try {
            return await apiClient.get<number>('/dashboard/total-pontos-ativos');
        } catch (error) {
            console.error('Erro ao buscar total de pontos ativos:', error);
            throw error;
        }
    }

    async getTotalLicencasAtivas(): Promise<number> {
        try {
            return await apiClient.get<number>('/licenca-ambiental/buscar/total-licencas-ativas');
        } catch (error) {
            console.error('Erro ao buscar total de licenças ativas:', error);
            throw error;
        }
    }

    async getTotalPesoMes(): Promise<number> {
        try {
            return await apiClient.get<number>('/dashboard/total-peso-mes');
        } catch (error) {
            console.error('Erro ao buscar total de peso do mês:', error);
            throw error;
        }
    }

    async getTotalCooperativasAtivas(): Promise<number> {
        try {
            return await apiClient.get<number>('/cooperativas/busca-total-cooperativas-ativas');
        } catch (error) {
            console.error('Erro ao buscar total de cooperativas ativas:', error);
            throw error;
        }
    }

    async getAlertas(): Promise<Alerta[]> {
        try {
            return await apiClient.get<Alerta[]>('/dashboard/alertas');
        } catch (error) {
            console.error('Erro ao buscar alertas:', error);
            throw error;
        }
    }

    async getGraficoData(tipo: string, params = {}): Promise<any> {
        try {
            return await apiClient.get(`/dashboard/graficos/${tipo}`, params);
        } catch (error) {
            console.error('Erro ao buscar dados do gráfico:', error);
            throw error;
        }
    }
}

export const dashboardService = new DashboardService();
export default DashboardService;
