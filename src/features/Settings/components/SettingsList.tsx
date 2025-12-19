import { useNavigate } from "react-router-dom";
import { Settings, Bell, HelpCircle, ChevronRight, ArrowLeft} from "lucide-react";
import { NavLink } from "react-router-dom";
// import { Settings, Bell, HelpCircle, ArrowLeft } from "lucide-react";

const items = [
  { label: "General Settings", path: "/settings/general", icon: Settings },
  { label: "Notifications", path: "/settings/notifications", icon: Bell },
  { label: "Help & Support", path: "/settings/help", icon: HelpCircle },
];

const SettingsList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden p-4 space-y-2">
      <h1 className="text-xl font-semibold mb-4 flex gap-4">
         <NavLink
        to="/dashboard"
        className="flex items-center gap-2 text-sm text-gray-600"
      >
        <ArrowLeft size={16} />
      </NavLink>
        Settings</h1>

      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-3">
            <item.icon size={20} className="text-blue-600" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          <ChevronRight className="text-gray-400" />
        </button>
      ))}
    </div>
  );
};

export default SettingsList;
