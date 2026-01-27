import { apiClient } from '../api';

export interface Residuo {
    id?: number;
    idPontoColeta?: number;
    tipoResiduo: string;
    peso: number;
    nomeResponsavel?: string;
    responsavel?: string; // API might return this
    dataColeta?: string;
    dataInicio?: string; // For display purposes (from table)
    local?: string; // For display purposes
}

export interface ResiduosFilters {
    tipoResiduo?: string;
    nomeResponsavel?: string;
    dataInicio?: string;
    dataFim?: string;
    local?: string;
}

export interface PaginacaoResponse<T> {
    content: T[];
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

class ResiduosService {
    async listarTodos(params = {}): Promise<PaginacaoResponse<Residuo>> {
        return await apiClient.get('/residuos/busca/paginada', params);
    }

    async buscarComFiltros(filtros: ResiduosFilters, params: any = {}): Promise<PaginacaoResponse<Residuo>> {
        return await apiClient.post('/residuos/busca/filtro', filtros, { params });
    }

    async criar(dados: Residuo): Promise<Residuo> {
        return await apiClient.post('/residuos/criar', dados);
    }

    async atualizar(id: number, dados: Residuo): Promise<Residuo> {
        return await apiClient.put(`/residuos/editar/${id}`, dados);
    }

    async remover(id: number): Promise<void> {
        await apiClient.delete(`/residuos/remove/${id}`);
    }

    async buscarPorId(id: number): Promise<Residuo> {
        return await apiClient.get(`/residuos/${id}`);
    }
}

export const residuosService = new ResiduosService();
export default ResiduosService;
