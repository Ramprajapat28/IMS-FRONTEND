# FitInventory Management System - Frontend Flow Guide

This document explains the user interface and interaction flows of the FitInventory Management System (IMS).

---

## 1. Authentication Flow

### Login Screen
*   **What to enter**:
    *   **Email**: Registered user email address.
    *   **Password**: User-specific password.
*   **Actions**:
    *   **Login Button**: Validates credentials with the server. If successful, redirects to the **Dashboard/Inventory**.
    *   **Sign Up (Optional/Commented)**: Switches the view to create a new account.

### Sign Up Screen
*   **What to enter**:
    *   **Full Name**, **Email**, **Password**, **Confirm Password**.
*   **Actions**:
    *   **Sign Up Button**: Creates a new user profile. currently redirects to Inventory.
    *   **Login Link**: Switches back to the Login screen.

---

## 2. Inventory Management

### Navigation Hierarchy
The system uses a hierarchical category system to organize products:
`Global Category` > `Sub Category` > `Products` > `Product Details`.

### Global Category Page (`/inventory`)
*   **What to see**: Grid of main categories (e.g., Footwear, Apparel).
*   **Actions**:
    *   **Add Category Button**: Opens a form to create a new high-level category.
    *   **Category Card Click**: Navigates to the sub-categories under that global category.
    *   **Edit (Pencil Icon)**: Modifies name or logo of the global category.
    *   **Delete (Trash Icon)**: Removes the category (requires confirmation).

### Sub Category Page
*   **What to see**: List of sub-groups (e.g., Running Shoes, T-Shirts).
*   **Actions**:
    *   **Add Sub Category Button**: Form to add a specific group under the current global category.
    *   **Click on Sub Category**: Navigates to the list of specific products in that group.

### Product Listing Table
*   **Inputs**:
    *   **Search Bar**: Filters products by name or SKU across the current category.
    *   **Sort Dropdown**: Reorders the list by Name, Category, or Quantity.
*   **Actions**:
    *   **Row Click**: Navigates to the **Product Details Page**.

### Product Details & Management
*   **View Mode**: Displays full product info, pricing, and specific stock locations.
*   **Management Actions**:
    *   **Edit Button**: Opens the **Product Management/Edit** view.
    *   **Download Barcode**: Generates SKU barcode as PNG.
    *   **Print Barcode**: Physical label printing modal.

---

## 3. Product Management & Stock Actions
Accessed by clicking **Edit** on any Product Details page.

### Page 1: Edit Basic Details
*   **What you can change**:
    *   **General**: Name, Description, Categories, Size, SKU, HSN Code.
    *   **Pricing**: MRP, Discounted Price, Cost (CTC), GST Percentage.
    *   **Inventory Rules**: Reorder Level (Low Stock Limit).
*   **Actions**:
    *   **Save & Next**: Moves to Inventory Management (Stock actions).

### Page 2: Inventory Actions
This page allows managing physical stock in the warehouse.

#### A. Adding New Stock
*   **Inputs**:
    *   **Quantity**: Number of units to add.
    *   **Warehouse / Room / Shelf / Rack**: Physical destination for the new stock.
    *   **Remark**: optional note for the transaction (e.g., "New Shipment").
*   **Action**: Clicking **Submit** updates the total quantity and logs the entry.

#### B. Deducting Stock
*   **Why**: Used for manual adjustments or removing damaged items.
*   **Inputs**:
    *   **Quantity**: Units to remove.
    *   **Location**: Select the specific shelf/rack to deduct from.
    *   **Remark**: Required explanation (e.g., "Damaged during handling").
*   **Action**: **Deduct Stock** button updates the inventory immediately.

#### C. Transferring Stock
*   **Why**: Move items from one warehouse/shelf to another.
*   **Flow**:
    1.  **Source**: Select the location where stock is currently located.
    2.  **Destination**: Select the new physical location.
    3.  **Quantity & Remark**: Specify how much to move and why (e.g., "Exhibition Display").
*   **Action**: **Execute Transfer** moves the stock between locations in the system.

#### D. Stock History
*   **What to see**: A scrollable log of all additions, deductions, and transfers with dates and remarks.

---

## 4. Warehouse Management

### Warehouse List Page (`/warehouse`)
*   **Actions**:
    *   **Add Warehouse Button**: Opens a modal to enter Name, Location, and Contact details.
    *   **Warehouse Card**: Navigates into the warehouse to see Rooms and Racks.
    *   **Edit/Delete Icons**: Manage warehouse metadata.

### Internal Hierarchy (Room/Rack)
*   **Flow**: Warehouse > Room > Rack/Shelf.
*   **Details**: Shows exactly how much stock of which product is stored in a specific physical location.

---

## 4. Orders & Reports

### Orders Page (`/orders`)
*   **Inputs**:
    *   **Filter selects**: Filter history by Category, Product, Warehouse, or Status (Processing, Sold, Returned, etc.).
*   **Interactions**:
    *   View inward/outward dates and the user responsible for the transaction.

---

## 5. Barcode System

### Barcode Scanner (`/barcode/scanner`)
*   **Actions**: Uses the device camera to scan SKUs. Successful scans navigate directly to the product's inventory record.

---

> [!TIP]
> **Converting to PDF**:
> 1. Open this file in **VS Code**.
> 2. Install the **Markdown PDF** extension.
> 3. Right-click and select **Markdown PDF: Export (pdf)**.
