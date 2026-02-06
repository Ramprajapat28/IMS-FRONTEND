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
import { BarcodeGenerate, BarcodeHistory, BarcodeScanner } from "@/features/Barcode";
import { AddProduct, GroupItem } from "@/features/Product";
import { Reports } from "@/features/Report";
import { Profile } from "@/features/Profile";
import { Order } from "@/features/Order";
import { InventoryPage, InventoryCategoriesPage, InventoryProductDetailsPage, InventoryVariantsPage, GlobalCategoryPage, AddGlobalCategoryPage, AddCategoryPage, EditGlobalCategoryPage, EditCategoryPage } from "@/features/Inventory";
import CategoryProducts from "@/features/Product/screens/CategoryProducts";
import EditProduct from "@/features/Product/screens/EditProduct";
// import ProductVariantsPage from "@/features/Product/screens/ProductVariantsPage";
import ProductDetailsPage from "@/features/Product/screens/ProductDetailsPage";
// import WarehousePage from "@/features/Warehouse/screens/WarehousePage";
import WarehouseListPage from "@/features/Warehouse/screens/WarehouseListPage";
import WarehouseDetailsPage from "@/features/Warehouse/screens/WarehouseDetailsPage";
import RoomDetailsPage from "@/features/Warehouse/screens/RoomDetailsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/inventory" replace />} />

      {/* Auth routes */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Main Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Inventory Routes - Hierarchy */}
        <Route path="/inventory" element={<GlobalCategoryPage />} />
        <Route path="/inventory/add-global" element={<AddGlobalCategoryPage />} />
        <Route path="/inventory/global-category/:globalId/categories" element={<InventoryCategoriesPage />} />
        <Route path="/inventory/add-category" element={<AddCategoryPage />} />
        <Route path="/inventory/edit-global/:id" element={<EditGlobalCategoryPage />} />
        <Route path="/inventory/edit-category/:id" element={<EditCategoryPage />} />
        <Route path="/inventory/category/:categoryId" element={<InventoryPage />} />
        <Route path="/inventory/details/:id" element={<InventoryProductDetailsPage />} />
        <Route path="/inventory/variants/:id" element={<InventoryVariantsPage />} />

        {/* Warehouse Routes - Drill-down navigation */}
        <Route path="/warehouse" element={<WarehouseListPage />} />
        <Route path="/warehouse/:id" element={<WarehouseDetailsPage />} />
        <Route path="/warehouse/:id/room/:roomId" element={<RoomDetailsPage />} />

        <Route path="/orders" element={<Order />} />
        <Route path="/barcode/generate" element={<BarcodeGenerate />} />
        <Route path="/barcode/history" element={<BarcodeHistory />} />
        <Route path="/barcode/scanner" element={<BarcodeScanner />} />

        {/* Products Routes - WITHOUT categories (back to original) */}
        <Route path="/products" element={<GroupItem />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/category/:name" element={<CategoryProducts />} />
        {/* <Route path="/products/variants/:id" element={<ProductVariantsPage />} /> */}
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/products/details/:id" element={<ProductDetailsPage />} />

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
        href="/inventory"
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to Inventory
      </a>
    </div>
  </div>
);

export default AppRoutes;
