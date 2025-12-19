// import { NavLink } from "react-router-dom";
// import { Settings, HelpCircle, Bell, ArrowLeft } from "lucide-react";

// const linkClass = ({ isActive }: { isActive: boolean }) =>
//   `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
//    ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

// const SettingsSidebar: React.FC = () => {
//   return (
//     <aside className="w-64 bg-gray-50 border-r p-4">

//       {/* BACK */}
//       <NavLink
//         to="/dashboard"
//         className="flex items-center gap-2 text-sm text-gray-600 mb-6"
//       >
//         <ArrowLeft size={16} />
//         Back to Dashboard
//       </NavLink>

//       <nav className="space-y-2">
//         <NavLink to="/settings" className={linkClass}>
//           <Settings size={18} />
//           Settings
//         </NavLink>

//         <NavLink to="/help" className={linkClass}>
//           <HelpCircle size={18} />
//           More setting
//         </NavLink>

//         <NavLink to="/notifications" className={linkClass}>
//           <Bell size={18} />
//           And more setting
//         </NavLink>
//         <NavLink to="/help" className={linkClass}>
//           <HelpCircle size={18} />
//           More setting
//         </NavLink>

//         <NavLink to="/notifications" className={linkClass}>
//           <Bell size={18} />
//           And more setting
//         </NavLink>
//         <NavLink to="/help" className={linkClass}>
//           <HelpCircle size={18} />
//           More setting
//         </NavLink>

//         <NavLink to="/notifications" className={linkClass}>
//           <Bell size={18} />
//           And more setting
//         </NavLink>
//         <NavLink to="/help" className={linkClass}>
//           <HelpCircle size={18} />
//           More setting
//         </NavLink>

//         <NavLink to="/notifications" className={linkClass}>
//           <Bell size={18} />
//           And more setting
//         </NavLink>
//         <NavLink to="/help" className={linkClass}>
//           <HelpCircle size={18} />
//           More setting
//         </NavLink>

//         <NavLink to="/notifications" className={linkClass}>
//           <Bell size={18} />
//           And more setting
//         </NavLink>
//       </nav>

//     </aside>
//   );
// };

// export default SettingsSidebar;
// import { NavLink } from "react-router-dom";
// import {
//   Settings,
//   HelpCircle,
//   Bell,
//   ArrowLeft,
//   X
// } from "lucide-react";
// import { useSettingsSidebar } from "./SettingsSidebarContext";

// const linkClass = ({ isActive }: { isActive: boolean }) =>
//   `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
//    ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

// const SettingsSidebar: React.FC = () => {
//   const { isOpen, close } = useSettingsSidebar();

//   return (
//     <>
//       {/* OVERLAY (mobile) */}
//       {isOpen && (
//         <div
//           onClick={close}
//           className="fixed inset-0 bg-black/30 z-40 md:hidden"
//         />
//       )}

//       {/* SIDEBAR */}
//       <aside
//         className={`
//           fixed md:static top-0 left-0 z-50 h-full w-64
//           bg-gray-50 border-r
//           transform transition-transform duration-300
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0
//           flex flex-col
//         `}
//       >
//         {/* MOBILE CLOSE */}
//         <div className="md:hidden flex justify-end p-3 border-b">
//           <button onClick={close}>
//             <X />
//           </button>
//         </div>

//         {/* MAIN CONTENT */}
//         <div className="p-4 flex-1 overflow-y-auto">

//           {/* BACK */}
//           <NavLink
//             to="/dashboard"
//             onClick={close}
//             className="flex items-center gap-2 text-sm text-gray-600 mb-6"
//           >
//             <ArrowLeft size={16} />
//             Back to Dashboard
//           </NavLink>

//           <nav className="space-y-2">
//             <NavLink to="/settings" className={linkClass} onClick={close}>
//               <Settings size={18} />
//               Settings
//             </NavLink>

//             <NavLink to="/help" className={linkClass} onClick={close}>
//               <HelpCircle size={18} />
//               More Settings
//             </NavLink>

//             <NavLink to="/notifications" className={linkClass} onClick={close}>
//               <Bell size={18} />
//               Notifications
//             </NavLink>

//             {/* repeat safely */}
//             <NavLink to="/help" className={linkClass} onClick={close}>
//               <HelpCircle size={18} />
//               More Settings
//             </NavLink>

//             <NavLink to="/notifications" className={linkClass} onClick={close}>
//               <Bell size={18} />
//               And More
//             </NavLink>
//           </nav>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default SettingsSidebar;
import { NavLink } from "react-router-dom";
import { Settings, Bell, HelpCircle, ArrowLeft } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import { Settings, HelpCircle, Bell, ArrowLeft } from "lucide-react";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
   ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

const SettingsSidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 bg-gray-50 border-r p-4">
        <NavLink
        to="/dashboard"
        className="flex items-center gap-2 text-sm text-gray-600 mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </NavLink>
      <nav className="space-y-2">
        <NavLink to="/settings/general" className={linkClass}>
          <Settings size={18} />
          General
        </NavLink>

        <NavLink to="/settings/notifications" className={linkClass}>
          <Bell size={18} />
          Notifications
        </NavLink>

        <NavLink to="/settings/help" className={linkClass}>
          <HelpCircle size={18} />
          Help & Support
        </NavLink>
      </nav>
    </aside>
  );
};

export default SettingsSidebar;
