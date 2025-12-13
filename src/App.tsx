import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./feature/Dashboard/components/Dashboard";
import SettingsLayout from "../src/feature/Setting/screens/Setting";
import AuthPage from "./feature/Auth/components/Auth";
import DashboardPage from "./feature/Dashboard/screens/DashboardPage";
import BarcodeGenerate from "../src/feature/BarCodeScanner/screens/BarcodeGenerate";
import BarcodeHistory from "../src/feature/BarCodeScanner/screens/BarcodeHistory";
import AddProduct from "../src/feature/Product/screens/AddProduct";
import GroupItem from "../src/feature/Product/screens/GroupItem";
import Reports from "../src/feature/Report/screens/Reports";
import Profile from "../src/feature/Profile/Profile";
import Help from "../src/components/HelpSupport";
import Notifications from "../src/components/Notifications";
import GeneralSettings from "../src/components/GeneralSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/auth" replace />} />

        <Route path="/auth" element={<AuthPage />} />

        {/* MAIN DASHBOARD LAYOUT */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/barcode/generate" element={<BarcodeGenerate />} />
          <Route path="/barcode/history" element={<BarcodeHistory />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/groups" element={<GroupItem />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route path="/settings" element={<SettingsLayout />}>
          <Route path="general" element={<GeneralSettings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="help" element={<Help />} />
        </Route>

        <Route path="*" element={<div>404 - Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;