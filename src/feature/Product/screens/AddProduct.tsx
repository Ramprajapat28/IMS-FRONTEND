import { useState } from "react";
import { ImagePlus, X } from "lucide-react";

const AddProduct: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Add Product</h1>
        <p className="text-sm text-gray-500">
          Add a new product with details and image.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-xl shadow grid gap-6 md:grid-cols-3">

        {/* IMAGE UPLOAD */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Product Image
          </label>

          <div className="relative w-full h-48 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 hover:border-blue-600 transition">

            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <ImagePlus size={32} />
                <span className="text-sm">Upload Image</span>
                <span className="text-xs text-gray-400">
                  PNG, JPG up to 2MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="md:col-span-2 space-y-4">

          <div>
            <label className="text-sm text-gray-600">Product Name</label>
            <input
              placeholder="Enter product name"
              className="w-full mt-1 border px-4 py-2 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-gray-600">SKU</label>
              <input
                placeholder="SKU12345"
                className="w-full mt-1 border px-4 py-2 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Price (₹)</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full mt-1 border px-4 py-2 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              rows={3}
              placeholder="Short product description"
              className="w-full mt-1 border px-4 py-2 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          Save Product
        </button>
      </div>

    </div>
  );
};

export default AddProduct;
