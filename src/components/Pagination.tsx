

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pages = [];
    // Logic to show a window of pages could be added here, currently showing all or simple range
    // For simplicity, showing max 5 pages around current
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(0, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <nav aria-label="Navegação de páginas">
            <ul className="pagination justify-content-end mb-0">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        Anterior
                    </button>
                </li>
                {pages.map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(page)}
                        >
                            {page + 1}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        Próxima
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
