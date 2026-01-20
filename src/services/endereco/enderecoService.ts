import { apiClient } from '../api';
import { EnderecoData } from '../../components/Endereco';

class EnderecoService {
    async criar(dados: EnderecoData): Promise<EnderecoData> {
        return await apiClient.post('/endereco/criar', dados);
    }

    async atualizar(id: number, dados: EnderecoData): Promise<EnderecoData> {
        return await apiClient.put(`/endereco/editar/${id}`, dados);
    }

    async buscarPorId(id: number): Promise<EnderecoData> {
        return await apiClient.get(`/endereco/${id}`);
    }
}

export const enderecoService = new EnderecoService();
export default EnderecoService;
