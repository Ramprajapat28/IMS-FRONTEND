import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Filter } from "lucide-react";
import { useState } from "react";

// Mock data - replace with actual API call
const getCategoryProducts = (categoryId: string) => {
    // This would be replaced with actual API call
    const products = [
        { id: "P001", name: "Blue Jersey T-shirt", sku: "TS01-BL-M", stock: 45, warehouse: "Main", room: "A1", shelf: "S3" },
        { id: "P002", name: "White Cotton T-shirt", sku: "TS02-WH-L", stock: 32, warehouse: "Main", room: "A1", shelf: "S3" },
        { id: "P003", name: "Black Polo T-shirt", sku: "TS03-BK-XL", stock: 28, warehouse: "Main", room: "A2", shelf: "S1" },
        { id: "P004", name: "Red Sports T-shirt", sku: "TS04-RD-M", stock: 19, warehouse: "Warehouse B", room: "B1", shelf: "S2" },
    ];

    return products;
};

const InventoryCategoryProductsPage = () => {
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
                <h1 className="text-2xl font-bold text-blue-600">{categoryName} - Inventory</h1>
                <p className="text-sm text-gray-600 mt-1">{filteredProducts.length} items in stock</p>
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

            {/* Products Table */}
            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Warehouse</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Room</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Shelf</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 cursor-pointer">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 30 ? 'bg-green-100 text-green-800' :
                                            product.stock > 15 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.warehouse}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.room}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.shelf}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => navigate(`/inventory/variants/${product.id}`)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No products found
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryCategoryProductsPage;
