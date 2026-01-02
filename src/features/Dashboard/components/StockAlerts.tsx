import { AlertTriangle, AlertCircle } from "lucide-react";
import type { StockProduct } from "../types/dashboard.types";

interface StockAlertsProps {
    products: StockProduct[];
}

const StockAlerts = ({ products }: StockAlertsProps) => {
    return (
        <div className="bg-white rounded-xl border col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between px-4 py-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100">
                        <AlertTriangle className="text-red-600" />
                    </div>
                    <h2 className="font-semibold">Stock Alerts</h2>
                </div>
            </div>

            <div className="divide-y max-h-[400px] overflow-y-auto">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.product_id} className="flex gap-4 px-4 py-4 items-center">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {/* Using a placeholder or potentially product image if available */}
                                {product.image ? (
                                    <img src={product.image} alt={product.product_name} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <AlertCircle className="text-gray-400" />
                                )}
                            </div>

                            <div className="flex-1">
                                <p className="font-medium">{product.product_name}</p>
                                <p className="text-sm text-gray-500">
                                    Available: <span className="font-semibold">{product.available_count}</span>
                                </p>
                            </div>

                            <div>
                                {product.stock_status === "out_of_stock" ? (
                                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 font-medium">
                                        Out of Stock
                                    </span>
                                ) : (
                                    <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-600 font-medium">
                                        Low Stock
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        No stock alerts at the moment.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockAlerts;
