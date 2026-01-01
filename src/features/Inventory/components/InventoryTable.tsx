import { ChevronRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { InventoryProduct } from "../data/inventory.data";
import type { InventoryVariant } from "../data/variants.data";

type InventoryTableProps = {
    data: (InventoryProduct | InventoryVariant)[];
    mode: "PRODUCTS" | "VARIANTS";
    onDelete: (id: number) => void;
    onRowClick?: (item: any) => void;
};

const InventoryTable = ({ data, mode, onDelete, onRowClick }: InventoryTableProps) => {
    const navigate = useNavigate();

    const handleRowClick = (item: InventoryProduct | InventoryVariant) => {
        if (onRowClick) {
            onRowClick(item);
        } else {
            // Default behavior: navigate to product details
            navigate(`/products/${item.id}`);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-3">Sr.no</th>
                        <th className="p-3">Product Name</th>
                        {mode === "PRODUCTS" && <th className="p-3">Category</th>}
                        {mode === "VARIANTS" && <th className="p-3">Size</th>}
                        <th className="p-3">SKU #</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Qty</th>
                        <th className="p-3"></th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id} className="border-b last:border-none hover:bg-gray-50">
                            <td className="p-3">{index + 1}</td>

                            <td className="p-3">
                                <div className="flex items-center gap-3 min-w-[220px]">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-lg object-cover"
                                    />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                            </td>

                            {mode === "PRODUCTS" && (
                                <td className="p-3 text-gray-600">
                                    {(item as InventoryProduct).category}
                                </td>
                            )}

                            {mode === "VARIANTS" && (
                                <td className="p-3 font-medium">
                                    {(item as InventoryVariant).size}
                                </td>
                            )}

                            <td className="p-3 text-gray-500">{item.sku}</td>
                            <td className="p-3 text-gray-600">{item.location}</td>
                            <td className="p-3">{item.quantity}</td>

                            <td className="p-3">
                                <div className="flex gap-2">
                                    {mode === "PRODUCTS" && (item as InventoryProduct).hasVariants && (
                                        <button
                                            onClick={() => handleRowClick(item)}
                                            className="border rounded-lg p-1.5 hover:bg-gray-100"
                                            title="View variants"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="border rounded-lg p-1.5 hover:bg-gray-100"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
