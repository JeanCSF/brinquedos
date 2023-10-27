import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);

  return (
    <div className="flex items-center justify-center mt-4">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm" aria-label="Pagination">
        <button
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-100"
            }`}
        >
          Primeira
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-100"
            }`}
        >
          Anterior
        </button>
        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? "cursor-not-allowed" : "hover:bg-gray-100"
            }`}
        >
          Próxima
        </button>
        <button
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? "cursor-not-allowed" : "hover:bg-gray-100"
            }`}
        >
          Última
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
