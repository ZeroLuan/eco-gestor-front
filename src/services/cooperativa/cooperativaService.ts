import { apiClient } from '../api';
import { EnderecoData } from '../../components/Endereco';

export interface Cooperativa {
    id?: number;
    nomeEmpresa: string;
    nomeFantasia?: string;
    cnpj: string;
    email?: string;
    telefone?: string;
    naturezaJuridica?: string;
    cnae?: string;
    nomeResponsavel?: string; // or responsavel? Check JS
    // JS uses "responsavel" in usage: `item.responsavel`. 
    // And `cooperativaResponsavel` input.
    // However, Request object in JS: `nomeResponsavel: responsavel`.
    // I will use `nomeResponsavel` to match Request, but UI might show "responsavel".
    // Wait, the table in `cooperativa.js` does: `item.responsavel`. 
    // So the response from backend likely provides `responsavel`.
    // Let's assume response has `responsavel` or `nomeResponsavel` mapped.
    // I'll add both to be safe or check the JS `CooperativaResponse.fromAPI`.
    // JS `CooperativaResponse.fromAPI` was imported but not shown.
    // I'll stick to `nomeResponsavel` for payload and `responsavel` for display if that's what backend returns.
    // Or I'll use `nomeResponsavel` and map it if needed.
    responsavel?: string; // For display
    enderecoId?: number;
    endereco?: EnderecoData;
    ativo?: boolean; // Deprecated, use statusCooperativa
    statusCooperativa?: boolean;
    nome?: string;
}

export interface CooperativaFilters {
    nomeEmpresa?: string;
    cnpj?: string;
    telefone?: string;
    statusCooperativa?: boolean | string;
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

class CooperativaService {
    async listarTodos(params = {}): Promise<PaginacaoResponse<Cooperativa>> {
        return this.buscarPaginado(params);
    }

    async buscarPaginado(params: any = {}): Promise<PaginacaoResponse<Cooperativa>> {
        try {
            return await apiClient.get<PaginacaoResponse<Cooperativa>>('/cooperativas/busca/paginada', params);
        } catch (error) {
            console.error("Erro ao buscar cooperativas paginadas:", error);
            throw error;
        }
    }

    async listarListaCompleta(): Promise<Cooperativa[]> {
        try {
            return await apiClient.get<Cooperativa[]>('/cooperativas/listar-todas');
        } catch (error) {
            console.error("Erro ao listar todas as cooperativas:", error);
            return [];
        }
    }

    async buscarComFiltros(filtros: CooperativaFilters, params: any = {}): Promise<PaginacaoResponse<Cooperativa>> {
        try {
            return await apiClient.post<PaginacaoResponse<Cooperativa>>('/cooperativas/busca/filtro', filtros, { params });
        } catch (error) {
            console.error('Erro ao buscar cooperativas com filtros:', error);
            throw error;
        }
    }

    async criar(dados: Cooperativa): Promise<Cooperativa> {
        return await apiClient.post('/cooperativas/criar', dados);
    }

    async atualizar(id: number, dados: Cooperativa): Promise<Cooperativa> {
        return await apiClient.put(`/cooperativas/editar/${id}`, dados);
    }

    async remover(id: number): Promise<void> {
        await apiClient.delete(`/cooperativas/remove/${id}`);
    }
}

export const cooperativaService = new CooperativaService();
export default CooperativaService;
