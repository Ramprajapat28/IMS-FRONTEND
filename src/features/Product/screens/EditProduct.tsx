import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, ChevronLeft, Save } from "lucide-react";
import { productsApi } from "@/features/Product/api/product.api";
import { shelvesApi, roomsApi, warehousesApi, type Shelf, type Room, type Warehouse } from "@/features/Inventory/api/location.api";

type ProductForm = {
    name: string;
    description: string;
    category: string;
    size: string;
    sku: string;
    quantity: string;
    reorderLevel: string;
    warehouse_id: string;
    room_id: string;
    shelf_id: string;
    refundable: boolean;
};

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [currentPage, setCurrentPage] = useState(1);
    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        category: "",
        size: "",
        sku: "",
        quantity: "",
        reorderLevel: "",
        warehouse_id: "",
        room_id: "",
        shelf_id: "",
        refundable: false,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dropdown data
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [filteredShelves, setFilteredShelves] = useState<Shelf[]>([]);

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
                        category: product.category || "",
                        size: "", // TODO: Get from variant if applicable
                        sku: product.sku,
                        quantity: String(product.stock_quantity || 0),
                        reorderLevel: String(product.reorder_level || 0),
                        warehouse_id: "",
                        room_id: "",
                        shelf_id: "",
                        refundable: false,
                    });

                    if (product.product_image) {
                        setImagePreview(product.product_image);
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

    // Load dropdown data
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [warehousesRes, roomsRes, shelvesRes] = await Promise.all([
                    warehousesApi.getAll(1, 100),
                    roomsApi.getAll(1, 100),
                    shelvesApi.getAll(1, 100),
                ]);

                if (warehousesRes.data) setWarehouses(warehousesRes.data);
                if (roomsRes.rooms) setRooms(roomsRes.rooms);
                if (shelvesRes.data) setShelves(shelvesRes.data);
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

    // Filter shelves based on room
    useEffect(() => {
        if (form.room_id) {
            const filtered = shelves.filter(s => s.room_id === Number(form.room_id));
            setFilteredShelves(filtered);
        } else {
            setFilteredShelves([]);
        }
    }, [form.room_id, shelves]);

    const updateField = <K extends keyof ProductForm>(
        key: K,
        value: ProductForm[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        setSelectedFile(file);
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
        if (!form.quantity || !form.warehouse_id || !form.room_id || !form.shelf_id) {
            alert("Please fill all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: Implement actual update logic with API
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("sku", form.sku);
            formData.append("category", form.category);
            if (form.description) formData.append("description", form.description);
            if (form.reorderLevel) formData.append("reorder_level", form.reorderLevel);

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            // await productsApi.update(Number(id), formData);
            // await itemsApi.addStock({ product_id: Number(id), shelf_id: Number(form.shelf_id), quantity: Number(form.quantity) });

            console.log("Saving product:", form);
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

                            {/* Category */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Product Category:
                                </label>
                                <select
                                    value={form.category}
                                    onChange={(e) => updateField("category", e.target.value)}
                                    className="w-48 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">Size</option>
                                    <option value="T-Shirts">T-Shirts</option>
                                    <option value="Caps">Caps</option>
                                    <option value="Bottles">Bottles</option>
                                    <option value="Mugs">Mugs</option>
                                    <option value="Cases">Cases</option>
                                    <option value="Bags">Bags</option>
                                    <option value="Phone">Phone</option>
                                    <option value="Furniture">Furniture</option>
                                </select>
                            </div>

                            {/* Size */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Product Size (if applicable):
                                </label>
                                <select
                                    value={form.size}
                                    onChange={(e) => updateField("size", e.target.value)}
                                    className="w-48 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">Size</option>
                                    <option value="S">Small</option>
                                    <option value="M">Medium</option>
                                    <option value="L">Large</option>
                                    <option value="XL">X-Large</option>
                                    <option value="XXL">2X-Large</option>
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
                        <h2 className="text-lg font-semibold text-blue-600 mb-4">Product Image</h2>

                        <label className="border-2 border-dashed border-gray-300 rounded-xl h-56 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition relative overflow-hidden">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    className="h-full w-full object-contain rounded-lg p-2"
                                    alt="preview"
                                />
                            ) : (
                                <>
                                    <div className="w-20 h-20 mb-3">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-400">
                                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                            <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 font-medium mb-1">
                                        Drag images(s) here
                                    </p>
                                    <span className="text-blue-600 text-sm font-medium">Browse Images</span>
                                </>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) =>
                                    e.target.files && handleImageUpload(e.target.files[0])
                                }
                            />
                        </label>

                        {/* Add another image button */}
                        <div className="flex justify-center">
                            <button className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-400 transition">
                                <Plus size={24} />
                            </button>
                        </div>

                        <div className="space-y-1 pt-4">
                            <p className="text-xs text-gray-600">
                                You can upload up to 15 images, each should not exceed 5 MB in size and 7000 × 7000 pixels resolution.
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
                                Update Quantity <span className="text-red-500">*</span>
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

                        {/* Re-order Level */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Re-Order Level <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.reorderLevel}
                                onChange={(e) => {
                                    const value = Math.max(0, parseInt(e.target.value) || 0);
                                    updateField("reorderLevel", String(value));
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

                                {/* Shelf */}
                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        Shelf <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.shelf_id}
                                        onChange={(e) => updateField("shelf_id", e.target.value)}
                                        disabled={!form.room_id}
                                        className="w-64 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select Shelf</option>
                                        {filteredShelves.map(s => (
                                            <option key={s.shelf_id} value={s.shelf_id}>{s.name}</option>
                                        ))}
                                    </select>
                                    {!form.room_id && form.warehouse_id && (
                                        <p className="text-xs text-gray-500 mt-1">Select a room first</p>
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

                                {/* Shelf */}
                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        Shelf <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.shelf_id}
                                        onChange={(e) => updateField("shelf_id", e.target.value)}
                                        disabled={!form.room_id}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select Shelf</option>
                                        {filteredShelves.map(s => (
                                            <option key={s.shelf_id} value={s.shelf_id}>{s.name}</option>
                                        ))}
                                    </select>
                                    {!form.room_id && form.warehouse_id && (
                                        <p className="text-xs text-gray-500 mt-1">Select a room first</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Refundable */}
                        <label className="flex items-start gap-3 cursor-pointer">
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
                        </label>

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
