import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { categoriesApi, type GlobalCategory } from "../api/category.api";
import { productsApi } from "@/features/Product/api/product.api";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";

const AddCategoryPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [globalCategories, setGlobalCategories] = useState<GlobalCategory[]>([]);

    const [name, setName] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [sizes, setSizes] = useState("");
    const [globalId, setGlobalId] = useState<string>(location.state?.global_category_id || "");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGlobals = async () => {
            try {
                const res = await categoriesApi.getAllGlobal();
                if (res.success && res.data) setGlobalCategories(res.data);
            } catch (err) {
                console.error("Failed to load categories");
            } finally {
                setIsLoading(false);
            }
        };
        fetchGlobals();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        try {
            const cdnUrl = await uploadToCloudinary(file, "category", "logo", productsApi.getPresignedUrl);
            setLogoUrl(cdnUrl);
        } catch (err) {
            setError("Failed to upload logo");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !globalId) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const sizesArray = sizes.split(",").map(s => s.trim()).filter(s => s !== "");

            const res = await categoriesApi.createCategory({
                category_name: name,
                global_category_id: Number(globalId),
                logo_url: logoUrl || null,
                sizes: sizesArray.length > 0 ? sizesArray : null
            });
            if (res.success) {
                navigate(-1);
            } else {
                setError(res.message || "Failed to create");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-blue-600">Add Sub Category</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6 shadow-sm">
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                        required
                        value={globalId}
                        onChange={(e) => setGlobalId(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="">Select Category</option>
                        {globalCategories.map(gc => (
                            <option key={gc.global_category_id} value={gc.global_category_id}>{gc.category_name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category Name *</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. T-shirts, Running Shoes"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes (Comma separated)</label>
                    <input
                        type="text"
                        value={sizes}
                        onChange={(e) => setSizes(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. S, M, L, XL or 7, 8, 9, 10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter sizes separated by commas</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo / Icon (Optional)</label>
                    <div className="flex items-center gap-4">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-lg object-cover border" />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center border border-dashed text-gray-400">
                                <Upload size={24} />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="text-xs"
                            disabled={isUploading}
                        />
                        {isUploading && <Loader2 className="animate-spin text-blue-600" size={16} />}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || isUploading || !name || !globalId}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Create Sub Category
                </button>
            </form>
        </div>
    );
};

export default AddCategoryPage;
