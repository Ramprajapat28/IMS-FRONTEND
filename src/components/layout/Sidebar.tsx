import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Box,
  Package,
  ScanBarcode,
  ShoppingCart,
  User,
  LogOut,
  X,
  Warehouse,
} from "lucide-react";
import { useSidebar } from "@/app/providers";
import { LogoutModal } from "@/features/Auth";
import logo from "../../assets/logo.png";

const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
     ${isActive
      ? "bg-blue-50 font-semibold text-blue-600"
      : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 xl:hidden"
          onClick={close}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed xl:static top-0 left-0 z-50
          w-64 h-screen bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          xl:translate-x-0
          flex flex-col
        `}
      >
        {/* MOBILE CLOSE */}
        <div className="xl:hidden flex justify-end p-4">
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
            <Home size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/inventory" className={linkClass} onClick={close}>
            <Package size={20} />
            Inventory
          </NavLink>

          <NavLink to="/products" className={linkClass} onClick={close}>
            <Box size={20} />
            Products
          </NavLink>

          <NavLink to="/warehouse" className={linkClass} onClick={close}>
            <Warehouse size={20} />
            Warehouse
          </NavLink>

          <NavLink to="/barcode/generate" className={linkClass} onClick={close}>
            <ScanBarcode size={20} />
            BarCode Scanner
          </NavLink>

          <NavLink to="/orders" className={linkClass} onClick={close}>
            <ShoppingCart size={20} />
            Outward
          </NavLink>

          <NavLink to="/profile" className={linkClass} onClick={close}>
            <User size={20} />
            Profile
          </NavLink>
        </nav>

        {/* FOOTER */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Sidebar;
