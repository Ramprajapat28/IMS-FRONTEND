import { Bell, Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/app/providers";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { open } = useSidebar();

  return (
    <header className="h-16 bg-white border-b flex items-center px-4 md:px-10">
      {/* LEFT */}
      {/* <div className="flex items-center gap-3 min-w-[180px]">
        {/* HAMBURGER (mobile) */}
        {/*<button
          onClick={open}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        <div className="w-9 h-9 rounded-lg bg-blue-600 items-center justify-center text-white font-bold hidden sm:flex">
          F
        </div>
        <span className="text-lg font-semibold text-gray-800 hidden sm:block">
          FitInventory
        </span>
      </div> */}

      {/* CENTER (hidden on mobile) */}
      <div className="flex-1 hidden md:flex ml-12">
        <div className="relative w-1/3 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm
                       focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 min-w-[150px] justify-end">
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <img
          onClick={() => navigate("/profile")}
          src="https://i.pravatar.cc/40"
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Navbar;
// import { NavLink } from "react-router-dom";
// import { Menu } from "lucide-react";

// const Navbar = () => {
//   return (
//     <header className="bg-white border-b px-4 md:px-6 py-4 flex items-center justify-between">
//       {/* LEFT SECTION */}
//       <div className="flex items-center gap-3">
//         {/* MOBILE MENU BUTTON */}
//         <button className="md:hidden">
//           <Menu size={22} />
//         </button>

//         {/* SEARCH */}
//         <input
//           placeholder="Search"
//           className="border px-4 py-2 rounded-lg w-40 sm:w-64 md:w-80"
//         />
//       </div>

//       {/* RIGHT SECTION */}
//       <div className="flex items-center gap-3 md:gap-4">
//         {/* FILTER LINKS */}
//         <NavLink
//           to="/dashboard?filter=month"
//           className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100 hidden sm:block"
//         >
//           Month
//         </NavLink>

//         <NavLink
//           to="/dashboard?filter=year"
//           className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100 hidden sm:block"
//         >
//           Year
//         </NavLink>

//         {/* PROFILE */}
//         <NavLink to="/profile">
//           <img
//             src="https://i.pravatar.cc/40"
//             className="w-9 h-9 rounded-full cursor-pointer"
//           />
//         </NavLink>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
