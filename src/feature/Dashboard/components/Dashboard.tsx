import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/SideBar";
import Navbar from "../../../components/Navbar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">

      {/* FULL WIDTH NAVBAR */}
      <Navbar />

      {/* BELOW NAVBAR */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
