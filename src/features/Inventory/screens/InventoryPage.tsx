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
            const response = await inventoryApi.getCategoryProducts(categoryName, page, rows, search);

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
                            mrp: p.type === 'group' ? 0 : p.mrp, // Will be formatted as --- if 0 and type is group
                            discounted_price: p.type === 'group' ? 0 : p.discounted_price,
                            image: Array.isArray(p.product_image) && p.product_image.length > 0
                                ? p.product_image[0].file_path
                                : "",
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
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300); // reduced debounce for snappier feel

        return () => clearTimeout(timer);
    }, [categoryName, page, rows, search]);


    // Filter by client-side sort (Search is now server-side)
    const filtered = useMemo(() => {
        let d = data;

        if (sortBy !== "none") {
            d = [...d].sort((a, b) =>
                sortBy === "quantity"
                    ? b.quantity - a.quantity
                    : a[sortBy].localeCompare(b[sortBy])
            );
        }

        return d;
    }, [data, sortBy]);


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
            <div className=" mx-auto bg-white rounded-xl border p-4 space-y-5">

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
                    <div className="relative md:max-w-sm w-full group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isLoading ? (
                                <Loader2 className="text-blue-500 animate-spin" size={16} />
                            ) : (
                                <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                            )}
                        </div>
                        <input
                            className={`w-full border rounded-lg pl-9 pr-3 py-2 text-sm transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none ${isLoading ? 'bg-blue-50/30' : 'bg-white'}`}
                            placeholder="Search inventory..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1); // Reset page on search
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
                        <option value="category">Sub Category</option>
                        <option value="quantity">Quantity</option>
                    </select>
                </div>

                {/* TABLE */}
                {(isLoading && data.length === 0) ? (
                    <div className="flex flex-col justify-center items-center py-32 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                        <p className="text-gray-500 font-medium font-inter animate-pulse">Loading Inventory Items...</p>
                    </div>
                ) : (
                    <InventoryTable
                        data={filtered}
                        // onDelete={(id) => setData((prev) => prev.filter((p) => p.id !== id))}
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
