# Fitistan IMS - Frontend

## Overview
This is the frontend application for the Fitistan Inventory Management System. It's a React-based SPA that provides a user-friendly interface for inventory tracking, barcode scanning, and order processing.

## Tech Stack
- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Client**: Axios

## Setup & Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment:
   - Create a `.env` file in the root of this directory.
   - Add your backend API URL:
     ```env
     VITE_API_URL=http://localhost:3000
     ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Directory Structure
- `src/features`: Contains modularized functionality (e.g., Product, Inventory, Dashboard).
- `src/api`: Centralized API service definitions.
- `src/components`: Generic, reusable UI components (Buttons, Modals, etc.).
- `src/hooks`: Custom React hooks for shared logic.

For more technical details on state management and feature structure, see [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md).
