# Fitistan IMS Frontend

A modern Inventory Management System built with React, TypeScript, and Vite.

## Table of Contents

- [Project Structure](#project-structure)
- [Architecture Principles](#architecture-principles)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)

---

## Project Structure

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
│   └── ui/                       # Reusable UI primitives
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

---

## Architecture Principles

### Feature-Based Architecture

Each feature is self-contained with its own:

| Directory       | Purpose                              |
|-----------------|--------------------------------------|
| `screens/`      | Page/screen components               |
| `components/`   | Feature-specific components          |
| `hooks/`        | Feature-specific hooks               |
| `types/`        | Feature-specific TypeScript types    |
| `services/`     | Feature-specific API calls           |
| `utils/`        | Feature-specific utilities           |
| `index.ts`      | Barrel file exporting public API     |

### Import Conventions

Use the `@/` alias for absolute imports:

```typescript
// Recommended
import { AuthPage } from "@/features/Auth";
import { useSidebar } from "@/app/providers";

// Avoid
import { AuthPage } from "../../../features/Auth";
```

### Barrel Files

Each module has an `index.ts` barrel file that exports only the public API:

```typescript
// features/Auth/index.ts
export { default as AuthPage } from "./components/AuthPage";
export { default as Login } from "./screens/Login";
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

---

## Tech Stack

| Technology       | Purpose                    |
|------------------|----------------------------|
| React 19         | UI library                 |
| TypeScript       | Type safety                |
| Vite             | Build tool                 |
| React Router v7  | Routing                    |
| TailwindCSS      | Styling                    |
| Chart.js         | Charts and visualizations  |
| Lucide React     | Icons                      |

---

## Configuration

### Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.app.json`:

| Alias  | Maps To  |
|--------|----------|
| `@/*`  | `src/*`  |

This allows clean imports such as:

```typescript
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
```

### Environment Variables

Create a `.env` file in the project root for environment-specific configuration:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Available Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start development server             |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build locally     |
| `npm run lint`    | Run ESLint                           |

---

## License

This project is proprietary software. All rights reserved.
