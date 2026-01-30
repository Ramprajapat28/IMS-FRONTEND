import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { productsApi } from "@/features/Product/api/product.api";
import { categoriesApi, type Category } from "@/features/Inventory/api/category.api";

/* ----------------------------- TYPES ----------------------------- */
type ProductForm = {
  name: string;
  description: string;
  global_category_id: string;
  category_id: string;
  category: string;
  size: string;
  sku: string;
  product_code: string;
  mrp: number | string;
  discounted_price: number | string;
  cost_to_consumer: number | string;
  gst_percentage: number | string;
};

/* ----------------------------- COMPONENT ----------------------------- */
const AddProduct = () => {
  const navigate = useNavigate();

  /* ----------------------------- STATE ----------------------------- */
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    global_category_id: "",
    category_id: "",
    category: "",
    size: "",
    sku: "",
    product_code: "",
    mrp: "",
    discounted_price: "",
    cost_to_consumer: "",
    gst_percentage: "",
  });

  // Multiple Image States
  const [imagePreviews, setImagePreviews] = useState<{ url: string; uploading: boolean; error?: boolean }[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalCategories, setGlobalCategories] = useState<any[]>([]);

  // Autocomplete State
  const [suggestions, setSuggestions] = useState<{ id: number, code: string, name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load categories and global categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, globalRes] = await Promise.all([
          categoriesApi.getAll(),
          categoriesApi.getAllGlobal()
        ]);

        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
        if (globalRes.success && globalRes.data) {
          setGlobalCategories(globalRes.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchData();
  }, []);

  /* ----------------------------- HANDLERS ----------------------------- */
  const updateField = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    try {
      // 1. Get Presigned URL
      const presigned = await productsApi.getPresignedUrl(file.name, "product", "images");

      // 2. Upload to S3
      const uploadRes = await fetch(presigned.presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          // Use exact content type if provided, otherwise fallback to file.type, but respecting user's recent changes
          "Content-Type": presigned.contentType || file.type
        },
      });

      if (!uploadRes.ok) {
        throw new Error(`Failed to upload to S3: ${uploadRes.status}`);
      }

      return presigned.cdnUrl;
    } catch (err) {
      console.error(`Failed to upload ${file.name}`, err);
      return null;
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    // Create temporary placeholders
    const newPreviews = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file), // Local preview
      uploading: true
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Process uploads
    const newUploadedUrls: string[] = [];
    const fileArray = Array.from(files);

    /* 
       We need to track index relative to the TOTAL list to update loading state correctly.
       However, simplified approach: append new ones, upload them, then update their status.
    */

    // We know the starting index of new items
    const startIndex = imagePreviews.length;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const globalIndex = startIndex + i;

      // Upload
      const url = await uploadSingleFile(file);

      if (url) {
        newUploadedUrls.push(url);
        // Mark validation success
        setImagePreviews(prev => prev.map((item, idx) =>
          idx === globalIndex ? { ...item, uploading: false } : item
        ));
      } else {
        // Mark error
        setImagePreviews(prev => prev.map((item, idx) =>
          idx === globalIndex ? { ...item, uploading: false, error: true } : item
        ));
      }
    }

    setUploadedUrls((prev) => [...prev, ...newUploadedUrls]);
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.category || !form.sku) {
      alert("Please fill all required fields");
      return;
    }

    // Check if uploads are still pending
    if (imagePreviews.some(img => img.uploading)) {
      alert("Please wait for images to finish uploading");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create Product Payload (JSON)
      // Map stored URLs to the format backend expects
      const productImages = uploadedUrls.map(url => ({
        file_path: url,
        view: "front"
      }));

      const payload = {
        name: form.name,
        sku: form.sku,
        product_code: form.product_code,
        category: form.category,
        description: form.description,
        size: form.size,
        cost_to_consumer: Number(form.cost_to_consumer) || 0,
        mrp: Number(form.mrp) || 0,
        discounted_price: Number(form.discounted_price) || 0,
        gst_percentage: Number(form.gst_percentage) || 0,
        category_id: Number(form.category_id),
        global_category_id: Number(form.global_category_id),
        product_image: productImages
      };

      const productRes = await productsApi.create(payload as any);

      if (!productRes.success || !productRes.data) {
        throw new Error(productRes.message || "Failed to create product");
      }

      // Success - navigate back to products
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className=" max-w-7xl mx-auto space-y-3">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-blue-600">Add Product</h1>
          <p className="text-sm text-gray-600">
            Create and manage products in the inventory
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT FORM */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6 space-y-6">
          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Enter Product Name: <span className="text-red-500">*</span>
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
                Enter Product Description (optional):
              </label>
              <input
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Enter Product Description"
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
            <div className="flex flex-col md:flex-row gap-4">
              {/* Global Category */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Global Category: <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.global_category_id}
                  onChange={(e) => {
                    updateField("global_category_id", e.target.value);
                    updateField("category_id", "");
                    updateField("category", "");
                  }}
                  className="w-72 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="" className="text-gray-400">Select Global Category</option>
                  {globalCategories.map((gc) => (
                    <option key={gc.global_category_id} value={gc.global_category_id}>
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
                  value={form.category_id}
                  disabled={!form.global_category_id}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedCat = categories.find(c => c.category_id === Number(selectedId));
                    if (selectedCat) {
                      setForm(prev => ({
                        ...prev,
                        category_id: selectedId,
                        category: selectedCat.category_name
                      }));
                    }
                  }}
                  className="w-72 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
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
                Select Product Size (if applicable):
              </label>
              <select
                value={form.size}
                onChange={(e) => updateField("size", e.target.value)}
                className="w-72 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="" className="text-gray-400">Select Size</option>
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
                Enter Product SKU: <span className="text-red-500">*</span>
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
                Enter Product Code (Variant Group):
              </label>
              <input
                value={form.product_code}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField("product_code", val);
                  // Basic debounce could be added here, but for now simple onChange is okay for limited users
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
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                onFocus={() => {
                  if (form.product_code.length >= 2 && suggestions.length > 0) setShowSuggestions(true);
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

          {/* FOOTER BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition font-medium mt-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating Product...
              </>
            ) : (
              <>
                Add Product
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </>
            )}
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-4 ">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Product Images ({imagePreviews.length}/15)</h2>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {imagePreviews.map((img, index) => (
              <div key={index} className={`relative group border rounded-lg p-1 h-24 w-full flex items-center justify-center ${img.error ? 'border-red-400 bg-red-50' : ''}`}>
                {img.uploading ? (
                  <Loader2 className="animate-spin text-blue-600" size={24} />
                ) : img.error ? (
                  <span className="text-xs text-red-500 font-medium">Upload Failed</span>
                ) : (
                  <img src={img.url} alt="preview" className="h-full w-full object-contain" />
                )}

                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition shadow-sm z-10"
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
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </label>

          {/* Add another image button (Optional explicit button) */}
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
    </div>
  );
};

export default AddProduct;
