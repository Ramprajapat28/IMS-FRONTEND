import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "../src/components/SidebarContext.tsx";
import './index.css'
import App from './App.tsx'
import "../src/services/chartSetup.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidebarProvider>
    {/* <BrowserRouter> */}
    <App />
  {/* </BrowserRouter> */}
  </SidebarProvider>
  </StrictMode>,
)
