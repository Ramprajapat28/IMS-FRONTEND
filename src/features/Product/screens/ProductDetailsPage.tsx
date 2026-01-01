import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Tag, Hash, Package, MapPin, RefreshCw, Download, FileText } from "lucide-react";
import { productsApi } from "@/features/Product/api/product.api";
import type { Product } from "@/features/Product/types";

const ProductDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const response = await productsApi.getById(Number(id));
                if (response.success && response.data) {
                    setProduct(response.data);
                } else {
                    setError("Product not found");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load product");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-gray-400" size={48} />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="text-center text-red-600 py-8">
                    <p className="text-lg font-medium">Failed to load product</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    // Get location string from stock details
    const getLocation = () => {
        if (product.stock_details && product.stock_details.length > 0) {
            const stock = product.stock_details[0];
            return `${stock.shelf_name}_${stock.room_name}_${stock.warehouse_name} (S1-R1-W1)`;
        }
        return "Not assigned";
    };

    const isInStock = (product.stock_quantity || 0) > 0;

    return (
        <div className="max-w-7xl mx-auto space-y-2">
            {/* HEADER */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
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
                            <span className="text-blue-600 font-medium">{product.name}</span>
                            <span className="text-gray-600">› ( MEDIUM )</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* LEFT - Product Image & Barcode */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4 space-y-4">
                    {/* Product Image */}
                    <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center h-56">
                        {product.product_image ? (
                            <img
                                src={product.product_image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-gray-400 text-center">
                                <Package size={48} className="mx-auto mb-2" />
                                <p className="text-sm">No image available</p>
                            </div>
                        )}
                    </div>

                    {/* Product Name & Size */}
                    <div className="text-center space-y-1">
                        <h2 className="text-base font-semibold">{product.name}</h2>
                        <span className="inline-block px-3 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                            ( MEDIUM )
                        </span>
                    </div>

                    {/* Barcode */}
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-3 text-center">
                        <svg className="mx-auto mb-1" width="160" height="50" viewBox="0 0 200 60">
                            {/* Barcode bars */}
                            <rect x="10" y="10" width="3" height="40" fill="black" />
                            <rect x="15" y="10" width="2" height="40" fill="black" />
                            <rect x="20" y="10" width="4" height="40" fill="black" />
                            <rect x="27" y="10" width="2" height="40" fill="black" />
                            <rect x="32" y="10" width="3" height="40" fill="black" />
                            <rect x="38" y="10" width="2" height="40" fill="black" />
                            <rect x="43" y="10" width="4" height="40" fill="black" />
                            <rect x="50" y="10" width="2" height="40" fill="black" />
                            <rect x="55" y="10" width="3" height="40" fill="black" />
                            <rect x="61" y="10" width="2" height="40" fill="black" />
                            <rect x="66" y="10" width="4" height="40" fill="black" />
                            <rect x="73" y="10" width="3" height="40" fill="black" />
                            <rect x="79" y="10" width="2" height="40" fill="black" />
                            <rect x="84" y="10" width="3" height="40" fill="black" />
                            <rect x="90" y="10" width="2" height="40" fill="black" />
                            <rect x="95" y="10" width="4" height="40" fill="black" />
                            <rect x="102" y="10" width="2" height="40" fill="black" />
                            <rect x="107" y="10" width="3" height="40" fill="black" />
                            <rect x="113" y="10" width="4" height="40" fill="black" />
                            <rect x="120" y="10" width="2" height="40" fill="black" />
                            <rect x="125" y="10" width="3" height="40" fill="black" />
                            <rect x="131" y="10" width="2" height="40" fill="black" />
                            <rect x="136" y="10" width="4" height="40" fill="black" />
                            <rect x="143" y="10" width="2" height="40" fill="black" />
                            <rect x="148" y="10" width="3" height="40" fill="black" />
                            <rect x="154" y="10" width="2" height="40" fill="black" />
                            <rect x="159" y="10" width="4" height="40" fill="black" />
                            <rect x="166" y="10" width="3" height="40" fill="black" />
                            <rect x="172" y="10" width="2" height="40" fill="black" />
                            <rect x="177" y="10" width="4" height="40" fill="black" />
                            <rect x="184" y="10" width="2" height="40" fill="black" />
                        </svg>
                        <p className="text-xs font-mono text-gray-600">{product.sku}</p>
                    </div>

                    {/* Download Barcode Button */}
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm">
                        <Download size={16} />
                        Download barcode
                    </button>
                </div>

                {/* RIGHT - Product Information */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 pb-3 border-b">
                        <h2 className="text-lg font-semibold text-blue-600">Product Information</h2>
                        <button
                            onClick={() => navigate(`/products/edit/${product.product_id}`)}
                            className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-xs flex items-center gap-1.5"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                        </button>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-3">
                        {/* Product Name */}
                        <div className="border-l-4 border-blue-600 pl-3 py-1.5">
                            <p className="text-xs text-gray-500 mb-0.5">Product Name</p>
                            <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        </div>

                        {/* Product Description */}
                        <div className="flex gap-2.5">
                            <FileText size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Product Description</p>
                                <p className="text-xs text-gray-900">{product.description || "Blue Jersey DRI-FIT T-shirt with custom name and jersey no."}</p>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="flex gap-2.5">
                            <Tag size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">CATEGORY</p>
                                <p className="font-medium text-gray-900 text-sm">{product.category || "T-shirts"}</p>
                            </div>
                        </div>

                        {/* Size */}
                        <div className="flex gap-2.5">
                            <Tag size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">SIZE</p>
                                <p className="font-medium text-gray-900 text-sm">Medium</p>
                            </div>
                        </div>

                        {/* SKU */}
                        <div className="flex gap-2.5">
                            <Hash size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">SKU</p>
                                <p className="font-medium text-gray-900 text-sm">{product.sku}</p>
                            </div>
                        </div>

                        {/* Available Quantity */}
                        <div className="flex gap-2.5">
                            <Package size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-0.5">AVAILABLE QUANTITY</p>
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-900 text-sm">{product.stock_quantity || 20}</p>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isInStock ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                        {isInStock ? 'In-Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex gap-2.5">
                            <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">LOCATION</p>
                                <p className="font-medium text-gray-900 text-sm">{getLocation()}</p>
                            </div>
                        </div>

                        {/* Re-order Level */}
                        <div className="flex gap-2.5">
                            <RefreshCw size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">RE-ORDER LEVEL</p>
                                <p className="font-medium text-gray-900 text-sm">{product.reorder_level || 10}</p>
                            </div>
                        </div>

                        {/* Refundable Item */}
                        <div className="flex items-start gap-2.5 pt-3 border-t">
                            <input
                                type="checkbox"
                                checked={true}
                                readOnly
                                className="mt-0.5 w-4 h-4"
                            />
                            <div>
                                <p className="font-medium text-xs text-gray-900">Refundable Item</p>
                                <p className="text-xs text-gray-500">( This item can be returned and restocked )</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
