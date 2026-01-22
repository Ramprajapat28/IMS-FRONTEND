import { useNavigate } from "react-router-dom";
import type { InventoryProduct } from "../types/inventory.types";

type InventoryTableProps = {
    data: InventoryProduct[];
    onRowClick?: (item: InventoryProduct) => void;
};

const InventoryTable = ({ data, onRowClick }: InventoryTableProps) => {
    const navigate = useNavigate();

    const handleRowClick = (item: InventoryProduct) => {
        if (onRowClick) {
            onRowClick(item);
        } else {
            // Default behavior: navigate to product details
            navigate(`/products/details/${item.id}`);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-3">Sr.no</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">SKU #</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Qty</th>
                        {/* <th className="p-3"></th> */}
                    </tr>
                </thead>

                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr
                                key={item.id}
                                className="border-b last:border-none hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleRowClick(item)}
                            >
                                <td className="p-3">{index + 1}</td>

                                <td className="p-3">
                                    <div className="flex items-center gap-3 min-w-[220px]">
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                </td>

                                <td className="p-3 text-gray-600">
                                    {item.category}
                                </td>

                                <td className="p-3 text-gray-500">
                                    {item.sku}
                                </td>

                                <td className="p-3 text-gray-600">{item.location}</td>
                                <td className="p-3">{item.quantity}</td>
{/* 
                                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="border rounded-lg p-1.5 hover:bg-gray-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td> */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
