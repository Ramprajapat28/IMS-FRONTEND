// // import React, { useEffect, useMemo, useRef, useState } from "react";
// // import {
// //     X,
// //     Tag,
// //     Hash,
// //     Image as ImageIcon,
// //     Edit3,
// //     ChevronDown,
// //     Loader2,
// //     Plus,
// //     Minus,
// //     Package
// // } from "lucide-react";
// // import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
// // import { DecodeHintType, BarcodeFormat } from "@zxing/library";


// // import { useLocation, useNavigate } from "react-router-dom";
// // import Header from "../Components/Header";
// // import ProductSoldSuccess from "./ProductSoldSuccess";
// // import { productsApi } from "@/features/Product/api/product.api";
// // import { itemsApi } from "@/features/Inventory/api/item.api";
// // import { warehousesApi, roomsApi, shelvesApi, racksApi } from "@/features/Inventory/api/location.api";
// // import type { Product } from "@/features/Product/types";

// // /* ---------------- Types ---------------- */

// // type Mode = "camera" | "upload";

// // interface StockLocation {
// //     warehouse_id: number;
// //     warehouse_name: string;
// //     room_id: number;
// //     room_name: string;
// //     shelf_id?: number;
// //     shelf_name?: string;
// //     rack_id?: number;
// //     rack_name?: string;
// //     item_count: number;
// // }

// // /* ---------------- Component ---------------- */

// // const BarcodeScannerPage: React.FC = () => {
// //     const location = useLocation();
// //     const navigate = useNavigate();

// //     const mode = (location.state?.mode as Mode) ?? "camera";

// //     const videoRef = useRef<HTMLVideoElement>(null);
// //     const controlsRef = useRef<IScannerControls | null>(null);
// //     const fileInputRef = useRef<HTMLInputElement>(null);

// //     // Selection State
// //     const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | "">("");
// //     const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
// //     const [selectedShelfId, setSelectedShelfId] = useState<number | "">("");
// //     const [selectedRackId, setSelectedRackId] = useState<number | "">("");
// //     const [sellingMode, setSellingMode] = useState<"Online" | "Offline">("Online");
// //     const [quantity, setQuantity] = useState<number | "">(1);
// //     const [isReturnMode, setIsReturnMode] = useState(false);
// //     const [storageType, setStorageType] = useState<'shelf' | 'rack'>('shelf');
// //     const [sold, setSold] = useState(false);
// //     const [cameraError, setCameraError] = useState<string | null>(null);

// //     // State
// //     const [product, setProduct] = useState<Product | null>(null);
// //     const [stockDetails, setStockDetails] = useState<StockLocation[]>([]);
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [isSelling, setIsSelling] = useState(false);
// //     const [isReturning, setIsReturning] = useState(false);
// //     const [error, setError] = useState<string | null>(null);

// //     // Calculate available stock for the currently selected location (Sell mode)
// //     const currentLocationStock = useMemo(() => {
// //         if (!product || isReturnMode) return 0;
// //         if (storageType === 'shelf' && selectedShelfId) {
// //             const shelf = stockDetails.find(s => s.shelf_id === Number(selectedShelfId));
// //             return shelf ? shelf.item_count : 0;
// //         }
// //         if (storageType === 'rack' && selectedRackId) {
// //             const rack = stockDetails.find(s => s.rack_id === Number(selectedRackId));
// //             return rack ? rack.item_count : 0;
// //         }
// //         return 0;
// //     }, [product, isReturnMode, storageType, selectedShelfId, selectedRackId, stockDetails]);
// //     const [dragActive, setDragActive] = useState(false);

// //     // Return Mode: Destination location state
// //     const [returnWarehouseId, setReturnWarehouseId] = useState<number | "">("")
// //     const [returnRoomId, setReturnRoomId] = useState<number | "">("")
// //     const [returnShelfId, setReturnShelfId] = useState<number | "">("")
// //     const [returnRackId, setReturnRackId] = useState<number | "">("")

// //     // All locations for Return mode
// //     const [allWarehouses, setAllWarehouses] = useState<any[]>([]);
// //     const [allRooms, setAllRooms] = useState<any[]>([]);
// //     const [allShelves, setAllShelves] = useState<any[]>([]);
// //     const [allRacks, setAllRacks] = useState<any[]>([]);
// //     const [successMessage, setSuccessMessage] = useState<string>("Product Sold Successfully!");


// //     /* ---------------- API CALLS ---------------- */

// //     const resetScanner = () => {
// //         setSold(false);
// //         setProduct(null);
// //         setStockDetails([]);
// //         setSelectedWarehouseId("");
// //         setSelectedRoomId("");
// //         setSelectedShelfId("");
// //         setSelectedRackId("");
// //         setReturnWarehouseId("");
// //         setReturnRoomId("");
// //         setReturnShelfId("");
// //         setReturnRackId("");
// //         setQuantity(1);
// //         setIsReturnMode(false);
// //         setError(null);
// //         setSuccessMessage("Product Sold Successfully!");
// //         if (fileInputRef.current) {
// //             fileInputRef.current.value = "";
// //         }
// //     };

// //     const fetchProductBySku = async (sku: string) => {
// //         setIsLoading(true);
// //         setError(null);
// //         try {
// //             // 1. Get Product Basic Info
// //             const res = await productsApi.getBySku(sku);
// //             if (res.success && res.data) {
// //                 const prod = res.data;
// //                 setProduct(prod);

// //                 // 2. Get Full Details (Stock)
// //                 // We need the ID from the first call to get details
// //                 if (prod.product_id) {
// //                     const detailRes = await productsApi.getDetails(prod.product_id);
// //                     if (detailRes.success && detailRes.data && detailRes.data.stock_details) {
// //                         // Filter only AVAILABLE items because removeStock API only works on available items
// //                         const availableStock = detailRes.data.stock_details.filter((s: any) => s.status === 'available');
// //                         setStockDetails(availableStock as any);
// //                     }
// //                 }
// //             } else {
// //                 setError("Product not found");
// //                 setProduct(null);
// //             }
// //         } catch (err: any) {
// //             console.error(err);
// //             setError("Failed to fetch product. " + (err.message || ""));
// //             setProduct(null);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     const handleSell = async () => {
// //         if (!product) return;

// //         if (!selectedShelfId && !selectedRackId) {
// //             alert("Please select a location (shelf or rack)");
// //             return;
// //         }

// //         const finalQty = Number(quantity) || 1;

// //         if (finalQty > currentLocationStock) {
// //             alert(`Insufficient stock in this location. Available: ${currentLocationStock}`);
// //             return;
// //         }

// //         setIsSelling(true);
// //         try {
// //             const res = await itemsApi.removeStock({
// //                 product_id: product.product_id,
// //                 shelf_id: selectedShelfId ? Number(selectedShelfId) : undefined,
// //                 rack_id: selectedRackId ? Number(selectedRackId) : undefined,
// //                 quantity: finalQty,
// //                 status: 'sold',
// //                 mode: sellingMode
// //             });

// //             if (res.success) {
// //                 setSuccessMessage("Product Sold Successfully!");
// //                 setSold(true);
// //             } else {
// //                 alert("Failed to sell item: " + res.message);
// //             }
// //         } catch (err: any) {
// //             alert("Error processing sale: " + err.message);
// //         } finally {
// //             setIsSelling(false);
// //         }
// //     };

// //     const handleReturn = async () => {
// //         if (!product) return;

// //         if (!returnShelfId && !returnRackId) {
// //             alert("Please select a return location (shelf or rack)");
// //             return;
// //         }

// //         const finalQty = Number(quantity) || 1;

// //         setIsReturning(true);
// //         try {
// //             const res = await itemsApi.returnStock({
// //                 product_id: product.product_id,
// //                 shelf_id: returnShelfId ? Number(returnShelfId) : undefined,
// //                 rack_id: returnRackId ? Number(returnRackId) : undefined,
// //                 quantity: finalQty
// //             });

// //             if (res.success && res.data) {
// //                 setSuccessMessage("Product Returned Successfully!");
// //                 setSold(true);
// //                 // No need to reset scanner manually here as showing success screen hides the scanner logic
// //             } else {
// //                 alert("Failed to return item: " + (res as any).message);
// //             }
// //         } catch (err: any) {
// //             alert("Error processing return: " + err.message);
// //         } finally {
// //             setIsReturning(false);
// //         }
// //     };


// //     // Use a stable reader instance
// //     const reader = useMemo(() => {
// //         const hints = new Map();
// //         const formats = [
// //             BarcodeFormat.CODE_128,
// //         ];
// //         hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
// //         hints.set(DecodeHintType.TRY_HARDER, true);
// //         return new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 250 });
// //     }, []);

// //     const isLoadingRef = useRef(false);
// //     useEffect(() => {
// //         isLoadingRef.current = isLoading;
// //     }, [isLoading]);

// //     const isStartingRef = useRef(false);

// //     /* ---------------- CAMERA SCAN ---------------- */
// //     useEffect(() => {
// //         const isCameraMode = mode === "camera";
// //         const hasProduct = !!product;
// //         const videoElement = videoRef.current;

// //         if (!isCameraMode || !videoElement || hasProduct) {
// //             if (controlsRef.current) {
// //                 console.log("Stopping camera (Mode change or Product found)");
// //                 controlsRef.current.stop();
// //                 controlsRef.current = null;
// //             }
// //             return;
// //         }

// //         if (isStartingRef.current) return;

// //         // Check if camera API is supported
// //         if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
// //             setCameraError("Camera access IS BLOCKED. Browsers require HTTPS (Secure) for camera access on mobile/network. Please use localhost or enable SSL.");
// //             return;
// //         }

// //         let isMounted = true;
// //         let activeControls: IScannerControls | null = null;
// //         let startTimeout: ReturnType<typeof setTimeout> | null = null;

// //         const startCamera = () => {
// //             if (!isMounted || isStartingRef.current) return;
// //             isStartingRef.current = true;

// //             const constraints = {
// //                 video: {
// //                     facingMode: 'environment',
// //                     width: { min: 640, ideal: 1280, max: 1920 },
// //                     height: { min: 480, ideal: 720, max: 1080 },
// //                     // @ts-ignore
// //                     focusMode: 'continuous'
// //                 }
// //             };

// //             console.log("Starting camera scanner delayed...");
// //             reader.decodeFromConstraints(
// //                 constraints,
// //                 videoElement,
// //                 (result) => {
// //                     if (result && !isLoadingRef.current && !product) {
// //                         const text = result.getText();
// //                         if (text) {
// //                             console.log("Barcode detected:", text);
// //                             fetchProductBySku(text);
// //                         }
// //                     }
// //                 }
// //             ).then((controls) => {
// //                 isStartingRef.current = false;
// //                 if (!isMounted) {
// //                     controls.stop();
// //                     return;
// //                 }
// //                 activeControls = controls;
// //                 controlsRef.current = controls;
// //                 console.log("Camera successfully active.");
// //             }).catch((err) => {
// //                 isStartingRef.current = false;
// //                 if (err.name === 'AbortError' || err.message?.includes('already playing')) {
// //                     console.warn("Camera start interrupted, ignoring transient error.");
// //                     return;
// //                 }
// //                 console.error("Failed to start camera:", err);
// //                 setCameraError(err.message || "Failed to start camera. Please ensure permissions are granted.");
// //             });
// //         };

// //         // Delay start to allow React StrictMode and other renders to settle
// //         startTimeout = setTimeout(startCamera, 300);

// //         return () => {
// //             isMounted = false;
// //             if (startTimeout) clearTimeout(startTimeout);

// //             console.log("Cleaning up camera scanner effect...");
// //             if (activeControls) {
// //                 activeControls.stop();
// //             }
// //             // We set isStartingRef to false slowly via the promise, 
// //             // but we can also set it here if no promise is pending.
// //             setTimeout(() => { isStartingRef.current = false; }, 500);
// //         };
// //     }, [mode, product, reader]);

// //     /* ---------------- FETCH ALL LOCATIONS FOR RETURN MODE ---------------- */
// //     useEffect(() => {
// //         const fetchAllLocations = async () => {
// //             try {
// //                 const [wRes, rRes, sRes, rackRes] = await Promise.all([
// //                     warehousesApi.getAll(1, 100),
// //                     roomsApi.getAll(1, 100),
// //                     shelvesApi.getAll(1, 100),
// //                     racksApi.getAll(undefined, 1, 100)
// //                 ]);

// //                 if (wRes.success && wRes.data) setAllWarehouses(wRes.data);
// //                 if (rRes.success && rRes.rooms) setAllRooms(rRes.rooms);
// //                 if (sRes.success && sRes.data) setAllShelves(sRes.data);
// //                 if (rackRes.success && rackRes.data) setAllRacks(rackRes.data);
// //             } catch (err) {
// //                 console.error("Failed to fetch locations:", err);
// //             }
// //         };
// //         fetchAllLocations();
// //     }, []);


// //     /* ---------------- IMAGE UPLOAD ---------------- */
// //     // Simulating scan from image (not implementing OCR for now unless library supports it easily, 
// //     // replacing with manual SKU entry simulation if image uploaded for demo purpose or just keeping existing mock?)
// //     // Actually BrowserMultiFormatReader can decode from image too.
// //     const handleFiles = async (files: FileList | null) => {
// //         if (!files || files.length === 0) return;
// //         const imageFile = files[0];

// //         // Decode from image
// //         const reader = new BrowserMultiFormatReader();
// //         try {
// //             const result = await reader.decodeFromImageUrl(URL.createObjectURL(imageFile));
// //             if (result) {
// //                 fetchProductBySku(result.getText());
// //             }
// //         } catch (e) {
// //             alert("Could not detect barcode in image");
// //         }
// //     };

// //     const handleDrag = (e: React.DragEvent) => {
// //         e.preventDefault();
// //         e.stopPropagation();
// //         setDragActive(e.type === "dragenter" || e.type === "dragover");
// //     };

// //     const handleDrop = (e: React.DragEvent) => {
// //         e.preventDefault();
// //         e.stopPropagation();
// //         setDragActive(false);
// //         handleFiles(e.dataTransfer.files);
// //     };

// //     /* ---------------- DROPDOWN LOGIC ---------------- */
// //     // Unique Warehouses
// //     const uniqueWarehouses = Array.from(new Set(stockDetails.map(s => s.warehouse_id)))
// //         .filter(id => id !== undefined && id !== null)
// //         .map(id => stockDetails.find(s => s.warehouse_id === id))
// //         .filter(x => x !== undefined);

// //     // Unique Rooms for selected Warehouse
// //     const uniqueRooms = selectedWarehouseId
// //         ? Array.from(new Set(stockDetails.filter(s => s.warehouse_id === Number(selectedWarehouseId)).map(s => s.room_id)))
// //             .filter(id => id !== undefined && id !== null)
// //             .map(id => stockDetails.find(s => s.room_id === id))
// //             .filter(x => x !== undefined)
// //         : [];

// //     // Unique Shelves for selected Room
// //     const uniqueShelves = selectedRoomId
// //         ? Array.from(new Set(stockDetails
// //             .filter(s => s.room_id === Number(selectedRoomId) && s.shelf_id)
// //             .map(s => s.shelf_id)))
// //             .map(id => stockDetails.find(s => s.shelf_id === id))
// //             .filter(x => x !== undefined)
// //         : [];

// //     // Unique Racks for selected Room
// //     const uniqueRacks = selectedRoomId
// //         ? Array.from(new Set(stockDetails
// //             .filter(s => s.room_id === Number(selectedRoomId) && s.rack_id)
// //             .map(s => s.rack_id)))
// //             .map(id => stockDetails.find(s => s.rack_id === id))
// //             .filter(x => x !== undefined)
// //         : [];

// //     // Return Mode: Filtered locations  
// //     const returnRoomsFiltered = returnWarehouseId
// //         ? allRooms.filter((r: any) => r.warehouse_id === Number(returnWarehouseId))
// //         : [];

// //     const returnShelvesFiltered = returnRoomId
// //         ? allShelves.filter((s: any) => s.room_id === Number(returnRoomId))
// //         : [];

// //     const returnRacksFiltered = returnRoomId
// //         ? allRacks.filter((r: any) => r.room_id === Number(returnRoomId))
// //         : [];



// //     /* ---------------- UI ---------------- */

// //     return (
// //         <div className="h-screen md:h-[90%] overflow-y-hidden bg-gray-50 flex flex-col">
// //             <Header />

// //             <div className="flex-1 overflow-y-hidden">
// //                 <div className="h-full bg-white rounded-xl border shadow-sm p-3">
// //                     <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3">

// //                         {/* PRODUCT INFO / SUCCESS */}
// //                         <div className={`order-2 lg:order-1 ${sold || product ? "lg:col-span-12" : "lg:col-span-8"} h-full overflow-hidden`}>
// //                             <div className="h-full rounded-lg border overflow-hidden flex flex-col">

// //                                 {!sold && (
// //                                     <div className="bg-gray-50 px-4 py-2 font-semibold border-b text-gray-900 text-sm">
// //                                         Product Information
// //                                     </div>
// //                                 )}

// //                                 {!product && !sold && !isLoading && !error && (
// //                                     <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
// //                                         Scan a barcode to see details
// //                                     </div>
// //                                 )}

// //                                 {isLoading && !sold && (
// //                                     <div className="flex-1 flex items-center justify-center text-blue-600">
// //                                         <Loader2 className="w-8 h-8 animate-spin" />
// //                                     </div>
// //                                 )}

// //                                 {error && !sold && (
// //                                     <div className="flex-1 flex flex-col items-center justify-center text-red-500 gap-2">
// //                                         <p>{error}</p>
// //                                         <button onClick={() => { setError(null); setProduct(null); }} className="text-blue-600 hover:underline text-sm">Try Again</button>
// //                                     </div>
// //                                 )}


// //                                 {product && !sold && (
// //                                     <div className="flex-1 overflow-hidden p-3">
// //                                         <div className="h-full flex flex-col">
// //                                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

// //                                                 {/* LEFT BOX - Product Details */}
// //                                                 <div className="border rounded-lg p-2.5 bg-white relative">

// //                                                     {/* Cancel / Rescan Button */}
// //                                                     <button
// //                                                         onClick={resetScanner}
// //                                                         className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition z-10"
// //                                                         title="Scan another product"
// //                                                     >
// //                                                         <X size={20} />
// //                                                     </button>

// //                                                     <div className="flex gap-2.5">


// //                                                         {/* Product Image */}
// //                                                         <div className="flex-shrink-0">
// //                                                             <div className="w-24 h-28 rounded-lg border-2 border-gray-300 overflow-hidden bg-white">

// //                                                                 {(() => {
// //                                                                     const imgs = product.product_image;
// //                                                                     let url = "";
// //                                                                     if (Array.isArray(imgs) && imgs.length > 0) {
// //                                                                         const item = imgs[0];
// //                                                                         if (typeof item === 'object') {
// //                                                                             url = item.file_path || item.cdnUrl || item.url || "";
// //                                                                         } else {
// //                                                                             url = String(item);
// //                                                                         }
// //                                                                     } else if (typeof imgs === 'string') {
// //                                                                         if (imgs.startsWith('[') || imgs.startsWith('{')) {
// //                                                                             try {
// //                                                                                 const parsed = JSON.parse(imgs);
// //                                                                                 if (Array.isArray(parsed) && parsed.length > 0) {
// //                                                                                     const first = parsed[0];
// //                                                                                     url = typeof first === 'object' ? (first.file_path || "") : String(first);
// //                                                                                 } else if (typeof parsed === 'object') {
// //                                                                                     url = parsed.file_path || "";
// //                                                                                 }
// //                                                                             } catch { url = imgs; }
// //                                                                         } else {
// //                                                                             url = imgs;
// //                                                                         }
// //                                                                     }

// //                                                                     if (url) {
// //                                                                         return (
// //                                                                             <img
// //                                                                                 src={url}
// //                                                                                 alt="Product"
// //                                                                                 className="w-full h-full object-cover"
// //                                                                                 onError={(e) => {
// //                                                                                     e.currentTarget.style.display = 'none';
// //                                                                                     const parent = e.currentTarget.parentElement;
// //                                                                                     if (parent) {
// //                                                                                         parent.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-50');
// //                                                                                         parent.innerHTML = '<div class="text-gray-400 text-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-1"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22v-9.5"></path></svg><p class="text-[10px]">No image</p></div>';
// //                                                                                     }
// //                                                                                 }}
// //                                                                             />
// //                                                                         );
// //                                                                     } else {
// //                                                                         return (
// //                                                                             <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
// //                                                                                 <Package size={24} className="mb-1" />
// //                                                                                 <p className="text-[10px]">No image</p>
// //                                                                             </div>
// //                                                                         );
// //                                                                     }
// //                                                                 })()}
// //                                                             </div>
// //                                                         </div>

// //                                                         {/* Product Info */}
// //                                                         <div className="flex-1 space-y-2">
// //                                                             {/* Product Name */}
// //                                                             <div className="flex items-start gap-2">
// //                                                                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
// //                                                                     <Edit3 className="w-3.5 h-3.5 text-gray-700" />
// //                                                                 </div>
// //                                                                 <div className="flex-1">
// //                                                                     <p className="text-[10px] text-gray-400 mb-0.5">Product Name</p>
// //                                                                     <p className="text-sm font-semibold text-gray-900">{product.name}</p>
// //                                                                 </div>
// //                                                             </div>

// //                                                             {/* Category */}
// //                                                             <div className="flex items-start gap-2">
// //                                                                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
// //                                                                     <Tag className="w-3.5 h-3.5 text-gray-700" />
// //                                                                 </div>
// //                                                                 <div className="flex-1">
// //                                                                     <p className="text-[10px] text-gray-400 uppercase mb-0.5">Category</p>
// //                                                                     <p className="text-sm font-medium text-gray-900">{product.category_name || "-"}</p>
// //                                                                 </div>
// //                                                             </div>

// //                                                             {/* SKU */}
// //                                                             <div className="flex items-start gap-2">
// //                                                                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
// //                                                                     <Hash className="w-3.5 h-3.5 text-gray-700" />
// //                                                                 </div>
// //                                                                 <div className="flex-1">
// //                                                                     <p className="text-[10px] text-gray-400 uppercase mb-0.5">SKU</p>
// //                                                                     <p className="text-sm font-bold text-gray-900">{product.sku}</p>
// //                                                                 </div>
// //                                                             </div>
// //                                                         </div>
// //                                                     </div>
// //                                                 </div>

// //                                                 {/* RIGHT BOX - Location & Selling */}
// //                                                 <div className="border rounded-lg p-2.5 bg-white">
// //                                                     <div className="space-y-2.5">
// //                                                         {/* Mode Toggle: Sell / Return */}
// //                                                         <div className="flex gap-2 border-b pb-2">
// //                                                             <button
// //                                                                 onClick={() => setIsReturnMode(false)}
// //                                                                 className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${!isReturnMode
// //                                                                     ? 'bg-blue-600 text-white'
// //                                                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //                                                                     }`}
// //                                                             >
// //                                                                 Sell
// //                                                             </button>
// //                                                             <button
// //                                                                 onClick={() => setIsReturnMode(true)}
// //                                                                 className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${isReturnMode
// //                                                                     ? 'bg-green-600 text-white'
// //                                                                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //                                                                     }`}
// //                                                             >
// //                                                                 Return
// //                                                             </button>
// //                                                         </div>


// //                                                         {/* Location Selection - SELL MODE ONLY */}
// //                                                         {!isReturnMode && (
// //                                                             <div>
// //                                                                 <p className="text-sm font-semibold mb-2 text-gray-900">1. Select Location :</p>

// //                                                                 <div className="space-y-1.5">
// //                                                                     {/* WAREHOUSE */}
// //                                                                     <div>
// //                                                                         <label className="text-[11px] text-gray-500 mb-1 block">
// //                                                                             Warehouse <span className="text-red-500">*</span>
// //                                                                         </label>
// //                                                                         <div className="relative">
// //                                                                             <select
// //                                                                                 className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
// //                                                                                 value={selectedWarehouseId}
// //                                                                                 onChange={(e) => {
// //                                                                                     setSelectedWarehouseId(Number(e.target.value));
// //                                                                                     setSelectedRoomId("");
// //                                                                                     setSelectedShelfId("");
// //                                                                                 }}
// //                                                                             >
// //                                                                                 <option value="">Select Warehouse</option>
// //                                                                                 {uniqueWarehouses.map((w) => (
// //                                                                                     <option key={w?.warehouse_id} value={w?.warehouse_id}>{w?.warehouse_name}</option>
// //                                                                                 ))}
// //                                                                             </select>
// //                                                                             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
// //                                                                         </div>
// //                                                                     </div>


// //                                                                     {/* ROOM */}
// //                                                                     <div>
// //                                                                         <label className="text-[11px] text-gray-500 mb-1 block">
// //                                                                             Room <span className="text-red-500">*</span>
// //                                                                         </label>
// //                                                                         <div className="relative">
// //                                                                             <select
// //                                                                                 className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
// //                                                                                 value={selectedRoomId}
// //                                                                                 onChange={(e) => {
// //                                                                                     setSelectedRoomId(Number(e.target.value));
// //                                                                                     setSelectedShelfId("");
// //                                                                                 }}
// //                                                                                 disabled={!selectedWarehouseId}
// //                                                                             >
// //                                                                                 <option value="">Select Room</option>
// //                                                                                 {uniqueRooms.map((r) => (
// //                                                                                     <option key={r?.room_id} value={r?.room_id}>{r?.room_name}</option>
// //                                                                                 ))}
// //                                                                             </select>
// //                                                                             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
// //                                                                         </div>
// //                                                                     </div>



// //                                                                     {/* STORAGE TYPE TOGGLE */}
// //                                                                     <div className="flex flex-col gap-1.5 mt-2">
// //                                                                         <label className="text-[11px] text-gray-500 block">
// //                                                                             Storage Type
// //                                                                         </label>
// //                                                                         <div className="flex p-0.5 bg-gray-100 rounded-lg w-fit">
// //                                                                             <button
// //                                                                                 type="button"
// //                                                                                 onClick={() => {
// //                                                                                     setStorageType('shelf');
// //                                                                                     setSelectedRackId("");
// //                                                                                 }}
// //                                                                                 className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${storageType === 'shelf'
// //                                                                                     ? 'bg-white text-blue-600 shadow-sm'
// //                                                                                     : 'text-gray-500 hover:text-gray-700'
// //                                                                                     }`}
// //                                                                             >
// //                                                                                 Shelf
// //                                                                             </button>
// //                                                                             <button
// //                                                                                 type="button"
// //                                                                                 onClick={() => {
// //                                                                                     setStorageType('rack');
// //                                                                                     setSelectedShelfId("");
// //                                                                                 }}
// //                                                                                 className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${storageType === 'rack'
// //                                                                                     ? 'bg-white text-blue-600 shadow-sm'
// //                                                                                     : 'text-gray-500 hover:text-gray-700'
// //                                                                                     }`}
// //                                                                             >
// //                                                                                 Rack
// //                                                                             </button>
// //                                                                         </div>
// //                                                                     </div>

// //                                                                     {/* SHELF / RACK Selection */}
// //                                                                     {storageType === 'shelf' ? (
// //                                                                         <div>
// //                                                                             <label className="text-[11px] text-gray-500 mb-1 block">
// //                                                                                 Shelf <span className="text-red-500">*</span>
// //                                                                             </label>
// //                                                                             <div className="relative">
// //                                                                                 <select
// //                                                                                     className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
// //                                                                                     value={selectedShelfId}
// //                                                                                     onChange={(e) => setSelectedShelfId(Number(e.target.value))}
// //                                                                                     disabled={!selectedRoomId}
// //                                                                                 >
// //                                                                                     <option value="">Select Shelf</option>
// //                                                                                     {uniqueShelves.map((s) => (
// //                                                                                         <option key={s?.shelf_id} value={s?.shelf_id}>
// //                                                                                             {s?.shelf_name} ({s?.item_count} available)
// //                                                                                         </option>
// //                                                                                     ))}
// //                                                                                 </select>
// //                                                                                 <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
// //                                                                             </div>
// //                                                                         </div>
// //                                                                     ) : (
// //                                                                         <div>
// //                                                                             <label className="text-[11px] text-gray-500 mb-1 block">
// //                                                                                 Rack <span className="text-red-500">*</span>
// //                                                                             </label>
// //                                                                             <div className="relative">
// //                                                                                 <select
// //                                                                                     className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
// //                                                                                     value={selectedRackId}
// //                                                                                     onChange={(e) => setSelectedRackId(Number(e.target.value))}
// //                                                                                     disabled={!selectedRoomId}
// //                                                                                 >
// //                                                                                     <option value="">Select Rack</option>
// //                                                                                     {uniqueRacks.map((r) => (
// //                                                                                         <option key={r?.rack_id} value={r?.rack_id}>
// //                                                                                             {r?.rack_name} ({r?.item_count} available)
// //                                                                                         </option>
// //                                                                                     ))}
// //                                                                                 </select>
// //                                                                                 <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
// //                                                                             </div>
// //                                                                         </div>
// //                                                                     )}
// //                                                                 </div>
// //                                                             </div>
// //                                                         )}

// //                                                         {/* Selling Mode - SELL MODE ONLY */}
// //                                                         {!isReturnMode && (
// //                                                             <div>
// //                                                                 <p className="text-sm font-semibold mb-2 text-gray-900">2. Select mode of selling :</p>
// //                                                                 <div className="flex gap-6">
// //                                                                     <label className="flex items-center gap-1.5 cursor-pointer">
// //                                                                         <input
// //                                                                             type="radio"
// //                                                                             name="selling-mode"
// //                                                                             checked={sellingMode === "Online"}
// //                                                                             onChange={() => setSellingMode("Online")}
// //                                                                             className="w-4 h-4 text-blue-600 focus:ring-blue-500"
// //                                                                         />
// //                                                                         <span className="text-sm text-gray-900">Online</span>
// //                                                                     </label>
// //                                                                     <label className="flex items-center gap-1.5 cursor-pointer">
// //                                                                         <input
// //                                                                             type="radio"
// //                                                                             name="selling-mode"
// //                                                                             checked={sellingMode === "Offline"}
// //                                                                             onChange={() => setSellingMode("Offline")}
// //                                                                             className="w-4 h-4 text-blue-600 focus:ring-blue-500"
// //                                                                         />
// //                                                                         <span className="text-sm text-gray-900">Offline</span>
// //                                                                     </label>
// //                                                                 </div>
// //                                                             </div>
// //                                                         )}


// //                                                         {/* Quantity */}
// //                                                         <div className="flex gap-4">
// //                                                             <div className="flex-1 max-w-[100px]">
// //                                                                 <label className="text-[11px] text-gray-500 mb-1 block">
// //                                                                     Quantity <span className="text-red-500">*</span>
// //                                                                 </label>
// //                                                                 <div className="flex items-center border border-gray-300 rounded-md bg-white">
// //                                                                     <button
// //                                                                         onClick={() => setQuantity(q => Math.max(1, (Number(q) || 0) - 1))}
// //                                                                         className="px-2 py-1.5 hover:bg-gray-100 text-gray-600 border-r transition"
// //                                                                         type="button"
// //                                                                     >
// //                                                                         <Minus size={14} />
// //                                                                     </button>
// //                                                                     <input
// //                                                                         type="number"
// //                                                                         min="1"
// //                                                                         value={quantity}
// //                                                                         onFocus={(e) => e.target.select()}
// //                                                                         onChange={(e) => {
// //                                                                             const val = e.target.value;
// //                                                                             if (val === "") {
// //                                                                                 setQuantity("");
// //                                                                             } else {
// //                                                                                 setQuantity(Math.max(1, Number(val)));
// //                                                                             }
// //                                                                         }}
// //                                                                         className="w-full text-center text-xs focus:outline-none py-1.5 font-medium appearance-none"
// //                                                                     />
// //                                                                     <button
// //                                                                         onClick={() => setQuantity(q => (Number(q) || 0) + 1)}
// //                                                                         className="px-2 py-1.5 hover:bg-gray-100 text-gray-600 border-l transition"
// //                                                                         type="button"
// //                                                                     >
// //                                                                         <Plus size={14} />
// //                                                                     </button>
// //                                                                 </div>
// //                                                                 {quantity !== "" && Number(quantity) > currentLocationStock && !isReturnMode && (selectedShelfId || selectedRackId) && (
// //                                                                     <p className="text-[10px] text-red-500 font-medium mt-1">
// //                                                                         ⚠️ Max available here: {currentLocationStock}
// //                                                                     </p>
// //                                                                 )}
// //                                                             </div>
// //                                                             {/* RETURN MODE - Location Selection */}
// //                                                             {isReturnMode && (
// //                                                                 <div className="mt-3">
// //                                                                     <p className="text-sm font-semibold mb-2 text-gray-900">Select Return Destination:</p>
// //                                                                     <div className="space-y-1.5">
// //                                                                         {/* Warehouse */}
// //                                                                         <div>
// //                                                                             <label className="text-[11px] text-gray-500 mb-1 block">Warehouse <span className="text-red-500">*</span></label>
// //                                                                             <div className="relative">
// //                                                                                 <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-green-500" value={returnWarehouseId} onChange={(e) => { setReturnWarehouseId(Number(e.target.value)); setReturnRoomId(""); setReturnShelfId(""); setReturnRackId(""); }}>
// //                                                                                     <option value="">Select Warehouse</option>
// //                                                                                     {allWarehouses.map((w: any) => (<option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>))}
// //                                                                                 </select>
// //                                                                                 <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
// //                                                                             </div>
// //                                                                         </div>
// //                                                                         {/* Room */}
// //                                                                         <div>
// //                                                                             <label className="text-[11px] text-gray-500 mb-1 block">Room <span className="text-red-500">*</span></label>
// //                                                                             <div className="relative">
// //                                                                                 <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-green-500" value={returnRoomId} onChange={(e) => { setReturnRoomId(Number(e.target.value)); setReturnShelfId(""); setReturnRackId(""); }} disabled={!returnWarehouseId}>
// //                                                                                     <option value="">Select Room</option>
// //                                                                                     {returnRoomsFiltered.map((r: any) => (<option key={r.room_id} value={r.room_id}>{r.name || r.room_name}</option>))}
// //                                                                                 </select>
// //                                                                                 <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
// //                                                                             </div>
// //                                                                         </div>

// //                                                                         {/* STORAGE TYPE TOGGLE (RETURN) */}
// //                                                                         <div className="flex flex-col gap-1.5 mt-2">
// //                                                                             <label className="text-[11px] text-gray-500 block">
// //                                                                                 Storage Type
// //                                                                             </label>
// //                                                                             <div className="flex p-0.5 bg-gray-100 rounded-lg w-fit">
// //                                                                                 <button
// //                                                                                     type="button"
// //                                                                                     onClick={() => {
// //                                                                                         setStorageType('shelf');
// //                                                                                         setReturnRackId("");
// //                                                                                     }}
// //                                                                                     className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${storageType === 'shelf'
// //                                                                                         ? 'bg-white text-green-600 shadow-sm'
// //                                                                                         : 'text-gray-500 hover:text-gray-700'
// //                                                                                         }`}
// //                                                                                 >
// //                                                                                     Shelf
// //                                                                                 </button>
// //                                                                                 <button
// //                                                                                     type="button"
// //                                                                                     onClick={() => {
// //                                                                                         setStorageType('rack');
// //                                                                                         setReturnShelfId("");
// //                                                                                     }}
// //                                                                                     className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${storageType === 'rack'
// //                                                                                         ? 'bg-white text-green-600 shadow-sm'
// //                                                                                         : 'text-gray-500 hover:text-gray-700'
// //                                                                                         }`}
// //                                                                                 >
// //                                                                                     Rack
// //                                                                                 </button>
// //                                                                             </div>
// //                                                                         </div>

// //                                                                         {/* SHELF / RACK Selection */}
// //                                                                         {storageType === 'shelf' ? (
// //                                                                             <div>
// //                                                                                 <label className="text-[11px] text-gray-500 mb-1 block">Shelf <span className="text-red-500">*</span></label>
// //                                                                                 <div className="relative">
// //                                                                                     <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-green-500" value={returnShelfId} onChange={(e) => setReturnShelfId(Number(e.target.value))} disabled={!returnRoomId}>
// //                                                                                         <option value="">Select Shelf</option>
// //                                                                                         {returnShelvesFiltered.map((s: any) => (<option key={s.shelf_id} value={s.shelf_id}>{s.name || s.shelf_name}</option>))}
// //                                                                                     </select>
// //                                                                                     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
// //                                                                                 </div>
// //                                                                             </div>
// //                                                                         ) : (
// //                                                                             <div>
// //                                                                                 <label className="text-[11px] text-gray-500 mb-1 block">Rack <span className="text-red-500">*</span></label>
// //                                                                                 <div className="relative">
// //                                                                                     <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-green-500" value={returnRackId} onChange={(e) => setReturnRackId(Number(e.target.value))} disabled={!returnRoomId}>
// //                                                                                         <option value="">Select Rack</option>
// //                                                                                         {returnRacksFiltered.map((r: any) => (<option key={r.rack_id} value={r.rack_id}>{r.rack_name}</option>))}
// //                                                                                     </select>
// //                                                                                     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
// //                                                                                 </div>
// //                                                                             </div>
// //                                                                         )}
// //                                                                     </div>
// //                                                                 </div>
// //                                                             )}
// //                                                         </div>
// //                                                     </div>
// //                                                 </div>
// //                                             </div>

// //                                             {/* Sell Button - Below boxes, inside container */}
// //                                             {!isReturnMode && (
// //                                                 <div className="flex justify-end mt-3">
// //                                                     <button
// //                                                         onClick={handleSell}
// //                                                         disabled={(!selectedShelfId && !selectedRackId) || isSelling || Number(quantity || 0) < 1 || Number(quantity || 0) > currentLocationStock}
// //                                                         className={`px-5 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 shadow-sm
// //                                                         ${(!selectedShelfId && !selectedRackId) || isSelling || Number(quantity || 0) > currentLocationStock ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
// //                                                     >
// //                                                         {isSelling ? (
// //                                                             <Loader2 className="w-3.5 h-3.5 animate-spin" />
// //                                                         ) : (
// //                                                             <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                                                                 <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
// //                                                                 <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
// //                                                             </svg>
// //                                                         )}
// //                                                         Sell
// //                                                     </button>
// //                                                 </div>
// //                                             )}

// //                                             {/* Return Button */}
// //                                             {isReturnMode && (
// //                                                 <div className="flex justify-end mt-3">
// //                                                     <button
// //                                                         onClick={handleReturn}
// //                                                         disabled={(!returnShelfId && !returnRackId) || isReturning || Number(quantity || 0) < 1}
// //                                                         className={`px-5 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 shadow-sm ${(!returnShelfId && !returnRackId) || isReturning ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
// //                                                     >
// //                                                         {isReturning ? (
// //                                                             <Loader2 className="w-3.5 h-3.5 animate-spin" />
// //                                                         ) : (
// //                                                             <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                                                                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
// //                                                                 <polyline points="9 22 9 12 15 12 15 22"></polyline>
// //                                                             </svg>
// //                                                         )}
// //                                                         Return
// //                                                     </button>
// //                                                 </div>
// //                                             )}
// //                                         </div>
// //                                     </div>
// //                                 )}

// //                                 {sold && (
// //                                     <div className="flex-1 flex flex-col items-center justify-center p-6">
// //                                         <ProductSoldSuccess message={successMessage} />
// //                                         <button
// //                                             onClick={resetScanner}
// //                                             className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
// //                                         >
// //                                             Scan Another Product
// //                                         </button>
// //                                         <button
// //                                             onClick={() => navigate('/dashboard')}
// //                                             className="mt-3 text-sm text-gray-500 hover:text-gray-700"
// //                                         >
// //                                             Back to Dashboard
// //                                         </button>
// //                                     </div>
// //                                 )}

// //                             </div>
// //                         </div>

// //                         {/* RIGHT PANEL - Camera/Upload */}
// //                         <div
// //                             className={`order-1 lg:order-2 lg:col-span-4 transition-all duration-300 h-full ${sold || product ? "hidden" : ""
// //                                 }`}
// //                         >
// //                             <div className="h-full rounded-lg border relative overflow-hidden bg-white">

// //                                 {/* CAMERA MODE */}
// //                                 {mode === "camera" && !sold && (
// //                                     <div className="h-full bg-black relative">
// //                                         <button
// //                                             onClick={() => {
// //                                                 controlsRef.current?.stop();
// //                                                 navigate(-1);
// //                                             }}
// //                                             className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 hover:bg-gray-100 transition"
// //                                         >
// //                                             <X className="w-3.5 h-3.5" />
// //                                         </button>

// //                                         {cameraError ? (
// //                                             <div className="h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gray-900">
// //                                                 <p className="text-red-400 font-semibold mb-2">Camera Error</p>
// //                                                 <p className="text-sm text-gray-300 mb-4">{cameraError}</p>
// //                                                 <button
// //                                                     onClick={() => window.location.reload()}
// //                                                     className="px-4 py-2 bg-white text-black text-xs font-semibold rounded hover:bg-gray-200 transition"
// //                                                 >
// //                                                     Reload Page
// //                                                 </button>
// //                                             </div>
// //                                         ) : (
// //                                             <>
// //                                                 <video
// //                                                     ref={videoRef}
// //                                                     className="w-full h-full object-cover"
// //                                                     autoPlay
// //                                                     muted
// //                                                     playsInline
// //                                                 />

// //                                                 <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4">
// //                                                     <div className="w-full text-center bg-black/20 backdrop-blur-sm rounded-full py-2 px-4 mt-8">
// //                                                         <p className="text-white font-semibold text-sm shadow-sm">Scanning entire screen...</p>
// //                                                     </div>

// //                                                     {/* Full screen scan frame corners */}
// //                                                     <div className="absolute inset-8 border-2 border-white/50 rounded-xl">
// //                                                         <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1 rounded-tl-xl"></div>
// //                                                         <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1 rounded-tr-xl"></div>
// //                                                         <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1 rounded-bl-xl"></div>
// //                                                         <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1 rounded-br-xl"></div>

// //                                                         {/* Animated scan line */}
// //                                                         <div className="w-full h-[2px] bg-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-[scan_2s_ease-in-out_infinite] mt-4"></div>
// //                                                     </div>

// //                                                     <p className="text-[10px] text-gray-200 mb-4 bg-black/20 px-3 py-1 rounded-full">
// //                                                         Position barcode anywhere within the frame
// //                                                     </p>
// //                                                 </div>

// //                                                 <style>{`
// //                                                     @keyframes scan {
// //                                                         0% { transform: translateY(0); opacity: 0; }
// //                                                         10% { opacity: 1; }
// //                                                         90% { opacity: 1; }
// //                                                         100% { transform: translateY(60vh); opacity: 0; }
// //                                                     }
// //                                                 `}</style>
// //                                             </>
// //                                         )}
// //                                     </div>
// //                                 )}

// //                                 {/* UPLOAD MODE */}
// //                                 {mode === "upload" && !sold && (
// //                                     <div className="h-full flex flex-col items-center justify-center p-4 relative">
// //                                         <button
// //                                             onClick={() => navigate(-1)}
// //                                             className="absolute top-2 right-2 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition"
// //                                         >
// //                                             <X className="w-3.5 h-3.5" />
// //                                         </button>

// //                                         <div
// //                                             onClick={() => fileInputRef.current?.click()}
// //                                             onDragEnter={handleDrag}
// //                                             onDragLeave={handleDrag}
// //                                             onDragOver={handleDrag}
// //                                             onDrop={handleDrop}
// //                                             className={`w-full h-full border-2 border-dashed rounded-lg p-6 cursor-pointer transition
// //                         flex flex-col items-center justify-center
// //                         ${dragActive
// //                                                     ? "border-blue-500 bg-blue-50"
// //                                                     : "border-gray-300 hover:border-gray-400"
// //                                                 }`}
// //                                         >
// //                                             <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
// //                                                 <ImageIcon className="w-6 h-6 text-gray-400" />
// //                                             </div>

// //                                             <p className="text-xs text-gray-700 text-center mb-1">
// //                                                 Drag image(s) here or{" "}
// //                                                 <span className="text-blue-600 font-medium">
// //                                                     Browse Images
// //                                                 </span>
// //                                             </p>

// //                                             <p className="text-[10px] text-gray-400 text-center mt-2 max-w-xs leading-relaxed">
// //                                                 You can upload images containing barcodes.
// //                                             </p>

// //                                             <input
// //                                                 ref={fileInputRef}
// //                                                 type="file"
// //                                                 accept="image/*"
// //                                                 hidden
// //                                                 onChange={(e) => handleFiles(e.target.files)}
// //                                             />
// //                                         </div>
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         </div>

// //                     </div>
// //                 </div>
// //             </div>
// //         </div >
// //     );
// // };

// // export default BarcodeScannerPage;
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//     X,
//     Tag,
//     Hash,
//     Image as ImageIcon,
//     Edit3,
//     ChevronDown,
//     Loader2,
//     Plus,
//     Minus,
//     Package
// } from "lucide-react";
// import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
// import { DecodeHintType, BarcodeFormat } from "@zxing/library";

// import { useLocation, useNavigate } from "react-router-dom";
// import Header from "../Components/Header";
// import ProductSoldSuccess from "./ProductSoldSuccess";
// import { productsApi } from "@/features/Product/api/product.api";
// import { itemsApi } from "@/features/Inventory/api/item.api";
// import { warehousesApi, roomsApi, shelvesApi, racksApi } from "@/features/Inventory/api/location.api";
// import type { Product } from "@/features/Product/types";

// /* ---------------- Types ---------------- */

// type Mode = "camera" | "upload";

// interface StockLocation {
//     warehouse_id: number;
//     warehouse_name: string;
//     room_id: number;
//     room_name: string;
//     shelf_id?: number;
//     shelf_name?: string;
//     rack_id?: number;
//     rack_name?: string;
//     item_count: number;
// }

// /* ---------------- Component ---------------- */

// const BarcodeScannerPage: React.FC = () => {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const mode = (location.state?.mode as Mode) ?? "camera";

//     const videoRef = useRef<HTMLVideoElement>(null);
//     const controlsRef = useRef<IScannerControls | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     // Selection State
//     const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | "">("");
//     const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
//     const [selectedShelfId, setSelectedShelfId] = useState<number | "">("");
//     const [selectedRackId, setSelectedRackId] = useState<number | "">("");
//     const [sellingMode, setSellingMode] = useState<"Online" | "Offline">("Online");
//     const [quantity, setQuantity] = useState<number | "">(1);
//     const [isReturnMode, setIsReturnMode] = useState(false);
//     const [storageType, setStorageType] = useState<'shelf' | 'rack'>('shelf');
//     const [sold, setSold] = useState(false);
//     const [cameraError, setCameraError] = useState<string | null>(null);

//     // State
//     const [product, setProduct] = useState<Product | null>(null);
//     const [stockDetails, setStockDetails] = useState<StockLocation[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSelling, setIsSelling] = useState(false);
//     const [isReturning, setIsReturning] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     // Calculate available stock for the currently selected location (Sell mode)
//     const currentLocationStock = useMemo(() => {
//         if (!product || isReturnMode) return 0;
//         if (storageType === 'shelf' && selectedShelfId) {
//             const shelf = stockDetails.find(s => s.shelf_id === Number(selectedShelfId));
//             return shelf ? shelf.item_count : 0;
//         }
//         if (storageType === 'rack' && selectedRackId) {
//             const rack = stockDetails.find(s => s.rack_id === Number(selectedRackId));
//             return rack ? rack.item_count : 0;
//         }
//         return 0;
//     }, [product, isReturnMode, storageType, selectedShelfId, selectedRackId, stockDetails]);
    
//     const [dragActive, setDragActive] = useState(false);

//     // Return Mode: Destination location state
//     const [returnWarehouseId, setReturnWarehouseId] = useState<number | "">("");
//     const [returnRoomId, setReturnRoomId] = useState<number | "">("");
//     const [returnShelfId, setReturnShelfId] = useState<number | "">("");
//     const [returnRackId, setReturnRackId] = useState<number | "">("");

//     // All locations for Return mode
//     const [allWarehouses, setAllWarehouses] = useState<any[]>([]);
//     const [allRooms, setAllRooms] = useState<any[]>([]);
//     const [allShelves, setAllShelves] = useState<any[]>([]);
//     const [allRacks, setAllRacks] = useState<any[]>([]);
//     const [successMessage, setSuccessMessage] = useState<string>("Product Sold Successfully!");

//     /* ---------------- API CALLS ---------------- */

//     const resetScanner = () => {
//         setSold(false);
//         setProduct(null);
//         setStockDetails([]);
//         setSelectedWarehouseId("");
//         setSelectedRoomId("");
//         setSelectedShelfId("");
//         setSelectedRackId("");
//         setReturnWarehouseId("");
//         setReturnRoomId("");
//         setReturnShelfId("");
//         setReturnRackId("");
//         setQuantity(1);
//         setIsReturnMode(false);
//         setError(null);
//         setSuccessMessage("Product Sold Successfully!");
//         if (fileInputRef.current) {
//             fileInputRef.current.value = "";
//         }
//     };

//     const fetchProductBySku = async (sku: string) => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const res = await productsApi.getBySku(sku);
//             if (res.success && res.data) {
//                 const prod = res.data;
//                 setProduct(prod);

//                 if (prod.product_id) {
//                     const detailRes = await productsApi.getDetails(prod.product_id);
//                     if (detailRes.success && detailRes.data && detailRes.data.stock_details) {
//                         const availableStock = detailRes.data.stock_details.filter((s: any) => s.status === 'available');
//                         setStockDetails(availableStock as any);
//                     }
//                 }
//             } else {
//                 setError("Product not found");
//                 setProduct(null);
//             }
//         } catch (err: any) {
//             console.error(err);
//             setError("Failed to fetch product. " + (err.message || ""));
//             setProduct(null);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSell = async () => {
//         if (!product) return;

//         if (!selectedShelfId && !selectedRackId) {
//             alert("Please select a location (shelf or rack)");
//             return;
//         }

//         const finalQty = Number(quantity) || 1;

//         if (finalQty > currentLocationStock) {
//             alert(`Insufficient stock in this location. Available: ${currentLocationStock}`);
//             return;
//         }

//         setIsSelling(true);
//         try {
//             const res = await itemsApi.removeStock({
//                 product_id: product.product_id,
//                 shelf_id: selectedShelfId ? Number(selectedShelfId) : undefined,
//                 rack_id: selectedRackId ? Number(selectedRackId) : undefined,
//                 quantity: finalQty,
//                 status: 'sold',
//                 mode: sellingMode
//             });

//             if (res.success) {
//                 setSuccessMessage("Product Sold Successfully!");
//                 setSold(true);
//             } else {
//                 alert("Failed to sell item: " + res.message);
//             }
//         } catch (err: any) {
//             alert("Error processing sale: " + err.message);
//         } finally {
//             setIsSelling(false);
//         }
//     };

//     const handleReturn = async () => {
//         if (!product) return;

//         if (!returnShelfId && !returnRackId) {
//             alert("Please select a return location (shelf or rack)");
//             return;
//         }

//         const finalQty = Number(quantity) || 1;

//         setIsReturning(true);
//         try {
//             const res = await itemsApi.returnStock({
//                 product_id: product.product_id,
//                 shelf_id: returnShelfId ? Number(returnShelfId) : undefined,
//                 rack_id: returnRackId ? Number(returnRackId) : undefined,
//                 quantity: finalQty
//             });

//             if (res.success && res.data) {
//                 setSuccessMessage("Product Returned Successfully!");
//                 setSold(true);
//             } else {
//                 alert("Failed to return item: " + (res as any).message);
//             }
//         } catch (err: any) {
//             alert("Error processing return: " + err.message);
//         } finally {
//             setIsReturning(false);
//         }
//     };

//     // Optimized reader with barcode-specific hints
//     const reader = useMemo(() => {
//     const hints = new Map();
//     const formats = [
//         BarcodeFormat.CODE_128,
//         BarcodeFormat.CODE_39,
//         BarcodeFormat.EAN_13,
//         BarcodeFormat.EAN_8,
//         BarcodeFormat.UPC_A,
//         BarcodeFormat.UPC_E,
//     ];
//     hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
//     hints.set(DecodeHintType.TRY_HARDER, true); // Already enabled - good!
    
//     return new BrowserMultiFormatReader(hints, { 
//         delayBetweenScanAttempts: 50,  // Change from 100ms to 50ms - scan twice as fast
//         delayBetweenScanSuccess: 500
//     });
// }, []);
//     // Keep track of loading state in a ref for camera callback
//     const isLoadingRef = useRef(false);
//     const productRef = useRef<Product | null>(null);
    
//     useEffect(() => {
//         isLoadingRef.current = isLoading;
//     }, [isLoading]);

//     useEffect(() => {
//         productRef.current = product;
//     }, [product]);

//     const isStartingRef = useRef(false);
//     const lastScannedRef = useRef<string>("");
//     const lastScanTimeRef = useRef<number>(0);

//     /* ---------------- CAMERA SCAN - FIXED VERSION ---------------- */
//     useEffect(() => {
//         const isCameraMode = mode === "camera";
//         const videoElement = videoRef.current;

//         // Don't stop camera when product is found - keep scanning enabled
//         if (!isCameraMode || !videoElement) {
//             if (controlsRef.current) {
//                 console.log("Stopping camera (Mode changed)");
//                 controlsRef.current.stop();
//                 controlsRef.current = null;
//             }
//             return;
//         }

//         // Prevent multiple simultaneous starts
//         if (isStartingRef.current || controlsRef.current) {
//             return;
//         }

//         // Check camera support
//         if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//             setCameraError("Camera access not available. Use HTTPS or localhost.");
//             return;
//         }

//         let isMounted = true;
//         let activeControls: IScannerControls | null = null;

//         const startCamera = async () => {
//             if (!isMounted || isStartingRef.current) return;
//             isStartingRef.current = true;

//             const constraints = {
//     video: {
//         facingMode: 'environment',
//         width: { min: 640, ideal: 1920, max: 3840 },  // Higher resolution
//         height: { min: 480, ideal: 1080, max: 2160 },
//         aspectRatio: { ideal: 16 / 9 },
//         frameRate: { ideal: 60, max: 60 },  // Higher frame rate
//         // Advanced focus settings
//         // @ts-ignore
//         focusMode: 'continuous',
//         focusDistance: { ideal: 0 },  // Auto-focus at any distance
//         advanced: [
//             { focusMode: 'continuous' },
//             { torch: false }  // Disable flash unless needed
//         ]
//     }
// };

//             console.log("🎥 Starting barcode scanner...");

//             try {
//                 const controls = await reader.decodeFromConstraints(
//     constraints,
//     videoElement,
//     (result, error) => {
//         if (result) {
//             // Success - existing code
//             const text = result.getText();
//             // ... your existing logic
//         } else if (error) {
//             // Show hint if barcode is detected but can't be read
//             if (error.message?.includes('NotFoundException')) {
//                 console.log('📍 No barcode in frame - adjust position');
//             } else if (error.message?.includes('FormatException')) {
//                 console.log('⚠️ Barcode detected but unreadable - improve focus/lighting');
//             }
//         }
//     }
// );

//                 if (!isMounted) {
//                     controls.stop();
//                     isStartingRef.current = false;
//                     return;
//                 }

//                 activeControls = controls;
//                 controlsRef.current = controls;
//                 isStartingRef.current = false;
//                 console.log("✅ Camera active and scanning continuously");

//             } catch (err: any) {
//                 isStartingRef.current = false;
//                 console.error("❌ Camera error:", err);
//                 setCameraError(err.message || "Failed to start camera");
//             }
//         };

//         // Small delay to avoid React strict mode issues
//         const timeout = setTimeout(startCamera, 300);

//         return () => {
//             isMounted = false;
//             clearTimeout(timeout);
            
//             if (activeControls) {
//                 console.log("🛑 Cleaning up camera");
//                 activeControls.stop();
//                 controlsRef.current = null;
//             }
            
//             setTimeout(() => {
//                 isStartingRef.current = false;
//             }, 500);
//         };
//     }, [mode, reader]); // Removed 'product' dependency - this is the key fix!

//     // Play beep sound on successful scan
//     const playBeep = () => {
//         try {
//             const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//             const oscillator = audioContext.createOscillator();
//             const gainNode = audioContext.createGain();
            
//             oscillator.connect(gainNode);
//             gainNode.connect(audioContext.destination);
            
//             oscillator.frequency.value = 800;
//             oscillator.type = 'sine';
            
//             gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//             gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
//             oscillator.start(audioContext.currentTime);
//             oscillator.stop(audioContext.currentTime + 0.1);
//         } catch (e) {
//             console.log("Audio not supported");
//         }
//     };

//     /* ---------------- FETCH ALL LOCATIONS FOR RETURN MODE ---------------- */
//     useEffect(() => {
//         const fetchAllLocations = async () => {
//             try {
//                 const [wRes, rRes, sRes, rackRes] = await Promise.all([
//                     warehousesApi.getAll(1, 100),
//                     roomsApi.getAll(1, 100),
//                     shelvesApi.getAll(1, 100),
//                     racksApi.getAll(undefined, 1, 100)
//                 ]);

//                 if (wRes.success && wRes.data) setAllWarehouses(wRes.data);
//                 if (rRes.success && rRes.rooms) setAllRooms(rRes.rooms);
//                 if (sRes.success && sRes.data) setAllShelves(sRes.data);
//                 if (rackRes.success && rackRes.data) setAllRacks(rackRes.data);
//             } catch (err) {
//                 console.error("Failed to fetch locations:", err);
//             }
//         };
//         fetchAllLocations();
//     }, []);

//     /* ---------------- IMAGE UPLOAD ---------------- */
//     const handleFiles = async (files: FileList | null) => {
//         if (!files || files.length === 0) return;
//         const imageFile = files[0];

//         const imgReader = new BrowserMultiFormatReader();
//         try {
//             const result = await imgReader.decodeFromImageUrl(URL.createObjectURL(imageFile));
//             if (result) {
//                 fetchProductBySku(result.getText());
//             }
//         } catch (e) {
//             alert("Could not detect barcode in image");
//         }
//     };

//     const handleDrag = (e: React.DragEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setDragActive(e.type === "dragenter" || e.type === "dragover");
//     };

//     const handleDrop = (e: React.DragEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setDragActive(false);
//         handleFiles(e.dataTransfer.files);
//     };

//     /* ---------------- DROPDOWN LOGIC ---------------- */
//     const uniqueWarehouses = Array.from(new Set(stockDetails.map(s => s.warehouse_id)))
//         .filter(id => id !== undefined && id !== null)
//         .map(id => stockDetails.find(s => s.warehouse_id === id))
//         .filter(x => x !== undefined);

//     const uniqueRooms = selectedWarehouseId
//         ? Array.from(new Set(stockDetails.filter(s => s.warehouse_id === Number(selectedWarehouseId)).map(s => s.room_id)))
//             .filter(id => id !== undefined && id !== null)
//             .map(id => stockDetails.find(s => s.room_id === id))
//             .filter(x => x !== undefined)
//         : [];

//     const uniqueShelves = selectedRoomId
//         ? Array.from(new Set(stockDetails
//             .filter(s => s.room_id === Number(selectedRoomId) && s.shelf_id)
//             .map(s => s.shelf_id)))
//             .map(id => stockDetails.find(s => s.shelf_id === id))
//             .filter(x => x !== undefined)
//         : [];

//     const uniqueRacks = selectedRoomId
//         ? Array.from(new Set(stockDetails
//             .filter(s => s.room_id === Number(selectedRoomId) && s.rack_id)
//             .map(s => s.rack_id)))
//             .map(id => stockDetails.find(s => s.rack_id === id))
//             .filter(x => x !== undefined)
//         : [];

//     const returnRoomsFiltered = returnWarehouseId
//         ? allRooms.filter((r: any) => r.warehouse_id === Number(returnWarehouseId))
//         : [];

//     const returnShelvesFiltered = returnRoomId
//         ? allShelves.filter((s: any) => s.room_id === Number(returnRoomId))
//         : [];

//     const returnRacksFiltered = returnRoomId
//         ? allRacks.filter((r: any) => r.room_id === Number(returnRoomId))
//         : [];

//     /* ---------------- UI ---------------- */

//     // if (sold) {
//     //     return <ProductSoldSuccess message={successMessage} onClose={resetScanner} />;
//     // }

//     return (
//         <div className="h-screen md:h-[90%] overflow-y-hidden bg-gray-50 flex flex-col">
//             <Header />

//             <div className="flex-1 overflow-y-hidden">
//                 <div className="h-full bg-white rounded-xl border shadow-sm p-3">
//                     <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3">

//                         {/* LEFT: CAMERA SCANNER */}
//                         <div className={`order-1 lg:order-1 ${product ? "lg:col-span-4" : "lg:col-span-8"} h-full`}>
//                             <div className="h-full rounded-lg border overflow-hidden flex flex-col bg-gray-900">
                                
//                                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 font-semibold text-white text-sm flex items-center justify-between">
//                                     <span>📷 Barcode Scanner</span>
//                                     {mode === "camera" && !cameraError && (
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                                             <span className="text-xs">Live</span>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {mode === "camera" && (
//                                     <div className="flex-1 relative bg-black">
//                                         {!cameraError ? (
//                                             <>
//                                                 <video
//                                                     ref={videoRef}
//                                                     className="w-full h-full object-cover"
//                                                     autoPlay
//                                                     muted
//                                                     playsInline
//                                                 />
                                                
//                                                 {/* Scanning Overlay */}
//                                                 <div className="absolute inset-0 pointer-events-none">
//                                                     <div className="absolute inset-8">
//                                                         <div className="relative w-full h-full border-2 border-white/30 rounded-xl">
//                                                             {/* Corner markers */}
//                                                             <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-400 rounded-tl-xl"></div>
//                                                             <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-400 rounded-tr-xl"></div>
//                                                             <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-400 rounded-bl-xl"></div>
//                                                             <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-400 rounded-br-xl"></div>
                                                            
//                                                             {/* Scan line */}
//                                                             <div className="scan-line"></div>
//                                                         </div>
//                                                     </div>
                                                    
//                                                     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//                                                         <p className="text-white text-xs bg-black/60 backdrop-blur px-4 py-2 rounded-full">
//                                                             {isLoading ? "🔍 Loading..." : "📦 Position barcode within frame"}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </>
//                                         ) : (
//                                             <div className="flex flex-col items-center justify-center h-full p-6 text-center">
//                                                 <div className="text-red-400 text-5xl mb-4">⚠️</div>
//                                                 <h3 className="text-white text-lg font-bold mb-2">Camera Error</h3>
//                                                 <p className="text-gray-300 text-sm mb-4">{cameraError}</p>
//                                                 <button
//                                                     onClick={() => window.location.reload()}
//                                                     className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100"
//                                                 >
//                                                     Retry
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}

//                                 {mode === "upload" && (
//                                     <div className="flex-1 flex items-center justify-center p-6">
//                                         <div
//                                             className={`w-full max-w-md border-2 border-dashed rounded-xl p-8 text-center transition ${
//                                                 dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
//                                             }`}
//                                             onDragEnter={handleDrag}
//                                             onDragLeave={handleDrag}
//                                             onDragOver={handleDrag}
//                                             onDrop={handleDrop}
//                                         >
//                                             <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                                             <p className="text-gray-600 mb-4">Drag & drop barcode image or click to upload</p>
//                                             <input
//                                                 ref={fileInputRef}
//                                                 type="file"
//                                                 accept="image/*"
//                                                 className="hidden"
//                                                 onChange={(e) => handleFiles(e.target.files)}
//                                             />
//                                             <button
//                                                 onClick={() => fileInputRef.current?.click()}
//                                                 className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
//                                             >
//                                                 Choose File
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* RIGHT: PRODUCT INFO */}
//                         <div className={`order-2 lg:order-2 ${product ? "lg:col-span-8" : "hidden lg:block lg:col-span-4"} h-full overflow-hidden`}>
//                             <div className="h-full rounded-lg border overflow-hidden flex flex-col">

//                                 {!product && (
//                                     <>
//                                         <div className="bg-gray-50 px-4 py-2 font-semibold border-b text-gray-900 text-sm">
//                                             Product Information
//                                         </div>
//                                         <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
//                                             {isLoading ? (
//                                                 <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//                                             ) : error ? (
//                                                 <div className="text-center">
//                                                     <p className="text-red-500 mb-2">{error}</p>
//                                                     <button onClick={() => setError(null)} className="text-blue-600 hover:underline text-sm">
//                                                         Try Again
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 "Scan a barcode to see product details"
//                                             )}
//                                         </div>
//                                     </>
//                                 )}

//                                 {product && (
//                                     <div className="flex-1 overflow-auto p-3">
//                                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                            
//                                             {/* Product Details Box */}
//                                             <div className="border rounded-lg p-3 bg-white relative">
//                                                 <button
//                                                     onClick={resetScanner}
//                                                     className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 z-10"
//                                                     title="Clear and scan another"
//                                                 >
//                                                     <X size={20} />
//                                                 </button>

//                                                 <div className="flex gap-3">
//                                                     {/* Product Image */}
//                                                     <div className="flex-shrink-0">
//                                                         <div className="w-24 h-28 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-50">
//                                                             {(() => {
//                                                                 const imgs = product.product_image;
//                                                                 let url = "";
//                                                                 if (Array.isArray(imgs) && imgs.length > 0) {
//                                                                     const item = imgs[0];
//                                                                     if (typeof item === 'object') {
//                                                                         url = item.file_path || item.cdnUrl || item.url || "";
//                                                                     } else {
//                                                                         url = String(item);
//                                                                     }
//                                                                 } else if (typeof imgs === 'string') {
//                                                                     if (imgs.startsWith('[') || imgs.startsWith('{')) {
//                                                                         try {
//                                                                             const parsed = JSON.parse(imgs);
//                                                                             if (Array.isArray(parsed) && parsed.length > 0) {
//                                                                                 const first = parsed[0];
//                                                                                 url = typeof first === 'object' ? (first.file_path || "") : String(first);
//                                                                             } else if (typeof parsed === 'object') {
//                                                                                 url = parsed.file_path || "";
//                                                                             }
//                                                                         } catch { url = imgs; }
//                                                                     } else {
//                                                                         url = imgs;
//                                                                     }
//                                                                 }

//                                                                 return url ? (
//                                                                     <img
//                                                                         src={url}
//                                                                         alt="Product"
//                                                                         className="w-full h-full object-cover"
//                                                                         onError={(e) => {
//                                                                             e.currentTarget.style.display = 'none';
//                                                                             const parent = e.currentTarget.parentElement;
//                                                                             if (parent) {
//                                                                                 parent.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg><p class="text-xs mt-1">No image</p></div>';
//                                                                             }
//                                                                         }}
//                                                                     />
//                                                                 ) : (
//                                                                     <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
//                                                                         <Package size={24} />
//                                                                         <p className="text-xs mt-1">No image</p>
//                                                                     </div>
//                                                                 );
//                                                             })()}
//                                                         </div>
//                                                     </div>

//                                                     {/* Product Info */}
//                                                     <div className="flex-1 space-y-2">
//                                                         <div className="flex items-start gap-2">
//                                                             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                                                                 <Edit3 className="w-3.5 h-3.5 text-gray-700" />
//                                                             </div>
//                                                             <div className="flex-1">
//                                                                 <p className="text-[10px] text-gray-400 mb-0.5">Product Name</p>
//                                                                 <p className="text-sm font-semibold text-gray-900">{product.name}</p>
//                                                             </div>
//                                                         </div>

//                                                         <div className="flex items-start gap-2">
//                                                             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                                                                 <Tag className="w-3.5 h-3.5 text-gray-700" />
//                                                             </div>
//                                                             <div className="flex-1">
//                                                                 <p className="text-[10px] text-gray-400 uppercase mb-0.5">Category</p>
//                                                                 <p className="text-sm font-medium text-gray-900">{product.category_name || "-"}</p>
//                                                             </div>
//                                                         </div>

//                                                         <div className="flex items-start gap-2">
//                                                             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//                                                                 <Hash className="w-3.5 h-3.5 text-gray-700" />
//                                                             </div>
//                                                             <div className="flex-1">
//                                                                 <p className="text-[10px] text-gray-400 uppercase mb-0.5">SKU</p>
//                                                                 <p className="text-sm font-bold text-gray-900">{product.sku}</p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Location & Actions Box */}
//                                             <div className="border rounded-lg p-3 bg-white">
//                                                 <div className="space-y-2.5">
//                                                     {/* Mode Toggle */}
//                                                     <div className="flex gap-2 border-b pb-2">
//                                                         <button
//                                                             onClick={() => setIsReturnMode(false)}
//                                                             className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${
//                                                                 !isReturnMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                             }`}
//                                                         >
//                                                             Sell
//                                                         </button>
//                                                         <button
//                                                             onClick={() => setIsReturnMode(true)}
//                                                             className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${
//                                                                 isReturnMode ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                             }`}
//                                                         >
//                                                             Return
//                                                         </button>
//                                                     </div>

//                                                     {/* SELL MODE */}
//                                                     {!isReturnMode && (
//                                                         <>
//                                                             <p className="text-sm font-semibold text-gray-900">1. Select Location:</p>
                                                            
//                                                             <div className="space-y-1.5">
//                                                                 {/* Warehouse */}
//                                                                 <div>
//                                                                     <label className="text-[11px] text-gray-500 mb-1 block">
//                                                                         Warehouse <span className="text-red-500">*</span>
//                                                                     </label>
//                                                                     <div className="relative">
//                                                                         <select
//                                                                             className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8"
//                                                                             value={selectedWarehouseId}
//                                                                             onChange={(e) => {
//                                                                                 setSelectedWarehouseId(Number(e.target.value));
//                                                                                 setSelectedRoomId("");
//                                                                                 setSelectedShelfId("");
//                                                                                 setSelectedRackId("");
//                                                                             }}
//                                                                         >
//                                                                             <option value="">Select Warehouse</option>
//                                                                             {uniqueWarehouses.map((w) => (
//                                                                                 <option key={w?.warehouse_id} value={w?.warehouse_id}>
//                                                                                     {w?.warehouse_name}
//                                                                                 </option>
//                                                                             ))}
//                                                                         </select>
//                                                                         <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Room */}
//                                                                 <div>
//                                                                     <label className="text-[11px] text-gray-500 mb-1 block">
//                                                                         Room <span className="text-red-500">*</span>
//                                                                     </label>
//                                                                     <div className="relative">
//                                                                         <select
//                                                                             className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8"
//                                                                             value={selectedRoomId}
//                                                                             onChange={(e) => {
//                                                                                 setSelectedRoomId(Number(e.target.value));
//                                                                                 setSelectedShelfId("");
//                                                                                 setSelectedRackId("");
//                                                                             }}
//                                                                             disabled={!selectedWarehouseId}
//                                                                         >
//                                                                             <option value="">Select Room</option>
//                                                                             {uniqueRooms.map((r) => (
//                                                                                 <option key={r?.room_id} value={r?.room_id}>
//                                                                                     {r?.room_name}
//                                                                                 </option>
//                                                                             ))}
//                                                                         </select>
//                                                                         <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Storage Type Toggle */}
//                                                                 <div className="flex flex-col gap-1.5 mt-2">
//                                                                     <label className="text-[11px] text-gray-500 block">Storage Type</label>
//                                                                     <div className="flex p-0.5 bg-gray-100 rounded-lg w-fit">
//                                                                         <button
//                                                                             type="button"
//                                                                             onClick={() => {
//                                                                                 setStorageType('shelf');
//                                                                                 setSelectedRackId("");
//                                                                             }}
//                                                                             className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${
//                                                                                 storageType === 'shelf' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
//                                                                             }`}
//                                                                         >
//                                                                             Shelf
//                                                                         </button>
//                                                                         <button
//                                                                             type="button"
//                                                                             onClick={() => {
//                                                                                 setStorageType('rack');
//                                                                                 setSelectedShelfId("");
//                                                                             }}
//                                                                             className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${
//                                                                                 storageType === 'rack' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
//                                                                             }`}
//                                                                         >
//                                                                             Rack
//                                                                         </button>
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Shelf/Rack Selector */}
//                                                                 {storageType === 'shelf' && (
//                                                                     <div>
//                                                                         <label className="text-[11px] text-gray-500 mb-1 block">
//                                                                             Shelf <span className="text-red-500">*</span>
//                                                                         </label>
//                                                                         <div className="relative">
//                                                                             <select
//                                                                                 className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8"
//                                                                                 value={selectedShelfId}
//                                                                                 onChange={(e) => setSelectedShelfId(Number(e.target.value))}
//                                                                                 disabled={!selectedRoomId}
//                                                                             >
//                                                                                 <option value="">Select Shelf</option>
//                                                                                 {uniqueShelves.map((s) => (
//                                                                                     <option key={s?.shelf_id} value={s?.shelf_id}>
//                                                                                         {s?.shelf_name} (Stock: {s?.item_count})
//                                                                                     </option>
//                                                                                 ))}
//                                                                             </select>
//                                                                             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                                                                         </div>
//                                                                     </div>
//                                                                 )}

//                                                                 {storageType === 'rack' && (
//                                                                     <div>
//                                                                         <label className="text-[11px] text-gray-500 mb-1 block">
//                                                                             Rack <span className="text-red-500">*</span>
//                                                                         </label>
//                                                                         <div className="relative">
//                                                                             <select
//                                                                                 className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8"
//                                                                                 value={selectedRackId}
//                                                                                 onChange={(e) => setSelectedRackId(Number(e.target.value))}
//                                                                                 disabled={!selectedRoomId}
//                                                                             >
//                                                                                 <option value="">Select Rack</option>
//                                                                                 {uniqueRacks.map((r) => (
//                                                                                     <option key={r?.rack_id} value={r?.rack_id}>
//                                                                                         {r?.rack_name} (Stock: {r?.item_count})
//                                                                                     </option>
//                                                                                 ))}
//                                                                             </select>
//                                                                             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                                                                         </div>
//                                                                     </div>
//                                                                 )}
//                                                             </div>

//                                                             <p className="text-sm font-semibold text-gray-900 mt-3">2. Selling Details:</p>

//                                                             {/* Selling Mode */}
//                                                             <div>
//                                                                 <label className="text-[11px] text-gray-500 mb-1 block">Mode</label>
//                                                                 <div className="flex p-0.5 bg-gray-100 rounded-lg">
//                                                                     <button
//                                                                         onClick={() => setSellingMode("Online")}
//                                                                         className={`flex-1 px-3 py-1 text-[10px] font-medium rounded-md transition ${
//                                                                             sellingMode === "Online" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
//                                                                         }`}
//                                                                     >
//                                                                         Online
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={() => setSellingMode("Offline")}
//                                                                         className={`flex-1 px-3 py-1 text-[10px] font-medium rounded-md transition ${
//                                                                             sellingMode === "Offline" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
//                                                                         }`}
//                                                                     >
//                                                                         Offline
//                                                                     </button>
//                                                                 </div>
//                                                             </div>

//                                                             {/* Quantity */}
//                                                             <div>
//                                                                 <label className="text-[11px] text-gray-500 mb-1 block">Quantity</label>
//                                                                 <div className="flex items-center gap-2">
//                                                                     <button
//                                                                         onClick={() => setQuantity(prev => Math.max(1, (Number(prev) || 1) - 1))}
//                                                                         className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
//                                                                     >
//                                                                         <Minus size={14} />
//                                                                     </button>
//                                                                     <input
//                                                                         type="number"
//                                                                         min="1"
//                                                                         value={quantity}
//                                                                         onChange={(e) => setQuantity(Number(e.target.value) || "")}
//                                                                         className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-center"
//                                                                     />
//                                                                     <button
//                                                                         onClick={() => setQuantity(prev => (Number(prev) || 1) + 1)}
//                                                                         className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
//                                                                     >
//                                                                         <Plus size={14} />
//                                                                     </button>
//                                                                 </div>
//                                                                 {currentLocationStock > 0 && (
//                                                                     <p className="text-[10px] text-gray-500 mt-1">
//                                                                         Available: {currentLocationStock}
//                                                                     </p>
//                                                                 )}
//                                                             </div>

//                                                             {/* Sell Button */}
//                                                             <button
//                                                                 onClick={handleSell}
//                                                                 disabled={isSelling || !selectedShelfId && !selectedRackId}
//                                                                 className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                                                             >
//                                                                 {isSelling ? (
//                                                                     <>
//                                                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                                                         Processing...
//                                                                     </>
//                                                                 ) : (
//                                                                     "✓ Sell Product"
//                                                                 )}
//                                                             </button>
//                                                         </>
//                                                     )}

//                                                     {/* RETURN MODE */}
//                                                     {isReturnMode && (
//                                                         <>
//                                                             <p className="text-sm font-semibold text-gray-900">1. Select Return Location:</p>
                                                            
//                                                             <div className="space-y-1.5">
//                                                                 {/* Warehouse */}
//                                                                 <div>
//                                                                     <label className="text-[11px] text-gray-500 mb-1 block">
//                                                                         Warehouse <span className="text-red-500">*</span>
//                                                                     </label>
//                                                                     <div className="relative">
//                                                                         <select
//                                                                             className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8"
//                                                                             value={returnWarehouseId}
//                                                                             onChange={(e) => {
//                                                                                 setReturnWarehouseId(Number(e.target.value));
//                                                                                 setReturnRoomId("");
//                                                                                 setReturnShelfId("");
//                                                                                 setReturnRackId("");
//                                                                             }}
//                                                                         >
//                                                                             <option value="">Select Warehouse</option>
//                                                                             {allWarehouses.map((w: any) => (
//                                                                                 <option key={w.warehouse_id} value={w.warehouse_id}>
//                                                                                     {w.name}
//                                                                                 </option>
//                                                                             ))}
//                                                                         </select>
//                                                                         <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Room */}
//                                                                 <div>
//                                                                     <label className="text-[11px] text-gray-500 mb-1 block">
//                                                                         Room <span className="text-red-500">*</span>
//                                                                     </label>
//                                                                     <div className="relative">
//                                                                         <select
//                                                                             className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8"
//                                                                             value={returnRoomId}
//                                                                             onChange={(e) => {
//                                                                                 setReturnRoomId(Number(e.target.value));
//                                                                                 setReturnShelfId("");
//                                                                                 setReturnRackId("");
//                                                                             }}
//                                                                             disabled={!returnWarehouseId}
//                                                                         >
//                                                                             <option value="">Select Room</option>
//                                                                             {returnRoomsFiltered.map((r: any) => (
//                                                                                 <option key={r.room_id} value={r.room_id}>
//                                                                                     {r.name}
//                                                                                 </option>
//                                                                             ))}
//                                                                         </select>
//                                                                         <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Storage Type Toggle */}
//                                                                 <div className="flex flex-col gap-1.5 mt-2">
//                                                                     <label className="text-[11px] text-gray-500 block">Storage Type</label>
//                                                                     <div className="flex p-0.5 bg-gray-100 rounded-lg w-fit">
//                                                                         <button
//                                                                             type="button"
//                                                                             onClick={() => {
//                                                                                 setStorageType('shelf');
//                                                                                 setReturnRackId("");
//                                                                             }}
//                                                                             className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${
//                                                                                 storageType === 'shelf' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
//                                                                             }`}
//                                                                         >
//                                                                             Shelf
//                                                                         </button>
//                                                                         <button
//                                                                             type="button"
//                                                                             onClick={() => {
//                                                                                 setStorageType('rack');
//                                                                                 setReturnShelfId("");
//                                                                             }}
//                                                                             className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${
//                                                                                 storageType === 'rack' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
//                                                                             }`}
//                                                                         >
//                                                                             Rack
//                                                                         </button>
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Shelf/Rack Selector */}
//                                                                 {storageType === 'shelf' && (
//                                                                     <div>
//                                                                         <label className="text-[11px] text-gray-500 mb-1 block">
//                                                                             Shelf <span className="text-red-500">*</span>
//                                                                         </label>
//                                                                         <div className="relative">
//                                                                             <select
//                                                                                 className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8"
//                                                                                 value={returnShelfId}
//                                                                                 onChange={(e) => setReturnShelfId(Number(e.target.value))}
//                                                                                 disabled={!returnRoomId}
//                                                                             >
//                                                                                 <option value="">Select Shelf</option>
//                                                                                 {returnShelvesFiltered.map((s: any) => (
//                                                                                     <option key={s.shelf_id} value={s.shelf_id}>
//                                                                                         {s.name}
//                                                                                     </option>
//                                                                                 ))}
//                                                                             </select>
//                                                                             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                                                                         </div>
//                                                                     </div>
//                                                                 )}

//                                                                 {storageType === 'rack' && (
//                                                                     <div>
//                                                                         <label className="text-[11px] text-gray-500 mb-1 block">
//                                                                             Rack <span className="text-red-500">*</span>
//                                                                         </label>
//                                                                         <div className="relative">
//                                                                             <select
//                                                                                 className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8"
//                                                                                 value={returnRackId}
//                                                                                 onChange={(e) => setReturnRackId(Number(e.target.value))}
//                                                                                 disabled={!returnRoomId}
//                                                                             >
//                                                                                 <option value="">Select Rack</option>
//                                                                                 {returnRacksFiltered.map((r: any) => (
//                                                                                     <option key={r.rack_id} value={r.rack_id}>
//                                                                                         {r.name}
//                                                                                     </option>
//                                                                                 ))}
//                                                                             </select>
//                                                                             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                                                                         </div>
//                                                                     </div>
//                                                                 )}
//                                                             </div>

//                                                             <p className="text-sm font-semibold text-gray-900 mt-3">2. Return Quantity:</p>

//                                                             {/* Quantity */}
//                                                             <div>
//                                                                 <label className="text-[11px] text-gray-500 mb-1 block">Quantity</label>
//                                                                 <div className="flex items-center gap-2">
//                                                                     <button
//                                                                         onClick={() => setQuantity(prev => Math.max(1, (Number(prev) || 1) - 1))}
//                                                                         className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
//                                                                     >
//                                                                         <Minus size={14} />
//                                                                     </button>
//                                                                     <input
//                                                                         type="number"
//                                                                         min="1"
//                                                                         value={quantity}
//                                                                         onChange={(e) => setQuantity(Number(e.target.value) || "")}
//                                                                         className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-center"
//                                                                     />
//                                                                     <button
//                                                                         onClick={() => setQuantity(prev => (Number(prev) || 1) + 1)}
//                                                                         className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
//                                                                     >
//                                                                         <Plus size={14} />
//                                                                     </button>
//                                                                 </div>
//                                                             </div>

//                                                             {/* Return Button */}
//                                                             <button
//                                                                 onClick={handleReturn}
//                                                                 disabled={isReturning || !returnShelfId && !returnRackId}
//                                                                 className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                                                             >
//                                                                 {isReturning ? (
//                                                                     <>
//                                                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                                                         Processing...
//                                                                     </>
//                                                                 ) : (
//                                                                     "↩ Return Product"
//                                                                 )}
//                                                             </button>
//                                                         </>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Scan Line Animation CSS */}
//             <style>{`
//                 .scan-line {
//                     position: absolute;
//                     top: 0;
//                     left: 0;
//                     right: 0;
//                     height: 2px;
//                     background: linear-gradient(90deg, transparent, #10b981, transparent);
//                     box-shadow: 0 0 10px #10b981;
//                     animation: scan 2s ease-in-out infinite;
//                 }
                
//                 @keyframes scan {
//                     0% { transform: translateY(0); opacity: 0; }
//                     10% { opacity: 1; }
//                     90% { opacity: 1; }
//                     100% { transform: translateY(100%); opacity: 0; }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default BarcodeScannerPage;
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    X,
    Tag,
    Hash,
    Image as ImageIcon,
    Edit3,
    ChevronDown,
    Loader2,
    Plus,
    Minus,
    Package,
    AlertCircle,
    Camera,
    Focus
} from "lucide-react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { DecodeHintType, BarcodeFormat } from "@zxing/library";

import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import ProductSoldSuccess from "./ProductSoldSuccess";
import { productsApi } from "@/features/Product/api/product.api";
import { itemsApi } from "@/features/Inventory/api/item.api";
import { warehousesApi, roomsApi, shelvesApi, racksApi } from "@/features/Inventory/api/location.api";
import type { Product } from "@/features/Product/types";

/* ---------------- Types ---------------- */

type Mode = "camera" | "upload";

interface StockLocation {
    warehouse_id: number;
    warehouse_name: string;
    room_id: number;
    room_name: string;
    shelf_id?: number;
    shelf_name?: string;
    rack_id?: number;
    rack_name?: string;
    item_count: number;
}

/* ---------------- Component ---------------- */

const BarcodeScannerPage: React.FC = () => {
    const location = useLocation();

    const mode = (location.state?.mode as Mode) ?? "camera";

    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Selection State
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | "">("");
    const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
    const [selectedShelfId, setSelectedShelfId] = useState<number | "">("");
    const [selectedRackId, setSelectedRackId] = useState<number | "">("");
    const [sellingMode, setSellingMode] = useState<"Online" | "Offline">("Online");
    const [quantity, setQuantity] = useState<number | "">(1);
    const [isReturnMode, setIsReturnMode] = useState(false);
    const [storageType, setStorageType] = useState<'shelf' | 'rack'>('shelf');
    const [sold, setSold] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // State
    const [product, setProduct] = useState<Product | null>(null);
    const [stockDetails, setStockDetails] = useState<StockLocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSelling, setIsSelling] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scanHint, setScanHint] = useState<string>("Position barcode within frame");
    const [scanAttempts, setScanAttempts] = useState<number>(0);

    // Calculate available stock for the currently selected location (Sell mode)
    const currentLocationStock = useMemo(() => {
        if (!product || isReturnMode) return 0;
        if (storageType === 'shelf' && selectedShelfId) {
            const shelf = stockDetails.find(s => s.shelf_id === Number(selectedShelfId));
            return shelf ? shelf.item_count : 0;
        }
        if (storageType === 'rack' && selectedRackId) {
            const rack = stockDetails.find(s => s.rack_id === Number(selectedRackId));
            return rack ? rack.item_count : 0;
        }
        return 0;
    }, [product, isReturnMode, storageType, selectedShelfId, selectedRackId, stockDetails]);
    
    const [dragActive, setDragActive] = useState(false);

    // Return Mode: Destination location state
    const [returnWarehouseId, setReturnWarehouseId] = useState<number | "">("");
    const [returnRoomId, setReturnRoomId] = useState<number | "">("");
    const [returnShelfId, setReturnShelfId] = useState<number | "">("");
    const [returnRackId, setReturnRackId] = useState<number | "">("");

    // All locations for Return mode
    const [allWarehouses, setAllWarehouses] = useState<any[]>([]);
    const [allRooms, setAllRooms] = useState<any[]>([]);
    const [allShelves, setAllShelves] = useState<any[]>([]);
    const [allRacks, setAllRacks] = useState<any[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>("Product Sold Successfully!");

    /* ---------------- API CALLS ---------------- */

    const resetScanner = () => {
        setSold(false);
        setProduct(null);
        setStockDetails([]);
        setSelectedWarehouseId("");
        setSelectedRoomId("");
        setSelectedShelfId("");
        setSelectedRackId("");
        setReturnWarehouseId("");
        setReturnRoomId("");
        setReturnShelfId("");
        setReturnRackId("");
        setQuantity(1);
        setIsReturnMode(false);
        setError(null);
        setScanHint("Position barcode within frame");
        setScanAttempts(0);
        setSuccessMessage("Product Sold Successfully!");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const fetchProductBySku = async (sku: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await productsApi.getBySku(sku);
            if (res.success && res.data) {
                const prod = res.data;
                setProduct(prod);

                if (prod.product_id) {
                    const detailRes = await productsApi.getDetails(prod.product_id);
                    if (detailRes.success && detailRes.data && detailRes.data.stock_details) {
                        const availableStock = detailRes.data.stock_details.filter((s: any) => s.status === 'available');
                        setStockDetails(availableStock as any);
                    }
                }
            } else {
                setError("Product not found");
                setProduct(null);
            }
        } catch (err: any) {
            console.error(err);
            setError("Failed to fetch product. " + (err.message || ""));
            setProduct(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSell = async () => {
        if (!product) return;

        if (!selectedShelfId && !selectedRackId) {
            alert("Please select a location (shelf or rack)");
            return;
        }

        const finalQty = Number(quantity) || 1;

        if (finalQty > currentLocationStock) {
            alert(`Insufficient stock in this location. Available: ${currentLocationStock}`);
            return;
        }

        setIsSelling(true);
        try {
            const res = await itemsApi.removeStock({
                product_id: product.product_id,
                shelf_id: selectedShelfId ? Number(selectedShelfId) : undefined,
                rack_id: selectedRackId ? Number(selectedRackId) : undefined,
                quantity: finalQty,
                status: 'sold',
                mode: sellingMode
            });

            if (res.success) {
                setSuccessMessage("Product Sold Successfully!");
                setSold(true);
            } else {
                alert("Failed to sell item: " + res.message);
            }
        } catch (err: any) {
            alert("Error processing sale: " + err.message);
        } finally {
            setIsSelling(false);
        }
    };

    const handleReturn = async () => {
        if (!product) return;

        if (!returnShelfId && !returnRackId) {
            alert("Please select a return location (shelf or rack)");
            return;
        }

        const finalQty = Number(quantity) || 1;

        setIsReturning(true);
        try {
            const res = await itemsApi.returnStock({
                product_id: product.product_id,
                shelf_id: returnShelfId ? Number(returnShelfId) : undefined,
                rack_id: returnRackId ? Number(returnRackId) : undefined,
                quantity: finalQty
            });

            if (res.success && res.data) {
                setSuccessMessage("Product Returned Successfully!");
                setSold(true);
            } else {
                alert("Failed to return item: " + (res as any).message);
            }
        } catch (err: any) {
            alert("Error processing return: " + err.message);
        } finally {
            setIsReturning(false);
        }
    };

    // ENHANCED: Optimized reader with all barcode formats
    const reader = useMemo(() => {
        const hints = new Map();
        const formats = [
            BarcodeFormat.CODE_128,
            BarcodeFormat.CODE_39,
            BarcodeFormat.CODE_93,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
            BarcodeFormat.ITF,
            BarcodeFormat.CODABAR,
            BarcodeFormat.QR_CODE,
            BarcodeFormat.DATA_MATRIX,
        ];
        hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
        hints.set(DecodeHintType.TRY_HARDER, true);
        hints.set(DecodeHintType.ASSUME_GS1, false);
        
        return new BrowserMultiFormatReader(hints, { 
            delayBetweenScanAttempts: 50,  // FASTER: Scan every 50ms (20 fps)
            delayBetweenScanSuccess: 500   // Wait 500ms after success
        });
    }, []);

    // Keep track of loading state in a ref for camera callback
    const isLoadingRef = useRef(false);
    const productRef = useRef<Product | null>(null);
    
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        productRef.current = product;
    }, [product]);

    const isStartingRef = useRef(false);
    const lastScannedRef = useRef<string>("");
    const lastScanTimeRef = useRef<number>(0);
    const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ENHANCED: Play beep sound on successful scan
    const playBeep = (success: boolean = true) => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = success ? 800 : 400;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (e) {
            console.log("Audio not supported");
        }
    };

    /* ---------------- ENHANCED CAMERA SCAN WITH BETTER FOCUS ---------------- */
    useEffect(() => {
        const isCameraMode = mode === "camera";
        const videoElement = videoRef.current;

        if (!isCameraMode || !videoElement) {
            if (controlsRef.current) {
                console.log("Stopping camera (Mode changed)");
                controlsRef.current.stop();
                controlsRef.current = null;
            }
            return;
        }

        // Prevent multiple simultaneous starts
        if (isStartingRef.current || controlsRef.current) {
            return;
        }

        // Check camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraError("Camera access not available. Use HTTPS or localhost.");
            return;
        }

        let isMounted = true;
        let activeControls: IScannerControls | null = null;

        const startCamera = async () => {
            if (!isMounted || isStartingRef.current) return;
            isStartingRef.current = true;

            // ENHANCED: Higher resolution and frame rate
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { min: 640, ideal: 1920, max: 3840 },
                    height: { min: 480, ideal: 1080, max: 2160 },
                    aspectRatio: { ideal: 16 / 9 },
                    frameRate: { ideal: 60, max: 60 },
                    // @ts-ignore - Advanced camera features for better focus
                    focusMode: 'continuous',
                    focusDistance: { ideal: 0 },
                    advanced: [
                        { focusMode: 'continuous' },
                        { torch: false }
                    ]
                }
            }as unknown as MediaStreamConstraints;

            console.log("🎥 Starting enhanced barcode scanner...");

            try {
                const controls = await reader.decodeFromConstraints(
                    constraints,
                    videoElement,
                    (result, error) => {
                        // Update scan attempts counter
                        setScanAttempts(prev => prev + 1);

                        if (result) {
                            const text = result.getText();
                            const now = Date.now();

                            // Prevent duplicate scans of same barcode within 3 seconds
                            if (
                                lastScannedRef.current === text && 
                                now - lastScanTimeRef.current < 3000
                            ) {
                                return;
                            }

                            // Don't scan if currently loading
                            if (isLoadingRef.current) {
                                return;
                            }

                            console.log("✅ Barcode detected:", text);
                            
                            lastScannedRef.current = text;
                            lastScanTimeRef.current = now;
                            
                            // Success feedback
                            setScanHint("✓ Barcode scanned successfully!");
                            playBeep(true);
                            
                            // Vibrate if supported
                            if (navigator.vibrate) {
                                navigator.vibrate([100, 50, 100]);
                            }

                            fetchProductBySku(text);

                            // Reset hint after 2 seconds
                            if (hintTimeoutRef.current) {
                                clearTimeout(hintTimeoutRef.current);
                            }
                            hintTimeoutRef.current = setTimeout(() => {
                                setScanHint("Position barcode within frame");
                            }, 2000);

                        } else if (error) {
                            // ENHANCED: Provide helpful hints based on error type
                            const errorMsg = error.message || error.toString();
                            
                            if (errorMsg.includes('NotFoundException')) {
                                if (scanAttempts % 20 === 0) { // Update hint every 20 attempts
                                    setScanHint("📍 No barcode detected - adjust position");
                                }
                            } else if (errorMsg.includes('FormatException')) {
                                setScanHint("⚠️ Barcode found but unclear - improve focus/lighting");
                                if (scanAttempts % 30 === 0) {
                                    playBeep(false); // Warning beep
                                }
                            } else if (errorMsg.includes('ChecksumException')) {
                                setScanHint("🔍 Barcode damaged or unclear - hold steady");
                            }
                        }
                    }
                );

                if (!isMounted) {
                    controls.stop();
                    isStartingRef.current = false;
                    return;
                }

                activeControls = controls;
                controlsRef.current = controls;
                isStartingRef.current = false;
                console.log("✅ Camera active - scanning at 60fps with enhanced focus");

            } catch (err: any) {
                isStartingRef.current = false;
                console.error("❌ Camera error:", err);
                
                // Better error messages
                if (err.name === 'NotAllowedError') {
                    setCameraError("Camera permission denied. Please allow camera access.");
                } else if (err.name === 'NotFoundError') {
                    setCameraError("No camera found. Please connect a camera.");
                } else if (err.name === 'NotReadableError') {
                    setCameraError("Camera is already in use by another application.");
                } else {
                    setCameraError(err.message || "Failed to start camera");
                }
            }
        };

        const timeout = setTimeout(startCamera, 300);

        return () => {
            isMounted = false;
            clearTimeout(timeout);
            
            if (hintTimeoutRef.current) {
                clearTimeout(hintTimeoutRef.current);
            }
            
            if (activeControls) {
                console.log("🛑 Cleaning up camera");
                activeControls.stop();
                controlsRef.current = null;
            }
            
            setTimeout(() => {
                isStartingRef.current = false;
            }, 500);
        };
    }, [mode, reader]);

    /* ---------------- FETCH ALL LOCATIONS FOR RETURN MODE ---------------- */
    useEffect(() => {
        const fetchAllLocations = async () => {
            try {
                const [wRes, rRes, sRes, rackRes] = await Promise.all([
                    warehousesApi.getAll(1, 100),
                    roomsApi.getAll(1, 100),
                    shelvesApi.getAll(1, 100),
                    racksApi.getAll(undefined, 1, 100)
                ]);

                if (wRes.success && wRes.data) setAllWarehouses(wRes.data);
                if (rRes.success && rRes.rooms) setAllRooms(rRes.rooms);
                if (sRes.success && sRes.data) setAllShelves(sRes.data);
                if (rackRes.success && rackRes.data) setAllRacks(rackRes.data);
            } catch (err) {
                console.error("Failed to fetch locations:", err);
            }
        };
        fetchAllLocations();
    }, []);

    /* ---------------- ENHANCED IMAGE UPLOAD WITH ROTATION ---------------- */
    const rotateImage = (imageUrl: string, degrees: number): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                
                if (degrees === 90 || degrees === 270) {
                    canvas.width = img.height;
                    canvas.height = img.width;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }
                
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((degrees * Math.PI) / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                
                resolve(canvas.toDataURL());
            };
            img.src = imageUrl;
        });
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const imageFile = files[0];

        setIsLoading(true);
        setScanHint("🔍 Analyzing image...");

        const imgReader = new BrowserMultiFormatReader();
        const imageUrl = URL.createObjectURL(imageFile);
        
        try {
            // Try original image first
            const result = await imgReader.decodeFromImageUrl(imageUrl);
            if (result) {
                console.log("✅ Barcode found in original image");
                fetchProductBySku(result.getText());
                setIsLoading(false);
                return;
            }
        } catch (e) {
            console.log("Trying rotated versions...");
        }

        // Try all 4 rotations
        const angles = [90, 180, 270];
        for (const angle of angles) {
            try {
                setScanHint(`🔄 Trying ${angle}° rotation...`);
                const rotatedUrl = await rotateImage(imageUrl, angle);
                const result = await imgReader.decodeFromImageUrl(rotatedUrl);
                if (result) {
                    console.log(`✅ Barcode found at ${angle}° rotation`);
                    fetchProductBySku(result.getText());
                    setIsLoading(false);
                    return;
                }
            } catch (e) {
                continue;
            }
        }

        // No barcode found
        setIsLoading(false);
        setScanHint("❌ No barcode found in image");
        alert("Could not detect barcode in image. Try:\n• Better lighting\n• Clear focus\n• Straight angle\n• Higher quality image");
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    /* ---------------- DROPDOWN LOGIC ---------------- */
    const uniqueWarehouses = Array.from(new Set(stockDetails.map(s => s.warehouse_id)))
        .filter(id => id !== undefined && id !== null)
        .map(id => stockDetails.find(s => s.warehouse_id === id))
        .filter(x => x !== undefined);

    const uniqueRooms = selectedWarehouseId
        ? Array.from(new Set(stockDetails.filter(s => s.warehouse_id === Number(selectedWarehouseId)).map(s => s.room_id)))
            .filter(id => id !== undefined && id !== null)
            .map(id => stockDetails.find(s => s.room_id === id))
            .filter(x => x !== undefined)
        : [];

    const uniqueShelves = selectedRoomId
        ? Array.from(new Set(stockDetails
            .filter(s => s.room_id === Number(selectedRoomId) && s.shelf_id)
            .map(s => s.shelf_id)))
            .map(id => stockDetails.find(s => s.shelf_id === id))
            .filter(x => x !== undefined)
        : [];

    const uniqueRacks = selectedRoomId
        ? Array.from(new Set(stockDetails
            .filter(s => s.room_id === Number(selectedRoomId) && s.rack_id)
            .map(s => s.rack_id)))
            .map(id => stockDetails.find(s => s.rack_id === id))
            .filter(x => x !== undefined)
        : [];

    const returnRoomsFiltered = returnWarehouseId
        ? allRooms.filter((r: any) => r.warehouse_id === Number(returnWarehouseId))
        : [];

    const returnShelvesFiltered = returnRoomId
        ? allShelves.filter((s: any) => s.room_id === Number(returnRoomId))
        : [];

    const returnRacksFiltered = returnRoomId
        ? allRacks.filter((r: any) => r.room_id === Number(returnRoomId))
        : [];

    /* ---------------- UI ---------------- */

    if (sold) {
        return <ProductSoldSuccess message={successMessage} onClose={resetScanner} />;
    }

    return (
        <div className="h-screen md:h-[90%] overflow-y-hidden bg-gray-50 flex flex-col">
            <Header />

            <div className="flex-1 overflow-y-hidden">
                <div className="h-full bg-white rounded-xl border shadow-sm p-3">
                    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3">

                        {/* LEFT: CAMERA SCANNER */}
                        <div className={`order-1 lg:order-1 ${product ? "lg:col-span-4" : "lg:col-span-8"} h-full`}>
                            <div className="h-full rounded-lg border overflow-hidden flex flex-col bg-gray-900">
                                
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 font-semibold text-white text-sm flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Camera size={16} />
                                        Barcode Scanner
                                    </span>
                                    {mode === "camera" && !cameraError && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs">Live • 60fps</span>
                                        </div>
                                    )}
                                </div>

                                {mode === "camera" && (
                                    <div className="flex-1 relative bg-black">
                                        {!cameraError ? (
                                            <>
                                                <video
                                                    ref={videoRef}
                                                    className="w-full h-full object-cover"
                                                    autoPlay
                                                    muted
                                                    playsInline
                                                />
                                                
                                                {/* ENHANCED Scanning Overlay */}
                                                <div className="absolute inset-0 pointer-events-none">
                                                    <div className="absolute inset-8">
                                                        <div className="relative w-full h-full border-2 border-white/30 rounded-xl">
                                                            {/* Corner markers with animation */}
                                                            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-400 rounded-tl-xl animate-pulse"></div>
                                                            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-green-400 rounded-tr-xl animate-pulse"></div>
                                                            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-green-400 rounded-bl-xl animate-pulse"></div>
                                                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-400 rounded-br-xl animate-pulse"></div>
                                                            
                                                            {/* Scan line with enhanced animation */}
                                                            <div className="scan-line"></div>
                                                            
                                                            {/* Center crosshair for better alignment */}
                                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                                <Focus className="w-12 h-12 text-white/40" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Top hint badge */}
                                                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                                                        <div className={`backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-colors ${
                                                            scanHint.includes('✓') ? 'bg-green-500/90' : 
                                                            scanHint.includes('⚠️') || scanHint.includes('❌') ? 'bg-yellow-500/90' : 
                                                            'bg-blue-500/90'
                                                        }`}>
                                                            <span className="text-white font-medium text-xs">{scanHint}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Bottom instructions */}
                                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                                        <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-xl">
                                                            <p className="text-white text-xs font-medium mb-1 text-center">
                                                                {isLoading ? "🔍 Loading product..." : "📦 Tips for best results:"}
                                                            </p>
                                                            {!isLoading && (
                                                                <ul className="text-white/80 text-[10px] space-y-0.5">
                                                                    <li>• Hold barcode 15-20cm from camera</li>
                                                                    <li>• Keep barcode straight and steady</li>
                                                                    <li>• Ensure good lighting without glare</li>
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Scan counter (debug info) */}
                                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                                        <span className="text-white/70 text-[10px]">
                                                            Scans: {scanAttempts}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                                                <h3 className="text-white text-lg font-bold mb-2">Camera Error</h3>
                                                <p className="text-gray-300 text-sm mb-4 max-w-md">{cameraError}</p>
                                                <button
                                                    onClick={() => window.location.reload()}
                                                    className="bg-white text-gray-900 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                                                >
                                                    Retry Camera Access
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {mode === "upload" && (
                                    <div className="flex-1 flex items-center justify-center p-6">
                                        <div
                                            className={`w-full max-w-md border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                                                dragActive ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 bg-gray-50"
                                            }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                            <p className="text-gray-700 font-semibold mb-2">Upload Barcode Image</p>
                                            <p className="text-gray-500 text-sm mb-4">
                                                Drag & drop or click to upload<br/>
                                                <span className="text-xs text-gray-400">Supports auto-rotation for best results</span>
                                            </p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFiles(e.target.files)}
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isLoading}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center gap-2 justify-center">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Analyzing...
                                                    </span>
                                                ) : (
                                                    "Choose File"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: PRODUCT INFO */}
                        <div className={`order-2 lg:order-2 ${product ? "lg:col-span-8" : "hidden lg:block lg:col-span-4"} h-full overflow-hidden`}>
                            <div className="h-full rounded-lg border overflow-hidden flex flex-col">

                                {!product && (
                                    <>
                                        <div className="bg-gray-50 px-4 py-2 font-semibold border-b text-gray-900 text-sm">
                                            Product Information
                                        </div>
                                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-6">
                                            {isLoading ? (
                                                <div className="text-center">
                                                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-3" />
                                                    <p className="text-gray-600">Loading product details...</p>
                                                </div>
                                            ) : error ? (
                                                <div className="text-center">
                                                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                                    <p className="text-red-500 mb-3">{error}</p>
                                                    <button 
                                                        onClick={() => {
                                                            setError(null);
                                                            setProduct(null);
                                                        }} 
                                                        className="text-blue-600 hover:underline text-sm font-medium"
                                                    >
                                                        Try Scanning Again
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                                                    <p className="text-gray-600 font-medium mb-1">Ready to Scan</p>
                                                    <p className="text-gray-400 text-xs">Position barcode in camera view</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {product && (
                                    <div className="flex-1 overflow-auto p-3">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                            
                                            {/* Product Details Box */}
                                            <div className="border rounded-lg p-3 bg-white relative">
                                                <button
                                                    onClick={resetScanner}
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 z-10 transition"
                                                    title="Clear and scan another"
                                                >
                                                    <X size={20} />
                                                </button>

                                                <div className="flex gap-3">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-24 h-28 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-50">
                                                            {(() => {
                                                                const imgs = product.product_image;
                                                                let url = "";
                                                                if (Array.isArray(imgs) && imgs.length > 0) {
                                                                    const item = imgs[0];
                                                                    if (typeof item === 'object') {
                                                                        url = item.file_path || item.cdnUrl || item.url || "";
                                                                    } else {
                                                                        url = String(item);
                                                                    }
                                                                } else if (typeof imgs === 'string') {
                                                                    if (imgs.startsWith('[') || imgs.startsWith('{')) {
                                                                        try {
                                                                            const parsed = JSON.parse(imgs);
                                                                            if (Array.isArray(parsed) && parsed.length > 0) {
                                                                                const first = parsed[0];
                                                                                url = typeof first === 'object' ? (first.file_path || "") : String(first);
                                                                            } else if (typeof parsed === 'object') {
                                                                                url = parsed.file_path || "";
                                                                            }
                                                                        } catch { url = imgs; }
                                                                    } else {
                                                                        url = imgs;
                                                                    }
                                                                }

                                                                return url ? (
                                                                    <img
                                                                        src={url}
                                                                        alt="Product"
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.currentTarget.style.display = 'none';
                                                                            const parent = e.currentTarget.parentElement;
                                                                            if (parent) {
                                                                                parent.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg><p class="text-xs mt-1">No image</p></div>';
                                                                            }
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                                        <Package size={24} />
                                                                        <p className="text-xs mt-1">No image</p>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-start gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                                <Edit3 className="w-3.5 h-3.5 text-gray-700" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-[10px] text-gray-400 mb-0.5">Product Name</p>
                                                                <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                                <Tag className="w-3.5 h-3.5 text-gray-700" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-[10px] text-gray-400 uppercase mb-0.5">Category</p>
                                                                <p className="text-sm font-medium text-gray-900">{product.category_name || "-"}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                                <Hash className="w-3.5 h-3.5 text-gray-700" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-[10px] text-gray-400 uppercase mb-0.5">SKU</p>
                                                                <p className="text-sm font-bold text-gray-900">{product.sku}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location & Actions Box */}
                                            <div className="border rounded-lg p-3 bg-white">
                                                <div className="space-y-2.5">
                                                    {/* Mode Toggle */}
                                                    <div className="flex gap-2 border-b pb-2">
                                                        <button
                                                            onClick={() => setIsReturnMode(false)}
                                                            className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                                                !isReturnMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            Sell
                                                        </button>
                                                        <button
                                                            onClick={() => setIsReturnMode(true)}
                                                            className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                                                isReturnMode ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            Return
                                                        </button>
                                                    </div>

                                                    {/* SELL MODE */}
                                                    {!isReturnMode && (
                                                        <>
                                                            <p className="text-sm font-semibold text-gray-900">1. Select Location:</p>
                                                            
                                                            <div className="space-y-1.5">
                                                                {/* Warehouse */}
                                                                <div>
                                                                    <label className="text-[11px] text-gray-500 mb-1 block">
                                                                        Warehouse <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select
                                                                            className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                            value={selectedWarehouseId}
                                                                            onChange={(e) => {
                                                                                setSelectedWarehouseId(Number(e.target.value));
                                                                                setSelectedRoomId("");
                                                                                setSelectedShelfId("");
                                                                                setSelectedRackId("");
                                                                            }}
                                                                        >
                                                                            <option value="">Select Warehouse</option>
                                                                            {uniqueWarehouses.map((w) => (
                                                                                <option key={w?.warehouse_id} value={w?.warehouse_id}>
                                                                                    {w?.warehouse_name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                </div>

                                                                {/* Room */}
                                                                <div>
                                                                    <label className="text-[11px] text-gray-500 mb-1 block">
                                                                        Room <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select
                                                                            className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                                                            value={selectedRoomId}
                                                                            onChange={(e) => {
                                                                                setSelectedRoomId(Number(e.target.value));
                                                                                setSelectedShelfId("");
                                                                                setSelectedRackId("");
                                                                            }}
                                                                            disabled={!selectedWarehouseId}
                                                                        >
                                                                            <option value="">Select Room</option>
                                                                            {uniqueRooms.map((r) => (
                                                                                <option key={r?.room_id} value={r?.room_id}>
                                                                                    {r?.room_name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                </div>

                                                                {/* Storage Type Toggle */}
                                                                <div className="flex flex-col gap-1.5 mt-2">
                                                                    <label className="text-[11px] text-gray-500 block">Storage Type</label>
                                                                    <div className="flex p-0.5 bg-gray-100 rounded-lg w-fit">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setStorageType('shelf');
                                                                                setSelectedRackId("");
                                                                            }}
                                                                            className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${
                                                                                storageType === 'shelf' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                                                                            }`}
                                                                        >
                                                                            Shelf
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setStorageType('rack');
                                                                                setSelectedShelfId("");
                                                                            }}
                                                                            className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${
                                                                                storageType === 'rack' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                                                                            }`}
                                                                        >
                                                                            Rack
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Shelf/Rack Selector */}
                                                                {storageType === 'shelf' && (
                                                                    <div>
                                                                        <label className="text-[11px] text-gray-500 mb-1 block">
                                                                            Shelf <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="relative">
                                                                            <select
                                                                                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                                                                value={selectedShelfId}
                                                                                onChange={(e) => setSelectedShelfId(Number(e.target.value))}
                                                                                disabled={!selectedRoomId}
                                                                            >
                                                                                <option value="">Select Shelf</option>
                                                                                {uniqueShelves.map((s) => (
                                                                                    <option key={s?.shelf_id} value={s?.shelf_id}>
                                                                                        {s?.shelf_name} (Stock: {s?.item_count})
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {storageType === 'rack' && (
                                                                    <div>
                                                                        <label className="text-[11px] text-gray-500 mb-1 block">
                                                                            Rack <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="relative">
                                                                            <select
                                                                                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                                                                value={selectedRackId}
                                                                                onChange={(e) => setSelectedRackId(Number(e.target.value))}
                                                                                disabled={!selectedRoomId}
                                                                            >
                                                                                <option value="">Select Rack</option>
                                                                                {uniqueRacks.map((r) => (
                                                                                    <option key={r?.rack_id} value={r?.rack_id}>
                                                                                        {r?.rack_name} (Stock: {r?.item_count})
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <p className="text-sm font-semibold text-gray-900 mt-3">2. Selling Details:</p>

                                                            {/* Selling Mode */}
                                                            <div>
                                                                <label className="text-[11px] text-gray-500 mb-1 block">Mode</label>
                                                                <div className="flex p-0.5 bg-gray-100 rounded-lg">
                                                                    <button
                                                                        onClick={() => setSellingMode("Online")}
                                                                        className={`flex-1 px-3 py-1 text-[10px] font-medium rounded-md transition ${
                                                                            sellingMode === "Online" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                                                                        }`}
                                                                    >
                                                                        Online
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setSellingMode("Offline")}
                                                                        className={`flex-1 px-3 py-1 text-[10px] font-medium rounded-md transition ${
                                                                            sellingMode === "Offline" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                                                                        }`}
                                                                    >
                                                                        Offline
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Quantity */}
                                                            <div>
                                                                <label className="text-[11px] text-gray-500 mb-1 block">Quantity</label>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => setQuantity(prev => Math.max(1, (Number(prev) || 1) - 1))}
                                                                        className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        value={quantity}
                                                                        onChange={(e) => setQuantity(Number(e.target.value) || "")}
                                                                        className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                                                    <button
                                                                        onClick={() => setQuantity(prev => {
                                                                            const newQty = (Number(prev) || 1) + 1;
                                                                            return currentLocationStock > 0 && newQty > currentLocationStock 
                                                                                ? currentLocationStock 
                                                                                : newQty;
                                                                        })}
                                                                        className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                                {currentLocationStock > 0 && (
                                                                    <p className="text-[10px] text-gray-500 mt-1">
                                                                        Available: <span className="font-semibold text-green-600">{currentLocationStock}</span>
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Sell Button */}
                                                            <button
                                                                onClick={handleSell}
                                                                disabled={isSelling || !selectedShelfId && !selectedRackId}
                                                                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                                                            >
                                                                {isSelling ? (
                                                                    <>
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                        Processing...
                                                                    </>
                                                                ) : (
                                                                    "✓ Sell Product"
                                                                )}
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* RETURN MODE - Similar structure, keeping it concise */}
                                                    {isReturnMode && (
                                                        <>
                                                            <p className="text-sm font-semibold text-gray-900">1. Select Return Location:</p>
                                                            
                                                            <div className="space-y-1.5">
                                                                {/* Warehouse */}
                                                                <div>
                                                                    <label className="text-[11px] text-gray-500 mb-1 block">
                                                                        Warehouse <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select
                                                                            className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                            value={returnWarehouseId}
                                                                            onChange={(e) => {
                                                                                setReturnWarehouseId(Number(e.target.value));
                                                                                setReturnRoomId("");
                                                                                setReturnShelfId("");
                                                                                setReturnRackId("");
                                                                            }}
                                                                        >
                                                                            <option value="">Select Warehouse</option>
                                                                            {allWarehouses.map((w: any) => (
                                                                                <option key={w.warehouse_id} value={w.warehouse_id}>
                                                                                    {w.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                </div>

                                                                {/* Room */}
                                                                <div>
                                                                    <label className="text-[11px] text-gray-500 mb-1 block">
                                                                        Room <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select
                                                                            className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                                                                            value={returnRoomId}
                                                                            onChange={(e) => {
                                                                                setReturnRoomId(Number(e.target.value));
                                                                                setReturnShelfId("");
                                                                                setReturnRackId("");
                                                                            }}
                                                                            disabled={!returnWarehouseId}
                                                                        >
                                                                            <option value="">Select Room</option>
                                                                            {returnRoomsFiltered.map((r: any) => (
                                                                                <option key={r.room_id} value={r.room_id}>
                                                                                    {r.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                </div>

                                                                {/* Storage Type Toggle */}
                                                                <div className="flex flex-col gap-1.5 mt-2">
                                                                    <label className="text-[11px] text-gray-500 block">Storage Type</label>
                                                                    <div className="flex p-0.5 bg-gray-100 rounded-lg w-fit">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setStorageType('shelf');
                                                                                setReturnRackId("");
                                                                            }}
                                                                            className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${
                                                                                storageType === 'shelf' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
                                                                            }`}
                                                                        >
                                                                            Shelf
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setStorageType('rack');
                                                                                setReturnShelfId("");
                                                                            }}
                                                                            className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${
                                                                                storageType === 'rack' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
                                                                            }`}
                                                                        >
                                                                            Rack
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Shelf/Rack Selector */}
                                                                {storageType === 'shelf' && (
                                                                    <div>
                                                                        <label className="text-[11px] text-gray-500 mb-1 block">
                                                                            Shelf <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="relative">
                                                                            <select
                                                                                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                                                                                value={returnShelfId}
                                                                                onChange={(e) => setReturnShelfId(Number(e.target.value))}
                                                                                disabled={!returnRoomId}
                                                                            >
                                                                                <option value="">Select Shelf</option>
                                                                                {returnShelvesFiltered.map((s: any) => (
                                                                                    <option key={s.shelf_id} value={s.shelf_id}>
                                                                                        {s.name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {storageType === 'rack' && (
                                                                    <div>
                                                                        <label className="text-[11px] text-gray-500 mb-1 block">
                                                                            Rack <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="relative">
                                                                            <select
                                                                                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                                                                                value={returnRackId}
                                                                                onChange={(e) => setReturnRackId(Number(e.target.value))}
                                                                                disabled={!returnRoomId}
                                                                            >
                                                                                <option value="">Select Rack</option>
                                                                                {returnRacksFiltered.map((r: any) => (
                                                                                    <option key={r.rack_id} value={r.rack_id}>
                                                                                        {r.name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <p className="text-sm font-semibold text-gray-900 mt-3">2. Return Quantity:</p>

                                                            {/* Quantity */}
                                                            <div>
                                                                <label className="text-[11px] text-gray-500 mb-1 block">Quantity</label>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => setQuantity(prev => Math.max(1, (Number(prev) || 1) - 1))}
                                                                        className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        value={quantity}
                                                                        onChange={(e) => setQuantity(Number(e.target.value) || "")}
                                                                        className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                    />
                                                                    <button
                                                                        onClick={() => setQuantity(prev => (Number(prev) || 1) + 1)}
                                                                        className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Return Button */}
                                                            <button
                                                                onClick={handleReturn}
                                                                disabled={isReturning || !returnShelfId && !returnRackId}
                                                                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                                                            >
                                                                {isReturning ? (
                                                                    <>
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                        Processing...
                                                                    </>
                                                                ) : (
                                                                    "↩ Return Product"
                                                                )}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Scan Line Animation CSS */}
            <style>{`
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, #10b981, #10b981, transparent);
                    box-shadow: 0 0 15px #10b981, 0 0 30px rgba(16, 185, 129, 0.5);
                    animation: scan 2s ease-in-out infinite;
                }
                
                @keyframes scan {
                    0% { 
                        transform: translateY(0); 
                        opacity: 0; 
                    }
                    10% { 
                        opacity: 1; 
                    }
                    90% { 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translateY(100%); 
                        opacity: 0; 
                    }
                }
                
                /* Smooth transitions for all interactive elements */
                input, select, button {
                    transition: all 0.2s ease;
                }
                
                /* Hide number input spinners for cleaner look */
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
};

export default BarcodeScannerPage;
