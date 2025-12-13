import { useState } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Product Added",
    message: "New product 'iPhone Cover' was added successfully.",
    type: "success",
    time: "2 hours ago",
    read: false
  },
  {
    id: 2,
    title: "Low Stock Alert",
    message: "Product 'USB Cable' is running low on stock.",
    type: "warning",
    time: "Yesterday",
    read: false
  },
  {
    id: 3,
    title: "Monthly Report Ready",
    message: "Your sales report for March is available.",
    type: "info",
    time: "2 days ago",
    read: true
  }
];

const iconMap = {
  success: <CheckCircle className="text-green-600" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  info: <Info className="text-blue-600" />
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-gray-500">
            Stay updated with system activities.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-100"
          >
            Mark all as read
          </button>

          <button
            onClick={clearAll}
            className="text-sm px-3 py-1.5 border rounded-lg text-red-600 hover:bg-red-50"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-2">
        {notifications.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Bell className="mx-auto mb-2" />
            No notifications
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex gap-4 p-4 rounded-xl border transition
              ${n.read ? "bg-white" : "bg-blue-50"}
            `}
          >
            {/* ICON */}
            <div className="mt-1">
              {iconMap[n.type]}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium">{n.title}</h3>
                <span className="text-xs text-gray-400">{n.time}</span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Notifications;
