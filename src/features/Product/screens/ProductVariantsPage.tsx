import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import { productsApi } from "@/features/Product/api/product.api";

// Mock variant data - replace with actual API
type Variant = {
    id: number;
    productId: number;
    productName: string;
    size: string;
    sku: string;
    location: string;
    qty: number;
};

const MOCK_VARIANTS: Variant[] = [
    { id: 1, productId: 1, productName: "Blue Jersey T-Shirt", size: "Small", sku: "TS01-BL-S", location: "S1-R1-W1", qty: 20 },
    { id: 2, productId: 1, productName: "Blue Jersey T-Shirt", size: "Medium", sku: "TS01-BL-M", location: "S1-R1-W1", qty: 20 },
    { id: 3, productId: 1, productName: "Blue Jersey T-Shirt", size: "Large", sku: "TS-01-BL-L", location: "S1-R1-W1", qty: 20 },
    { id: 4, productId: 1, productName: "Blue Jersey T-Shirt", size: "X-Large", sku: "TS-01-BL-XL", location: "S1-R1-W1", qty: 20 },
    { id: 5, productId: 1, productName: "Blue Jersey T-Shirt", size: "2X-Large", sku: "TS-01-BL-2XL", location: "S1-R1-W1", qty: 20 },
];

const ProductVariantsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [variants, setVariants] = useState<Variant[]>([]);
    const [productName, setProductName] = useState("");
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                // Load product details
                const response = await productsApi.getById(Number(id));
                if (response.success && response.data) {
                    setProductName(response.data.name);
                }

                // TODO: Load actual variants from API
                // For now, using mock data
                const productVariants = MOCK_VARIANTS.filter(v => v.productId === Number(id));
                setVariants(productVariants);
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

    const handleRowClick = (variantId: number) => {
        // Navigate to edit product for this specific variant
        navigate(`/products/edit/${variantId}`);
    };

    const handleDelete = (variantId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this variant?")) {
            setVariants(prev => prev.filter(v => v.id !== variantId));
        }
    };

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
                    onClick={() => navigate("/products")}
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
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600">
                                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
                            </svg>
                            <span className="text-blue-600 font-medium">{productName}</span>
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
                            placeholder="Search"
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
                                <th className="p-3">Product Name</th>
                                <th className="p-3">Size</th>
                                <th className="p-3">SKU #</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Qty</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVariants.map((variant, index) => (
                                <tr
                                    key={variant.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(variant.id)}
                                >
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3 font-medium">{variant.productName}</td>
                                    <td className="p-3 text-gray-600">{variant.size}</td>
                                    <td className="p-3 text-gray-600">{variant.sku}</td>
                                    <td className="p-3 text-gray-600">{variant.location}</td>
                                    <td className="p-3 text-gray-600">{variant.qty}</td>
                                    <td className="p-3">
                                        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={(e) => handleDelete(variant.id, e)}
                                                className="border p-1.5 rounded-lg hover:bg-gray-100"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
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
        </div>
    );
};

export default ProductVariantsPage;
