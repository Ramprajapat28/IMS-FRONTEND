import { useState } from "react";
import { PackagePlus, Layers } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
}

const mockProducts: Product[] = [
  { id: 1, name: "T-Shirt", sku: "TST-001" },
  { id: 2, name: "Mug", sku: "MUG-002" },
  { id: 3, name: "Cap", sku: "CAP-003" },
];

const GroupItem: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const toggleProduct = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Group Items</h1>
        <p className="text-sm text-gray-500">
          Create and manage groups of similar products.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white p-6 rounded-xl shadow grid gap-6 md:grid-cols-3">

        {/* GROUP DETAILS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Layers />
            <h2 className="font-medium">Group Details</h2>
          </div>

          <div>
            <label className="text-sm text-gray-600">Group Name</label>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Accessories"
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* SUMMARY */}
          <div className="border rounded-lg p-3 bg-gray-50 text-sm">
            <p className="text-gray-600">Selected Products</p>
            <p className="font-medium">
              {selected.length} product{selected.length !== 1 && "s"} selected
            </p>
          </div>
        </div>

        {/* PRODUCT SELECTION */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <PackagePlus />
            <h2 className="font-medium">Select Products</h2>
          </div>

          <div className="border rounded-lg divide-y">
            {mockProducts.map((product) => (
              <label
                key={product.id}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                />
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    SKU: {product.sku}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          Create Group
        </button>
      </div>

    </div>
  );
};

export default GroupItem;
