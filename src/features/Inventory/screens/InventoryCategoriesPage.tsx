import { useNavigate } from "react-router-dom";
import { Package, Shirt, Droplet, Briefcase, Coffee, Smartphone, ArrowRight } from "lucide-react";

interface Category {
    id: string;
    name: string;
    icon: React.ReactNode;
    count: number;
    color: string;
}

const categories: Category[] = [
    { id: "tshirts", name: "T-Shirts", icon: <Shirt className="w-6 h-6" />, count: 45, color: "bg-blue-50 text-blue-600" },
    { id: "caps", name: "Caps", icon: <Package className="w-6 h-6" />, count: 28, color: "bg-purple-50 text-purple-600" },
    { id: "bottles", name: "Bottles", icon: <Droplet className="w-6 h-6" />, count: 32, color: "bg-cyan-50 text-cyan-600" },
    { id: "leather-bags", name: "Leather Bags", icon: <Briefcase className="w-6 h-6" />, count: 18, color: "bg-amber-50 text-amber-600" },
    { id: "mugs", name: "Mugs", icon: <Coffee className="w-6 h-6" />, count: 56, color: "bg-orange-50 text-orange-600" },
    { id: "iphone-covers", name: "iPhone Covers", icon: <Smartphone className="w-6 h-6" />, count: 42, color: "bg-pink-50 text-pink-600" },
];

const InventoryCategoriesPage = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryId: string, categoryName: string) => {
        navigate(`/inventory/category/${categoryId}`, { state: { categoryName } });
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-blue-600">Inventory Categories</h1>
                <p className="text-sm text-gray-600 mt-1">Select a category to view inventory items</p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id, category.name)}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 group text-left"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                                {category.icon}
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.count} items in stock</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default InventoryCategoriesPage;
