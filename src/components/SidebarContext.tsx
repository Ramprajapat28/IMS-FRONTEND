// import { createContext, useContext, useState } from "react";

// interface SidebarContextType {
//   isOpen: boolean;
//   open: () => void;
//   close: () => void;
// }

// const SidebarContext = createContext<SidebarContextType | null>(null);

// export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <SidebarContext.Provider
//       value={{
//         isOpen,
//         open: () => setIsOpen(true),
//         close: () => setIsOpen(false)
//       }}
//     >
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// export const useSidebar = () => {
//   const context = useContext(SidebarContext);
//   if (!context) throw new Error("useSidebar must be used inside SidebarProvider");
//   return context;
// };
import { createContext, useContext, useState } from "react";

interface SidebarContextType {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
};
