// // import { useEffect, useMemo, useState } from "react";
// // import {
// //   Search,
// //   Plus,
// //   Pencil,
// //   Trash2,
// //   ChevronRight,
// // } from "lucide-react";
// // import { useNavigate } from "react-router-dom";

// // /* -------------------------------- TYPES -------------------------------- */
// // type Product = {
// //   id: number;
// //   name: string;
// //   category: string;
// //   sku: string;
// //   location: string;
// //   quantity: number;
// //   image: string;
// // };

// // /* ------------------------------- DUMMY DATA ------------------------------ */
// // const PRODUCTS: Product[] = Array.from({ length: 150 }, (_, i) => ({
// //   id: i + 1,
// //   name: [
// //     "Blue Jersey Tshirt",
// //     "Sena Cap Green",
// //     "Stainless Steel Bottle",
// //     "The Soldier Mug",
// //     "Camo T-Shirt",
// //     "iPhone Case – Camo",
// //     "Red Premium Satchel",
// //     "iPhone 14 Pro",
// //     "Gaming Chair",
// //     "Borealis Backpack",
// //   ][i % 10],
// //   category: [
// //     "T-Shirts",
// //     "Caps",
// //     "Bottles",
// //     "Mugs",
// //     "Cases",
// //     "Bags",
// //     "Phone",
// //     "Furniture",
// //   ][i % 8],
// //   sku: i % 3 === 0 ? "— — — —" : `PT${1000 + i}`,
// //   location: ["R1-W1", "S1-R2-W1", "R2-W1", "Warehouse A"][i % 4],
// //   quantity: 100 + (i % 7) * 50,
// //   image:
// //     "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200",
// // }));

// // /* -------------------------- PAGINATION CONFIG ---------------------------- */
// // const MAX_VISIBLE_PAGES = 5;

// // const getVisiblePages = (page: number, totalPages: number) => {
// //   const half = Math.floor(MAX_VISIBLE_PAGES / 2);

// //   let start = Math.max(1, page - half);
// //   let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

// //   if (end - start + 1 < MAX_VISIBLE_PAGES) {
// //     start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
// //   }

// //   return Array.from({ length: end - start + 1 }, (_, i) => start + i);
// // };

// // /* -------------------------------- COMPONENT ------------------------------ */
// // const ProductsPage = () => {
// //   const navigate = useNavigate();

// //   const [search, setSearch] = useState("");
// //   const [sortBy, setSortBy] = useState<"name" | "category" | "quantity">(
// //     "name"
// //   );
// //   const [page, setPage] = useState(1);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);

// //   /* ----------------------------- FILTER + SORT ---------------------------- */
// //   const filteredProducts = useMemo(() => {
// //     const s = search.toLowerCase();

// //     let data = PRODUCTS.filter((p) =>
// //       p.name.toLowerCase().includes(s)
// //     );

// //     data = [...data].sort((a, b) => {
// //       if (sortBy === "quantity") return b.quantity - a.quantity;
// //       return a[sortBy].localeCompare(b[sortBy]);
// //     });

// //     return data;
// //   }, [search, sortBy]);

// //   /* ----------------------------- PAGINATION ------------------------------ */
// //   const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
// //   const visiblePages = getVisiblePages(page, totalPages);

// //   const paginatedProducts = filteredProducts.slice(
// //     (page - 1) * rowsPerPage,
// //     page * rowsPerPage
// //   );

// //   useEffect(() => {
// //     if (page > totalPages) setPage(totalPages || 1);
// //   }, [page, totalPages]);

// //   /* -------------------------------- RENDER ------------------------------- */
// //   return (
// //     <div className="bg-white rounded-xl border p-4 md:p-6 space-y-4">
// //       {/* HEADER */}
// //       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
// //         <div>
// //           <h1 className="text-xl font-semibold">Products</h1>
// //           <p className="text-sm text-gray-500">
// //             Dashboard › Products
// //           </p>
// //         </div>

// //         <div className="flex gap-2">
// //           <button
// //             onClick={() => navigate("/products/add")}
// //             className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
// //           >
// //             <Plus size={16} /> Add Product
// //           </button>
// //         </div>
// //       </div>

// //       {/* SEARCH + SORT */}
// //       <div className="flex flex-col md:flex-row md:items-center gap-3">
// //         <div className="relative w-full md:max-w-sm">
// //           <Search
// //             size={16}
// //             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
// //           />
// //           <input
// //             value={search}
// //             onChange={(e) => {
// //               setSearch(e.target.value);
// //               setPage(1);
// //             }}
// //             placeholder="Search product"
// //             className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm"
// //           />
// //         </div>

// //         <select
// //           value={sortBy}
// //           onChange={(e) =>
// //             setSortBy(e.target.value as typeof sortBy)
// //           }
// //           className="border rounded-lg px-3 py-2 text-sm md:ml-auto"
// //         >
// //           <option value="name">Sort by Name</option>
// //           <option value="category">Sort by Category</option>
// //           <option value="quantity">Sort by Quantity</option>
// //         </select>
// //       </div>

// //       {/* TABLE */}
// //       <div className="overflow-x-auto">
// //         <table className="w-full text-sm">
// //           <thead className="bg-gray-100 text-left">
// //             <tr>
// //               <th className="p-3">#</th>
// //               <th className="p-3">Product Name</th>
// //               <th className="p-3">Category</th>
// //               <th className="p-3">SKU</th>
// //               <th className="p-3">Location</th>
// //               <th className="p-3">Qty</th>
// //               <th className="p-3"></th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {paginatedProducts.map((p) => (
// //               <tr key={p.id} className="border-b last:border-none">
// //                 <td className="p-3">{p.id}</td>

// //                 <td className="p-3 flex items-center gap-3 min-w-[220px]">
// //                   <img
// //                     src={p.image}
// //                     className="w-10 h-10 rounded-lg object-cover"
// //                   />
// //                   <span className="font-medium">{p.name}</span>
// //                 </td>

// //                 <td className="p-3 text-gray-600">{p.category}</td>
// //                 <td className="p-3 text-gray-500">{p.sku}</td>
// //                 <td className="p-3 text-gray-600">{p.location}</td>
// //                 <td className="p-3">{p.quantity}</td>

// //                 <td className="p-3 flex gap-2">
// //                   <button className="border rounded-lg p-1.5 hover:bg-gray-100">
// //                     <ChevronRight size={16} />
// //                   </button>
// //                   <button className="border rounded-lg p-1.5 hover:bg-gray-100">
// //                     <Pencil size={16} />
// //                   </button>
// //                   <button className="border rounded-lg p-1.5 hover:bg-gray-100">
// //                     <Trash2 size={16} />
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* FOOTER */}
// //       <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
// //         {/* ROWS */}
// //         <div className="flex items-center gap-2 text-sm">
// //           <span>Rows per page</span>
// //           <select
// //             value={rowsPerPage}
// //             onChange={(e) => {
// //               setRowsPerPage(Number(e.target.value));
// //               setPage(1);
// //             }}
// //             className="border rounded-lg px-2 py-1"
// //           >
// //             {[5, 10, 20].map((n) => (
// //               <option key={n} value={n}>
// //                 {n}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* PAGINATION */}
// //         <div className="flex items-center gap-2 flex-wrap justify-center">
// //           {visiblePages[0] !== 1 && (
// //             <button
// //               onClick={() => setPage(1)}
// //               className="w-9 h-9 rounded-full border text-sm"
// //             >
// //               1
// //             </button>
// //           )}

// //           {visiblePages[0] > 2 && <span>…</span>}

// //           {visiblePages.map((p) => (
// //             <button
// //               key={p}
// //               onClick={() => setPage(p)}
// //               className={`w-9 h-9 rounded-full border text-sm
// //                 ${
// //                   p === page
// //                     ? "bg-gray-900 text-white"
// //                     : "hover:bg-gray-100"
// //                 }`}
// //             >
// //               {p}
// //             </button>
// //           ))}

// //           {visiblePages.at(-1)! < totalPages - 1 && <span>…</span>}

// //           {visiblePages.at(-1)! !== totalPages && (
// //             <button
// //               onClick={() => setPage(totalPages)}
// //               className="w-9 h-9 rounded-full border text-sm"
// //             >
// //               {totalPages}
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductsPage;
// import { useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   Plus,
//   Pencil,
//   Trash2,
//   ChevronRight,
//   Download,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// /* -------------------------------- TYPES -------------------------------- */
// type Product = {
//   id: number;
//   name: string;
//   category: string;
//   sku: string;
//   location: string;
//   quantity: number;
//   image: string;
// };

// /* ------------------------------- DUMMY DATA ------------------------------ */
// const INITIAL_PRODUCTS: Product[] = Array.from({ length: 50 }, (_, i) => ({
//   id: i + 1,
//   name: "Blue Jersey T-Shirt",
//   category: "T-Shirts",
//   sku: `TS01-BL-${i}`,
//   location: "S1-R1-W1",
//   quantity: 20 + i,
//   image:
//     "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200",
// }));

// /* -------------------------------- COMPONENT ------------------------------ */
// const ProductsPage = () => {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] =
//     useState<"none" | "name" | "category" | "quantity">("none");
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 10;

//   /* --------------------------- SEARCH + SORT ---------------------------- */
//   const filteredProducts = useMemo(() => {
//     let data = products.filter((p) =>
//       `${p.name} ${p.sku} ${p.category} ${p.location}`
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     );

//     if (sortBy !== "none") {
//       data = [...data].sort((a, b) => {
//         if (sortBy === "quantity") return b.quantity - a.quantity;
//         return a[sortBy].localeCompare(b[sortBy]);
//       });
//     }

//     return data;
//   }, [products, search, sortBy]);

//   /* ------------------------------ PAGINATION ----------------------------- */
//   const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
//   const paginatedProducts = filteredProducts.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage
//   );

//   /* ------------------------------ ACTIONS -------------------------------- */
//   const handleDelete = (id: number) => {
//     if (confirm("Are you sure you want to delete this product?")) {
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//     }
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();

//     doc.text("Products List", 14, 15);

//     autoTable(doc, {
//       startY: 20,
//       head: [["Name", "Category", "SKU", "Location", "Qty"]],
//       body: products.map((p) => [
//         p.name,
//         p.category,
//         p.sku,
//         p.location,
//         p.quantity,
//       ]),
//     });

//     doc.save("products.pdf");
//   };

//   /* -------------------------------- UI -------------------------------- */
//   return (
//     <div className="bg-white rounded-xl border p-6 space-y-5">
//       {/* TOP BAR */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-xl font-semibold">Products</h1>
//           <p className="text-sm text-gray-500">Dashboard → Products</p>
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={() => navigate("/products/add")}
//             className="bg-black text-white px-4 py-2 rounded-lg text-sm flex gap-1"
//           >
//             <Plus size={16} /> Add Product
//           </button>

//           <button
//             onClick={exportPDF}
//             className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex gap-1"
//           >
//             <Download size={16} /> Import Product
//           </button>
//         </div>
//       </div>

//       {/* SEARCH & SORT */}
//       <div className="flex flex-col md:flex-row gap-3">
//         <div className="relative w-full md:max-w-sm">
//           <Search
//             size={16}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />
//           <input
//             placeholder="Search by name, SKU, category..."
//             className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//           />
//         </div>

//         <select
//           value={sortBy}
//           onChange={(e) =>
//             setSortBy(e.target.value as typeof sortBy)
//           }
//           className="border rounded-lg px-3 py-2 text-sm md:ml-auto"
//         >
//           <option value="none">Sort By</option>
//           <option value="name">Name</option>
//           <option value="category">Category</option>
//           <option value="quantity">Quantity</option>
//         </select>
//       </div>

//       {/* TABLE */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3">#</th>
//               <th className="p-3">Product</th>
//               <th className="p-3">Category</th>
//               <th className="p-3">SKU</th>
//               <th className="p-3">Location</th>
//               <th className="p-3">Qty</th>
//               <th className="p-3"></th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedProducts.map((p) => (
//               <tr key={p.id} className="border-b">
//                 <td className="p-3">{p.id}</td>

//                 <td className="p-3 flex items-center gap-3">
//                   <img
//                     src={p.image}
//                     className="w-10 h-10 rounded-lg"
//                   />
//                   {p.name}
//                 </td>

//                 <td className="p-3">{p.category}</td>
//                 <td className="p-3">{p.sku}</td>
//                 <td className="p-3">{p.location}</td>
//                 <td className="p-3">{p.quantity}</td>

//                 <td className="p-3 flex gap-2">
//                   <button
//                     onClick={() => navigate(`/products/${p.id}`)}
//                     className="border rounded-lg p-1.5"
//                   >
//                     <ChevronRight size={16} />
//                   </button>

//                   <button
//                     onClick={() => navigate(`/products/${p.id}`)}
//                     className="border rounded-lg p-1.5"
//                   >
//                     <Pencil size={16} />
//                   </button>

//                   <button
//                     onClick={() => handleDelete(p.id)}
//                     className="border rounded-lg p-1.5"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductsPage;
import { useEffect, useMemo, useState } from "react";
import { Search, Pencil, Trash2, Loader2, Printer, Download, ShoppingBag, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import ProductsNavbar from "../components/ProductsNavbar";
import ProductsFooter from "../components/ProductsFooter";
import { productsApi } from "@/features/Product/api/product.api";
import { formatCurrency } from "@/utils";
import type { Product } from "@/features/Product/types";
import BarcodePrintModal from "../components/BarcodePrintModal";
import BulkBarcodePrintModal from "../components/BulkBarcodePrintModal";

// Map API product to display format
interface DisplayProduct {
  id: number;
  name: string;
  category_name: string;
  category_id: number;
  sku: string;
  image: string;
  mrp: number;
  discounted_price: number;
  barcode_image?: string;
}

const ProductsPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] =
    useState<"none" | "name" | "category">("none");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Map<number, DisplayProduct>>(new Map());

  // Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isBulkPrintModalOpen, setIsBulkPrintModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DisplayProduct | null>(null);

  const handlePrintClick = (p: DisplayProduct) => {
    setSelectedProduct(p);
    setIsPrintModalOpen(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(prev => {
        const next = new Map(prev);
        data.forEach(p => next.set(p.id, p));
        return next;
      });
    } else {
      setSelectedProducts(prev => {
        const next = new Map(prev);
        data.forEach(p => next.delete(p.id));
        return next;
      });
    }
  };

  const handleSelectRow = (p: DisplayProduct, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    setSelectedProducts(prev => {
      const next = new Map(prev);
      if (next.has(p.id)) {
        next.delete(p.id);
      } else {
        next.set(p.id, p);
      }
      return next;
    });
  };

  const handleBulkDownload = async () => {
    const productsToDownload = Array.from(selectedProducts.values());
    if (productsToDownload.length === 0) return;

    for (const p of productsToDownload) {
      if (!p.sku || p.sku === "-----") continue;

      try {
        // Create a temporary canvas
        const canvas = document.createElement("canvas");

        // Generate barcode using JsBarcode on the canvas (matching ProductDetailsPage logic)
        JsBarcode(canvas, p.sku, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 20,
          margin: 10,
          background: "#ffffff"
        });

        // Convert canvas to data URL (PNG)
        const dataUrl = canvas.toDataURL("image/png");

        // Trigger download
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${p.sku}-barcode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Small delay to prevent browser blocking multiple downloads
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        console.error(`Failed to generate barcode for ${p.sku}`, err);
      }
    }
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productsApi.getAll(page, rows, search);
        if (response.success && response.data) {
          const products: DisplayProduct[] = response.data.map((p: Product) => {
            return {
              id: p.product_id,
              name: p.name,
              category_name: p.category_name || "Uncategorized",
              category_id: p.category_id || 0,
              sku: p.sku || "-----",
              image: Array.isArray(p.product_image) && p.product_image.length > 0
                ? p.product_image[0].file_path
                : "",
              mrp: p.mrp || 0,
              discounted_price: p.discounted_price || 0,
              barcode_image: p.barcode_image,
            };
          });
          setData(products);

          if (response.pagination) {
            setTotalPages(response.pagination.totalPages);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [page, rows, search]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productsApi.delete(id);
      setData((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const filtered = useMemo(() => {
    let d = data;

    if (sortBy !== "none") {
      d = [...d].sort((a, b) => {
        const key = sortBy === "category" ? "category_name" : sortBy;
        // @ts-ignore
        return a[key].localeCompare(b[key]);
      });
    }

    return d;
  }, [data, sortBy]);

  // const totalPages = Math.ceil(filtered.length / rows);
  // Client-side slicing removed as we are using server-side pagination
  const visible = filtered; // .slice((page - 1) * rows, page * rows);

  if (isLoading && data.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-6 flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Initializing Product List...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center text-red-600 py-8">
          <p className="text-lg font-medium">Failed to load products</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-6 space-y-5">
      <ProductsNavbar
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Products" },
        ]}
        // @ts-ignore
        onRefresh={() => {
          // Re-fetch products
          // We can just reload the page for simplicity or trigger the useEffect again
          window.location.reload();
        }}
      />

      {/* SEARCH & SORT */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative md:max-w-sm w-full group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="text-blue-500 animate-spin" size={16} />
            ) : (
              <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            )}
          </div>
          <input
            className={`w-full border rounded-lg pl-9 pr-3 py-2 text-sm transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none ${isLoading ? 'bg-blue-50/30' : 'bg-white'}`}
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="border rounded-lg px-3 py-2 text-sm md:ml-auto"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as typeof sortBy)
          }
        >
          <option value="none">Sort By</option>
          <option value="name">Name</option>
          <option value="category">Sub Category</option>
        </select>
      </div>

      {/* BULK ACTIONS */}
      {selectedProducts.size > 0 && (
        <div className="flex items-center flex-col md:flex-row gap-4 bg-blue-50 border border-blue-100 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-around w-full md:w-auto gap-4 ">
            <span className="text-sm font-medium text-blue-700">{selectedProducts.size} products selected</span>
            <button
              onClick={() => setSelectedProducts(new Map())}
              className="text-xs border border-blue-200 p-2 rounded-md bg-white text-blue-600 hover:bg-blue-100"
            >
              Clear selection
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkDownload}
              className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition flex items-center gap-1.5"
            >
              <Download size={14} /> Download Barcodes
            </button>
            <button
              onClick={() => setIsBulkPrintModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer size={14} /> Bulk Print
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={data.length > 0 && data.every(p => selectedProducts.has(p.id))}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 whitespace-nowrap">Sr.no</th>
              <th className="p-3 whitespace-nowrap min-w-[200px]">Product Name</th>
              <th className="p-3 whitespace-nowrap min-w-[150px]">Sub Category</th>
              <th className="p-3 whitespace-nowrap min-w-[120px]">SKU #</th>
              <th className="p-3 whitespace-nowrap text-right min-w-[100px]">MRP</th>
              <th className="p-3 whitespace-nowrap text-right min-w-[150px]">Discounted Price</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {visible.map((p, index) => {
              return (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    // Always navigate to product details when clicking row
                    navigate(`/products/details/${p.id}`);
                  }}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedProducts.has(p.id)}
                      onChange={(e) => handleSelectRow(p, e)}
                    />
                  </td>
                  <td className="p-3 whitespace-nowrap">{(page - 1) * rows + index + 1}</td>
                  <td className="p-3">
                    <div className="flex gap-3 items-center min-w-[180px]">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border text-gray-400">
                          <Package size={20} />
                        </div>
                      )}
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{p.category_name}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{p.sku}</td>
                  <td className="p-3 text-right font-medium text-gray-700 whitespace-nowrap">{formatCurrency(p.mrp)}</td>
                  <td className="p-3 text-right font-medium text-blue-600 whitespace-nowrap">{formatCurrency(p.discounted_price)}</td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate("/barcode/scanner", { state: { sku: p.sku } })}
                        className="border p-1.5 rounded-lg hover:bg-gray-100 text-green-600 border-green-100"
                        title="Sell Manual"
                      >
                        <ShoppingBag size={16} />
                      </button>
                      <button
                        onClick={() => handlePrintClick(p)}
                        className="border p-1.5 rounded-lg hover:bg-gray-100 text-blue-600 border-blue-100"
                        title="Print Barcode"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/products/edit/${p.id}`)}
                        className="border p-1.5 rounded-lg hover:bg-gray-100"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="border p-1.5 rounded-lg hover:bg-gray-100"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ProductsFooter
        page={page}
        totalPages={totalPages}
        rowsPerPage={rows}
        onPageChange={setPage}
        onRowsChange={(n) => {
          setRows(n);
          setPage(1);
        }}
      />

      {selectedProduct && (
        <BarcodePrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          product={{
            name: selectedProduct.name,
            sku: selectedProduct.sku,
            mrp: selectedProduct.mrp,
            discounted_price: selectedProduct.discounted_price,
            barcode_image: selectedProduct.barcode_image
          }}
        />
      )}

      <BulkBarcodePrintModal
        isOpen={isBulkPrintModalOpen}
        onClose={() => setIsBulkPrintModalOpen(false)}
        products={Array.from(selectedProducts.values())
          .map(p => ({
            name: p.name,
            sku: p.sku,
            barcode_image: p.barcode_image,
            mrp: p.mrp,
            discounted_price: p.discounted_price
          }))
        }
      />
    </div>
  );
};

export default ProductsPage;
// type FooterProps = {
//   page: number;
//   totalPages: number;
//   rowsPerPage: number;
//   onPageChange: (p: number) => void;
//   onRowsChange: (n: number) => void;
// };

// const MAX_VISIBLE = 5;

// const ProductsFooter1 = ({
//   page,
//   totalPages,
//   rowsPerPage,
//   onPageChange,
//   onRowsChange,
// }: FooterProps) => {
//   const half = Math.floor(MAX_VISIBLE / 2);
//   let start = Math.max(1, page - half);
//   let end = Math.min(totalPages, start + MAX_VISIBLE - 1);

//   if (end - start + 1 < MAX_VISIBLE) {
//     start = Math.max(1, end - MAX_VISIBLE + 1);
//   }

//   const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

//   return (
//     <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
//       {/* ROWS */}
//       <div className="flex items-center gap-2 text-sm">
//         <span>Rows per page</span>
//         <select
//           value={rowsPerPage}
//           onChange={(e) => onRowsChange(Number(e.target.value))}
//           className="border rounded-lg px-2 py-1"
//         >
//           {[5, 10, 20].map((n) => (
//             <option key={n} value={n}>
//               {n}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* PAGINATION */}
//       <div className="flex gap-2 flex-wrap justify-center">
//         {start > 1 && (
//           <button
//             onClick={() => onPageChange(1)}
//             className="w-9 h-9 border rounded-full"
//           >
//             1
//           </button>
//         )}

//         {start > 2 && <span>…</span>}

//         {pages.map((p) => (
//           <button
//             key={p}
//             onClick={() => onPageChange(p)}
//             className={`w-9 h-9 rounded-full border
//               ${
//                 p === page
//                   ? "bg-gray-900 text-white"
//                   : "hover:bg-gray-100"
//               }`}
//           >
//             {p}
//           </button>
//         ))}

//         {end < totalPages - 1 && <span>…</span>}

//         {end < totalPages && (
//           <button
//             onClick={() => onPageChange(totalPages)}
//             className="w-9 h-9 border rounded-full"
//           >
//             {totalPages}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };
