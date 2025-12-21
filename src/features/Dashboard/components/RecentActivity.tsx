import { ShoppingCart, MapPin } from "lucide-react";

type Status = "Processing" | "Cancelled" | "Onhold";

const statusStyles: Record<Status, string> = {
  Processing: "bg-purple-100 text-purple-600",
  Cancelled: "bg-red-100 text-red-600",
  Onhold: "bg-sky-100 text-sky-600",
};

const RecentActivity = () => {
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

        <button className="text-sm border rounded-lg px-3 py-1.5">
          View More
        </button>
      </div>

      <div className="divide-y">
        <ActivityItem status="Processing" />
        <ActivityItem status="Cancelled" />
        <ActivityItem status="Onhold" />
      </div>
    </div>
  );
};

export default RecentActivity;

const ActivityItem = ({ status }: { status: Status }) => (
  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 px-4 py-4 items-center">
    {/* LEFT */}
    <div className="flex gap-4 min-w-0">
      <img
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="min-w-0">
        <p className="font-medium truncate">Apple Watch Series 9</p>
        <p className="text-sm text-gray-500 truncate">
          Electronics • $640
        </p>
      </div>
    </div>

    {/* CENTER */}
    <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
      <MapPin size={14} />
      Warehouse A
    </div>

    {/* RIGHT */}
    <div className="flex flex-row md:flex-col gap-2 items-start md:items-end">
      <span className="text-sm text-gray-500">Today, 1:30 PM</span>
      <span
        className={`text-xs px-3 py-1 rounded-full ${statusStyles[status]}`}
      >
        {status}
      </span>
    </div>
  </div>
);
