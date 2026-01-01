import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import InventoryNavbar from "../components/InventoryNavbar";
import InventoryTable from "../components/InventoryTable";
import InventoryFooter from "../components/InventoryFooter";
import { INVENTORY_VARIANTS, type InventoryVariant } from "../data/variants.data";
import { INVENTORY_PRODUCTS } from "../data/inventory.data";

const InventoryVariantsPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();

    // Get product info
    const product = INVENTORY_PRODUCTS.find((p) => p.id === Number(productId));

    // Get variants for this product
    const productVariants = INVENTORY_VARIANTS.filter(
        (v) => v.productId === Number(productId)
    );

    const [data, setData] = useState<InventoryVariant[]>(productVariants);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);

    // Filter
    const filtered = useMemo(() => {
        return data.filter((v) =>
            `${v.name} ${v.size} ${v.sku} ${v.location}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [data, search]);

    // Pagination
    const totalPages = Math.ceil(filtered.length / rows);
    const paginated = filtered.slice((page - 1) * rows, page * rows);

    // Handle variant click - navigate to product details
    const handleVariantClick = (variant: InventoryVariant) => {
        navigate(`/products/${variant.id}`);
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-xl border p-6 space-y-5">
                {/* NAVBAR */}
                <InventoryNavbar
                    breadcrumbs={[
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Inventory", path: "/inventory" },
                        { label: product?.name || "Product" },
                    ]}
                />

                {/* SEARCH */}
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

                {/* TABLE */}
                <InventoryTable
                    data={paginated}
                    mode="VARIANTS"
                    onDelete={(id) => setData((prev) => prev.filter((v) => v.id !== id))}
                    onRowClick={handleVariantClick}
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

export default InventoryVariantsPage;
