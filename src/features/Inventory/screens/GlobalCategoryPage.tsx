import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight, Loader2, Plus, Package, Edit2, Trash2
} from "lucide-react";
import { categoriesApi, type GlobalCategory } from "../api/category.api";

import { resolveUrl } from "@/utils";

const GlobalCategoryPage = () => {
    const navigate = useNavigate();
    const [globalCategories, setGlobalCategories] = useState<GlobalCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGlobalCategories = async () => {
            try {
                const response = await categoriesApi.getAllGlobal();
                if (response.success && response.data) {
                    setGlobalCategories(response.data);
                }
            } catch (err) {
                setError("Failed to load categories");
            } finally {
                setIsLoading(false);
            }
        };

        fetchGlobalCategories();
    }, []);

    const handleGlobalCategoryClick = (id: number, name: string) => {
        navigate(`/inventory/global-category/${id}/categories`, { state: { globalCategoryName: name } });
    };

    const handleDeleteGlobal = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this global category?")) return;

        try {
            const res = await categoriesApi.deleteGlobal(id);
            if (res.success) {
                setGlobalCategories(prev => prev.filter(c => c.global_category_id !== id));
            } else {
                alert(res.message || "Failed to delete");
            }
        } catch (err) {
            alert("Failed to delete category");
        }
    };

    // Remove the separate error/loading returns - we'll handle them in the grid

    return (
        <div className=" mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600">Inventory</h1>
                    <p className="text-sm text-gray-600 mt-1">Select a category to browse</p>
                </div>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
                    onClick={() => navigate("/inventory/add-global")}
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Global Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border border-gray-200">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No categories available</p>
                    </div>
                ) : globalCategories.length > 0 ? (
                    globalCategories.map((category) => (
                        <button
                            key={category.global_category_id}
                            onClick={() => handleGlobalCategoryClick(category.global_category_id, category.category_name)}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 group text-left"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100">
                                    <img
                                        src={resolveUrl(category.logo_url) || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200"}
                                        alt={category.category_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/inventory/edit-global/${category.global_category_id}`);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteGlobal(e, category.global_category_id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1 capitalize">{category.category_name}</h3>
                            <p className="text-sm text-gray-500">Click to view categories</p>
                        </button>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No categories found. Add one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalCategoryPage;
