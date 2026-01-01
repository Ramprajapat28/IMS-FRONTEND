import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import InventoryNavbar from "../components/InventoryNavbar";
import InventoryTable from "../components/InventoryTable";
import InventoryFooter from "../components/InventoryFooter";
import { INVENTORY_PRODUCTS, type InventoryProduct } from "../data/inventory.data";

const InventoryPage = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<InventoryProduct[]>(INVENTORY_PRODUCTS);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"none" | "name" | "category" | "quantity">("none");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);

    // Filter and sort
    const filtered = useMemo(() => {
        let d = data.filter((p) =>
            `${p.name} ${p.sku} ${p.category} ${p.location}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        if (sortBy !== "none") {
            d = [...d].sort((a, b) =>
                sortBy === "quantity"
                    ? b.quantity - a.quantity
                    : a[sortBy].localeCompare(b[sortBy])
            );
        }

        return d;
    }, [data, search, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filtered.length / rows);
    const paginated = filtered.slice((page - 1) * rows, page * rows);

    // Handle row click - navigate based on hasVariants
    const handleRowClick = (item: InventoryProduct) => {
        if (item.hasVariants) {
            // Navigate to variants page
            navigate(`/inventory/variants/${item.id}`);
        } else {
            // Navigate directly to product details
            navigate(`/products/${item.id}`);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-xl border p-6 space-y-5">
                {/* NAVBAR */}
                <InventoryNavbar
                    breadcrumbs={[
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Inventory" },
                    ]}
                />

                {/* SEARCH & SORT */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative md:max-w-sm w-full">
                        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <select
                        className="border rounded-lg px-3 py-2 text-sm md:ml-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    >
                        <option value="none">Sort By</option>
                        <option value="name">Name</option>
                        <option value="category">Category</option>
                        <option value="quantity">Quantity</option>
                    </select>
                </div>

                {/* TABLE */}
                <InventoryTable
                    data={paginated}
                    mode="PRODUCTS"
                    onDelete={(id) => setData((prev) => prev.filter((p) => p.id !== id))}
                    onRowClick={handleRowClick}
                />

                {/* FOOTER */}
                <InventoryFooter
                    page={page}
                    totalPages={totalPages}
                    rowsPerPage={rows}
                    totalEntries={filtered.length}
                    onPageChange={setPage}
                    onRowsChange={(n) => {
                        setRows(n);
                        setPage(1);
                    }}
                />
            </div>
        </div>
    );
};

export default InventoryPage;
