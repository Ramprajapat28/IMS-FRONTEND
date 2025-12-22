import { Plus, Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type Breadcrumb = {
  label: string;
  path?: string;
};

const ProductsNavbar = ({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isProductsRoot = location.pathname === "/products";

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
            onClick={() => navigate("/products/add")}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm flex gap-1"
          >
            <Plus size={16} /> Add Product
          </button>

          <button
            onClick={() => alert("PDF Export hooked here")}
            className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex gap-1"
          >
            <Download size={16} /> Import Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsNavbar;
