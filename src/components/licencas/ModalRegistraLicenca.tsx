import { useState, useEffect } from 'react';
import { licencasService, LicencaAmbiental } from '../../services/licencas/licencasService';
import { cooperativaService, Cooperativa } from '../../services/cooperativa/cooperativaService';
import { TIPOS_LICENCA, STATUS_LICENCA, EnumUtils } from '../../utils/constants';
import { toast } from 'react-toastify';

interface ModalRegistraLicencaProps {
    show: boolean;
    onClose: () => void;
    onSave: () => void;
    licencaData: LicencaAmbiental | null; // Data for editing
}

const ModalRegistraLicenca = ({ show, onClose, onSave, licencaData }: ModalRegistraLicencaProps) => {
    // Initial State
    const initialLicencaState: LicencaAmbiental = {
        numeroLicenca: '',
        tipoLicenca: '',
        statusLicenca: 'ATIVA',
        dataEmissao: '',
        dataValidade: '',
        cooperativaId: undefined
    };

    const [formData, setFormData] = useState<LicencaAmbiental>(initialLicencaState);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    // Cooperativas selection
    const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
    const [filtroCooperativa, setFiltroCooperativa] = useState('');

    useEffect(() => {
        if (show) {
            // Load cooperatives
            cooperativaService.listarListaCompleta()
                .then(data => {
                    const normalizedData = Array.isArray(data) ? data : (data as any).content || [];
                    setCooperativas(normalizedData);
                })
                .catch(err => console.error("Erro ao carregar cooperativas", err));

            setFiltroCooperativa('');

            if (licencaData) {
                setFormData({
                    ...licencaData,
                    // Ensure dates are in YYYY-MM-DD for input[type=date]
                    dataEmissao: licencaData.dataEmissao ? licencaData.dataEmissao.split('T')[0] : '',
                    dataValidade: licencaData.dataValidade ? licencaData.dataValidade.split('T')[0] : ''
                });
            } else {
                setFormData(initialLicencaState);
            }
            setErro('');
        }
    }, [show, licencaData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        if (!formData.cooperativaId) {
            setErro('Selecione uma cooperativa.');
            setLoading(false);
            return;
        }

        try {
            // Clean payload - only send what backend expects in LicencaAmbientalRequest
            const payload: any = {
                numeroLicenca: formData.numeroLicenca,
                tipoLicenca: formData.tipoLicenca,
                statusLicenca: formData.statusLicenca,
                cooperativaId: Number(formData.cooperativaId),
                dataEmissao: formData.dataEmissao ? `${formData.dataEmissao}T00:00:00` : undefined,
                dataValidade: formData.dataValidade ? `${formData.dataValidade}T00:00:00` : undefined,
            };

            // Remove undefined fields
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined) {
                    delete payload[key];
                }
            });

            if (licencaData?.id) {
                await licencasService.atualizar(licencaData.id, payload);
                toast.success('Licença atualizada com sucesso!');
            } else {
                await licencasService.criar(payload);
                toast.success('Licença cadastrada com sucesso!');
            }
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            setErro('Ocorreu um erro ao salvar a licença. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    const filteredCooperativas = cooperativas.filter(c => {
        const nome = c.nome || c.nomeEmpresa || '';
        return nome.toLowerCase().includes(filtroCooperativa.toLowerCase());
    });

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-success text-white">
                        <h5 className="modal-title">
                            <i className="bi bi-file-earmark-text-fill me-2"></i>
                            {licencaData ? 'Editar Licença' : 'Nova Licença'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {erro && <div className="alert alert-danger">{erro}</div>}

                            <div className="mb-3">
                                <label className="form-label">Cooperativa</label>
                                <div className="input-group mb-2">
                                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Pesquisar cooperativa..."
                                        value={filtroCooperativa}
                                        onChange={e => setFiltroCooperativa(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="form-select"
                                    name="cooperativaId"
                                    value={formData.cooperativaId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione uma cooperativa...</option>
                                    {filteredCooperativas.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.nome || c.nomeEmpresa} {c.cnpj ? `- ${c.cnpj}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Número da Licença</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="numeroLicenca"
                                    value={formData.numeroLicenca}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Tipo</label>
                                <select
                                    className="form-select"
                                    name="tipoLicenca"
                                    value={formData.tipoLicenca}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {EnumUtils.toSelectOptions(TIPOS_LICENCA).map((t: any) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Data de Emissão</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="dataEmissao"
                                    value={formData.dataEmissao}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Data de Validade</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="dataValidade"
                                    value={formData.dataValidade}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    name="statusLicenca"
                                    value={formData.statusLicenca}
                                    onChange={handleChange}
                                    required
                                >
                                    {EnumUtils.toSelectOptions(STATUS_LICENCA).map((s: any) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalRegistraLicenca;
