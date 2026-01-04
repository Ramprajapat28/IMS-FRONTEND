import { Pencil, Trash2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type TableMode = "PRODUCTS" | "CATEGORY";

export type BaseProduct = {
  id: number;
  name: string;
  image: string;
  sku: string;
  location: string;
  quantity: number;
  category?: string;
  size?: string;
  product_code?: string;
};

type Props = {
  data: BaseProduct[];
  mode: TableMode;
  onDelete: (id: number) => void;
};

const ProductsTable = ({ data, mode, onDelete }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Product Name</th>

            {mode === "PRODUCTS" && <th className="p-3">Category</th>}
            {mode === "CATEGORY" && <th className="p-3">Size</th>}

            <th className="p-3">SKU</th>
            <th className="p-3">Location</th>
            <th className="p-3">Qty</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {data.map((p, i) => (
            <tr key={p.id} className="border-b last:border-none">
              <td className="p-3">{i + 1}</td>

              <td className="p-3 flex items-center gap-3 min-w-[220px]">
                <img
                  src={p.image}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <span className="font-medium">{p.name}</span>
              </td>

              {mode === "PRODUCTS" && (
                <td className="p-3 text-gray-600">{p.category}</td>
              )}

              {mode === "CATEGORY" && (
                <td className="p-3 font-medium">{p.size}</td>
              )}

              <td className="p-3 text-gray-500">{p.sku}</td>
              <td className="p-3 text-gray-600">{p.location}</td>
              <td className="p-3">{p.quantity}</td>

              <td className="p-3 flex gap-2">
                <button
                  onClick={() => {
                    if (p.product_code) {
                      navigate(`/products/variants/${p.product_code}`);
                    } else {
                      navigate(`/products/${p.id}`);
                    }
                  }}
                  className="border rounded-lg p-1.5 hover:bg-gray-100"
                >
                  <ChevronRight size={16} />
                </button>

                <button
                  onClick={() => navigate(`/products/edit/${p.id}`)}
                  className="border rounded-lg p-1.5 hover:bg-gray-100"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => onDelete(p.id)}
                  className="border rounded-lg p-1.5 hover:bg-gray-100"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
