import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Filter, Plus } from "lucide-react";
import { useState } from "react";

// Mock data - replace with actual API call
const getCategoryProducts = (categoryId: string) => {
    // This would be replaced with actual API call
    const products = [
        { id: "P001", name: "Blue Jersey T-shirt", sku: "TS01-BL-M", price: 599, variants: 5, category: "T-shirts", image: "https://via.placeholder.com/80" },
        { id: "P002", name: "White Cotton T-shirt", sku: "TS02-WH-L", price: 499, variants: 6, category: "T-shirts", image: "https://via.placeholder.com/80" },
        { id: "P003", name: "Black Polo T-shirt", sku: "TS03-BK-XL", price: 799, variants: 4, category: "T-shirts", image: "https://via.placeholder.com/80" },
        { id: "P004", name: "Red Sports T-shirt", sku: "TS04-RD-M", price: 699, variants: 7, category: "T-shirts", image: "https://via.placeholder.com/80" },
    ];

    return products;
};

const ProductCategoryProductsPage = () => {
    const { categoryId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const categoryName = location.state?.categoryName || "Category";

    const [searchTerm, setSearchTerm] = useState("");
    const products = getCategoryProducts(categoryId || "");

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-3 text-sm"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Categories
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">{categoryName}</h1>
                        <p className="text-sm text-gray-600 mt-1">{filteredProducts.length} products</p>
                    </div>
                    <button
                        onClick={() => navigate("/products/add")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl border p-4 mb-6">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                        onClick={() => navigate(`/products/variants/${product.id}`)}
                    >
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                                <span className="text-xs text-gray-500">{product.variants} variants</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="bg-white rounded-xl border p-12 text-center">
                    <p className="text-gray-500">No products found</p>
                </div>
            )}
        </div>
    );
};

export default ProductCategoryProductsPage;
