import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Tag, Hash, Package, Download, FileText, Percent, IndianRupee, Printer } from "lucide-react";
import { productsApi } from "@/features/Product/api/product.api";
import { formatCurrency } from "@/utils";
import type { Product } from "@/features/Product/types";

const InventoryProductDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedImage, setSelectedImage] = useState<string>("");


    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const response = await productsApi.getDetails(Number(id));
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

    useEffect(() => {
        if (product?.product_image) {
            const initialImage = Array.isArray(product.product_image) && product.product_image.length > 0
                ? resolveUrl(product.product_image[0])
                : resolveUrl(product.product_image);
            setSelectedImage(initialImage);
        }
    }, [product]);

    // Helper to extract URL from a SINGLE image object/string
    const resolveUrl = (image: any): string => {
        if (!image) return "";
        if (typeof image === 'object') {
            return image.file_path || image.cdnUrl || image.url || "";
        }
        if (typeof image === 'string') {
            if (image.startsWith('{') || image.startsWith('"')) {
                try {
                    const parsed = JSON.parse(image);
                    return typeof parsed === 'object' ? (parsed.file_path || parsed.cdnUrl || parsed.url || "") : parsed;
                } catch {
                    return image;
                }
            }
            return image;
        }
        return "";
    };

    // Helper to get ALL valid image URLs
    const getAllImages = (): string[] => {
        if (!product?.product_image) return [];

        if (Array.isArray(product.product_image)) {
            // If it's already an array of images
            return product.product_image.map(resolveUrl).filter(Boolean);
        }

        // Handle if it's a string that might be a JSON array
        if (typeof product.product_image === 'string') {
            try {
                if (product.product_image.trim().startsWith('[')) {
                    const parsed = JSON.parse(product.product_image);
                    if (Array.isArray(parsed)) {
                        return parsed.map(resolveUrl).filter(Boolean);
                    }
                }
            } catch (e) {
                // heuristic to treat as single image
            }
        }

        const single = resolveUrl(product.product_image);
        return single ? [single] : [];
    };

    // Alias for compatibility if needed, using the robust resolver


    const handleDownloadBarcode = async () => {
        const imageUrl = resolveUrl(product?.barcode_image);
        if (!imageUrl) return;

        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${product?.sku || 'barcode'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download barcode", err);
            window.open(imageUrl, '_blank');
        }
    };

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Barcode-${product?.sku || 'product'}`,
    });

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
                        onClick={() => navigate("/inventory")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Inventory
                    </button>
                </div>
            </div>
        );
    }



    const stockQty = product.stock_quantity || 0;
    const reorderLevel = product.reorder_level || 10;
    const isInStock = stockQty > 0;
    const isLowStock = isInStock && stockQty <= reorderLevel;
    const allImages = getAllImages();

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
                            <span className="text-gray-600">› {product.size}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* LEFT - Product Image & Barcode */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4 space-y-4">
                    {/* Product Image */}
                    {/* Product Image */}
                    {/* Product Image Gallery */}
                    <div className="space-y-3">
                        {/* Main Image */}
                        <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center h-64 border">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
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

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${selectedImage === img ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Name & Size */}
                    <div className="text-center space-y-1">
                        <h2 className="text-base font-semibold">{product.name}</h2>
                        <span className="inline-block px-3 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {product.size}
                        </span>
                    </div>

                    {/* Barcode */}
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-3 text-center">
                        <div className="flex justify-center mb-1">
                            {product.barcode_image && (
                                <img
                                    src={resolveUrl(product.barcode_image)}
                                    alt="Barcode"
                                    className="w-full h-auto max-h-52 object-contain"
                                    style={{ imageRendering: "pixelated" }}
                                />
                            )}
                        </div>
                        <p className="text-xs font-mono text-gray-600">{product.sku}</p>
                    </div>

                    {/* Download Barcode Button */}
                    <button
                        onClick={handleDownloadBarcode}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
                    >
                        <Download size={16} />
                        Download barcode
                    </button>

                    {/* Print Barcode Button */}
                    <button
                        onClick={() => handlePrint()}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm"
                    >
                        <Printer size={16} />
                        Print Barcode
                    </button>

                    {/* Hidden Printable Component */}
                    <div style={{ display: "none" }}>
                        <div ref={printRef} className="p-4 text-center" style={{ width: "300px", height: "200px", border: "1px solid #ccc", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 5px 0" }}>{product.name}</h2>
                            <p style={{ fontSize: "12px", margin: "0 0 10px 0" }}>Size: {product.size} | SKU: {product.sku}</p>
                            {product.barcode_image && (
                                <img
                                    src={resolveUrl(product.barcode_image)}
                                    alt="Barcode"
                                    style={{ width: "100%", height: "auto", maxHeight: "100px", imageRendering: "pixelated" }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT - Product Information */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border p-4">
                    {/* Header - WITHOUT EDIT BUTTON */}
                    <div className="flex justify-between items-center mb-4 pb-3 border-b">
                        <h2 className="text-lg font-semibold text-blue-600">Product Information</h2>
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
                        <div className="flex gap-4">
                            <div className="flex gap-2.5">
                                <Tag size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5 uppercase">Global Category</p>
                                    <p className="font-medium text-gray-900 text-sm">{product.global_category_name || "-"}</p>
                                </div>
                            </div>
                            <div className="flex gap-2.5 ml-4 border-l pl-4">
                                <Tag size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5 uppercase">Category</p>
                                    <p className="font-medium text-gray-900 text-sm">{product.category_name || "-"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Size */}
                        <div className="flex gap-2.5">
                            <Tag size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">SIZE</p>
                                <p className="font-medium text-gray-900 text-sm">{product.size}</p>
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

                        {/* Pricing Info */}
                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                                    <IndianRupee size={12} /> MRP
                                </p>
                                <p className="font-bold text-gray-900">{product.mrp ? formatCurrency(product.mrp) : "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 mb-0.5 flex items-center gap-1">
                                    <IndianRupee size={12} /> DISCOUNTED PRICE
                                </p>
                                <p className="font-bold text-blue-600">{product.discounted_price ? formatCurrency(product.discounted_price) : "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                                    <Percent size={12} /> GST %
                                </p>
                                <p className="font-medium text-gray-900">{product.gst_percentage ? `${product.gst_percentage}%` : "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                                    <IndianRupee size={12} /> CTC
                                </p>
                                <p className="font-medium text-gray-900">{product.cost_to_consumer ? formatCurrency(product.cost_to_consumer) : "-"}</p>
                            </div>
                        </div>

                        {/* Available Quantity */}
                        <div className="flex gap-2.5">
                            <Package size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-0.5">AVAILABLE QUANTITY</p>
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-900 text-sm">{product.stock_quantity || 0}</p>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${!isInStock ? 'bg-red-100 text-red-700' : isLowStock ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {!isInStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In-Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">LOCATION</p>

                            {product.stock_details && product.stock_details.length > 0 ? (
                                <div className="text-sm font-medium text-gray-900 space-y-1">
                                    {product.stock_details.map((s, index) => (
                                        <div key={index}>
                                            {s.warehouse_name} , {s.room_name} , {s.shelf_name} ({s.item_count})
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">Not assigned</p>
                            )}
                        </div>


                        {/* Re-order Level */}
                        <div className="flex gap-2.5">
                            <span className="text-gray-400 mt-0.5 flex-shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                            </span>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5 uppercase">Low stock limit (Re-order level)</p>
                                <p className="font-medium text-gray-900 text-sm">{product.reorder_level || 10}</p>
                            </div>
                        </div>

                        {/* Refundable Item */}
                        {/* <div className="flex items-start gap-2.5 pt-3 border-t">
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
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryProductDetailsPage;
