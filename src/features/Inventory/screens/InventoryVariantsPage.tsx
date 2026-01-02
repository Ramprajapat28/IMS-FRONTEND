// import { useMemo, useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Search, Loader2 } from "lucide-react";
// import InventoryNavbar from "../components/InventoryNavbar";
// import InventoryTable from "../components/InventoryTable";
// import InventoryFooter from "../components/InventoryFooter";
// import { inventoryApi } from "@/features/Inventory/api/inventory.api";
// // import { INVENTORY_VARIANTS, type InventoryVariant } from "../data/variants.data";

// // Define local type or import shared one
// export type InventoryVariant = {
//     id: number;
//     productId: number;
//     name: string;
//     size: string;
//     sku: string;
//     location: string;
//     quantity: number;
//     image: string;
// };

// const InventoryVariantsPage = () => {
//     const navigate = useNavigate();
//     const { productId } = useParams<{ productId: string }>();

//     const [productName, setProductName] = useState("Product");
//     const [data, setData] = useState<InventoryVariant[]>([]); // Use empty array initially
//     // const [isLoading, setIsLoading] = useState(true);

//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const [rows, setRows] = useState(10);

//     useEffect(() => {
//         // Fetch product info to get name (optional, nicer UX)
//         // For now, we can just fetch the variants if the API supported it.
//         // Since I don't see a specific "get variants" API ready in inventoryApi yet, 
//         // I will initialize with empty list to STOP CRASHING.
//         // User priority is fixing the error. 

//         // Use a safe default for now.
//         setData([]);

//         // Ideally:
//         // const fetchVariants = async () => { ... }
//         // fetchVariants();

//     }, [productId]);

//     // Filter
//     const filtered = useMemo(() => {
//         return data.filter((v) =>
//             `${v.name} ${v.size} ${v.sku} ${v.location}`
//                 .toLowerCase()
//                 .includes(search.toLowerCase())
//         );
//     }, [data, search]);

//     // Pagination
//     const totalPages = Math.ceil(filtered.length / rows);
//     const paginated = filtered.slice((page - 1) * rows, page * rows);

//     // Handle variant click - navigate to product details
//     const handleVariantClick = (variant: InventoryVariant) => {
//         navigate(`/products/details/${variant.id}`);
//     };

//     return (
//         <div className="">
//             <div className="max-w-7xl mx-auto bg-white rounded-xl border p-6 space-y-5">
//                 {/* NAVBAR */}
//                 <InventoryNavbar
//                     breadcrumbs={[
//                         { label: "Dashboard", path: "/dashboard" },
//                         { label: "Inventory", path: "/inventory" },
//                         { label: productName },
//                     ]}
//                 />

//                 {/* SEARCH */}
//                 <div className="relative md:max-w-sm w-full">
//                     <Search className="absolute left-3 top-3 text-gray-400" size={16} />
//                     <input
//                         className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="Search"
//                         value={search}
//                         onChange={(e) => {
//                             setSearch(e.target.value);
//                             setPage(1);
//                         }}
//                     />
//                 </div>

//                 {/* TABLE */}
//                 <InventoryTable
//                     data={paginated}
//                     mode="VARIANTS"
//                     onDelete={(id) => setData((prev) => prev.filter((v) => v.id !== id))}
//                     onRowClick={handleVariantClick}
//                 />

//                 {/* FOOTER */}
//                 <InventoryFooter
//                     page={page}
//                     totalPages={totalPages}
//                     rowsPerPage={rows}
//                     totalEntries={filtered.length}
//                     onPageChange={setPage}
//                     onRowsChange={(n) => {
//                         setRows(n);
//                         setPage(1);
//                     }}
//                 />
//             </div>
//         </div>
//     );
// };

// export default InventoryVariantsPage;
