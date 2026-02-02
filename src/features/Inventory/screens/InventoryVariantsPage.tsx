import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { productsApi } from "@/features/Product/api/product.api";
import InventoryFooter from "../components/InventoryFooter";
import { formatCurrency } from "@/utils";

type Variant = {
    id: number;
    productId: number;
    productName: string;
    size: string;
    sku: string;
    location: string;
    mrp?: number;
    discounted_price?: number;
    qty: number;
};

const InventoryVariantsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [variants, setVariants] = useState<Variant[]>([]);
    const [productName, setProductName] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const productCode = id; // Treat "id" param as the Product Code

                const response = await productsApi.getByCode(productCode);
                if (response.success && response.data && response.data.length > 0) {
                    setProductName(response.data[0].name.split('-')[0] + " (Group)");

                    const mappedVariants = response.data.map(p => ({
                        id: p.product_id,
                        productId: p.product_id,
                        productName: p.name,
                        size: p.size || "-",
                        sku: p.sku,
                        location: p.location || "-",
                        mrp: p.mrp,
                        discounted_price: p.discounted_price,
                        qty: p.stock_quantity || 0
                    }));
                    setVariants(mappedVariants as any);
                } else {
                    setVariants([]);
                    setProductName("Unknown Variant Group");
                }

            } catch (err) {
                console.error("Failed to load variants:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id]);

    const filteredVariants = variants.filter(v =>
        v.size.toLowerCase().includes(search.toLowerCase()) ||
        v.sku.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedVariants = filteredVariants.slice((page - 1) * rows, page * rows);
    const totalPages = Math.ceil(filteredVariants.length / rows);

    const handleRowClick = (variantId: number) => {
        // Navigate to inventory details for this specific variant
        navigate(`/inventory/details/${variantId}`);
    };

    // const handleDelete = (variantId: number, e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     if (confirm("Are you sure you want to delete this variant?")) {
    //         // Note: This only deletes from local state. Actual API call would be needed for persistence.
    //         setVariants(prev => prev.filter(v => v.id !== variantId));
    //     }
    // };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading variants...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-4">
            {/* HEADER */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate("/inventory")} // Back to Inventory
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-blue-600">Inventory</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate("/dashboard")}>Dashboard</span>
                        <span>›</span>
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate("/inventory")}>Inventory</span>
                        <span>›</span>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600 font-medium">{productName}</span>
                            <span className="text-gray-600">(Variants)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                {/* Search */}
                <div className="mb-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search variants..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Sr.no</th>
                                <th className="p-3">Variant Name</th>
                                <th className="p-3">Size</th>
                                <th className="p-3">SKU #</th>
                                <th className="p-3 text-right">MRP</th>
                                <th className="p-3 text-right">Discounted Price</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedVariants.map((variant, index) => (
                                <tr
                                    key={variant.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(variant.id)}
                                >
                                    <td className="p-3">{(page - 1) * rows + index + 1}</td>
                                    <td className="p-3 font-medium">{variant.productName}</td>
                                    <td className="p-3 text-gray-600">{variant.size}</td>
                                    <td className="p-3 text-gray-600">{variant.sku}</td>
                                    <td className="p-3 text-right font-medium text-gray-700">
                                        {formatCurrency(variant.mrp || 0)}
                                    </td>
                                    <td className="p-3 text-right font-medium text-blue-600">
                                        {formatCurrency(variant.discounted_price || 0)}
                                    </td>
                                    <td className="p-3 text-gray-600">{variant.location}</td>
                                    <td className="p-3">{variant.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredVariants.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No variants found
                    </div>
                )}
            </div>

            <InventoryFooter
                page={page}
                totalPages={totalPages}
                rowsPerPage={rows}
                totalEntries={filteredVariants.length}
                onPageChange={setPage}
                onRowsChange={(n) => {
                    setRows(n);
                    setPage(1);
                }}
            />
        </div>
    );
};

export default InventoryVariantsPage;
