import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package, Shirt, Droplet, Briefcase, Coffee, Smartphone, ArrowRight,
    Box, Loader2, Plus, ArrowLeft, Edit2, Trash2
} from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import { categoriesApi } from "@/features/Inventory/api/category.api";
import { resolveUrl } from "@/utils";

interface CategoryUI {
    id: string; // Numeric ID as string
    name: string;
    count: number;
    icon: React.ReactNode;
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
    const { globalId } = useParams<{ globalId: string }>();
    const location = useLocation();
    const globalCategoryName = location.state?.globalCategoryName || "Categories";

    const [categories, setCategories] = useState<CategoryUI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriesApi.getListWithCounts();
                if (response.success && response.data) {
                    let filteredData = response.data;

                    if (globalId) {
                        filteredData = response.data.filter(cat => Number((cat as any).global_category_id) === Number(globalId));
                    }

                    const mapped = filteredData.map((cat, index) => {
                        const config = UI_CONFIGS[index % UI_CONFIGS.length];
                        const categoryLogo = resolveUrl(cat.logo_url);
                        return {
                            id: String(cat.category_id),
                            name: cat.category_name,
                            count: cat.total_products || 0,
                            icon: categoryLogo ? (
                                <img src={categoryLogo} alt={cat.category_name} className="w-full h-full object-cover rounded-lg" />
                            ) : config.icon,
                            color: categoryLogo ? "" : config.color
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
    }, [globalId]);

    const handleCategoryClick = (category: CategoryUI) => {
        navigate(`/inventory/category/${category.id}`, { state: { categoryName: category.name } });
    };

    const handleDeleteCategory = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const res = await categoriesApi.deleteCategory(Number(id));
            if (res.success) {
                setCategories(prev => prev.filter(c => c.id !== id));
            } else {
                alert(res.message || "Failed to delete");
            }
        } catch (err) {
            alert("Failed to delete category");
        }
    };

    // Handle loading/error states in the grid area below

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600 capitalize">{globalCategoryName}</h1>
                        <p className="text-sm text-gray-600 mt-1">Select a category to view inventory items</p>
                    </div>
                </div>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
                    onClick={() => navigate("/inventory/add-category", { state: { global_category_id: globalId, global_category_name: globalCategoryName } })}
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <div className="col-span-full flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border border-gray-200">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No categories available</p>
                    </div>
                ) : categories.length > 0 ? (
                    categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 group text-left"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center overflow-hidden`}>
                                    {category.icon}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/inventory/edit-category/${category.id}`);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteCategory(e, category.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.count} items in stock</p>
                        </button>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No categories found. Add one to get started.</p>
                    </div>
                )}
            </div>
        </div >
    );
};

export default InventoryCategoriesPage;
