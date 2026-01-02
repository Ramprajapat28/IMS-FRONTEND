type InventoryFooterProps = {
    page: number;
    totalPages: number;
    rowsPerPage: number;
    totalEntries: number;
    onPageChange: (p: number) => void;
    onRowsChange: (n: number) => void;
};

const MAX_VISIBLE = 5;

const InventoryFooter = ({
    page,
    totalPages,
    rowsPerPage,
    // totalEntries,
    onPageChange,
    onRowsChange,
}: InventoryFooterProps) => {
    const half = Math.floor(MAX_VISIBLE / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + MAX_VISIBLE - 1);

    if (end - start + 1 < MAX_VISIBLE) {
        start = Math.max(1, end - MAX_VISIBLE + 1);
    }

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t">
            {/* ROWS PER PAGE */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Row Per Page</span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsChange(Number(e.target.value))}
                    className="border rounded-lg px-2 py-1"
                >
                    {[10, 20, 50].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
                <span className="ml-2">Entries</span>
            </div>

            {/* PAGINATION */}
            <div className="flex gap-2 flex-wrap justify-center items-center">
                {/* First Page */}
                {start > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="w-9 h-9 border rounded-full hover:bg-gray-100 flex items-center justify-center"
                        >
                            1
                        </button>
                        {start > 2 && <span className="text-gray-400">...</span>}
                    </>
                )}

                {/* Visible Pages */}
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition
              ${p === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "hover:bg-gray-100"
                            }`}
                    >
                        {p}
                    </button>
                ))}

                {/* Last Page */}
                {end < totalPages && (
                    <>
                        {end < totalPages - 1 && <span className="text-gray-400">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="w-9 h-9 border rounded-full hover:bg-gray-100 flex items-center justify-center"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                    disabled={page >= totalPages}
                    className="ml-2 border rounded-full p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default InventoryFooter;
