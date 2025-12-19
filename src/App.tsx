import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@/app/providers";
import AppRoutes from "@/app/routes";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppRoutes />
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;