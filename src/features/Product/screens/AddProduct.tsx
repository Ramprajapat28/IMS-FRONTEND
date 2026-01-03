import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { productsApi } from "@/features/Product/api/product.api";
import { categoriesApi, type Category } from "@/features/Inventory/api/category.api";

/* ----------------------------- TYPES ----------------------------- */
type ProductForm = {
  name: string;
  description: string;
  category: string;
  size: string;
  sku: string;
};

/* ----------------------------- COMPONENT ----------------------------- */
const AddProduct = () => {
  const navigate = useNavigate();

  /* ----------------------------- STATE ----------------------------- */
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    category: "",
    size: "",
    sku: "",
  });

  // Multiple Image States
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  /* ----------------------------- HANDLERS ----------------------------- */
  const updateField = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      // Basic validation (optional)
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
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      // Revoke old URL to avoid memory leak
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
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

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.category || !form.sku) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload Images First
      const uploadedImages = await uploadImagesToS3();

      // 2. Create Product Payload (JSON)
      const payload = {
        name: form.name,
        sku: form.sku,
        category: form.category,
        description: form.description,
        size: form.size,
        product_image: uploadedImages // Array of { file_path, view }
      };

      const productRes = await productsApi.create(payload as any); // Type assertion if needed

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

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Product Category: <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-72 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="" className="text-gray-400">Select Category</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_name}>
                    {c.category_name}
                  </option>
                ))}
                {categories.length === 0 && (
                  <option value="" disabled>Loading...</option>
                )}
              </select>
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
