import React, { useEffect, useRef, useState } from "react";
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
    Package
} from "lucide-react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import ProductSoldSuccess from "./ProductSoldSuccess";
import { productsApi } from "@/features/Product/api/product.api";
import { itemsApi } from "@/features/Inventory/api/item.api";
import { warehousesApi, roomsApi, shelvesApi } from "@/features/Inventory/api/location.api";
import type { Product } from "@/features/Product/types";

/* ---------------- Types ---------------- */

type Mode = "camera" | "upload";

interface StockLocation {
    warehouse_id: number;
    warehouse_name: string;
    room_id: number;
    room_name: string;
    shelf_id: number;
    shelf_name: string;
    item_count: number;
}

/* ---------------- Component ---------------- */

const BarcodeScannerPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const mode = (location.state?.mode as Mode) ?? "camera";

    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State
    const [product, setProduct] = useState<Product | null>(null);
    const [stockDetails, setStockDetails] = useState<StockLocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sold, setSold] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Selection State
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | "">("");
    const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
    const [selectedShelfId, setSelectedShelfId] = useState<number | "">("");
    const [sellingMode, setSellingMode] = useState<"Online" | "Offline">("Online");
    const [quantity, setQuantity] = useState<number>(1);
    const [isReturnMode, setIsReturnMode] = useState(false); // Return mode toggle

    // Return Mode: Destination location state
    const [returnWarehouseId, setReturnWarehouseId] = useState<number | "">("")
    const [returnRoomId, setReturnRoomId] = useState<number | "">("")
    const [returnShelfId, setReturnShelfId] = useState<number | "">("")

    // All locations for Return mode
    const [allWarehouses, setAllWarehouses] = useState<any[]>([]);
    const [allRooms, setAllRooms] = useState<any[]>([]);
    const [allShelves, setAllShelves] = useState<any[]>([]);

    const [isSelling, setIsSelling] = useState(false);
    const [isReturning, setIsReturning] = useState(false);


    /* ---------------- API CALLS ---------------- */

    const fetchProductBySku = async (sku: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Get Product Basic Info
            const res = await productsApi.getBySku(sku);
            if (res.success && res.data) {
                const prod = res.data;
                setProduct(prod);

                // 2. Get Full Details (Stock)
                // We need the ID from the first call to get details
                if (prod.product_id) {
                    const detailRes = await productsApi.getDetails(prod.product_id);
                    if (detailRes.success && detailRes.data && detailRes.data.stock_details) {
                        // Filter only AVAILABLE items because removeStock API only works on available items
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
        if (!product || !selectedShelfId) return;

        setIsSelling(true);
        try {
            const res = await itemsApi.removeStock({
                product_id: product.product_id,
                shelf_id: Number(selectedShelfId),
                quantity: quantity,
                status: 'sold',
                mode: sellingMode
            });

            if (res.success) {
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
        if (!product || !returnShelfId) return;

        setIsReturning(true);
        try {
            const res = await itemsApi.returnStock({
                product_id: product.product_id,
                shelf_id: Number(returnShelfId),
                quantity: quantity
            });

            if (res.success && res.data) {
                alert(`Successfully returned ${res.data.affected} item(s)`);
                setProduct(null);
                setStockDetails([]);
                setReturnWarehouseId("");
                setReturnRoomId("");
                setReturnShelfId("");
                setQuantity(1);
            } else {
                alert("Failed to return item: " + (res as any).message);
            }
        } catch (err: any) {
            alert("Error processing return: " + err.message);
        } finally {
            setIsReturning(false);
        }
    };


    /* ---------------- CAMERA SCAN ---------------- */
    useEffect(() => {
        if (mode !== "camera" || !videoRef.current || product || isLoading) return;

        const reader = new BrowserMultiFormatReader();

        reader.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result, _err, controls) => {
                if (result) {
                    controlsRef.current = controls;
                    const text = result.getText();
                    if (text) {
                        controls.stop();
                        fetchProductBySku(text);
                    }
                }
            }
        );

        return () => {
            controlsRef.current?.stop();
        };
    }, [mode, product, isLoading]);

    /* ---------------- FETCH ALL LOCATIONS FOR RETURN MODE ---------------- */
    useEffect(() => {
        const fetchAllLocations = async () => {
            try {
                const [wRes, rRes, sRes] = await Promise.all([
                    warehousesApi.getAll(1, 100),
                    roomsApi.getAll(1, 100),
                    shelvesApi.getAll(1, 100)
                ]);

                if (wRes.success && wRes.data) setAllWarehouses(wRes.data);
                if (rRes.success && rRes.rooms) setAllRooms(rRes.rooms);
                if (sRes.success && sRes.data) setAllShelves(sRes.data);
            } catch (err) {
                console.error("Failed to fetch locations:", err);
            }
        };
        fetchAllLocations();
    }, []);


    /* ---------------- IMAGE UPLOAD ---------------- */
    // Simulating scan from image (not implementing OCR for now unless library supports it easily, 
    // replacing with manual SKU entry simulation if image uploaded for demo purpose or just keeping existing mock?)
    // Actually BrowserMultiFormatReader can decode from image too.
    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const imageFile = files[0];

        // Decode from image
        const reader = new BrowserMultiFormatReader();
        try {
            const result = await reader.decodeFromImageUrl(URL.createObjectURL(imageFile));
            if (result) {
                fetchProductBySku(result.getText());
            }
        } catch (e) {
            alert("Could not detect barcode in image");
        }
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
    // Unique Warehouses
    const uniqueWarehouses = Array.from(new Set(stockDetails.map(s => s.warehouse_id)))
        .filter(id => id !== undefined && id !== null)
        .map(id => stockDetails.find(s => s.warehouse_id === id))
        .filter(x => x !== undefined);

    // Unique Rooms for selected Warehouse
    const uniqueRooms = selectedWarehouseId
        ? Array.from(new Set(stockDetails.filter(s => s.warehouse_id === Number(selectedWarehouseId)).map(s => s.room_id)))
            .filter(id => id !== undefined && id !== null)
            .map(id => stockDetails.find(s => s.room_id === id))
            .filter(x => x !== undefined)
        : [];

    // Unique Shelves for selected Room
    const uniqueShelves = selectedRoomId
        ? Array.from(new Set(stockDetails.filter(s => s.room_id === Number(selectedRoomId)).map(s => s.shelf_id)))
            .filter(id => id !== undefined && id !== null)
            .map(id => stockDetails.find(s => s.shelf_id === id))
            .filter(x => x !== undefined)
        : [];

    // Return Mode: Filtered locations  
    const returnRoomsFiltered = returnWarehouseId
        ? allRooms.filter((r: any) => r.warehouse_id === Number(returnWarehouseId))
        : [];

    const returnShelvesFiltered = returnRoomId
        ? allShelves.filter((s: any) => s.room_id === Number(returnRoomId))
        : [];



    /* ---------------- UI ---------------- */

    return (
        <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
            <Header />

            <div className="flex-1 overflow-hidden">
                <div className="h-[80%] bg-white rounded-xl border shadow-sm p-3">
                    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3">

                        {/* PRODUCT INFO / SUCCESS */}
                        <div className={`order-2 lg:order-1 ${sold ? "lg:col-span-12" : "lg:col-span-8"} h-full overflow-hidden`}>
                            <div className="h-full rounded-lg border overflow-hidden flex flex-col">

                                {!sold && (
                                    <div className="bg-gray-50 px-4 py-2 font-semibold border-b text-gray-900 text-sm">
                                        Product Information
                                    </div>
                                )}

                                {!product && !sold && !isLoading && !error && (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                                        Scan a barcode to see details
                                    </div>
                                )}

                                {isLoading && !sold && (
                                    <div className="flex-1 flex items-center justify-center text-blue-600">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    </div>
                                )}

                                {error && !sold && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-red-500 gap-2">
                                        <p>{error}</p>
                                        <button onClick={() => { setError(null); setProduct(null); }} className="text-blue-600 hover:underline text-sm">Try Again</button>
                                    </div>
                                )}


                                {product && !sold && (
                                    <div className="flex-1 overflow-hidden p-3">
                                        <div className="h-full flex flex-col">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                                                {/* LEFT BOX - Product Details */}
                                                <div className="border rounded-lg p-2.5 bg-white">
                                                    <div className="flex gap-2.5">
                                                        {/* Product Image */}
                                                        <div className="flex-shrink-0">
                                                            <div className="w-24 h-28 rounded-lg border-2 border-gray-300 overflow-hidden bg-white">

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

                                                                    if (url) {
                                                                        return (
                                                                            <img
                                                                                src={url}
                                                                                alt="Product"
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => {
                                                                                    e.currentTarget.style.display = 'none';
                                                                                    const parent = e.currentTarget.parentElement;
                                                                                    if (parent) {
                                                                                        parent.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-50');
                                                                                        parent.innerHTML = '<div class="text-gray-400 text-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-1"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22v-9.5"></path></svg><p class="text-[10px]">No image</p></div>';
                                                                                    }
                                                                                }}
                                                                            />
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                                                                                <Package size={24} className="mb-1" />
                                                                                <p className="text-[10px]">No image</p>
                                                                            </div>
                                                                        );
                                                                    }
                                                                })()}
                                                            </div>
                                                        </div>

                                                        {/* Product Info */}
                                                        <div className="flex-1 space-y-2">
                                                            {/* Product Name */}
                                                            <div className="flex items-start gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                                    <Edit3 className="w-3.5 h-3.5 text-gray-700" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-[10px] text-gray-400 mb-0.5">Product Name</p>
                                                                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                                                </div>
                                                            </div>

                                                            {/* Category */}
                                                            <div className="flex items-start gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                                    <Tag className="w-3.5 h-3.5 text-gray-700" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-[10px] text-gray-400 uppercase mb-0.5">Category</p>
                                                                    <p className="text-sm font-medium text-gray-900">{product.category_name || "-"}</p>
                                                                </div>
                                                            </div>

                                                            {/* SKU */}
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

                                                {/* RIGHT BOX - Location & Selling */}
                                                <div className="border rounded-lg p-2.5 bg-white">
                                                    <div className="space-y-2.5">
                                                        {/* Mode Toggle: Sell / Return */}
                                                        <div className="flex gap-2 border-b pb-2">
                                                            <button
                                                                onClick={() => setIsReturnMode(false)}
                                                                className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${!isReturnMode
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                Sell
                                                            </button>
                                                            <button
                                                                onClick={() => setIsReturnMode(true)}
                                                                className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${isReturnMode
                                                                    ? 'bg-green-600 text-white'
                                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                Return
                                                            </button>
                                                        </div>


                                                        {/* Location Selection - SELL MODE ONLY */}
                                                        {!isReturnMode && (
                                                            <div>
                                                                <p className="text-sm font-semibold mb-2 text-gray-900">1. Select Location :</p>

                                                                <div className="space-y-1.5">
                                                                    {/* WAREHOUSE */}
                                                                    <div>
                                                                        <label className="text-[11px] text-gray-500 mb-1 block">
                                                                            Warehouse <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="relative">
                                                                            <select
                                                                                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                                                value={selectedWarehouseId}
                                                                                onChange={(e) => {
                                                                                    setSelectedWarehouseId(Number(e.target.value));
                                                                                    setSelectedRoomId("");
                                                                                    setSelectedShelfId("");
                                                                                }}
                                                                            >
                                                                                <option value="">Select Warehouse</option>
                                                                                {uniqueWarehouses.map((w) => (
                                                                                    <option key={w?.warehouse_id} value={w?.warehouse_id}>{w?.warehouse_name}</option>
                                                                                ))}
                                                                            </select>
                                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                        </div>
                                                                    </div>


                                                                    {/* ROOM */}
                                                                    <div>
                                                                        <label className="text-[11px] text-gray-500 mb-1 block">
                                                                            Room <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="relative">
                                                                            <select
                                                                                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                                                value={selectedRoomId}
                                                                                onChange={(e) => {
                                                                                    setSelectedRoomId(Number(e.target.value));
                                                                                    setSelectedShelfId("");
                                                                                }}
                                                                                disabled={!selectedWarehouseId}
                                                                            >
                                                                                <option value="">Select Room</option>
                                                                                {uniqueRooms.map((r) => (
                                                                                    <option key={r?.room_id} value={r?.room_id}>{r?.room_name}</option>
                                                                                ))}
                                                                            </select>
                                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                        </div>
                                                                    </div>



                                                                    {/* SHELF */}
                                                                    <div>
                                                                        <label className="text-[11px] text-gray-500 mb-1 block">
                                                                            Shelf <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <div className="relative">
                                                                            <select
                                                                                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                                                value={selectedShelfId}
                                                                                onChange={(e) => setSelectedShelfId(Number(e.target.value))}
                                                                                disabled={!selectedRoomId}
                                                                            >
                                                                                <option value="">Select Shelf</option>
                                                                                {uniqueShelves.map((s) => (
                                                                                    <option key={s?.shelf_id} value={s?.shelf_id}>
                                                                                        {s?.shelf_name} ({s?.item_count} available)
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Selling Mode - SELL MODE ONLY */}
                                                        {!isReturnMode && (
                                                            <div>
                                                                <p className="text-sm font-semibold mb-2 text-gray-900">2. Select mode of selling :</p>
                                                                <div className="flex gap-6">
                                                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                                                        <input
                                                                            type="radio"
                                                                            name="selling-mode"
                                                                            checked={sellingMode === "Online"}
                                                                            onChange={() => setSellingMode("Online")}
                                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                                        />
                                                                        <span className="text-sm text-gray-900">Online</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                                                        <input
                                                                            type="radio"
                                                                            name="selling-mode"
                                                                            checked={sellingMode === "Offline"}
                                                                            onChange={() => setSellingMode("Offline")}
                                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                                        />
                                                                        <span className="text-sm text-gray-900">Offline</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}


                                                        {/* Quantity */}
                                                        <div className="flex gap-4">
                                                            <div className="flex-1 max-w-[100px]">
                                                                <label className="text-[11px] text-gray-500 mb-1 block">
                                                                    Quantity <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="flex items-center border border-gray-300 rounded-md bg-white">
                                                                    <button
                                                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                                        className="px-2 py-1.5 hover:bg-gray-100 text-gray-600 border-r transition"
                                                                        type="button"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        value={quantity}
                                                                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                                                        className="w-full text-center text-xs focus:outline-none py-1.5 font-medium appearance-none"
                                                                    />
                                                                    <button
                                                                        onClick={() => setQuantity(q => q + 1)}
                                                                        className="px-2 py-1.5 hover:bg-gray-100 text-gray-600 border-l transition"
                                                                        type="button"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {/* RETURN MODE - Location Selection */}
                                                            {isReturnMode && (
                                                                <div className="mt-3">
                                                                    <p className="text-sm font-semibold mb-2 text-gray-900">Select Return Destination:</p>
                                                                    <div className="space-y-1.5">
                                                                        <div>
                                                                            <label className="text-[11px] text-gray-500 mb-1 block">Warehouse <span className="text-red-500">*</span></label>
                                                                            <div className="relative">
                                                                                <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-green-500" value={returnWarehouseId} onChange={(e) => { setReturnWarehouseId(Number(e.target.value)); setReturnRoomId(""); setReturnShelfId(""); }}>
                                                                                    <option value="">Select Warehouse</option>
                                                                                    {allWarehouses.map((w: any) => (<option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>))}
                                                                                </select>
                                                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[11px] text-gray-500 mb-1 block">Room <span className="text-red-500">*</span></label>
                                                                            <div className="relative">
                                                                                <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-green-500" value={returnRoomId} onChange={(e) => { setReturnRoomId(Number(e.target.value)); setReturnShelfId(""); }} disabled={!returnWarehouseId}>
                                                                                    <option value="">Select Room</option>
                                                                                    {returnRoomsFiltered.map((r: any) => (<option key={r.room_id} value={r.room_id}>{r.name || r.room_name}</option>))}
                                                                                </select>
                                                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[11px] text-gray-500 mb-1 block">Shelf <span className="text-red-500">*</span></label>
                                                                            <div className="relative">
                                                                                <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-green-500" value={returnShelfId} onChange={(e) => setReturnShelfId(Number(e.target.value))} disabled={!returnRoomId}>
                                                                                    <option value="">Select Shelf</option>
                                                                                    {returnShelvesFiltered.map((s: any) => (<option key={s.shelf_id} value={s.shelf_id}>{s.name || s.shelf_name}</option>))}
                                                                                </select>
                                                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sell Button - Below boxes, inside container */}
                                            {!isReturnMode && (
                                                <div className="flex justify-end mt-3">
                                                    <button
                                                        onClick={handleSell}
                                                        disabled={!selectedShelfId || isSelling || quantity < 1}
                                                        className={`px-5 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 shadow-sm
                                                        ${!selectedShelfId || isSelling ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                                    >
                                                        {isSelling ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                                            </svg>
                                                        )}
                                                        Sell
                                                    </button>
                                                </div>
                                            )}

                                            {/* Return Button */}
                                            {isReturnMode && (
                                                <div className="flex justify-end mt-3">
                                                    <button
                                                        onClick={handleReturn}
                                                        disabled={!returnShelfId || isReturning || quantity < 1}
                                                        className={`px-5 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 shadow-sm ${!returnShelfId || isReturning ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                                    >
                                                        {isReturning ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                                            </svg>
                                                        )}
                                                        Return
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {sold && (
                                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                                        <ProductSoldSuccess />
                                        <button
                                            onClick={() => {
                                                setSold(false);
                                                setProduct(null);
                                                setStockDetails([]);
                                                setSelectedWarehouseId("");
                                                setSelectedRoomId("");
                                                setSelectedShelfId("");
                                            }}
                                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Scan Another Product
                                        </button>
                                        <button
                                            onClick={() => navigate('/dashboard')}
                                            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            Back to Dashboard
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* RIGHT PANEL - Camera/Upload */}
                        <div
                            className={`order-1 lg:order-2 lg:col-span-4 transition-all duration-300 h-full ${sold ? "hidden" : ""
                                }`}
                        >
                            <div className="h-full rounded-lg border relative overflow-hidden bg-white">

                                {/* CAMERA MODE */}
                                {mode === "camera" && !sold && (
                                    <div className="h-full bg-black relative">
                                        <button
                                            onClick={() => {
                                                controlsRef.current?.stop();
                                                navigate(-1);
                                            }}
                                            className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 hover:bg-gray-100 transition"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>

                                        <video
                                            ref={videoRef}
                                            className="w-full h-full object-cover"
                                        />

                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white pointer-events-none">
                                            <p className="font-semibold text-base mb-1">SCAN THE BARCODE</p>
                                            <p className="text-[10px] text-gray-200 mb-4">
                                                Line up the barcode inside the red corners.
                                            </p>
                                            <div className="border-2 border-red-500 w-48 h-20 rounded" />
                                            <p className="text-[10px] mt-3 opacity-80">Scanning…</p>
                                        </div>
                                    </div>
                                )}

                                {/* UPLOAD MODE */}
                                {mode === "upload" && !sold && (
                                    <div className="h-full flex flex-col items-center justify-center p-4 relative">
                                        <button
                                            onClick={() => navigate(-1)}
                                            className="absolute top-2 right-2 bg-gray-100 rounded-full p-1 hover:bg-gray-200 transition"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>

                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`w-full h-full border-2 border-dashed rounded-lg p-6 cursor-pointer transition
                        flex flex-col items-center justify-center
                        ${dragActive
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-300 hover:border-gray-400"
                                                }`}
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            </div>

                                            <p className="text-xs text-gray-700 text-center mb-1">
                                                Drag image(s) here or{" "}
                                                <span className="text-blue-600 font-medium">
                                                    Browse Images
                                                </span>
                                            </p>

                                            <p className="text-[10px] text-gray-400 text-center mt-2 max-w-xs leading-relaxed">
                                                You can upload images containing barcodes.
                                            </p>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => handleFiles(e.target.files)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarcodeScannerPage;
