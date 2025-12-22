import { Routes, Route, Navigate } from "react-router-dom";

// Features
import { AuthPage } from "@/features/Auth";
import { DashboardLayout, DashboardPage } from "@/features/Dashboard";
import {
  SettingsLayout,
  GeneralSettings,
  HelpSupport,
  Notifications,
} from "@/features/Settings";
import { BarcodeGenerate, BarcodeHistory } from "@/features/Barcode";
import { AddProduct, GroupItem } from "@/features/Product";
import { Reports } from "@/features/Report";
import { Profile } from "@/features/Profile";
import { Order } from "@/features/Order";
import CategoryProducts from "@/features/Product/screens/CategoryProducts";
import ProductDetails from "@/features/Product/screens/ProductDetails";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* Auth routes */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Main Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/barcode/generate" element={<BarcodeGenerate />} />
        <Route path="/barcode/history" element={<BarcodeHistory />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products" element={<GroupItem />} />
        <Route path="/products/category/:name" element={<CategoryProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<HelpSupport />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Settings Layout */}
      <Route path="/settings" element={<SettingsLayout />}>
        <Route path="general" element={<GeneralSettings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<HelpSupport />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <a
        href="/dashboard"
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </a>
    </div>
  </div>
);

export default AppRoutes;
