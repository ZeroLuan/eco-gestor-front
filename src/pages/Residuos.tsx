import { useState, useEffect } from 'react';
import { residuosService, Residuo, ResiduosFilters } from '../services/residuos/residuosService';
import { TIPOS_RESIDUO, EnumUtils } from '../utils/constants';
import Pagination from '../components/Pagination';
import ModalRegistraResiduo from '../components/residuos/ModalRegistraResiduo';
import { toast } from 'react-toastify';

const Residuos = () => {
    const [residuos, setResiduos] = useState<Residuo[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // Filtros
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroResponsavel, setFiltroResponsavel] = useState('');
    const [filtroDataInicio, setFiltroDataInicio] = useState('');
    const [filtroDataFim, setFiltroDataFim] = useState('');
    const [filtroLocal, setFiltroLocal] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<Residuo | null>(null);

    useEffect(() => {
        carregarResiduos(page);
    }, [page]);

    const carregarResiduos = async (pagina: number) => {
        setLoading(true);
        try {
            const hasFilters = filtroTipo || filtroResponsavel || filtroDataInicio || filtroDataFim || filtroLocal;
            let response;

            if (hasFilters) {
                const filtros: ResiduosFilters = {
                    tipoResiduo: filtroTipo || undefined,
                    nomeResponsavel: filtroResponsavel || undefined,
                    dataInicio: filtroDataInicio || undefined,
                    dataFim: filtroDataFim || undefined,
                    local: filtroLocal || undefined
                };
                response = await residuosService.buscarComFiltros(filtros, { page: pagina, size: 10, sort: 'id,desc' });
            } else {
                response = await residuosService.listarTodos({ page: pagina, size: 10, sort: 'id,desc' });
            }

            if (response && response.content) {
                setResiduos(response.content);
                setTotalPages(response.page.totalPages);
                setTotalElements(response.page.totalElements);
            } else {
                setResiduos([]);
                setTotalPages(0);
                setTotalElements(0);
            }

        } catch (error) {
            console.error(error);
            setResiduos([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePesquisar = () => {
        setPage(0);
        carregarResiduos(0);
    };

    const handleLimpar = () => {
        setFiltroTipo('');
        setFiltroResponsavel('');
        setFiltroDataInicio('');
        setFiltroDataFim('');
        setFiltroLocal('');
        setPage(0);

        setLoading(true);
        residuosService.listarTodos({ page: 0, size: 10, sort: 'id,desc' })
            .then(response => {
                if (response && response.content) {
                    setResiduos(response.content);
                    setTotalPages(response.page.totalPages);
                    setTotalElements(response.page.totalElements);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleNovo = () => {
        setModalData(null);
        setShowModal(true);
    };

    const handleEditar = (residuo: Residuo) => { // Must fetch details because table might not have everything?
        // JS implementation fetched details: await residuosService.buscarPorId(id);
        // I should do the same to be safe, especially for `idPontoColeta` if not in list dto.
        setLoading(true);
        residuosService.buscarPorId(residuo.id!)
            .then(data => {
                setModalData(data);
                setShowModal(true);
            })
            .catch(err => {
                console.error(err);
                toast.error('Erro ao carregar dados do resíduo.');
            })
            .finally(() => setLoading(false));
    };

    const handleExcluir = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este registro?\n\nEsta ação não pode ser desfeita.')) {
            try {
                await residuosService.remover(id);
                toast.success('Resíduo excluído com sucesso!');
                carregarResiduos(page);
            } catch (error) {
                toast.error('Erro ao excluir resíduo.');
            }
        }
    };

    const formatarData = (isoDate?: string) => {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        return d.toLocaleDateString('pt-BR');
    };

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center mb-3">
                <i className="bi bi-recycle text-success fs-2 me-2"></i>
                <h2 className="mb-0">Resíduos</h2>
            </div>

            {/* Filtros */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row gy-3">
                        <div className="col-md-3">
                            <label className="form-label small">Tipo de Resíduo</label>
                            <select
                                className="form-select"
                                value={filtroTipo}
                                onChange={e => setFiltroTipo(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {EnumUtils.toSelectOptions(TIPOS_RESIDUO).map((t: any) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small">Responsável</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nome..."
                                value={filtroResponsavel}
                                onChange={e => setFiltroResponsavel(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small">Período (De)</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filtroDataInicio}
                                onChange={e => setFiltroDataInicio(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small">Período (Até)</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filtroDataFim}
                                onChange={e => setFiltroDataFim(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Local</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o local..."
                                value={filtroLocal}
                                onChange={e => setFiltroLocal(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-between">
                        <button className="btn btn-success" onClick={handleNovo}>
                            <i className="bi bi-plus-lg me-1"></i>
                            Registrar Coleta
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
                                    <th scope="col">Data</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Quantidade (kg)</th>
                                    <th scope="col">Local</th>
                                    <th scope="col">Responsável</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center">Carregando...</td></tr>
                                ) : residuos.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center text-muted">Nenhum registro encontrado</td></tr>
                                ) : (
                                    residuos.map(residuo => (
                                        <tr key={residuo.id}>
                                            <td>{formatarData(residuo.dataColeta || residuo.dataInicio)}</td>
                                            <td>
                                                <span className={`badge bg-${EnumUtils.getCorTipoResiduo(residuo.tipoResiduo)}`}>
                                                    {EnumUtils.formatarTipoResiduo(residuo.tipoResiduo)}
                                                </span>
                                            </td>
                                            <td>{residuo.peso} kg</td>
                                            <td>{residuo.local}</td>
                                            <td>{residuo.nomeResponsavel}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(residuo)}>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluir(residuo.id!)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
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

            <ModalRegistraResiduo
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={() => carregarResiduos(page)}
                residuoData={modalData}
            />
        </div>
    );
};

export default Residuos;
