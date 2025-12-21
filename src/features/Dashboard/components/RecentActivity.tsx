// const RecentActivity = () => {
//   return (
//     <div className="bg-white p-6 rounded-xl border">
//       <div className="flex justify-between mb-4">
//         <h3 className="font-semibold">Recent Activities</h3>
//         <button className="text-sm border px-3 py-1 rounded-lg">
//           View More
//         </button>
//       </div>

//       {["Processing", "Cancelled", "Onhold"].map((status, i) => (
//         <div
//           key={i}
//           className="flex justify-between items-center py-3 border-b last:border-none"
//         >
//           <div>
//             <p className="font-medium">Apple Watch Series 9</p>
//             <p className="text-sm text-gray-500">Electronics · $640</p>
//           </div>

//           <span
//             className={`text-xs px-2 py-1 rounded-full
//               ${
//                 status === "Processing"
//                   ? "bg-purple-100 text-purple-600"
//                   : status === "Cancelled"
//                   ? "bg-red-100 text-red-600"
//                   : "bg-blue-100 text-blue-600"
//               }`}
//           >
//             {status}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RecentActivity;
import { ShoppingCart, MapPin } from "lucide-react";

type Status = "Processing" | "Cancelled" | "Onhold";

const statusStyles: Record<Status, string> = {
  Processing: "bg-purple-100 text-purple-600",
  Cancelled: "bg-red-100 text-red-600",
  Onhold: "bg-sky-100 text-sky-600",
};

const RecentActivities = () => {
  return (
    <div className="bg-white rounded-xl border w-full h-[100%]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <ShoppingCart size={20} className="text-blue-600" />
          </div>
          <h2 className="font-semibold text-gray-800">Recent Activities</h2>
        </div>

        <button className="text-sm border rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-100">
          View More
        </button>
      </div>

      {/* LIST */}
      <div className="divide-y">
        <ActivityItem
          image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
          title="Apple Watch Series 9"
          category="Electronics"
          price="$640"
          warehouse="Warehouse A"
          time="Today, 1:30 PM"
          status="Processing"
        />

        <ActivityItem
          image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
          title="Apple Watch Series 9"
          category="Electronics"
          price="$640"
          warehouse="Warehouse B"
          time="Yesterday, 12 PM"
          status="Cancelled"
        />

        <ActivityItem
          image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
          title="Apple Watch Series 9"
          category="Electronics"
          price="$640"
          warehouse="Warehouse A"
          time="15 Jan 2025"
          status="Onhold"
        />
      </div>
    </div>
  );
};

export default RecentActivities;
type ActivityItemProps = {
  image: string;
  title: string;
  category: string;
  price: string;
  warehouse: string;
  time: string;
  status: "Processing" | "Cancelled" | "Onhold";
};

const ActivityItem = ({
  image,
  title,
  category,
  price,
  warehouse,
  time,
  status,
}: ActivityItemProps) => {
  return (
    <div className="grid grid-cols-3 items-center px-5 py-4 w-full">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={title}
          className="w-12 h-12 rounded-lg object-cover"
        />

        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">
            {category} • {price}
          </p>
        </div>
      </div>

      {/* MIDDLE */}
      <div className="hidden md:flex items-center justify-center gap-1 text-sm text-gray-500">
        <MapPin size={14} />
        {warehouse}
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-sm text-gray-500">{time}</span>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};
