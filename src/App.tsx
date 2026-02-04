import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@/app/providers";
import AppRoutes from "@/app/routes";
import "./index.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <SidebarProvider>
        <AppRoutes />
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;