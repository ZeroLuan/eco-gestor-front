import { useState, forwardRef, useImperativeHandle } from 'react';
import { ESTADOS_BRASIL, EnumUtils } from '../utils/constants';

export interface EnderecoData {
    id?: number | null;
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export interface EnderecoRef {
    getDados: () => EnderecoData;
    validar: () => boolean;
    limpar: () => void;
    setDados: (dados: EnderecoData) => void;
}

const Endereco = forwardRef<EnderecoRef>((_, ref) => {
    const [dados, setDados] = useState<EnderecoData>({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
    });
    const [loadingCep, setLoadingCep] = useState(false);
    const [erroCep, setErroCep] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
        getDados: () => dados,
        validar: () => validar(),
        limpar: () => setDados({ cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' }),
        setDados: (novosDados: EnderecoData) => setDados({ ...novosDados })
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setDados(prev => ({ ...prev, [id]: value }));
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        setDados(prev => ({ ...prev, cep: value }));
    };

    const buscarCep = async () => {
        const cep = dados.cep.replace(/\D/g, '');
        if (cep.length !== 8) {
            setErroCep('CEP inválido.');
            return;
        }

        setLoadingCep(true);
        setErroCep(null);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setErroCep('CEP não encontrado.');
                return;
            }

            setDados(prev => ({
                ...prev,
                logradouro: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.uf || '',
                complemento: data.complemento || ''
            }));
        } catch (error) {
            console.error(error);
            setErroCep('Erro ao buscar CEP.');
        } finally {
            setLoadingCep(false);
        }
    };

    const validar = () => {
        return !!(dados.cep && dados.logradouro && dados.numero && dados.bairro && dados.cidade && dados.estado);
    };

    return (
        <div className="endereco-component border rounded p-3">
            <h6 className="mb-3">Endereço</h6>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <label htmlFor="cep" className="form-label">CEP <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="cep"
                            value={dados.cep}
                            onChange={handleCepChange}
                            onBlur={() => dados.cep.length === 9 && buscarCep()}
                            placeholder="00000-000"
                            maxLength={9}
                            required
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={buscarCep} disabled={loadingCep}>
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                    {loadingCep && <small className="text-muted"><span className="spinner-border spinner-border-sm me-1"></span>Buscando...</small>}
                    {erroCep && <small className="text-danger">{erroCep}</small>}
                </div>

                <div className="col-md-8 mb-3">
                    <label htmlFor="logradouro" className="form-label">Logradouro <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="logradouro" value={dados.logradouro} onChange={handleChange} required />
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-3">
                    <label htmlFor="numero" className="form-label">Número <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="numero" value={dados.numero} onChange={handleChange} required />
                </div>

                <div className="col-md-5 mb-3">
                    <label htmlFor="complemento" className="form-label">Complemento</label>
                    <input type="text" className="form-control" id="complemento" value={dados.complemento} onChange={handleChange} />
                </div>

                <div className="col-md-4 mb-3">
                    <label htmlFor="bairro" className="form-label">Bairro <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="bairro" value={dados.bairro} onChange={handleChange} required />
                </div>
            </div>

            <div className="row">
                <div className="col-md-8 mb-3">
                    <label htmlFor="cidade" className="form-label">Cidade <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="cidade" value={dados.cidade} onChange={handleChange} required />
                </div>

                <div className="col-md-4 mb-3">
                    <label htmlFor="estado" className="form-label">Estado <span className="text-danger">*</span></label>
                    <select className="form-select" id="estado" value={dados.estado} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {EnumUtils.toSelectOptions(ESTADOS_BRASIL).map((est: any) => (
                            <option key={est.value} value={est.value}>{est.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
});

export default Endereco;
