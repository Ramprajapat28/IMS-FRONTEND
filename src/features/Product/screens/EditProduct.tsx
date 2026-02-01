import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, ChevronLeft, Save } from "lucide-react";
import { productsApi } from "@/features/Product/api/product.api";
import { categoriesApi, type Category } from "@/features/Inventory/api/category.api";
import { itemsApi } from "@/features/Inventory/api/item.api";
import { shelvesApi, roomsApi, warehousesApi, racksApi, type Shelf, type Room, type Warehouse, type Rack } from "@/features/Inventory/api/location.api";

type ProductForm = {
    name: string;
    description: string;
    global_category_id: string;
    category: string;
    category_id?: number;
    size: string;
    sku: string;
    product_code: string;
    quantity: string;
    warehouse_id: string;
    room_id: string;
    shelf_id: string;
    rack_id: string;
    refundable: boolean;
    mrp: number | string;
    discounted_price: number | string;
    cost_to_consumer: number | string;
    gst_percentage: number | string;
};

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [currentPage, setCurrentPage] = useState(1);
    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        global_category_id: "",
        category: "",
        size: "",
        sku: "",
        product_code: "",
        quantity: "",
        warehouse_id: "",
        room_id: "",
        shelf_id: "",
        rack_id: "",
        refundable: false,
        mrp: "",
        discounted_price: "",
        cost_to_consumer: "",
        gst_percentage: "",
    });

    // Multiple Image States
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // For display
    const [existingImages, setExistingImages] = useState<any[]>([]); // Keep track of existing { file_path, view }
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // New files to upload

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Autocomplete State
    const [suggestions, setSuggestions] = useState<{ id: number, code: string, name: string }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Dropdown data
    const [categories, setCategories] = useState<Category[]>([]);
    const [globalCategories, setGlobalCategories] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [racks, setRacks] = useState<Rack[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [filteredShelves, setFilteredShelves] = useState<Shelf[]>([]);
    const [filteredRacks, setFilteredRacks] = useState<Rack[]>([]);
    const [selectionType, setSelectionType] = useState<'shelf' | 'rack'>('shelf');

    // Load product data
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const response = await productsApi.getById(Number(id));
                if (response.success && response.data) {
                    const product = response.data;

                    setForm({
                        name: product.name,
                        description: product.description || "",
                        category: product.category_name || "",
                        category_id: product.category_id,
                        global_category_id: String(product.global_category_id || ""),
                        size: product.size || "",
                        sku: product.sku,
                        product_code: product.product_code || "",
                        quantity: "", // Reset quantity for "Add Stock", don't prefill with total stock
                        warehouse_id: "",
                        room_id: "",
                        shelf_id: "",
                        rack_id: "",
                        refundable: false,
                        mrp: Number(product.mrp) || "",
                        discounted_price: Number(product.discounted_price) || "",
                        cost_to_consumer: Number(product.cost_to_consumer) || "",
                        gst_percentage: Number(product.gst_percentage) || "",
                    });

                    // Handle Images
                    if (product.product_image) {
                        if (Array.isArray(product.product_image)) {
                            // New structure: Array of objects or strings
                            const previews = product.product_image.map((img: any) =>
                                typeof img === 'string' ? img : img.file_path
                            ).filter(Boolean);

                            setImagePreviews(previews);
                            setExistingImages(product.product_image);
                        } else if (typeof product.product_image === 'string') {
                            // Legacy: single string
                            setImagePreviews([product.product_image]);
                            setExistingImages([{ file_path: product.product_image, view: "front" }]);
                        }
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load product");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Update global_category_id when categories load
    useEffect(() => {
        if (categories.length > 0 && form.category_id && !form.global_category_id) {
            const matchingCat = categories.find(c => c.category_id === form.category_id);
            if (matchingCat?.global_category_id) {
                setForm(prev => ({
                    ...prev,
                    global_category_id: String(matchingCat.global_category_id)
                }));
            }
        }
    }, [categories, form.category_id, form.global_category_id]);

    // Load dropdown data
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [categoriesRes, globalRes, warehousesRes, roomsRes, shelvesRes, racksRes] = await Promise.all([
                    categoriesApi.getAll(),
                    categoriesApi.getAllGlobal(),
                    warehousesApi.getAll(1, 100),
                    roomsApi.getAll(1, 100),
                    shelvesApi.getAll(1, 100),
                    racksApi.getAll(undefined, 1, 100),
                ]);

                if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data);
                if (globalRes.success && globalRes.data) setGlobalCategories(globalRes.data);
                if (warehousesRes.data) setWarehouses(warehousesRes.data);

                if (roomsRes.rooms) {
                    const mappedRooms = roomsRes.rooms.map((r: any) => ({
                        ...r,
                        name: r.room_name || r.name
                    }));
                    setRooms(mappedRooms);
                }

                if (shelvesRes.data) {
                    const mappedShelves = shelvesRes.data.map((s: any) => ({
                        ...s,
                        name: s.shelf_name || s.name
                    }));
                    setShelves(mappedShelves);
                }

                if (racksRes.data) {
                    const mappedRacks = racksRes.data.map((r: any) => ({
                        ...r,
                        name: r.rack_name || r.name
                    }));
                    setRacks(mappedRacks);
                }
            } catch (err) {
                console.error("Failed to load dropdown data:", err);
            }
        };

        fetchDropdownData();
    }, []);

    // Filter rooms based on warehouse
    useEffect(() => {
        if (form.warehouse_id) {
            const filtered = rooms.filter(r => r.warehouse_id === Number(form.warehouse_id));
            setFilteredRooms(filtered);
        } else {
            setFilteredRooms([]);
        }
    }, [form.warehouse_id, rooms]);

    // Filter shelves and racks based on room
    useEffect(() => {
        if (form.room_id) {
            const filteredS = shelves.filter(s => s.room_id === Number(form.room_id));
            setFilteredShelves(filteredS);

            const filteredR = racks.filter(r => r.room_id === Number(form.room_id));
            setFilteredRacks(filteredR);
        } else {
            setFilteredShelves([]);
            setFilteredRacks([]);
        }
    }, [form.room_id, shelves, racks]);

    const updateField = <K extends keyof ProductForm>(
        key: K,
        value: ProductForm[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        const selectedCat = categories.find(c => c.category_id === selectedId);
        if (selectedCat) {
            setForm(prev => ({
                ...prev,
                category_id: selectedCat.category_id,
                category: selectedCat.category_name
            }));
        }
    };

    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;

        const newFiles: File[] = [];
        const newPreviews: string[] = [];

        Array.from(files).forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} exceeds 5MB limit`);
                return;
            }
            newFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        setSelectedFiles((prev) => [...prev, ...newFiles]);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        // Find if this index corresponds to existing or new
        // existingImages are at the start of visual list? 
        // Logic: display order is [...existingPreviews, ...newPreviews]
        // Actually, existingImages logic is complex if we mix them.
        // Simplification: imagePreviews holds ALL display URLs.
        // We need to know WHICH one to delete.

        // This simple implementation might desync if we don't track indices strictly.
        // Better: store objects in state { type: 'existing'|'new', data: ... }
        // BUT for speed: 
        // Since we pushed existing to imagePreviews first, then new.

        const numExisting = existingImages.length;

        if (index < numExisting) {
            // Remove from existing
            setExistingImages(prev => prev.filter((_, i) => i !== index));
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            // Remove from new
            const newIndex = index - numExisting;
            setSelectedFiles(prev => prev.filter((_, i) => i !== newIndex));
            setImagePreviews(prev => {
                URL.revokeObjectURL(prev[index]);
                return prev.filter((_, i) => i !== index);
            });
        }
    };

    const uploadImagesToS3 = async () => {
        if (selectedFiles.length === 0) return [];

        const uploadPromises = selectedFiles.map(async (file) => {
            try {
                // 1. Get Presigned URL
                const presigned = await productsApi.getPresignedUrl(file.name, "product", "images");

                // 2. Upload to S3
                const uploadRes = await fetch(presigned.presignedUrl, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                });

                if (!uploadRes.ok) throw new Error("Failed to upload to S3");

                return {
                    file_path: presigned.cdnUrl,
                    view: "front" // default view
                };
            } catch (err) {
                console.error(`Failed to upload ${file.name}`, err);
                throw err;
            }
        });

        return Promise.all(uploadPromises);
    };

    const handleNext = () => {
        if (!form.name || !form.category || !form.sku) {
            alert("Please fill all required fields");
            return;
        }
        setCurrentPage(2);
    };

    const handlePrevious = () => {
        setCurrentPage(1);
    };

    const handleSubmit = async () => {
        // Validation: basic fields required. Stock fields optional if quantity is 0 or empty.
        // If quantity is provided, warehouse info is required.
        const stockQuantity = parseInt(form.quantity) || 0;

        if (stockQuantity > 0) {
            if (!form.warehouse_id || !form.room_id || (!form.shelf_id && !form.rack_id)) {
                alert("Please select a shelf or rack to add stock.");
                return;
            }
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Upload New Images
            const newUploadedImages = await uploadImagesToS3();

            // Combine existing (formatted correctly) and new
            // Existing might be strings or objects. normalize to { file_path }
            const formattedExisting = existingImages.map(img =>
                typeof img === 'string' ? { file_path: img, view: 'front' } : img
            );

            const allImages = [...formattedExisting, ...newUploadedImages];

            // 2. Prepare Payload (JSON)
            const payload = {
                name: form.name,
                sku: form.sku,
                product_code: form.product_code,
                category_name: form.category,
                description: form.description,
                size: form.size,
                cost_to_consumer: Number(form.cost_to_consumer) || 0,
                mrp: Number(form.mrp) || 0,
                discounted_price: Number(form.discounted_price) || 0,
                gst_percentage: Number(form.gst_percentage) || 0,
                category_id: Number(form.category_id),
                global_category_id: Number(form.global_category_id),
                product_images: allImages, // Send all images
            };

            // 1. Update Product Details
            await productsApi.update(Number(id), payload as any);

            // 2. Add Stock if quantity is specified
            if (stockQuantity > 0) {
                await itemsApi.addStock({
                    product_id: Number(id),
                    shelf_id: form.shelf_id ? Number(form.shelf_id) : undefined,
                    rack_id: form.rack_id ? Number(form.rack_id) : undefined,
                    quantity: stockQuantity
                });
            }

            navigate("/products");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-gray-400" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-3">
            {/* HEADER */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-blue-600">Edit Product Details</h1>
                    {currentPage === 2 && (
                        <p className="text-sm text-gray-600">Manage product information in the inventory</p>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            {/* PAGE 1: Product Details */}
            {currentPage === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* LEFT FORM */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4 space-y-6">
                        <div className="space-y-5">
                            {/* Product Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Product Name:
                                </label>
                                <input
                                    value={form.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    placeholder="Enter Product Name"
                                    className="w-full max-w-lg border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Product Description (optional):
                                </label>
                                <input
                                    value={form.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    placeholder="Product Description"
                                    className="w-full max-w-lg border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Pricing Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">MRP:</label>
                                    <input
                                        type="number"
                                        value={form.mrp}
                                        onChange={(e) => updateField("mrp", e.target.value)}
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Discounted Price:</label>
                                    <input
                                        type="number"
                                        value={form.discounted_price}
                                        onChange={(e) => updateField("discounted_price", e.target.value)}
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Cost to Consumer:</label>
                                    <input
                                        type="number"
                                        value={form.cost_to_consumer}
                                        onChange={(e) => updateField("cost_to_consumer", e.target.value)}
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">GST %:</label>
                                    <input
                                        type="number"
                                        value={form.gst_percentage}
                                        onChange={(e) => updateField("gst_percentage", e.target.value)}
                                        placeholder="0"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Global & Sub Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                                {/* Global Category */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Select Global Category: <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.global_category_id}
                                        onChange={(e) => setForm(prev => ({
                                            ...prev,
                                            global_category_id: e.target.value,
                                            category_id: undefined,
                                            category: ""
                                        }))}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="" className="text-gray-400">Select Global Category</option>
                                        {globalCategories.map((gc) => (
                                            <option key={gc.global_category_id} value={String(gc.global_category_id)}>
                                                {gc.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sub Category */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Select Category: <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.category_id || ""}
                                        disabled={!form.global_category_id}
                                        onChange={handleCategoryChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                    >
                                        <option value="" className="text-gray-400">Select Category</option>
                                        {categories
                                            .filter(c => c.global_category_id === Number(form.global_category_id))
                                            .map((c) => (
                                                <option key={c.category_id} value={c.category_id}>
                                                    {c.category_name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            {/* Size */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Product Size (if applicable):
                                </label>
                                <select
                                    value={form.size}
                                    disabled={!form.category_id}
                                    onChange={(e) => updateField("size", e.target.value)}
                                    className="w-48 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                >
                                    <option value="">
                                        {!form.category_id ? "Select Category" : (form.size || "Select Size")}
                                    </option>
                                    {/* Dynamically show sizes based on selected category */}
                                    {form.category_id && categories.find(c => c.category_id === Number(form.category_id))?.sizes?.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            {/* SKU */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Product SKU:
                                </label>
                                <input
                                    value={form.sku}
                                    onChange={(e) => updateField("sku", e.target.value)}
                                    placeholder="Enter SKU"
                                    className="w-72 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Product Code (Autocomplete) */}
                            <div className="relative">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Product Code (Variant Group):
                                </label>
                                <input
                                    value={form.product_code}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        updateField("product_code", val);
                                        if (val.length >= 2) {
                                            productsApi.searchCodes(val).then(res => {
                                                if (res.success && res.data) {
                                                    setSuggestions(res.data);
                                                    setShowSuggestions(true);
                                                }
                                            });
                                        } else {
                                            setSuggestions([]);
                                            setShowSuggestions(false);
                                        }
                                    }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onFocus={() => {
                                        if (form.product_code && form.product_code.length >= 2 && suggestions.length > 0) setShowSuggestions(true);
                                    }}
                                    placeholder="e.g. SUMMER-TEE-001"
                                    className="w-72 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">If blank, this product won't be grouped.</p>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-10 w-72 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                                        {suggestions.map((item) => (
                                            <div
                                                key={item.id}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                                onClick={() => {
                                                    updateField("product_code", item.code);
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                <div className="font-medium text-gray-900">{item.code}</div>
                                                <div className="text-xs text-gray-500">{item.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className="flex justify-between items-center pt-4 border-t">
                            <span className="text-sm text-gray-500">Page 1 of 2</span>
                            <button
                                onClick={handleNext}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                            >
                                Next
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="bg-white rounded-xl shadow-sm border p-8 space-y-4">
                        <h2 className="text-lg font-semibold text-blue-600 mb-4">Product Images ({imagePreviews.length}/15)</h2>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative group border rounded-lg p-1 h-24 w-full flex items-center justify-center">
                                    <img src={src} alt="preview" className="h-full w-full object-contain" />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <label className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition relative overflow-hidden">
                            <div className="w-10 h-10 mb-2">
                                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-400">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-gray-700 font-medium text-sm mb-1">
                                Click to add images
                            </p>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={(e) =>
                                    handleImageUpload(e.target.files)
                                }
                            />
                        </label>

                        {/* Add another image button */}
                        {/* <div className="flex justify-center">
                            <button className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-400 transition">
                                <Plus size={24} />
                            </button>
                        </div> */}

                        <div className="space-y-1 pt-4">
                            <p className="text-xs text-gray-600">
                                You can upload up to 15 images, each should not exceed 5 MB.
                            </p>
                            <p className="text-xs text-gray-700 font-medium mt-3">
                                *Recommended: Square images, White background.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* PAGE 2: Quantity & Location */}
            {currentPage === 2 && (
                <div className="bg-white rounded-xl shadow-sm border p-6 ">
                    <div className="space-y-6">
                        {/* Quantity */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Add Stock Quantity <span className="text-xs text-gray-500 font-normal">(Optional - leave 0 to only update details)</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.quantity}
                                onChange={(e) => {
                                    const value = Math.max(0, parseInt(e.target.value) || 0);
                                    updateField("quantity", String(value));
                                }}
                                placeholder=""
                                className="w-52 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-3 block">
                                Select location to store:
                            </label>

                            {/* Desktop Layout - Horizontal */}
                            <div className="hidden md:flex items-start gap-3">
                                {/* Warehouse */}
                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        Warehouse <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.warehouse_id}
                                        onChange={(e) => updateField("warehouse_id", e.target.value)}
                                        className="w-64 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">Select Warehouse</option>
                                        {warehouses.map(w => (
                                            <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Arrow */}
                                <div className="pt-8">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>

                                {/* Room */}
                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        Room <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.room_id}
                                        onChange={(e) => updateField("room_id", e.target.value)}
                                        disabled={!form.warehouse_id}
                                        className="w-64 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        {/* Current Selection */}
                                        <option value="">Select Room</option>
                                        {filteredRooms.map(r => (
                                            <option key={r.room_id} value={r.room_id}>{r.name}</option>
                                        ))}
                                    </select>
                                    {!form.warehouse_id && (
                                        <p className="text-xs text-gray-500 mt-1">Select a warehouse first</p>
                                    )}
                                </div>

                                {/* Arrow */}
                                <div className="pt-8">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>

                                {/* Toggle and Selection */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-700 mb-1 block">
                                        Select Storage Type
                                    </label>
                                    <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectionType('shelf');
                                                setForm(prev => ({ ...prev, rack_id: "" }));
                                            }}
                                            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${selectionType === 'shelf'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Shelf
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectionType('rack');
                                                setForm(prev => ({ ...prev, shelf_id: "" }));
                                            }}
                                            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${selectionType === 'rack'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Rack
                                        </button>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="pt-10">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>

                                {/* Selection Dropdown */}
                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        {selectionType === 'shelf' ? 'Shelf' : 'Rack'} <span className="text-red-500">*</span>
                                    </label>
                                    {selectionType === 'shelf' ? (
                                        <select
                                            value={form.shelf_id}
                                            onChange={(e) => setForm(prev => ({ ...prev, shelf_id: e.target.value, rack_id: "" }))}
                                            disabled={!form.room_id}
                                            className="w-64 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Shelf</option>
                                            {filteredShelves.map(s => (
                                                <option key={s.shelf_id} value={s.shelf_id}>{s.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <select
                                            value={form.rack_id}
                                            onChange={(e) => setForm(prev => ({ ...prev, rack_id: e.target.value, shelf_id: "" }))}
                                            disabled={!form.room_id}
                                            className="w-64 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Rack</option>
                                            {filteredRacks.map(r => (
                                                <option key={r.rack_id} value={r.rack_id}>{r.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Layout - Vertical */}
                            <div className="md:hidden space-y-4">
                                {/* Warehouse */}
                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        Warehouse <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.warehouse_id}
                                        onChange={(e) => updateField("warehouse_id", e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">Select Warehouse</option>
                                        {warehouses.map(w => (
                                            <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Room */}
                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        Room <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.room_id}
                                        onChange={(e) => updateField("room_id", e.target.value)}
                                        disabled={!form.warehouse_id}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select Room</option>
                                        {filteredRooms.map(r => (
                                            <option key={r.room_id} value={r.room_id}>{r.name}</option>
                                        ))}
                                    </select>
                                    {!form.warehouse_id && (
                                        <p className="text-xs text-gray-500 mt-1">Select a warehouse first</p>
                                    )}
                                </div>

                                {/* Toggle and Selection */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-700 block">
                                        Select Storage Type
                                    </label>
                                    <div className="flex p-1 bg-gray-100 rounded-lg w-full">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectionType('shelf');
                                                setForm(prev => ({ ...prev, rack_id: "" }));
                                            }}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectionType === 'shelf'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Shelf
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectionType('rack');
                                                setForm(prev => ({ ...prev, shelf_id: "" }));
                                            }}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectionType === 'rack'
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Rack
                                        </button>
                                    </div>
                                </div>

                                {/* Selection Dropdown */}
                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        {selectionType === 'shelf' ? 'Shelf' : 'Rack'} <span className="text-red-500">*</span>
                                    </label>
                                    {selectionType === 'shelf' ? (
                                        <select
                                            value={form.shelf_id}
                                            onChange={(e) => setForm(prev => ({ ...prev, shelf_id: e.target.value, rack_id: "" }))}
                                            disabled={!form.room_id}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Shelf</option>
                                            {filteredShelves.map(s => (
                                                <option key={s.shelf_id} value={s.shelf_id}>{s.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <select
                                            value={form.rack_id}
                                            onChange={(e) => setForm(prev => ({ ...prev, rack_id: e.target.value, shelf_id: "" }))}
                                            disabled={!form.room_id}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Rack</option>
                                            {filteredRacks.map(r => (
                                                <option key={r.rack_id} value={r.rack_id}>{r.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Refundable */}
                        {/* <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.refundable}
                                onChange={(e) => updateField("refundable", e.target.checked)}
                                className="mt-1 w-4 h-4"
                            />
                            <div>
                                <p className="font-medium text-sm">Refundable Item</p>
                                <p className="text-xs text-gray-500">
                                    This item can be returned and restocked
                                </p>
                            </div>
                        </label> */}

                        {/* Footer Buttons */}
                        <div className="flex justify-between items-center pt-6 border-t">
                            <button
                                onClick={handlePrevious}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center gap-2"
                            >
                                <ChevronLeft size={20} />
                                Previous
                            </button>

                            <span className="text-sm text-gray-500">Page 2 of 2</span>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={20} />
                                Save & Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProduct;
