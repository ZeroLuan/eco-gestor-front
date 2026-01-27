import { useNavigate } from 'react-router-dom';
import authService from '../services/auth/authService';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
    onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar-top">
            <div className="navbar">

                <button
                    className="btn btn-link d-lg-none"
                    id="sidebarToggle"
                    onClick={onToggleSidebar}
                >
                    <i className="bi bi-list fs-4"></i>
                </button>

                <div className="search-container">
                    <i className="bi bi-search"></i>
                    <input type="search" className="form-control" placeholder="Buscar no sistema..." />
                </div>

                <div className="notifications">
                    <button className="btn btn-link position-relative">
                        <i className="bi bi-bell fs-5"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            3
                        </span>
                    </button>
                    <button 
                        className="btn btn-link" 
                        onClick={toggleTheme}
                        title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
                    >
                        <i className={`bi bi-${theme === 'light' ? 'moon-stars' : 'sun'} fs-5`}></i>
                    </button>
                    <button 
                        className="btn btn-link" 
                        onClick={handleLogout}
                        title="Sair"
                    >
                        <i className="bi bi-box-arrow-right fs-5"></i>
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Header;
