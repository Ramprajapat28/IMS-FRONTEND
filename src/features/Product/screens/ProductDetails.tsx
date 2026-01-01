import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import JsBarcode from "jsbarcode";
import ProductsNavbar from "../components/ProductsNavbar";
import { productsApi, type Product } from "@/features/Product/api/product.api";

/* ----------------------------- COMPONENT ----------------------------- */
const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await productsApi.getById(Number(id));
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, product.sku, {
          format: "CODE128",
          displayValue: true,
          fontSize: 14,
        });
      } catch (e) {
        console.error("Barcode generation failed", e);
      }
    }
  }, [product]);

  /* ------------------------ BARCODE DOWNLOAD ------------------------ */
  const downloadBarcode = () => {
    if (!product || !barcodeRef.current) return;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">{error || "Product not found"}</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 text-sm underline text-gray-600 hover:text-gray-900"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductsNavbar
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Products", path: "/products" },
          { label: product.category || "Uncategorized", path: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CARD */}
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <img
            src={product.product_image || "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=600"}
            alt={product.name}
            className="w-full rounded-lg bg-gray-100 object-cover"
          />

          <div className="text-center space-y-1">
            <h2 className="font-semibold">{product.name}</h2>
            {/* <span className="inline-block text-xs bg-gray-200 px-3 py-1 rounded-full">
              ({product.size || "Standard"})
            </span> */}
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
          <Info label="Product Description" value={product.description || "N/A"} />
          <Info label="Category" value={product.category || "Uncategorized"} />
          {/* <Info label="Size" value={product.size || "Standard"} /> */}
          <Info label="SKU" value={product.sku} />
          <Info
            label="Available Quantity"
            value={product.stock_details?.length || 0}
            badge
          />
          <Info
            label="Location"
            value={(() => {
              if (!product.stock_details?.length) return "N/A";
              const locationMap = new Map<string, number>();
              product.stock_details.forEach((item) => {
                const loc = `${item.warehouse_name} > ${item.room_name} > ${item.shelf_name}`;
                locationMap.set(loc, (locationMap.get(loc) || 0) + 1);
              });
              return Array.from(locationMap.entries())
                .map(([loc, qty]) => `${loc} (${qty})`)
                .join(", ");
            })()}
          />
          <Info label="Re-Order Level" value={product.reorder_level || 0} />

          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={true} readOnly />
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
