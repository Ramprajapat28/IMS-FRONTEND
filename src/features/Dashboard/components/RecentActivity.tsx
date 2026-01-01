import { useEffect, useState } from "react";
import { ShoppingCart, MapPin, Loader2 } from "lucide-react";
import { ordersApi } from "@/features/Order/api/order.api";
import type { Order } from "@/features/Order/types";
import { useNavigate } from "react-router-dom";

const statusStyles: Record<string, string> = {
  Processing: "bg-purple-100 text-purple-600",
  Cancelled: "bg-red-100 text-red-600",
  Onhold: "bg-sky-100 text-sky-600",
  Completed: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Default: "bg-gray-100 text-gray-600"
};

interface ActivityItem {
  order_id: number;
  product_name: string;
  category: string;
  product_image: string;
  warehouse_name: string;
  status: string;
  created_at: string;
  quantity: number;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await ordersApi.getAll(1, 3);
        if (response.success && response.data) {
          const mappedActivities: ActivityItem[] = response.data.map((order: Order) => ({
            order_id: order.order_id,
            product_name: order.product_name || `Order #${order.order_id}`,
            category: "Uncategorized", // Order doesn't include category yet
            product_image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100", // Fallback
            warehouse_name: order.warehouse_name || "Main Warehouse",
            status: order.status,
            created_at: order.created_at || new Date().toISOString(),
            quantity: order.quantity
          }));
          setActivities(mappedActivities);
        }
      } catch (error) {
        console.error("Failed to fetch recent activity", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="bg-white rounded-xl border">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <ShoppingCart className="text-blue-600" />
          </div>
          <h2 className="font-semibold">Recent Activities</h2>
        </div>

        <button className="text-sm border rounded-lg px-3 py-1.5"
        
        onClick={() => navigate("/orders")}>
          View More
        </button>
      </div>

      <div className="divide-y">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No recent activity</div>
        ) : (
          activities.map((item) => (
            <ActivityItemRow key={item.order_id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;

const ActivityItemRow = ({ item }: { item: ActivityItem }) => (
  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 px-4 py-4 items-center">
    {/* LEFT */}
    <div className="flex gap-4 min-w-0">
      <img
        src={item.product_image}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="min-w-0">
        <p className="font-medium truncate">{item.product_name}</p>
        <p className="text-sm text-gray-500 truncate">
          
          {item.category}
        </p>
      </div>
    </div>

    {/* CENTER */}
    <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
      <MapPin size={14} />
      {item.warehouse_name}
    </div>

    {/* RIGHT */}
    <div className="flex flex-row md:flex-col gap-2 items-start md:items-end">
      <span className="text-sm text-gray-500">
        {new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
      </span>
      <span
        className={`text-xs px-3 py-1 rounded-full ${statusStyles[item.status] || statusStyles.Default}`}
      >
        {item.status}
      </span>
    </div>
  </div>
);
