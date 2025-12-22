type FooterProps = {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsChange: (n: number) => void;
};

const MAX_VISIBLE = 5;

const ProductsFooter = ({
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsChange,
}: FooterProps) => {
  const half = Math.floor(MAX_VISIBLE / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, start + MAX_VISIBLE - 1);

  if (end - start + 1 < MAX_VISIBLE) {
    start = Math.max(1, end - MAX_VISIBLE + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
      {/* ROWS */}
      <div className="flex items-center gap-2 text-sm">
        <span>Rows per page</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsChange(Number(e.target.value))}
          className="border rounded-lg px-2 py-1"
        >
          {[5, 10, 20].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2 flex-wrap justify-center">
        {start > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 border rounded-full"
          >
            1
          </button>
        )}

        {start > 2 && <span>…</span>}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-full border
              ${
                p === page
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        ))}

        {end < totalPages - 1 && <span>…</span>}

        {end < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 border rounded-full"
          >
            {totalPages}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductsFooter;
