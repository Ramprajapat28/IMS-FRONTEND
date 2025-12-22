import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";

/* ---------------------------------- TYPES --------------------------------- */
type OrderStatus = "Processing" | "Cancelled" | "Onhold";

type Order = {
  id: number;
  product: string;
  category: string;
  price: number;
  warehouse: string;
  datetime: string;
  status: OrderStatus;
  image: string;
};

/* -------------------------------- SAMPLE DATA ------------------------------- */
const ORDERS: Order[] = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  product: "Apple Watch Series 9",
  category: "Electronics",
  price: 640,
  warehouse: ["Warehouse A", "Warehouse B"][i % 2],
  datetime: "Today, 1:30 PM",
  status: (["Processing", "Cancelled", "Onhold"] as OrderStatus[])[i % 3],
  image:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
}));

/* ----------------------------- PAGINATION LOGIC ------------------------------ */
const MAX_VISIBLE_PAGES = 5;

const getVisiblePages = (page: number, totalPages: number) => {
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

  if (end - start + 1 < MAX_VISIBLE_PAGES) {
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/* ---------------- COMPONENT ---------------- */

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [statusFilter, setStatusFilter] = useState({
    category: "",
    product: "",
    warehouse: "",
    status: "",
  });
  const handleFilterChange = (
    key: keyof typeof statusFilter,
    value: string
  ) => {
    setStatusFilter((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  /* -------- FILTER LOGIC -------- */

  const filteredOrders = useMemo(() => {
    return ORDERS.filter((o) => {
      return (
        (!statusFilter.category || o.category === statusFilter.category) &&
        (!statusFilter.product || o.product === statusFilter.product) &&
        (!statusFilter.warehouse || o.warehouse === statusFilter.warehouse) &&
        (!statusFilter.status || o.status === statusFilter.status)
      );
    });
  }, [statusFilter]);

  /* ----------------------------- PAGINATION -------------------------------- */
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const visiblePages = getVisiblePages(page, totalPages);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* --------------------------- SAFETY CLAMP -------------------------------- */
  useEffect(() => {
    if (page < 1) setPage(1);
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleRowsChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };


  /* -------------------------------- RENDER -------------------------------- */
  return (
    <div className="bg-white rounded-xl border p-4 md:p-6 space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-sm text-gray-500">
          Overview of all order records and statuses
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-xl p-4 flex flex-wrap items-center gap-3">
    <span className="text-sm text-gray-600">Sort by :</span>

     <Select
          label="Category"
          options={["Electronics"]}
          onChange={(v) => handleFilterChange("category", v)}
        />

        <Select
          label="Product"
          options={["Apple Watch Series 9"]}
          onChange={(v) => handleFilterChange("product", v)}
        />

        <Select
          label="Warehouse"
          options={["Warehouse A", "Warehouse B"]}
          onChange={(v) => handleFilterChange("warehouse", v)}
        />

        <Select
          label="Status"
          options={["Processing", "Cancelled", "Onhold"]}
          onChange={(v) => handleFilterChange("status", v)}
        />

        <button className="ml-auto bg-gray-800 text-white px-4 py-1.5 rounded-lg text-sm">
          Sort
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Product</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((o) => (
              <tr key={o.id} className="border-b last:border-none">
                <td className="p-3">{o.id}</td>

                <td className="p-3 flex items-center gap-3 min-w-[220px]">
                  <img
                    src={o.image}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{o.product}</p>
                    <p className="text-gray-500 text-xs">
                      {o.category} • ${o.price}
                    </p>
                  </div>
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin size={14} />
                    {o.warehouse}
                  </div>
                </td>

                <td className="p-3 text-gray-500">{o.datetime}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        o.status === "Processing"
                          ? "bg-purple-100 text-purple-600"
                          : o.status === "Cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-sky-100 text-sky-600"
                      }`}
                  >
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
        {/* ROWS PER PAGE */}
        <div className="flex items-center gap-2 text-sm">
          <span>Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsChange(Number(e.target.value))}
            className="border rounded-lg px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* PAGINATION */}
        
        <div className="flex items-center gap-2 flex-wrap justify-center">
  {/* FIRST PAGE (only if not already visible) */}
  {visiblePages[0] !== 1 && (
    <button
      onClick={() => setPage(1)}
      className="w-9 h-9 rounded-full border text-sm hover:bg-gray-100"
    >
      1
    </button>
  )}

  {/* LEFT DOTS */}
  {visiblePages[0] > 2 && <span className="px-1">…</span>}

  {/* VISIBLE PAGES */}
  {visiblePages.map((p) => (
    <button
      key={p}
      onClick={() => setPage(p)}
      className={`w-9 h-9 rounded-full border text-sm
        ${
          p === page
            ? "bg-gray-900 text-white"
            : "hover:bg-gray-100"
        }`}
    >
      {p}
    </button>
  ))}

  {/* RIGHT DOTS */}
  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
    <span className="px-1">…</span>
  )}

  {/* LAST PAGE (only if not already visible) */}
  {visiblePages[visiblePages.length - 1] !== totalPages && (
    <button
      onClick={() => setPage(totalPages)}
      className="w-9 h-9 rounded-full border text-sm hover:bg-gray-100"
    >
      {totalPages}
    </button>
  )}
</div>
      </div>
    </div>
  );
};

export default OrdersPage;
const Select = ({
  label,
  options,
  onChange,
}: {
  label: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <select
    onChange={(e) => onChange(e.target.value)}
    className="border rounded-lg px-3 py-1.5 text-sm"
  >
    <option value="">{label}</option>
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);