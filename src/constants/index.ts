// Application constants

export const APP_NAME = "Fitistan IMS";
export const APP_VERSION = "1.0.0";

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  TIMEOUT: 30000,
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  BARCODE: {
    GENERATE: "/barcode/generate",
    HISTORY: "/barcode/history",
  },
  PRODUCTS: {
    ADD: "/products/add",
    GROUPS: "/products/groups",
  },
  REPORTS: "/reports",
  PROFILE: "/profile",
  SETTINGS: {
    ROOT: "/settings",
    GENERAL: "/settings/general",
    NOTIFICATIONS: "/settings/notifications",
    HELP: "/settings/help",
  },
  HELP: "/help",
  NOTIFICATIONS: "/notifications",
} as const;

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 80,
  HEADER_HEIGHT: 64,
  ANIMATION_DURATION: 200,
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 25, 50, 100],
} as const;
