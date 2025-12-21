import { NavLink } from "react-router-dom";
import {
  Home,
  Box,
  ShoppingCart,
  User,
  HelpCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useSidebar } from "@/app/providers";
import logo from "../../assets/logo.png";

const Sidebar = () => {
  const { isOpen, close } = useSidebar();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${
       isActive
         ? "bg-gray-100 font-semibold text-gray-900"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          w-64 h-screen bg-white border-r
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* MOBILE CLOSE */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={close}>
            <X size={20} />
          </button>
        </div>

        {/* BRAND */}
        <div className="px-6 py-4 flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 rounded-lg -rotate-12"
          />
          <h1 className="text-lg font-bold">Fitistan-IMS</h1>
        </div>

        <div className="h-px bg-gray-200 mx-4 mb-6" />

        {/* NAV */}
        <nav className="flex-1 px-4 space-y-1">
          <NavLink to="/dashboard" className={linkClass} onClick={close}>
            <Home size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/products" className={linkClass} onClick={close}>
            <Box size={18} />
            Products
          </NavLink>

          <NavLink to="/orders" className={linkClass} onClick={close}>
            <ShoppingCart size={18} />
            Orders
          </NavLink>

          <NavLink to="/profile" className={linkClass} onClick={close}>
            <User size={18} />
            Profile
          </NavLink>
        </nav>

        {/* FOOTER */}
        <div className="px-4 py-4 space-y-1">
          <NavLink to="/help" className={linkClass} onClick={close}>
            <HelpCircle size={18} />
            Help
          </NavLink>

          <NavLink to="/settings" className={linkClass} onClick={close}>
            <Settings size={18} />
            Settings
          </NavLink>

          <NavLink
            to="/logout"
            onClick={close}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-gray-100"
          >
            <LogOut size={18} />
            Log Out
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
