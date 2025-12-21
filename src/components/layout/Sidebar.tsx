// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Barcode,
//   ChevronDown,
//   PlusSquare,
//   Package,
//   FileBarChart,
//   User,
//   HelpCircle,
//   Settings,
//   X
// } from "lucide-react";
// import { useSidebar } from "@/app/providers";

// const Sidebar: React.FC = () => {
//   const location = useLocation();
//   const { isOpen, close } = useSidebar();

//   const [barcodeOpen, setBarcodeOpen] = useState(
//     location.pathname.startsWith("/barcode")
//   );
//   const [productsOpen, setProductsOpen] = useState(
//     location.pathname.startsWith("/products")
//   );

//   const linkClass = ({ isActive }: { isActive: boolean }) =>
//     `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
//      ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

//   const dropdownBtn =
//     "flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100";

//   return (
//     <>
//       {/* OVERLAY (mobile only) */}
//       {isOpen && (
//         <div
//           onClick={close}
//           className="fixed inset-0 bg-black/30 z-40 md:hidden"
//         />
//       )}

//       {/* SIDEBAR */}
//       <aside
//         className={`
//           fixed md:static top-0 left-0 z-50 h-full w-64 bg-white border-r
//           transform transition-transform duration-300
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0
//           flex flex-col
//         `}
//       >
//         {/* MOBILE CLOSE BUTTON */}
//         <div className="md:hidden flex justify-end p-3 border-b">
//           <button onClick={close}>
//             <X />
//           </button>
//         </div>

//         {/* MAIN CONTENT (SCROLLABLE) */}
//         <div className="p-4 flex-1 overflow-y-auto">
//           <h1 className="text-xl font-bold text-blue-600 mb-6">
//             Inventory
//           </h1>

//           <nav className="space-y-1">
//             <NavLink to="/dashboard" className={linkClass} onClick={close}>
//               <LayoutDashboard size={18} />
//               Dashboard
//             </NavLink>

//             {/* BARCODE DROPDOWN */}
//             <button
//               onClick={() => setBarcodeOpen(!barcodeOpen)}
//               className={dropdownBtn}
//               type="button"
//             >
//               <span className="flex items-center gap-3">
//                 <Barcode size={18} />
//                 Barcode
//               </span>
//               <ChevronDown
//                 size={16}
//                 className={`transition-transform ${
//                   barcodeOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {barcodeOpen && (
//               <div className="ml-6 space-y-1">
//                 <NavLink to="/barcode/generate" className={linkClass} onClick={close}>
//                   <Barcode size={16} />
//                   Barcode Generator
//                 </NavLink>

//                 <NavLink to="/barcode/history" className={linkClass} onClick={close}>
//                   <Barcode size={16} />
//                   Barcode History
//                 </NavLink>
//               </div>
//             )}

//             {/* PRODUCTS DROPDOWN */}
//             <button
//               onClick={() => setProductsOpen(!productsOpen)}
//               className={dropdownBtn}
//               type="button"
//             >
//               <span className="flex items-center gap-3">
//                 <Package size={18} />
//                 Products
//               </span>
//               <ChevronDown
//                 size={16}
//                 className={`transition-transform ${
//                   productsOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {productsOpen && (
//               <div className="ml-6 space-y-1">
//                 <NavLink to="/products/add" className={linkClass} onClick={close}>
//                   <PlusSquare size={16} />
//                   Add Product
//                 </NavLink>

//                 <NavLink to="/products/groups" className={linkClass} onClick={close}>
//                   <Package size={16} />
//                   Group Item
//                 </NavLink>
//               </div>
//             )}

//             <NavLink to="/reports" className={linkClass} onClick={close}>
//               <FileBarChart size={18} />
//               Reports
//             </NavLink>

//             <NavLink to="/profile" className={linkClass} onClick={close}>
//               <User size={18} />
//               Profile
//             </NavLink>
//           </nav>
//         </div>

//         {/* BOTTOM SECTION (FIXED AT BOTTOM) */}
//         <div className="p-4 border-t space-y-1 mt-auto">
//           <NavLink to="/help" className={linkClass} onClick={close}>
//             <HelpCircle size={18} />
//             Help
//           </NavLink>

//           <NavLink to="/settings" className={linkClass} onClick={close}>
//             <Settings size={18} />
//             Settings
//           </NavLink>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
// import { Home, Box, ShoppingCart, User, HelpCircle, Settings, LogOut } from "lucide-react";
// import type { JSX } from "react";

// const Sidebar = () => {
//   return (
//     <aside className="w-64 bg-white border-r min-h-screen px-4 py-6">
//       <h1 className="text-xl font-bold mb-8">Fitistan-IMS</h1>

//       <nav className="space-y-2">
//         <SidebarItem icon={<Home size={18} />} label="Dashboard" active />
//         <SidebarItem icon={<Box size={18} />} label="Products" />
//         <SidebarItem icon={<ShoppingCart size={18} />} label="Orders" />
//         <SidebarItem icon={<User size={18} />} label="Profile" />
//       </nav>

//       <div className="mt-10 space-y-2">
//         <SidebarItem icon={<HelpCircle size={18} />} label="Help" />
//         <SidebarItem icon={<Settings size={18} />} label="Settings" />
//         <SidebarItem icon={<LogOut size={18} />} label="Log Out" danger />
//       </div>
//     </aside>
//   );
// };

// const SidebarItem = ({
//   icon,
//   label,
//   active,
//   danger,
// }: {
//   icon: JSX.Element;
//   label: string;
//   active?: boolean;
//   danger?: boolean;
// }) => (
//   <div
//     className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
//       ${active ? "bg-gray-100 font-semibold" : ""}
//       ${danger ? "text-red-500" : "text-gray-700"}
//       hover:bg-gray-100`}
//   >
//     {icon}
//     {label}
//   </div>
// );

// export default Sidebar;
// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Barcode,
//   ChevronDown,
//   PlusSquare,
//   Package,
//   FileBarChart,
//   User,
//   HelpCircle,
//   Settings,
//   X,
// } from "lucide-react";
// import { useSidebar } from "@/app/providers";

// const Sidebar: React.FC = () => {
//   const location = useLocation();
//   const { isOpen, close } = useSidebar();

//   const [barcodeOpen, setBarcodeOpen] = useState(
//     location.pathname.startsWith("/barcode")
//   );
//   const [productsOpen, setProductsOpen] = useState(
//     location.pathname.startsWith("/products")
//   );

//   const linkClass = ({ isActive }: { isActive: boolean }) =>
//     `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
//      ${
//        isActive
//          ? "bg-gray-100 font-semibold text-gray-900"
//          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//      }`;

//   const dropdownBtn =
//     "flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition";

//   return (
//     <>
//       {/* MOBILE OVERLAY */}
//       {isOpen && (
//         <div
//           onClick={close}
//           className="fixed inset-0 bg-black/30 z-40 md:hidden"
//         />
//       )}

//       {/* SIDEBAR */}
//       <aside
//         className={`
//           fixed md:static top-0 left-0 z-50 h-full w-64 bg-white border-r
//           transform transition-transform duration-300
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0
//           flex flex-col
//         `}
//       >
//         {/* MOBILE HEADER */}
//         <div className="md:hidden flex items-center justify-between px-4 py-3 border-b">
//           <span className="font-semibold">Fitistan-IMS</span>
//           <button onClick={close}>
//             <X size={20} />
//           </button>
//         </div>

//         {/* BRAND */}
//         <div className="px-6 py-5 hidden md:block">
//           <h1 className="text-lg font-bold tracking-tight">
//             Fitistan-IMS
//           </h1>
//         </div>

//         {/* NAVIGATION */}
//         <nav className="px-4 space-y-1 flex-1 overflow-y-auto">
//           <NavLink to="/dashboard" className={linkClass} onClick={close}>
//             <LayoutDashboard size={18} />
//             Dashboard
//           </NavLink>

//           {/* BARCODE */}
//           <button
//             onClick={() => setBarcodeOpen(!barcodeOpen)}
//             className={dropdownBtn}
//           >
//             <span className="flex items-center gap-3">
//               <Barcode size={18} />
//               Barcode
//             </span>
//             <ChevronDown
//               size={16}
//               className={`transition-transform ${
//                 barcodeOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {barcodeOpen && (
//             <div className="ml-6 space-y-1">
//               <NavLink
//                 to="/barcode/generate"
//                 className={linkClass}
//                 onClick={close}
//               >
//                 Barcode Generator
//               </NavLink>

//               <NavLink
//                 to="/barcode/history"
//                 className={linkClass}
//                 onClick={close}
//               >
//                 Barcode History
//               </NavLink>
//             </div>
//           )}

//           {/* PRODUCTS */}
//           <button
//             onClick={() => setProductsOpen(!productsOpen)}
//             className={dropdownBtn}
//           >
//             <span className="flex items-center gap-3">
//               <Package size={18} />
//               Products
//             </span>
//             <ChevronDown
//               size={16}
//               className={`transition-transform ${
//                 productsOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {productsOpen && (
//             <div className="ml-6 space-y-1">
//               <NavLink
//                 to="/products/add"
//                 className={linkClass}
//                 onClick={close}
//               >
//                 <PlusSquare size={16} />
//                 Add Product
//               </NavLink>

//               <NavLink
//                 to="/products/groups"
//                 className={linkClass}
//                 onClick={close}
//               >
//                 Group Items
//               </NavLink>
//             </div>
//           )}

//           <NavLink to="/reports" className={linkClass} onClick={close}>
//             <FileBarChart size={18} />
//             Reports
//           </NavLink>

//           <NavLink to="/profile" className={linkClass} onClick={close}>
//             <User size={18} />
//             Profile
//           </NavLink>
//         </nav>

//         {/* FOOTER */}
//         <div className="px-4 py-4 border-t space-y-1">
//           <NavLink to="/help" className={linkClass} onClick={close}>
//             <HelpCircle size={18} />
//             Help
//           </NavLink>

//           <NavLink to="/settings" className={linkClass} onClick={close}>
//             <Settings size={18} />
//             Settings
//           </NavLink>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
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
  Menu,
} from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo.png"

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
     ${
       isActive
         ? "bg-gray-100 font-semibold text-gray-900"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 w-64 bg-white border-r h-screen px-4 py-6
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* MOBILE CLOSE BUTTON */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-1 justify-center">
        <img src={logo} alt="logo" className="w-8 h-8 rounded-lg items-center justify-center flex" style={{
transform: `rotate(-15deg)`,
transition: "transform 0.5s ease",
}}/>
        <h1 className="text-xl font-bold mb-3">Fitistan-IMS</h1>
        </div>
        <div className="h-[1.5px] bg-gray-300 w-full mb-3 rounded-lg" />

        <nav className="px-4 py-4 space-y-1 w-full">
          <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
            <Home size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/products" className={linkClass} onClick={() => setOpen(false)}>
            <Box size={18} />
            Products
          </NavLink>

          <NavLink to="/orders" className={linkClass} onClick={() => setOpen(false)}>
            <ShoppingCart size={18} />
            Orders
          </NavLink>

          <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
            <User size={18} />
            Profile
          </NavLink>
        </nav>

        <div className="px-4 py-4 space-y-1 absolute bottom-0">
          <NavLink to="/help" className={linkClass} onClick={() => setOpen(false)}>
            <HelpCircle size={18} />
            Help
          </NavLink>

          <NavLink to="/settings" className={linkClass} onClick={() => setOpen(false)}>
            <Settings size={18} />
            Settings
          </NavLink>

          <NavLink
            to="/logout"
            className={() =>
              "flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-red-500 hover:bg-gray-100"
            }
            onClick={() => setOpen(false)}
          >
            <LogOut size={18} />
            Log Out
          </NavLink>
        </div>
      </aside>

      {/* MOBILE TOGGLE BUTTON (PLACE THIS IN NAVBAR) */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white border rounded-lg p-2"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>
    </>
  );
};

export default Sidebar;
