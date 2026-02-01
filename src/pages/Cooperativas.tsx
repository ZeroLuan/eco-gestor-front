import { useState, useEffect } from 'react';
import { cooperativaService, Cooperativa, CooperativaFilters } from '../services/cooperativa/cooperativaService';
import Pagination from '../components/Pagination';
import ModalCadastroCooperativa from '../components/cooperativa/ModalCadastroCooperativa';
import { toast } from 'react-toastify';
import { formatarCNPJ, formatarTelefone, apenasNumeros } from '../utils/formatters';

const Cooperativas = () => {
    const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // Filtros
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroCnpj, setFiltroCnpj] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroTelefone, setFiltroTelefone] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<Cooperativa | null>(null);

    useEffect(() => {
        carregarCooperativas(page);
    }, [page]);

    const carregarCooperativas = async (pagina: number) => {
        setLoading(true);
        try {
            const hasFilters = filtroNome || filtroCnpj || filtroStatus || filtroTelefone;
            let response;

            if (hasFilters) {
                const filtros: CooperativaFilters = {
                    nomeEmpresa: filtroNome || undefined,
                    cnpj: filtroCnpj ? apenasNumeros(filtroCnpj) : undefined,
                    telefone: filtroTelefone ? apenasNumeros(filtroTelefone) : undefined,
                    statusCooperativa: filtroStatus === 'Ativa' ? true : filtroStatus === 'Inativa' ? false : undefined
                };
                response = await cooperativaService.buscarComFiltros(filtros, { page: pagina, size: 10, sort: 'id,desc' });
            } else {
                response = await cooperativaService.listarTodos({ page: pagina, size: 10, sort: 'id,desc' });
            }

            if (response && response.content) {
                setCooperativas(response.content);
                // Check if pagination info is in 'page' wrapper (standard) or partial (legacy/flat)
                const pageInfo = response.page ? response.page : response;
                setTotalPages(pageInfo.totalPages);
                setTotalElements(pageInfo.totalElements);
            } else {
                setCooperativas([]);
                setTotalPages(0);
                setTotalElements(0);
            }

        } catch (error) {
            console.error(error);
            setCooperativas([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePesquisar = () => {
        setPage(0);
        carregarCooperativas(0);
    };

    const handleLimpar = () => {
        setFiltroNome('');
        setFiltroCnpj('');
        setFiltroStatus('');
        setFiltroTelefone('');
        setPage(0);

        setLoading(true);
        cooperativaService.listarTodos({ page: 0, size: 10, sort: 'id,desc' })
            .then(response => {
                if (response && response.content) {
                    setCooperativas(response.content);
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

    const handleEditar = (cooperativa: Cooperativa) => {
        setModalData(cooperativa);
        setShowModal(true);
    };

    const handleExcluir = async (id: number, nome: string) => {
        if (confirm(`Tem certeza que deseja excluir a cooperativa "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
            try {
                await cooperativaService.remover(id);
                toast.success('Cooperativa excluída com sucesso!');
                carregarCooperativas(page);
            } catch (error) {
                toast.error('Erro ao excluir cooperativa.');
            }
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center mb-3">
                <i className="bi bi-people-fill text-info fs-2 me-2"></i>
                <h2 className="mb-0">Cooperativas</h2>
            </div>

            {/* Filtros */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row gy-3">
                        <div className="col-md-3">
                            <label className="form-label small">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o nome..."
                                value={filtroNome}
                                onChange={e => setFiltroNome(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">CNPJ</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="00.000.000/0000-00"
                                value={filtroCnpj}
                                onChange={e => setFiltroCnpj(formatarCNPJ(e.target.value))}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Status</label>
                            <select
                                className="form-select"
                                value={filtroStatus}
                                onChange={e => setFiltroStatus(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="Ativa">Ativa</option>
                                <option value="Inativa">Inativa</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Telefone</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="(00) 00000-0000"
                                value={filtroTelefone}
                                onChange={e => setFiltroTelefone(formatarTelefone(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-between">
                        <button className="btn btn-success" onClick={handleNovo}>
                            <i className="bi bi-plus-lg me-1"></i>
                            Nova Cooperativa
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
                                    <th scope="col">Nome</th>
                                    <th scope="col">CNPJ</th>
                                    <th scope="col">Responsável</th>
                                    <th scope="col">Telefone</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" style={{ width: '100px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center">Carregando...</td></tr>
                                ) : cooperativas.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center text-muted">Nenhum registro encontrado</td></tr>
                                ) : (
                                    cooperativas.map(cooperativa => (
                                        <tr key={cooperativa.id}>
                                            <td>{cooperativa.nomeEmpresa || cooperativa.nome || 'Sem nome'}</td>
                                            <td>{cooperativa.cnpj}</td>
                                            <td>{cooperativa.nomeResponsavel || cooperativa.responsavel || '-'}</td>
                                            <td>{cooperativa.telefone || '-'}</td>
                                            <td>
                                                {cooperativa.statusCooperativa ? (
                                                    <span className="badge bg-success">Ativa</span>
                                                ) : (
                                                    <span className="badge bg-danger">Inativa</span>
                                                )}
                                            </td>
                                            <td className="text-nowrap">
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(cooperativa)}>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluir(cooperativa.id!, cooperativa.nomeEmpresa || cooperativa.nome || '')}>
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

            <ModalCadastroCooperativa
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={() => carregarCooperativas(page)}
                cooperativaData={modalData}
            />
        </div >
    );
};

export default Cooperativas;
