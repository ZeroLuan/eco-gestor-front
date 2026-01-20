import { useState, useEffect, useRef } from 'react';
import { TIPOS_RESIDUO, EnumUtils } from '../../utils/constants';
import Endereco, { EnderecoRef } from '../Endereco';
import { pontosColetaService, PontoColeta } from '../../services/pontosColeta/pontosColetaService';
import { cooperativaService, Cooperativa } from '../../services/cooperativa/cooperativaService';
import { enderecoService } from '../../services/endereco/enderecoService';

interface ModalCadastroPontoProps {
    show: boolean;
    onClose: () => void;
    onSave: () => void;
    pontoData?: PontoColeta | null;
}

const ModalCadastroPonto = ({ show, onClose, onSave, pontoData }: ModalCadastroPontoProps) => {
    const [nomePonto, setNomePonto] = useState('');
    const [cooperativaId, setCooperativaId] = useState<number | ''>('');
    const [tipoResiduo, setTipoResiduo] = useState('');
    const [materiaisAceitos, setMateriaisAceitos] = useState<string[]>([]);
    const [ativo, setAtivo] = useState(true);
    const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCooperativas, setLoadingCooperativas] = useState(false);

    const enderecoRef = useRef<EnderecoRef>(null);

    // Bootstrap modal styling support
    useEffect(() => {
        if (show) {
            document.body.classList.add('modal-open');
            carregarCooperativas();
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [show]);

    useEffect(() => {
        if (show && pontoData) {
            setNomePonto(pontoData.nomePonto);
            setCooperativaId(pontoData.cooperativaId || (pontoData.cooperativa ? pontoData.cooperativa.id! : ''));
            setTipoResiduo(pontoData.tipoResiduo);
            setMateriaisAceitos(pontoData.materiaisAceitos || []);
            setAtivo(pontoData.ativo !== false);

            // Load address after render
            setTimeout(() => {
                if (enderecoRef.current && pontoData.endereco) {
                    enderecoRef.current.setDados(pontoData.endereco);
                } else if (enderecoRef.current && pontoData.enderecoId) {
                    // Fetch address if only ID provided
                    enderecoService.buscarPorId(pontoData.enderecoId).then(addr => {
                        if (enderecoRef.current) enderecoRef.current.setDados(addr);
                    });
                }
            }, 100);

        } else if (show) {
            limparFormulario();
        }
    }, [show, pontoData]);

    const limparFormulario = () => {
        setNomePonto('');
        setCooperativaId('');
        setTipoResiduo('');
        setMateriaisAceitos([]);
        setAtivo(true);
        if (enderecoRef.current) enderecoRef.current.limpar();
    };

    const carregarCooperativas = async () => {
        setLoadingCooperativas(true);
        try {
            const response = await cooperativaService.buscarPaginado({ page: 0, size: 1000 });
            setCooperativas(response.content || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingCooperativas(false);
        }
    };

    const handleMaterialChange = (valor: string) => {
        setMateriaisAceitos(prev => {
            if (prev.includes(valor)) {
                return prev.filter(m => m !== valor);
            } else {
                return [...prev, valor];
            }
        });
    };

    const handleSalvar = async () => {
        if (!enderecoRef.current?.validar()) {
            alert('Por favor, preencha o endereço.');
            return;
        }

        if (!nomePonto || !cooperativaId || !tipoResiduo) {
            alert('Preencha os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            // 1. Persist/Update Address
            let enderecoId = pontoData?.enderecoId;
            const dadosEndereco = enderecoRef.current.getDados();

            if (!enderecoId || (pontoData && pontoData.endereco && pontoData.endereco.id)) {
                // Logic: if address has ID, update it. If not, create it.
                // Endereco component usually manages this but let's stick to service
                let enderecoResp;
                if (dadosEndereco.id) {
                    enderecoResp = await enderecoService.atualizar(dadosEndereco.id, dadosEndereco);
                } else {
                    enderecoResp = await enderecoService.criar(dadosEndereco);
                }
                enderecoId = enderecoResp.id || undefined;
            } else {
                // Fallback
                const enderecoResp = await enderecoService.criar(dadosEndereco);
                enderecoId = enderecoResp.id || undefined;
            }

            const dadosPonto: PontoColeta = {
                id: pontoData?.id,
                nomePonto,
                cooperativaId: Number(cooperativaId),
                tipoResiduo,
                materiaisAceitos,
                ativo,
                enderecoId
            };

            if (pontoData?.id) {
                await pontosColetaService.atualizar(pontoData.id, dadosPonto);
            } else {
                await pontosColetaService.criar(dadosPonto);
            }

            onSave();
            onClose();

        } catch (error) {
            console.error(error);
            alert('Erro ao salvar ponto de coleta.');
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-success text-white">
                            <h5 className="modal-title">
                                <i className="bi bi-geo-alt-fill me-2"></i>
                                {pontoData ? 'Editar Ponto de Coleta' : 'Cadastrar Ponto de Coleta'}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nome do Ponto <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nomePonto}
                                        onChange={e => setNomePonto(e.target.value)}
                                        placeholder="Ex: Ecoponto Central"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Cooperativa <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={cooperativaId}
                                        onChange={e => setCooperativaId(Number(e.target.value))}
                                    >
                                        <option value="">Selecione...</option>
                                        {cooperativas.map(coop => (
                                            <option key={coop.id} value={coop.id}>
                                                {coop.nomeEmpresa}
                                            </option>
                                        ))}
                                    </select>
                                    {loadingCooperativas && <small className="text-muted">Carregando cooperativas...</small>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Tipo de Resíduo Principal <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={tipoResiduo}
                                        onChange={e => setTipoResiduo(e.target.value)}
                                    >
                                        <option value="">Selecione...</option>
                                        {EnumUtils.toSelectOptions(TIPOS_RESIDUO).map((tipo: any) => (
                                            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Materiais Aceitos</label>
                                    <div className="border rounded p-3 bg-light">
                                        {EnumUtils.toSelectOptions(TIPOS_RESIDUO).map((tipo: any) => (
                                            <div key={tipo.value} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`mat_${tipo.value}`}
                                                    checked={materiaisAceitos.includes(tipo.value)}
                                                    onChange={() => handleMaterialChange(tipo.value)}
                                                />
                                                <label className="form-check-label" htmlFor={`mat_${tipo.value}`}>
                                                    {tipo.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="pontoAtivo"
                                        checked={ativo}
                                        onChange={e => setAtivo(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="pontoAtivo">
                                        Ponto Ativo
                                    </label>
                                </div>

                                <Endereco ref={enderecoRef} />

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                <i className="bi bi-x-lg me-1"></i> Cancelar
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSalvar} disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="bi bi-check-lg me-1"></i>}
                                {pontoData ? 'Salvar Alterações' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default ModalCadastroPonto;
