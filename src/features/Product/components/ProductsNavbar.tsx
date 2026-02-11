import { Plus, Download, FileSpreadsheet } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type Breadcrumb = {
  label: string;
  path?: string;
};

type ProductsNavbarProps = {
  breadcrumbs: Breadcrumb[];
  onRefresh?: () => void;
};

const ProductsNavbar = ({ breadcrumbs, onRefresh }: ProductsNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isProductsRoot = location.pathname === "/products";

  // File Import Logic
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Get Presigned URL
      // Use 'product' and 'bulk_import' as configured in backend
      const presigned = await import("@/features/Product/api/product.api").then(m => m.productsApi.getPresignedUrl(file.name, "product", "bulk_import"));

      // 2. Upload to S3
      const uploadRes = await fetch(presigned.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": presigned.contentType || file.type }
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file");

      // 3. Trigger Backend Import
      const { productsApi } = await import("@/features/Product/api/product.api");
      const importRes = await productsApi.importBulk(presigned.cdnUrl);


      if (importRes.success && importRes.data) {
        const { summary, errors } = importRes.data;

        let msg = importRes.message || "Import completed";

        if (summary.failed > 0 && errors.length > 0) {
          msg += "\n\nFailures:";
          // Show first 3 errors to avoid huge alert
          errors.slice(0, 3).forEach((err: any) => {
            msg += `\n- SKU ${err.sku}: ${err.error}`;
          });
          if (errors.length > 3) msg += `\n...and ${errors.length - 3} more.`;
        }

        alert(msg);

        if (onRefresh) onRefresh();
        else window.location.reload();
      } else {
        alert("Import failed: " + importRes.message);
      }

    } catch (err) {
      console.error(err);
      alert("Import process failed. See console for details.");
    } finally {
      // Reset input
      e.target.value = "";
    }
  };

  const downloadSampleTemplate = () => {
    const headers = [
      "Name",
      "SKU",
      "Category",
      "Sub Category",
      "Description",
      "Size",
      "Product Code",
      "HSN Code",
      "MRP",
      "Discounted Price",
      "GST %",
      "Cost to Company",
      "Reorder Level",
      "Image URL"
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_import_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* LEFT - BREADCRUMB */}
      <div>
        <h1 className="text-xl font-semibold">
          {/* {breadcrumbs[breadcrumbs.length - 1].label} */}Product
        </h1>

        <div className="text-sm text-gray-500 flex gap-1 flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex gap-1">
              {b.path ? (
                <button
                  onClick={() => navigate(b.path!)}
                  className="hover:underline"
                >
                  {b.label}
                </button>
              ) : (
                <span>{b.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <span>›</span>}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT - ACTIONS */}
      {isProductsRoot && (
        <div className="flex gap-2">
          <button
            onClick={downloadSampleTemplate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex gap-1 items-center hover:bg-green-700 transition shadow-sm"
          >
            <FileSpreadsheet size={16} /> Sample
          </button>

          <button
            onClick={() => navigate("/products/add")}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm flex gap-1"
          >
            <Plus size={16} /> Add Product
          </button>

          <label className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex gap-1 cursor-pointer hover:bg-gray-300 transition">
            <Download size={16} /> Import Product
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};


export default ProductsNavbar;
