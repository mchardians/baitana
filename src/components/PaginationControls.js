import React from 'react';

export default function PaginationControls({
    currentPage,
    totalPages,
    onPageChange
}) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center items-center mt-10 space-x-2">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#2C3E9E] text-white hover:bg-[#3f51b5] transition-colors'
                }`}
            >
                Previous
            </button>

            <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => onPageChange(index + 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            currentPage === index + 1
                                ? 'bg-[#2C3E9E] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#2C3E9E] text-white hover:bg-[#3f51b5] transition-colors'
                }`}
            >
                Next
            </button>
        </div>
    );
}