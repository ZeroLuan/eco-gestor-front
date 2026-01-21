import { apiClient } from '../api';

export interface LicencaAmbiental {
    id?: number;
    numeroLicenca: string;
    tipoLicenca: string; // EnumTipoLicenca
    statusLicenca: string; // EnumStatus
    dataValidade: string; // ISO Date
    dataEmissao: string; // ISO Date
    cooperativaId?: number;
    // Optional fields from response if needed for display
    dataInicio?: string;
    dataFim?: string;
}

export interface LicencaAmbientalFilters {
    numeroLicenca?: string;
    tipoLicenca?: string;
    statusLicenca?: string;
    dataValidade?: string;
    cooperativaId?: number;
    // Backend filter uses LicencaAmbientalRequest structure
}

export interface PaginacaoResponse<T> {
    content: T[];
    number: number;
    totalPages: number;
    totalElements: number;
    size: number;
    page?: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

class LicencasService {
    async listarTodos(params = {}): Promise<PaginacaoResponse<LicencaAmbiental>> {
        return await apiClient.get('/licenca-ambiental/busca/paginada', params);
    }

    async buscarComFiltros(filtros: LicencaAmbientalFilters, params: any = {}): Promise<PaginacaoResponse<LicencaAmbiental>> {
        // Backend expects LicencaAmbientalRequest as body
        return await apiClient.post('/licenca-ambiental/busca/filtro', filtros, { params });
    }

    async criar(dados: LicencaAmbiental): Promise<LicencaAmbiental> {
        return await apiClient.post('/licenca-ambiental/criar', dados);
    }

    async atualizar(id: number, dados: LicencaAmbiental): Promise<LicencaAmbiental> {
        return await apiClient.put(`/licenca-ambiental/editar/${id}`, dados);
    }

    async remover(id: number): Promise<void> {
        await apiClient.delete(`/licenca-ambiental/remove/${id}`);
    }

    async buscarPorId(id: number): Promise<LicencaAmbiental> {
        return await apiClient.get(`/licenca-ambiental/${id}`);
    }
}

export const licencasService = new LicencasService();
export default LicencasService;
