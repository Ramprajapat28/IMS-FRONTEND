import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package, Shirt, Droplet, Briefcase, Coffee, Smartphone, ArrowRight,
    Box, Loader2
} from "lucide-react";
import { categoriesApi } from "@/features/Product/api/category.api";

interface CategoryUI {
    id: string; // Keep as string for URL/routing
    name: string;
    icon: React.ReactNode;
    count: number;
    color: string;
}

const UI_CONFIGS = [
    { icon: <Shirt className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
    { icon: <Package className="w-6 h-6" />, color: "bg-purple-50 text-purple-600" },
    { icon: <Droplet className="w-6 h-6" />, color: "bg-cyan-50 text-cyan-600" },
    { icon: <Briefcase className="w-6 h-6" />, color: "bg-amber-50 text-amber-600" },
    { icon: <Coffee className="w-6 h-6" />, color: "bg-orange-50 text-orange-600" },
    { icon: <Smartphone className="w-6 h-6" />, color: "bg-pink-50 text-pink-600" },
    { icon: <Box className="w-6 h-6" />, color: "bg-emerald-50 text-emerald-600" },
];

const InventoryCategoriesPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CategoryUI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriesApi.getListWithCounts();
                if (response.success && response.data) {
                    const mapped = response.data.map((cat, index) => {
                        const config = UI_CONFIGS[index % UI_CONFIGS.length];
                        return {
                            id: cat.category_name, // Use name as ID for URL friendly approach if needed, or stick to ID
                            name: cat.category_name,
                            count: cat.total_products || 0,
                            icon: config.icon,
                            color: config.color
                        };
                    });
                    setCategories(mapped);
                }
            } catch (err) {
                setError("Failed to load categories");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryName: string) => {
        // Navigate using category name as per user request to use "mine" (InventoryCategoryProductsPage uses name?)
        // The router expects /inventory/category/:categoryId
        // We will pass the name as the ID param for simpler lookups if the backend supports it, 
        // OR pass the ID if the products page expects ID. 
        // The plan said "getByCategory(categoryName)", so we pass name.
        navigate(`/inventory/category/${encodeURIComponent(categoryName)}`, { state: { categoryName } });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600 py-10">{error}</div>;
    }

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
                        key={category.name}
                        onClick={() => handleCategoryClick(category.name)}
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
