
interface HeaderProps {
    onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
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
                </div>

            </div>
        </nav>
    );
};

export default Header;
