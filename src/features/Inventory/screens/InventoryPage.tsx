import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import InventoryNavbar from "../components/InventoryNavbar";
import InventoryTable from "../components/InventoryTable";
import InventoryFooter from "../components/InventoryFooter";
import { inventoryApi } from "@/features/Inventory/api/inventory.api";

import { type InventoryProduct } from "../types/inventory.types";

const InventoryPage = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const location = useLocation();
    const categoryName = location.state?.categoryName || categoryId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const [data, setData] = useState<InventoryProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Server-side pagination state
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"none" | "name" | "category" | "quantity">("none");

    const fetchProducts = async () => {
        if (!categoryName) return;
        setIsLoading(true);
        try {
            const response = await inventoryApi.getCategoryProducts(categoryName, page, rows);

            if (response.success && response.data) {
                // Handle both direct array and paginated object structure
                const rawData = response.data as any;
                const productList = Array.isArray(rawData) ? rawData : rawData.products;

                if (Array.isArray(productList)) {
                    const mapped: InventoryProduct[] = productList.map((p: any) => {
                        // Format location string from stock details


                        return {
                            id: p.product_id,
                            name: p.name,
                            category: p.category_name,
                            sku: p.type === 'group' ? "-----" : (p.sku || "-----"),
                            realSku: p.sku || "-----",
                            location: p.type === 'group' ? `Mixed (${p.variant_count} variants)` : (p.location || "See Details"),
                            quantity: p.stock_quantity || 0,
                            type: p.type // "group" or "product"
                        };
                    });

                    setData(mapped);

                    // Update pagination if available
                    if (rawData.total !== undefined) {
                        setTotalProducts(rawData.total);
                        setTotalPages(rawData.totalPages || Math.ceil(rawData.total / rows));
                    } else if (response.pagination) {
                        setTotalProducts(response.pagination.total);
                        setTotalPages(response.pagination.totalPages);
                    }
                } else {
                    setData([]);
                }
            } else {
                setData([]);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [categoryName, page, rows]);


    // Filter by client-side search (for now, since API search isn't fully integrated in this view yet)
    // Note: Since we are paginating server-side, this client-side search only filters the CURRENT page.
    // Ideally update API to accept search. For now, mimicking previous behavior but on current page data.
    const filtered = useMemo(() => {
        let d = data;

        // Apply search filter
        if (search) {
            d = d.filter((p) =>
                `${p.name} ${p.sku} ${p.category} ${p.location}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (sortBy !== "none") {
            d = [...d].sort((a, b) =>
                sortBy === "quantity"
                    ? b.quantity - a.quantity
                    : a[sortBy].localeCompare(b[sortBy])
            );
        }

        return d;
    }, [data, search, sortBy]);


    // Handle row click - navigate to inventory details page or variants page
    const handleRowClick = (item: InventoryProduct) => {
        if ((item as any).type === 'group') {
            // Navigate to variants page using the code (sku field holds the code for groups)
            // Use realSku because item.sku is masked as "-----"
            navigate(`/inventory/variants/${item.realSku}`);
        } else {
            navigate(`/inventory/details/${item.id}`);
        }
    };

    return (
        <div className="">
            <div className="max-w-7xl mx-auto bg-white rounded-xl border p-4 space-y-5">

                {/* NAVBAR */}
                <InventoryNavbar
                    breadcrumbs={categoryId ? [
                        { label: "Dashboard", path: "/dashboard" },
                        { label: "Inventory", path: "/inventory" },
                        { label: `${categoryName}` },
                    ] : [
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
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                // For client-side filter on server page, we don't reset page
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
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <InventoryTable
                        data={filtered}
                        onDelete={(id) => setData((prev) => prev.filter((p) => p.id !== id))}
                        onRowClick={handleRowClick}
                    />
                )}

                {/* FOOTER */}
                <InventoryFooter
                    page={page}
                    totalPages={totalPages}
                    rowsPerPage={rows}
                    totalEntries={totalProducts}
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
