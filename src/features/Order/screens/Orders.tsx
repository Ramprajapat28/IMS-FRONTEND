import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { ordersApi } from "@/features/Order/api/order.api";
import type { Order as ApiOrder } from "@/features/Order/types";

/* ---------------------------------- TYPES --------------------------------- */
type OrderStatus = "Processing" | "Cancelled" | "Onhold" | string;

type Order = {
  id: number;
  product: string;
  product_id: number;
  shelf_id: number;
  quantity: number;
  category: string;
  warehouse: string;
  datetime: string;
  status: OrderStatus;
  mode?: string;
  image: string;
};

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

const resolveUrl = (image: any): string => {
  if (!image) return "";

  // 1. Handle Array (extract first item)
  if (Array.isArray(image)) {
    if (image.length === 0) return "";
    const first = image[0];
    return typeof first === 'object' ? (first.file_path || first.cdnUrl || first.url || "") : String(first);
  }

  // 2. Handle Object (single image object)
  if (typeof image === 'object') {
    return image.file_path || image.cdnUrl || image.url || "";
  }

  // 3. Handle String (potential JSON)
  if (typeof image === 'string') {
    if (image.startsWith('{') || image.startsWith('[')) {
      try {
        const parsed = JSON.parse(image);
        // Recursively call for parsed result
        if (Array.isArray(parsed) || typeof parsed === 'object') {
          // We can reuse the same logic by recursively calling resolveUrl, 
          // or just inline it to avoid recursion depth issues (though unlikely here)
          if (Array.isArray(parsed)) {
            if (parsed.length === 0) return "";
            const first = parsed[0];
            return typeof first === 'object' ? (first.file_path || first.cdnUrl || first.url || "") : String(first);
          }
          return parsed.file_path || parsed.cdnUrl || parsed.url || "";
        }
      } catch {
        return image;
      }
    }
    return image;
  }
  return "";
};

/* ---------------- COMPONENT ---------------- */

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState({
    category: "",
    product: "",
    warehouse: "",
    status: "",
  });

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pass status filter if valid, otherwise undefined
        const filters = statusFilter.status ? { status: statusFilter.status } : undefined;

        const response = await ordersApi.getAll(page, rowsPerPage, filters);

        if (response.success && response.data) {
          console.log("DEBUG: Orders API Response", response.data);
          const mappedOrders: Order[] = response.data.map((o: ApiOrder & { product_image?: any }) => ({
            id: o.order_id,
            product: o.product_name || `Product #${o.product_id}`,
            product_id: o.product_id,
            shelf_id: o.shelf_id,
            quantity: o.quantity,
            category: o.category_name || "General",
            warehouse: o.warehouse_name || "Unknown Warehouse",
            datetime: o.created_at ? new Date(o.created_at).toLocaleString() : "N/A",
            status: o.status || "Processing",
            mode: o.mode,
            image: resolveUrl(o.product_image) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
          }));
          setOrders(mappedOrders);

          if (response.pagination) {
            setTotalPages(response.pagination.totalPages);
          }
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, rowsPerPage, statusFilter.status]);

  // Compute unique filter options from orders data
  const filterOptions = useMemo(() => {
    const warehouses = [...new Set(orders.map(o => o.warehouse).filter(Boolean))];
    const products = [...new Set(orders.map(o => o.product).filter(Boolean))];
    const categories = [...new Set(orders.map(o => o.category).filter(Boolean))];
    const statuses = [...new Set(orders.map(o => o.status).filter(Boolean))];
    return { warehouses, products, categories, statuses };
  }, [orders]);

  const handleFilterChange = (
    key: keyof typeof statusFilter,
    value: string
  ) => {
    setStatusFilter((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  /* -------- FILTER LOGIC -------- */

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      return (
        (!statusFilter.category || o.category === statusFilter.category) &&
        (!statusFilter.product || o.product === statusFilter.product) &&
        (!statusFilter.warehouse || o.warehouse === statusFilter.warehouse) &&
        (!statusFilter.status || o.status === statusFilter.status)
      );
    });
  }, [orders, statusFilter]);

  /* ----------------------------- PAGINATION -------------------------------- */
  // const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const visiblePages = getVisiblePages(page, totalPages);

  const paginatedOrders = filteredOrders; // .slice((page - 1) * rowsPerPage, page * rowsPerPage);

  /* --------------------------- SAFETY CLAMP -------------------------------- */
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    } else if (page < 1) {
      setPage(1);
    }
  }, [page, totalPages]);

  const handleRowsChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };


  /* -------------------------------- RENDER -------------------------------- */
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center text-red-600 py-8">
          <p className="text-lg font-medium">Failed to load orders</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

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
        <span className="text-sm text-gray-600">Filter by :</span>

        <Select
          label="Category"
          options={filterOptions.categories}
          value={statusFilter.category}
          onChange={(v) => handleFilterChange("category", v)}
        />

        <Select
          label="Product"
          options={filterOptions.products}
          value={statusFilter.product}
          onChange={(v) => handleFilterChange("product", v)}
        />

        <Select
          label="Warehouse"
          options={filterOptions.warehouses}
          value={statusFilter.warehouse}
          onChange={(v) => handleFilterChange("warehouse", v)}
        />

        <Select
          label="Status"
          options={filterOptions.statuses}
          value={statusFilter.status}
          onChange={(v) => handleFilterChange("status", v)}
        />

        <button
          onClick={() => setStatusFilter({ category: "", product: "", warehouse: "", status: "" })}
          className="ml-auto bg-gray-800 text-white px-4 py-1.5 rounded-lg text-sm"
        >
          Clear Filters
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
                      {o.category}
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
                      ${o.status === "Processing"
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
        ${p === page
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
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border rounded-lg px-3 py-1.5 text-sm"
  >
    <option value="">{label}</option>
    {options.map((o) => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
);