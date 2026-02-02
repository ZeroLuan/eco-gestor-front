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
    id?: number;
    tipo: 'licenca' | 'ponto' | 'denuncia' | 'coleta' | 'cooperativa' | string;
    tipoLabel?: string;
    categoria?: string;
    titulo: string;
    descricao: string;
    usuarioEmail?: string;
    entidadeId?: number;
    entidadeTipo?: string;
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

    async getResiduosPorTipo(): Promise<{ [key: string]: number }> {
        try {
            return await apiClient.get<{ [key: string]: number }>('/dashboard/residuos-por-tipo');
        } catch (error) {
            console.error('Erro ao buscar resíduos por tipo:', error);
            return {};
        }
    }

    async getResiduosUltimosMeses(): Promise<Array<{ mes: number; ano: number; peso: number }>> {
        try {
            return await apiClient.get<Array<{ mes: number; ano: number; peso: number }>>('/dashboard/residuos-ultimos-meses');
        } catch (error) {
            console.error('Erro ao buscar resíduos dos últimos meses:', error);
            return [];
        }
    }

    async getLicencasProximasVencer(): Promise<Array<any>> {
        try {
            return await apiClient.get<Array<any>>('/dashboard/licencas-proximas-vencer');
        } catch (error) {
            console.error('Erro ao buscar licenças próximas do vencimento:', error);
            return [];
        }
    }
}

export const dashboardService = new DashboardService();
export default DashboardService;
