import { NavLink } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    return (
        <>
            <aside className={`sidebar ${isOpen ? 'show' : ''}`} id="sidebar">
                <div className="sidebar-content">

                    <div className="sidebar-header">
                        <div className="logo-container">
                            <i className="bi bi-leaf-fill text-success fs-2"></i>
                            <div className="logo-text">
                                <h5 className="mb-0 fw-bold">EcoGestor</h5>
                                <small className="text-muted">Irecê - BA</small>
                            </div>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <h6 className="sidebar-heading">Menu Principal</h6>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => window.innerWidth < 992 && onClose()}
                                >
                                    <i className="bi bi-speedometer2"></i>
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/pontos-coleta"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => window.innerWidth < 992 && onClose()}
                                >
                                    <i className="bi bi-geo-alt-fill"></i>
                                    <span>Pontos de Coleta</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/licencas"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => window.innerWidth < 992 && onClose()}
                                >
                                    <i className="bi bi-file-earmark-text"></i>
                                    <span>Licenças Ambientais</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/cooperativas"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => window.innerWidth < 992 && onClose()}
                                >
                                    <i className="bi bi-people-fill"></i>
                                    <span>Cooperativas</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/residuos"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => window.innerWidth < 992 && onClose()}
                                >
                                    <i className="bi bi-recycle"></i>
                                    <span>Resíduos</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/relatorios"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => window.innerWidth < 992 && onClose()}
                                >
                                    <i className="bi bi-file-earmark-pdf"></i>
                                    <span>Relatorio</span>
                                </NavLink>
                            </li>
                        </ul>

                        <h6 className="sidebar-heading mt-4">Sistema</h6>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className="bi bi-gear-fill"></i>
                                    <span>Configurações</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="sidebar-footer">
                        <div className="user-card">
                            <i className="bi bi-person-circle fs-3 text-primary"></i>
                            <div className="user-info">
                                <p className="mb-0 fw-bold small">Gestor Ambiental</p>
                                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>gestor@irece.ba.gov.br</p>
                            </div>
                        </div>
                    </div>

                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1039,
                        display: 'block'
                    }}
                    onClick={onClose}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
