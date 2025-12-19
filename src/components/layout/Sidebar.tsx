import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Barcode,
  ChevronDown,
  PlusSquare,
  Package,
  FileBarChart,
  User,
  HelpCircle,
  Settings,
  X
} from "lucide-react";
import { useSidebar } from "@/app/providers";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isOpen, close } = useSidebar();

  const [barcodeOpen, setBarcodeOpen] = useState(
    location.pathname.startsWith("/barcode")
  );
  const [productsOpen, setProductsOpen] = useState(
    location.pathname.startsWith("/products")
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
     ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

  const dropdownBtn =
    "flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100";

  return (
    <>
      {/* OVERLAY (mobile only) */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 h-full w-64 bg-white border-r
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* MOBILE CLOSE BUTTON */}
        <div className="md:hidden flex justify-end p-3 border-b">
          <button onClick={close}>
            <X />
          </button>
        </div>

        {/* MAIN CONTENT (SCROLLABLE) */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h1 className="text-xl font-bold text-blue-600 mb-6">
            Inventory
          </h1>

          <nav className="space-y-1">
            <NavLink to="/dashboard" className={linkClass} onClick={close}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            {/* BARCODE DROPDOWN */}
            <button
              onClick={() => setBarcodeOpen(!barcodeOpen)}
              className={dropdownBtn}
              type="button"
            >
              <span className="flex items-center gap-3">
                <Barcode size={18} />
                Barcode
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  barcodeOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {barcodeOpen && (
              <div className="ml-6 space-y-1">
                <NavLink to="/barcode/generate" className={linkClass} onClick={close}>
                  <Barcode size={16} />
                  Barcode Generator
                </NavLink>

                <NavLink to="/barcode/history" className={linkClass} onClick={close}>
                  <Barcode size={16} />
                  Barcode History
                </NavLink>
              </div>
            )}

            {/* PRODUCTS DROPDOWN */}
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={dropdownBtn}
              type="button"
            >
              <span className="flex items-center gap-3">
                <Package size={18} />
                Products
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  productsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {productsOpen && (
              <div className="ml-6 space-y-1">
                <NavLink to="/products/add" className={linkClass} onClick={close}>
                  <PlusSquare size={16} />
                  Add Product
                </NavLink>

                <NavLink to="/products/groups" className={linkClass} onClick={close}>
                  <Package size={16} />
                  Group Item
                </NavLink>
              </div>
            )}

            <NavLink to="/reports" className={linkClass} onClick={close}>
              <FileBarChart size={18} />
              Reports
            </NavLink>

            <NavLink to="/profile" className={linkClass} onClick={close}>
              <User size={18} />
              Profile
            </NavLink>
          </nav>
        </div>

        {/* BOTTOM SECTION (FIXED AT BOTTOM) */}
        <div className="p-4 border-t space-y-1 mt-auto">
          <NavLink to="/help" className={linkClass} onClick={close}>
            <HelpCircle size={18} />
            Help
          </NavLink>

          <NavLink to="/settings" className={linkClass} onClick={close}>
            <Settings size={18} />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
