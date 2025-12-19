# Fitistan IMS Frontend

A modern Inventory Management System built with React, TypeScript, and Vite.

## 📁 Project Structure

This project follows a **feature-based architecture** for better scalability and maintainability.

```
src/
├── app/                          # App-level configuration
│   ├── providers/                # React Context providers
│   │   ├── SidebarProvider.tsx   # Sidebar state management
│   │   └── index.ts              # Barrel file
│   └── routes/                   # Route configuration
│       └── index.tsx             # Centralized route definitions
│
├── components/                   # Shared/common UI components
│   ├── layout/                   # Layout components (Navbar, Sidebar)
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   └── ui/                       # Reusable UI primitives (buttons, inputs, etc.)
│
├── constants/                    # Application constants
│   └── index.ts                  # Routes, API config, UI constants
│
├── features/                     # Feature modules
│   ├── Auth/                     # Authentication feature
│   │   ├── components/           # Feature-specific components
│   │   ├── screens/              # Screen/page components
│   │   └── index.ts              # Public exports
│   │
│   ├── Barcode/                  # Barcode feature
│   │   ├── screens/
│   │   └── index.ts
│   │
│   ├── Dashboard/                # Dashboard feature
│   │   ├── components/
│   │   ├── screens/
│   │   └── index.ts
│   │
│   ├── Product/                  # Product management feature
│   │   ├── screens/
│   │   ├── types/                # Feature-specific types
│   │   └── index.ts
│   │
│   ├── Profile/                  # User profile feature
│   │   ├── screens/
│   │   └── index.ts
│   │
│   ├── Report/                   # Reports feature
│   │   ├── screens/
│   │   └── index.ts
│   │
│   └── Settings/                 # Settings feature
│       ├── components/
│       ├── screens/
│       └── index.ts
│
├── hooks/                        # Shared custom hooks
│   └── index.ts
│
├── services/                     # API services and external integrations
│   └── chartSetup.ts             # Chart.js configuration
│
├── types/                        # Shared TypeScript types
│   └── index.ts
│
├── utils/                        # Shared utility functions
│   └── index.ts
│
├── App.tsx                       # Root component
├── main.tsx                      # Entry point
└── index.css                     # Global styles
```

## 🏗️ Architecture Principles

### Feature-Based Architecture

Each feature is self-contained with its own:
- **screens/** - Page/screen components
- **components/** - Feature-specific components
- **hooks/** - Feature-specific hooks (when needed)
- **types/** - Feature-specific TypeScript types
- **services/** - Feature-specific API calls (when needed)
- **utils/** - Feature-specific utilities (when needed)
- **index.ts** - Barrel file exporting public API

### Import Conventions

Use the `@/` alias for absolute imports:
```typescript
// ✅ Good
import { AuthPage } from "@/features/Auth";
import { useSidebar } from "@/app/providers";

// ❌ Avoid
import { AuthPage } from "../../../features/Auth";
```

### Barrel Files

Each module has an `index.ts` barrel file that exports only the public API:
```typescript
// features/Auth/index.ts
export { default as AuthPage } from "./components/AuthPage";
export { default as Login } from "./screens/Login";
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## 📦 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v7** - Routing
- **TailwindCSS** - Styling
- **Chart.js** - Charts and visualizations
- **Lucide React** - Icons

## 🎨 Styling

The project uses TailwindCSS for styling. Global styles are in `src/index.css`.

## 🔧 Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.app.json`:
- `@/*` → `src/*`

This allows clean imports like `import { Button } from "@/components/ui"`.
