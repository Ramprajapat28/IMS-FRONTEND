import { BrowserRouter } from "react-router-dom";
import { SidebarProvider, NetworkStatusProvider } from "@/app/providers";
import AppRoutes from "@/app/routes";
import "./index.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <NetworkStatusProvider>
        <SidebarProvider>
          <AppRoutes />
        </SidebarProvider>
      </NetworkStatusProvider>
    </BrowserRouter>
  );
}

export default App;