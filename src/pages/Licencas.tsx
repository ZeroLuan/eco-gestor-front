import { useState } from 'react';

// Dados de exemplo (Mock)
const dadosIniciais = [
    {
        id: 1,
        empresa: "Empresa ABC Ltda",
        tipo: "LO",
        numero: "001/2024",
        emissao: "2024-01-15",
        validade: "2027-01-15",
        status: "Ativa",
    },
    {
        id: 2,
        empresa: "Indústria XYZ S.A.",
        tipo: "LI",
        numero: "002/2024",
        emissao: "2024-03-10",
        validade: "2026-03-10",
        status: "Ativa",
    },
    {
        id: 3,
        empresa: "Cooperativa Verde",
        tipo: "LP",
        numero: "003/2023",
        emissao: "2023-06-20",
        validade: "2024-06-20",
        status: "Vencida",
    },
    {
        id: 4,
        empresa: "EcoTech Solutions",
        tipo: "LO",
        numero: "004/2024",
        emissao: "2024-09-05",
        validade: "2029-09-05",
        status: "Ativa",
    },
    {
        id: 5,
        empresa: "Reciclagem Brasil",
        tipo: "LI",
        numero: "005/2024",
        emissao: "2024-11-01",
        validade: "2025-11-01",
        status: "Pendente",
    },
];

const Licencas = () => {
    const [licencas, setLicencas] = useState(dadosIniciais);

    // Filtros
    const [filtroEmpresa, setFiltroEmpresa] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroVencimento, setFiltroVencimento] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');

    const handlePesquisar = () => {
        const filtrados = dadosIniciais.filter(item => {
            const matchEmpresa = filtroEmpresa ? item.empresa.toLowerCase().includes(filtroEmpresa.toLowerCase()) : true;
            const matchStatus = filtroStatus ? item.status === filtroStatus : true;
            const matchVencimento = filtroVencimento ? item.validade === filtroVencimento : true;
            const matchTipo = filtroTipo ? item.tipo === filtroTipo : true;
            return matchEmpresa && matchStatus && matchVencimento && matchTipo;
        });
        setLicencas(filtrados.length > 0 ? filtrados : dadosIniciais); // Fallback logic from JS
        if (filtrados.length === 0) alert('Filtro não retornou resultados. Mostrando todos...');
    };

    const handleLimpar = () => {
        setFiltroEmpresa('');
        setFiltroStatus('');
        setFiltroVencimento('');
        setFiltroTipo('');
        setLicencas(dadosIniciais);
    };

    const handleNovo = () => {
        alert('Funcionalidade de cadastro simulada.');
        // Simple mock add
        const nova = {
            id: licencas.length + 1,
            empresa: "Nova Empresa Mock",
            tipo: "LO",
            numero: `00${licencas.length + 1}/2024`,
            emissao: new Date().toISOString().split('T')[0],
            validade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            status: "Ativa"
        };
        setLicencas([...licencas, nova]);
    };

    const formatarData = (isoDate: string) => {
        if (!isoDate) return "";
        const parts = isoDate.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const getStatusBadge = (status: string) => {
        if (status === 'Ativa') return 'success';
        if (status === 'Vencida') return 'danger';
        return 'warning';
    };

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center mb-3">
                <i className="bi bi-file-earmark-text-fill text-success fs-2 me-2"></i>
                <h2 className="mb-0">Licenças Ambientais</h2>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row gy-3">
                        <div className="col-md-3">
                            <label className="form-label small">Empresa</label>
                            <input type="text" className="form-control" placeholder="Digite o nome..." value={filtroEmpresa} onChange={e => setFiltroEmpresa(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Status</label>
                            <select className="form-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                                <option value="">Selecione...</option>
                                <option value="Ativa">Ativa</option>
                                <option value="Vencida">Vencida</option>
                                <option value="Pendente">Pendente</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Data Vencimento</label>
                            <input type="date" className="form-control" value={filtroVencimento} onChange={e => setFiltroVencimento(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Tipo</label>
                            <select className="form-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                                <option value="">Selecione...</option>
                                <option value="LP">LP - Licença Prévia</option>
                                <option value="LI">LI - Licença de Instalação</option>
                                <option value="LO">LO - Licença de Operação</option>
                            </select>
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

            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle">
                            <thead>
                                <tr>
                                    <th scope="col">Empresa</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Nº Licença</th>
                                    <th scope="col">Data Emissão</th>
                                    <th scope="col">Validade</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {licencas.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center text-muted">Nenhum registro encontrado</td></tr>
                                ) : (
                                    licencas.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.empresa}</td>
                                            <td><span className="badge bg-info">{item.tipo}</span></td>
                                            <td>{item.numero}</td>
                                            <td>{formatarData(item.emissao)}</td>
                                            <td>{formatarData(item.validade)}</td>
                                            <td><span className={`badge bg-${getStatusBadge(item.status)}`}>{item.status}</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => alert(`Editar ID: ${item.id}`)}><i className="bi bi-pencil"></i></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => alert(`Excluir ID: ${item.id}`)}><i className="bi bi-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="text-muted">Total de registros: {licencas.length}</div>
                <nav>
                    <ul className="pagination justify-content-end mb-0">
                        <li className="page-item disabled"><a className="page-link" href="#">Anterior</a></li>
                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">Próxima</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Licencas;
