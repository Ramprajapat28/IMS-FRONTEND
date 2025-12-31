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
import { Search, Pencil, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductsNavbar from "../components/ProductsNavbar";
import ProductsFooter from "../components/ProductsFooter";
import { productsApi, type Product } from "@/services/api";

// Map API product to display format
interface DisplayProduct {
  id: number;
  name: string;
  category: string;
  sku: string;
  location: string;
  quantity: number;
  image: string;
}

const ProductsPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] =
    useState<"none" | "name" | "category" | "quantity">("none");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productsApi.getAll(1, 100);
        if (response.success && response.data) {
          const products: DisplayProduct[] = response.data.map((p: Product) => {
            const totalQty = p.stock_details?.length || 0;

            // Aggregate stock by location
            const locationMap = new Map<string, number>();
            p.stock_details?.forEach((item) => {
              const loc = `${item.warehouse_name} > ${item.room_name} > ${item.shelf_name}`;
              locationMap.set(loc, (locationMap.get(loc) || 0) + 1);
            });

            const locationStrings = Array.from(locationMap.entries()).map(
              ([loc, qty]) => `${loc} (${qty})`
            );

            return {
              id: p.product_id,
              name: p.name,
              category: p.category || "Uncategorized",
              sku: p.sku,
              location: locationStrings.length > 0 ? locationStrings.join(", ") : "N/A",
              quantity: totalQty,
              image: p.product_image || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200",
            };
          });
          setData(products);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    let d = data.filter((p) =>
      `${p.name} ${p.sku} ${p.category} ${p.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (sortBy !== "none") {
      d = [...d].sort((a, b) =>
        sortBy === "quantity"
          ? b.quantity - a.quantity
          : a[sortBy].localeCompare(b[sortBy])
      );
    }

    return d;
  }, [data, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / rows);
  const visible = filtered.slice((page - 1) * rows, page * rows);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-gray-400" size={48} />
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
      />

      {/* SEARCH & SORT */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative md:max-w-sm w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm"
            placeholder="Search products"
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
          <option value="category">Category</option>
          <option value="quantity">Quantity</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Location</th>
              <th className="p-3">Qty</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {visible.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.id}</td>
                <td className="p-3 flex gap-3 items-center">
                  <img
                    src={p.image}
                    className="w-10 h-10 rounded-lg"
                  />
                  {p.name}
                </td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.location}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/products/category/${p.category}`)}
                    className="border p-1.5 rounded-lg"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/products/${p.id}`)}
                    className="border p-1.5 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="border p-1.5 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
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
