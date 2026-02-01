import { useState, useEffect, useRef } from 'react';
import Endereco, { EnderecoRef } from '../Endereco';
import { cooperativaService, Cooperativa } from '../../services/cooperativa/cooperativaService';
import { enderecoService } from '../../services/endereco/enderecoService';
import { toast } from 'react-toastify';
import { formatarCNPJ, formatarTelefone, formatarCNAE, formatarNaturezaJuridica } from '../../utils/formatters';

interface ModalCadastroCooperativaProps {
    show: boolean;
    onClose: () => void;
    onSave: () => void;
    cooperativaData?: Cooperativa | null;
}

const ModalCadastroCooperativa = ({ show, onClose, onSave, cooperativaData }: ModalCadastroCooperativaProps) => {
    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [naturezaJuridica, setNaturezaJuridica] = useState('');
    const [cnae, setCnae] = useState('');
    const [nomeResponsavel, setNomeResponsavel] = useState('');
    const [statusCooperativa, setStatusCooperativa] = useState(true);
    const [loading, setLoading] = useState(false);

    const enderecoRef = useRef<EnderecoRef>(null);

    // Bootstrap modal styling support
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
        if (show && cooperativaData) {
            setNomeEmpresa(cooperativaData.nomeEmpresa || cooperativaData.nome || '');
            setNomeFantasia(cooperativaData.nomeFantasia || '');
            setCnpj(cooperativaData.cnpj);
            setTelefone(cooperativaData.telefone || '');
            setEmail(cooperativaData.email || '');
            setNaturezaJuridica(cooperativaData.naturezaJuridica || '');
            setCnae(cooperativaData.cnae || '');
            // Prioritize nomeResponsavel, fallback to responsavel from API
            setNomeResponsavel(cooperativaData.nomeResponsavel || cooperativaData.responsavel || '');
            // Set status, defaulting to true if undefined (though existing should have it, new defaults to true)
            setStatusCooperativa(cooperativaData.statusCooperativa !== undefined ? cooperativaData.statusCooperativa : (cooperativaData.ativo !== undefined ? cooperativaData.ativo : true));

            // Load address after render
            setTimeout(() => {
                if (enderecoRef.current && cooperativaData.endereco) {
                    enderecoRef.current.setDados(cooperativaData.endereco);
                } else if (enderecoRef.current && cooperativaData.enderecoId) {
                    enderecoService.buscarPorId(cooperativaData.enderecoId).then(addr => {
                        if (enderecoRef.current) enderecoRef.current.setDados(addr);
                    });
                }
            }, 100);

        } else if (show) {
            limparFormulario();
        }
    }, [show, cooperativaData]);

    const limparFormulario = () => {
        setNomeEmpresa('');
        setNomeFantasia('');
        setCnpj('');
        setTelefone('');
        setEmail('');
        setNaturezaJuridica('');
        setCnae('');
        setNomeResponsavel('');
        setStatusCooperativa(true);
        if (enderecoRef.current) enderecoRef.current.limpar();
    };

    const handleSalvar = async () => {
        if (!enderecoRef.current?.validar()) {
            toast.warning('Por favor, preencha o endereço.');
            return;
        }

        if (!nomeEmpresa || !cnpj || !nomeResponsavel) {
            toast.warning('Preencha os campos obrigatórios (*).');
            return;
        }

        setLoading(true);
        try {
            // 1. Persist/Update Address
            let enderecoId = cooperativaData?.enderecoId;
            const dadosEndereco = enderecoRef.current.getDados();

            if (!enderecoId || (cooperativaData && cooperativaData.endereco && cooperativaData.endereco.id)) {
                let enderecoResp;
                if (dadosEndereco.id) {
                    enderecoResp = await enderecoService.atualizar(dadosEndereco.id, dadosEndereco);
                } else {
                    enderecoResp = await enderecoService.criar(dadosEndereco);
                }
                enderecoId = enderecoResp.id || undefined;
            } else {
                const enderecoResp = await enderecoService.criar(dadosEndereco);
                enderecoId = enderecoResp.id || undefined;
            }

            const dadosCooperativa: Cooperativa = {
                id: cooperativaData?.id,
                nomeEmpresa,
                nomeFantasia,
                cnpj,
                telefone,
                email,
                naturezaJuridica,
                cnae,
                nomeResponsavel,
                enderecoId,
                statusCooperativa
            };

            if (cooperativaData?.id) {
                await cooperativaService.atualizar(cooperativaData.id, dadosCooperativa);
            } else {
                await cooperativaService.criar(dadosCooperativa);
            }

            onSave();
            onClose();

        } catch (error) {
            console.error(error);
            toast.error('Erro ao salvar cooperativa.');
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
                                <i className="bi bi-building me-2"></i>
                                {cooperativaData ? 'Editar Cooperativa' : 'Cadastrar Cooperativa'}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nome da Cooperativa <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nomeEmpresa}
                                        onChange={e => setNomeEmpresa(e.target.value)}
                                        placeholder="Digite o nome da cooperativa"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nome Fantasia</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nomeFantasia}
                                        onChange={e => setNomeFantasia(e.target.value)}
                                        placeholder="Digite o nome fantasia"
                                    />
                                </div>

                                <Endereco ref={enderecoRef} />

                                <div className="mb-3 mt-3">
                                    <label className="form-label">CNPJ <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={cnpj}
                                        onChange={e => setCnpj(formatarCNPJ(e.target.value))}
                                        placeholder="00.000.000/0000-00"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Telefone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={telefone}
                                        onChange={e => setTelefone(formatarTelefone(e.target.value))}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="email@exemplo.com"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Natureza Jurídica</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={naturezaJuridica}
                                        onChange={e => setNaturezaJuridica(formatarNaturezaJuridica(e.target.value))}
                                        placeholder="000-0"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">CNAE</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={cnae}
                                        onChange={e => setCnae(formatarCNAE(e.target.value))}
                                        placeholder="Código CNAE"
                                    />
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

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                <i className="bi bi-x-lg me-1"></i> Cancelar
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSalvar} disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="bi bi-check-lg me-1"></i>}
                                {cooperativaData ? 'Salvar Alterações' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default ModalCadastroCooperativa;
