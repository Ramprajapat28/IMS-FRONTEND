import { useRef } from "react";
import { ArrowLeft, Download, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import ProductsNavbar from "../components/ProductsNavbar";

/* ----------------------------- SAMPLE DATA ----------------------------- */
const product = {
  name: "Blue Jersey T-Shirt",
  description:
    "Blue Jersey DRI-FIT T-shirt with custom name and jersey no.",
  category: "T-shirts",
  size: "Medium",
  sku: "TS01-BL-M",
  quantity: 20,
  location: "Shelf-1_Room-1_Warehouse-1 (S1-R1-W1)",
  reorderLevel: 10,
  refundable: true,
  image:
    "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=600",
};

/* ----------------------------- COMPONENT ----------------------------- */
const ProductDetail = () => {
  const navigate = useNavigate();
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  /* ------------------------ BARCODE DOWNLOAD ------------------------ */
  const downloadBarcode = () => {
    if (!barcodeRef.current) return;

    JsBarcode(barcodeRef.current, product.sku, {
      format: "CODE128",
      displayValue: true,
      fontSize: 14,
    });

    const svg = barcodeRef.current;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.sku}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      {/* <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-gray-500">
            Dashboard › Products › {product.name} ({product.size})
          </p>
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => navigate("/products/edit")}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div> */}
      <ProductsNavbar
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Products", path: "/products" },
          { label: "Blue Jersey T-Shirt", path:"/products/category/:name" },
          { label: "Meduim"},
        ]}
      />

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CARD */}
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg bg-gray-100 object-cover"
          />

          <div className="text-center space-y-1">
            <h2 className="font-semibold">{product.name}</h2>
            <span className="inline-block text-xs bg-gray-200 px-3 py-1 rounded-full">
              ({product.size})
            </span>
          </div>

          {/* BARCODE */}
          <div className="border rounded-lg p-3 flex flex-col items-center gap-2">
            <svg ref={barcodeRef} />
            <button
              onClick={downloadBarcode}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900"
            >
              <Download size={16} />
              Download barcode
            </button>
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold">Product Information</h2>

          <Info label="Product Name" value={product.name} />
          <Info label="Product Description" value={product.description} />
          <Info label="Category" value={product.category} />
          <Info label="Size" value={product.size} />
          <Info label="SKU" value={product.sku} />
          <Info label="Available Quantity" value={product.quantity} badge />
          <Info label="Location" value={product.location} />
          <Info label="Re-Order Level" value={product.reorderLevel} />

          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={product.refundable} readOnly />
            <span>
              Refundable Item{" "}
              <span className="text-gray-500">
                (This item can be returned and restocked)
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

/* ----------------------------- SUB COMPONENT ----------------------------- */
const Info = ({
  label,
  value,
  badge,
}: {
  label: string;
  value: string | number;
  badge?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500 uppercase">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-medium">{value}</span>
      {badge && (
        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
          In-Stock
        </span>
      )}
    </div>
  </div>
);
