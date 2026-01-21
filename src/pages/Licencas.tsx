import { useState, useEffect } from 'react';
import { licencasService, LicencaAmbiental, LicencaAmbientalFilters } from '../services/licencas/licencasService';
import { TIPOS_LICENCA, STATUS_LICENCA, EnumUtils } from '../utils/constants';
import Pagination from '../components/Pagination';
import ModalRegistraLicenca from '../components/licencas/ModalRegistraLicenca';
import { toast } from 'react-toastify';

const Licencas = () => {
    const [licencas, setLicencas] = useState<LicencaAmbiental[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // Filtros
    const [filtroNumero, setFiltroNumero] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroValidade, setFiltroValidade] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<LicencaAmbiental | null>(null);

    useEffect(() => {
        carregarLicencas(page);
    }, [page]);

    const carregarLicencas = async (pagina: number) => {
        setLoading(true);
        try {
            const hasFilters = filtroNumero || filtroTipo || filtroStatus || filtroValidade;
            let response;

            // Note: Backend might need datetime for validity if filter is on exact date, 
            // but usually filters are ranges or date-only. 
            // The provided backend code uses `LicencaAmbientalRequest` object for filter body.
            // Assuming string/ISO format works for LocalDateTime deserialization in basic scenarios.

            if (hasFilters) {
                const filtros: LicencaAmbientalFilters = {
                    numeroLicenca: filtroNumero || undefined,
                    tipoLicenca: filtroTipo || undefined,
                    statusLicenca: filtroStatus || undefined,
                    dataValidade: filtroValidade ? `${filtroValidade}T00:00:00` : undefined // Adjust if needed
                };
                response = await licencasService.buscarComFiltros(filtros, { page: pagina, size: 10, sort: 'id,desc' });
            } else {
                response = await licencasService.listarTodos({ page: pagina, size: 10, sort: 'id,desc' });
            }

            if (response && response.content) {
                setLicencas(response.content);
                const pageInfo = response.page ? response.page : response;
                setTotalPages(pageInfo.totalPages);
                setTotalElements(pageInfo.totalElements);
            } else {
                setLicencas([]);
                setTotalPages(0);
                setTotalElements(0);
            }

        } catch (error) {
            console.error(error);
            setLicencas([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePesquisar = () => {
        setPage(0);
        carregarLicencas(0);
    };

    const handleLimpar = () => {
        setFiltroNumero('');
        setFiltroTipo('');
        setFiltroStatus('');
        setFiltroValidade('');
        setPage(0);

        setLoading(true);
        licencasService.listarTodos({ page: 0, size: 10, sort: 'id,desc' })
            .then(response => {
                if (response && response.content) {
                    setLicencas(response.content);
                    const pageInfo = response.page ? response.page : response;
                    setTotalPages(pageInfo.totalPages);
                    setTotalElements(pageInfo.totalElements);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleNovo = () => {
        setModalData(null);
        setShowModal(true);
    };

    const handleEditar = (licenca: LicencaAmbiental) => {
        setModalData(licenca);
        setShowModal(true);
    };

    const handleExcluir = async (id: number, numero: string) => {
        if (confirm(`Tem certeza que deseja excluir a licença "${numero}"?\n\nEsta ação não pode ser desfeita.`)) {
            try {
                await licencasService.remover(id);
                toast.success('Licença excluída com sucesso!');
                carregarLicencas(page);
            } catch (error) {
                toast.error('Erro ao excluir licença.');
            }
        }
    };

    const formatarData = (isoDate?: string) => {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        return d.toLocaleDateString('pt-BR');
    };

    const getStatusInfo = (status: string) => {
        const s = EnumUtils.getByValue(STATUS_LICENCA, status);
        return s ? s : { label: status, cor: 'secondary' };
    };

    const getTipoLabel = (tipo: string) => {
        const t = EnumUtils.getByValue(TIPOS_LICENCA, tipo);
        return t ? t.label : tipo;
    };

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center mb-3">
                <i className="bi bi-file-earmark-text-fill text-success fs-2 me-2"></i>
                <h2 className="mb-0">Licenças Ambientais</h2>
            </div>

            {/* Filtros */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row gy-3">
                        <div className="col-md-3">
                            <label className="form-label small">Nº Licença</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o número..."
                                value={filtroNumero}
                                onChange={e => setFiltroNumero(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Tipo</label>
                            <select
                                className="form-select"
                                value={filtroTipo}
                                onChange={e => setFiltroTipo(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {EnumUtils.toSelectOptions(TIPOS_LICENCA).map((t: any) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Status</label>
                            <select
                                className="form-select"
                                value={filtroStatus}
                                onChange={e => setFiltroStatus(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {EnumUtils.toSelectOptions(STATUS_LICENCA).map((s: any) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Data Vencimento</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filtroValidade}
                                onChange={e => setFiltroValidade(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-between">
                        <button className="btn btn-success" onClick={handleNovo}>
                            <i className="bi bi-plus-lg me-1"></i> Nova Licença
                        </button>
                        <div>
                            <button className="btn btn-secondary me-2" onClick={handleLimpar}>
                                <i className="bi bi-x-lg me-1"></i> Limpar
                            </button>
                            <button className="btn btn-primary" onClick={handlePesquisar}>
                                <i className="bi bi-search me-1"></i> Pesquisar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">Nº Licença</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Data Emissão</th>
                                    <th scope="col">Validade</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" style={{ width: '100px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center">Carregando...</td></tr>
                                ) : licencas.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center text-muted">Nenhum registro encontrado</td></tr>
                                ) : (
                                    licencas.map(item => {
                                        const statusInfo = getStatusInfo(item.statusLicenca);
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.numeroLicenca}</td>
                                                <td><span className="badge bg-secondary">{getTipoLabel(item.tipoLicenca)}</span></td>
                                                <td>{formatarData(item.dataEmissao)}</td>
                                                <td>{formatarData(item.dataValidade)}</td>
                                                <td>
                                                    <span className={`badge bg-${statusInfo.cor}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="text-nowrap">
                                                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(item)}>
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluir(item.id!, item.numeroLicenca)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Paginação */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="text-muted">Total de registros: {totalElements}</div>
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>

            <ModalRegistraLicenca
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={() => carregarLicencas(page)}
                licencaData={modalData}
            />
        </div>
    );
};

export default Licencas;
