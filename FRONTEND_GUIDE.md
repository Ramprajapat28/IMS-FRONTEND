# Frontend Technical Guide

## 1. Feature-Based Architecture
The frontend is organized into modules under `src/features/`. Each feature follows a consistent structure:
- `api/`: Feature-specific API calls.
- `components/`: Feature-specific UI components.
- `screens/`: Main page components.
- `types/`: TypeScript definitions for the feature.

## 2. Category Hierarchy in UI
To maintain consistency with the backend logic, the UI labels are as follows:
- **Category Selection**: Fetches data from `global_category`.
- **Sub Category Selection**: Fetches data from the `category` table based on the selected `global_category_id`.

Example from `AddProduct.tsx`:
```tsx
// Global Category
<select value={form.global_category_id}>
  {globalCategories.map((gc) => (...))}
</select>

// Sub Category (filtered by global_category_id)
<select value={form.category_id}>
  {categories.filter(c => c.global_category_id === ...).map((c) => (...))}
</select>
```

## 3. Product Variants & SKU Logic
- **SKU**: Unique identifier for a specific product item (e.g., "SHIRT-RED-XL").
- **Product Code**: Used to group variants. If a product has a `product_code`, it is treated as part of a variant group in the inventory view.

## 4. Barcode Scanning
The system uses `lucide-react` icons and custom scanning logic (integrated via `features/Barcode`). It supports both camera scanning and manual entry.

## 5. UI/UX Principles
- **Clean Aesthetic**: Uses a white/blue color palette for a professional look.
- **Responsive**: Layouts are designed to work on both desktop and tablet resolutions.
- **Feedback**: Toast notifications are used for success/error messages during data entry.
