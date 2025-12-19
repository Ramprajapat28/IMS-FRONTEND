import { Outlet, useLocation } from "react-router-dom";
import SettingsSidebar from "../components/SettingsSidebar";
import SettingsList from "../components/SettingsList";

const SettingsLayout: React.FC = () => {
  const location = useLocation();

  // Are we on /settings exactly?
  const isSettingsHome = location.pathname === "/settings";

  return (
    <div className="h-screen flex">

      {/* DESKTOP SIDEBAR */}
      <SettingsSidebar />

      {/* CONTENT */}
      <main className="flex-1 bg-white overflow-y-auto">

        {/* MOBILE SETTINGS LIST (ONLY on /settings) */}
        {isSettingsHome && <SettingsList />}

        {/* SETTINGS DETAIL PAGE */}
        {!isSettingsHome && (
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        )}

      </main>
    </div>
  );
};

export default SettingsLayout;

