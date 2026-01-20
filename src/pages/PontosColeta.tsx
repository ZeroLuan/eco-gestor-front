import { useState, useEffect } from 'react';
import { pontosColetaService, PontoColeta, PontoColetaFilters } from '../services/pontosColeta/pontosColetaService';
import { TIPOS_RESIDUO, EnumUtils } from '../utils/constants';
import Pagination from '../components/Pagination';
import ModalCadastroPonto from '../components/ponto-coleta/ModalCadastroPonto';

const PontosColeta = () => {
    const [pontos, setPontos] = useState<PontoColeta[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // Filtros
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroEndereco, setFiltroEndereco] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<PontoColeta | null>(null);

    useEffect(() => {
        carregarPontos(page);
    }, [page]);

    const carregarPontos = async (pagina: number) => {
        setLoading(true);
        try {
            // Check if we have filters active
            const hasFilters = filtroNome || filtroTipo || filtroEndereco;
            let response;

            if (hasFilters) {
                const filtros: PontoColetaFilters = {
                    nomePonto: filtroNome || undefined,
                    tipoResiduo: filtroTipo || undefined,
                    enderecoNome: filtroEndereco || undefined
                };
                response = await pontosColetaService.buscarComFiltros(filtros, { page: pagina, size: 10, sort: 'id,desc' });
            } else {
                response = await pontosColetaService.listarTodos({ page: pagina, size: 10, sort: 'id,desc' });
            }

            if (response && response.content) {
                setPontos(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } else {
                setPontos([]);
                setTotalPages(0);
                setTotalElements(0);
            }

        } catch (error) {
            console.error(error);
            setPontos([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePesquisar = () => {
        setPage(0); // Reset page to 0
        carregarPontos(0);
    };

    const handleLimpar = () => {
        setFiltroNome('');
        setFiltroTipo('');
        setFiltroEndereco('');
        setPage(0);

        // Need to run load immediately after clearing state, usually better via effect or direct call with cleared params
        // I'll force call
        setLoading(true);
        pontosColetaService.listarTodos({ page: 0, size: 10, sort: 'id,desc' })
            .then(response => {
                if (response && response.content) {
                    setPontos(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleNovo = () => {
        setModalData(null);
        setShowModal(true);
    };

    const handleEditar = (ponto: PontoColeta) => {
        setModalData(ponto);
        setShowModal(true);
    };

    const handleExcluir = async (id: number, nome: string) => {
        if (confirm(`Tem certeza que deseja excluir o ponto de coleta "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
            try {
                await pontosColetaService.remover(id);
                alert('Ponto de coleta excluído com sucesso!');
                carregarPontos(page);
            } catch (error) {
                alert('Erro ao excluir ponto de coleta.');
            }
        }
    };

    const renderEndereco = (ponto: PontoColeta) => {
        if (typeof ponto.endereco === 'string') return ponto.endereco;
        if (ponto.endereco) {
            const { logradouro, numero, bairro, cidade, estado } = ponto.endereco;
            return `${logradouro || ''} ${numero || ''}, ${bairro || ''} - ${cidade || ''}/${estado || ''}`;
        }
        return 'Endereço não informado';
    };

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center mb-3">
                <i className="bi bi-geo-alt-fill text-primary fs-2 me-2"></i>
                <h2 className="mb-0">Ponto de Coleta</h2>
            </div>

            {/* Filtros */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row gy-3">
                        <div className="col-md-4">
                            <label className="form-label small">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite aqui..."
                                value={filtroNome}
                                onChange={e => setFiltroNome(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
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
                        <div className="col-md-4">
                            <label className="form-label small">Endereço</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por endereço..."
                                value={filtroEndereco}
                                onChange={e => setFiltroEndereco(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-between">
                        <button className="btn btn-success" onClick={handleNovo}>
                            <i className="bi bi-plus-lg me-1"></i>
                            Novo Ponto de Coleta
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
                                    <th scope="col">Endereço</th>
                                    <th scope="col">Tipo de Resíduo</th>
                                    <th scope="col">Materiais Aceitos</th>
                                    <th scope="col">Ponto Ativo</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center">Carregando...</td></tr>
                                ) : pontos.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center text-muted">Nenhum registro encontrado</td></tr>
                                ) : (
                                    pontos.map(ponto => (
                                        <tr key={ponto.id}>
                                            <td>{ponto.nomePonto || 'Sem nome'}</td>
                                            <td><small>{renderEndereco(ponto)}</small></td>
                                            <td>
                                                <span className={`badge bg-${EnumUtils.getCorTipoResiduo(ponto.tipoResiduo)}`}>
                                                    {EnumUtils.formatarTipoResiduo(ponto.tipoResiduo)}
                                                </span>
                                            </td>
                                            <td>
                                                {ponto.materiaisAceitos && ponto.materiaisAceitos.length > 0 ? (
                                                    ponto.materiaisAceitos.map((mat: any, idx) => {
                                                        const tipo = typeof mat === 'string' ? mat : (mat.tipo || mat);
                                                        return (
                                                            <span key={idx} className={`badge bg-${EnumUtils.getCorTipoResiduo(tipo)} me-1`}>
                                                                {EnumUtils.formatarTipoResiduo(tipo)}
                                                            </span>
                                                        );
                                                    })
                                                ) : <span className="text-muted">Nenhum</span>}
                                            </td>
                                            <td className="text-center">
                                                <input type="checkbox" className="form-check-input" checked={ponto.ativo} disabled readOnly />
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditar(ponto)}>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluir(ponto.id!, ponto.nomePonto)}>
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

            <ModalCadastroPonto
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={() => carregarPontos(page)}
                pontoData={modalData}
            />
        </div>
    );
};

export default PontosColeta;
