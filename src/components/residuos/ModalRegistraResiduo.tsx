import { useState, useEffect } from 'react';
import { residuosService, Residuo } from '../../services/residuos/residuosService';
import { pontosColetaService, PontoColeta } from '../../services/pontosColeta/pontosColetaService';
import { TIPOS_RESIDUO, EnumUtils } from '../../utils/constants';

interface ModalRegistraResiduoProps {
    show: boolean;
    onClose: () => void;
    onSave: () => void;
    residuoData?: Residuo | null;
}

const ModalRegistraResiduo = ({ show, onClose, onSave, residuoData }: ModalRegistraResiduoProps) => {
    const [tipoResiduo, setTipoResiduo] = useState('');
    const [peso, setPeso] = useState('');
    const [idPontoColeta, setIdPontoColeta] = useState('');
    const [nomeResponsavel, setNomeResponsavel] = useState('');
    const [dataColeta, setDataColeta] = useState('');

    const [pontosLocais, setPontosLocais] = useState<PontoColeta[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [show]);

    useEffect(() => {
        if (show) {
            if (residuoData) {
                setTipoResiduo(residuoData.tipoResiduo || '');
                setPeso(residuoData.peso ? residuoData.peso.toString() : '');
                setIdPontoColeta(residuoData.idPontoColeta ? residuoData.idPontoColeta.toString() : '');
                setNomeResponsavel(residuoData.nomeResponsavel || residuoData.responsavel || '');
                setDataColeta(residuoData.dataColeta ? residuoData.dataColeta.split('T')[0] : '');

                // If type is present, load points
                if (residuoData.tipoResiduo) {
                    carregarPontos(residuoData.tipoResiduo);
                }
            } else {
                limparFormulario();
            }
        }
    }, [show, residuoData]);

    const limparFormulario = () => {
        setTipoResiduo('');
        setPeso('');
        setIdPontoColeta('');
        setNomeResponsavel('');
        setDataColeta('');
        setPontosLocais([]);
    };

    const handleTipoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const tipo = e.target.value;
        setTipoResiduo(tipo);
        setIdPontoColeta(''); // Clear selection
        if (tipo) {
            await carregarPontos(tipo);
        } else {
            setPontosLocais([]);
        }
    };

    const carregarPontos = async (tipo: string) => {
        try {
            const pontos = await pontosColetaService.buscarPorTipoResiduo(tipo);
            setPontosLocais(pontos);
        } catch (error) {
            console.error(error);
            setPontosLocais([]);
        }
    };

    const handleSalvar = async () => {
        if (!tipoResiduo || !peso || !idPontoColeta || !nomeResponsavel || !dataColeta) {
            alert('Preencha todos os campos obrigatórios (*).');
            return;
        }

        setLoading(true);
        try {
            const dados: Residuo = {
                id: residuoData?.id,
                tipoResiduo,
                peso: parseFloat(peso),
                idPontoColeta: Number(idPontoColeta),
                nomeResponsavel,
                dataColeta
            };

            if (residuoData?.id) {
                await residuosService.atualizar(residuoData.id, dados);
            } else {
                await residuosService.criar(dados);
            }

            onSave();
            onClose();

        } catch (error) {
            console.error(error);
            alert('Erro ao salvar registro de coleta.');
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
                                <i className="bi bi-recycle me-2"></i>
                                {residuoData ? 'Editar Coleta' : 'Registrar Coleta'}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Tipo de Resíduo <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={tipoResiduo}
                                        onChange={handleTipoChange}
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        {EnumUtils.toSelectOptions(TIPOS_RESIDUO).map((t: any) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Quantidade (kg) <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={peso}
                                        onChange={e => setPeso(e.target.value)}
                                        placeholder="Ex: 50"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Local / Ponto de Coleta <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={idPontoColeta}
                                        onChange={e => setIdPontoColeta(e.target.value)}
                                        required
                                        disabled={!tipoResiduo}
                                    >
                                        <option value="">Selecione...</option>
                                        {pontosLocais.map(p => (
                                            <option key={p.id} value={p.id}>{p.nomePonto}</option>
                                        ))}
                                    </select>
                                    {!tipoResiduo && <small className="text-muted">Selecione o tipo de resíduo primeiro.</small>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Responsável <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nomeResponsavel}
                                        onChange={e => setNomeResponsavel(e.target.value)}
                                        placeholder="Nome do responsável"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Data da Coleta <span className="text-danger">*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dataColeta}
                                        onChange={e => setDataColeta(e.target.value)}
                                        required
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                <i className="bi bi-x-lg me-1"></i> Cancelar
                            </button>
                            <button type="button" className="btn btn-success" onClick={handleSalvar} disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="bi bi-check-lg me-1"></i>}
                                {residuoData ? 'Salvar Alterações' : 'Registrar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default ModalRegistraResiduo;
