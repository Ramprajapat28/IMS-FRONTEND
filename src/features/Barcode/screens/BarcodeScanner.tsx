
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    X,
    Tag,
    Hash,
    Image as ImageIcon,
    Edit3,

    Loader2,
    Plus,
    Minus,
    Package,
    AlertCircle,
    Camera,
    FileText,
    Type
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
                let prod = res.data;

                if (prod.product_id) {
                    const detailRes = await productsApi.getDetails(prod.product_id);
                    if (detailRes.success && detailRes.data) {
                        prod = { ...prod, ...detailRes.data };
                        if (detailRes.data.stock_details) {
                            const availableStock = detailRes.data.stock_details.filter((s: any) => s.status === 'available');
                            setStockDetails(availableStock as any);
                        }
                    }
                }
                setProduct(prod);
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
        const formats = [BarcodeFormat.CODE_128];
        hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
        hints.set(DecodeHintType.TRY_HARDER, false);
        hints.set(DecodeHintType.ASSUME_GS1, false);

        return new BrowserMultiFormatReader(hints, {
            delayBetweenScanAttempts: 100, // Balanced speed for CODE_128
            delayBetweenScanSuccess: 500
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

    // Deep linking from Products page
    useEffect(() => {
        if (location.state?.sku) {
            fetchProductBySku(location.state.sku);
        }
    }, [location.state?.sku]);

    const isStartingRef = useRef(false);
    const lastScannedRef = useRef<string>("");
    const lastScanTimeRef = useRef<number>(0);

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

        if (product || !isCameraMode || !videoElement) {
            if (controlsRef.current) {
                console.log("Stopping camera (Product found or Mode changed)");
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

        const startCamera = async () => {
            if (!isMounted || isStartingRef.current) return;
            isStartingRef.current = true;

            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    aspectRatio: { ideal: 16 / 9 },
                    frameRate: { ideal: 30 },
                    // @ts-ignore
                    focusMode: 'continuous',
                    advanced: [{ focusMode: 'continuous' }]
                }
            } as unknown as MediaStreamConstraints;

            console.log("🎥 Starting enhanced barcode scanner...");

            try {
                const controls = await reader.decodeFromConstraints(
                    constraints,
                    videoElement,
                    (result) => {
                        if (result) {
                            const text = result.getText();
                            const now = Date.now();

                            if (
                                lastScannedRef.current === text &&
                                now - lastScanTimeRef.current < 3000
                            ) {
                                return;
                            }

                            if (isLoadingRef.current) {
                                return;
                            }

                            console.log("✅ Barcode detected:", text);
                            lastScannedRef.current = text;
                            lastScanTimeRef.current = now;
                            playBeep(true);

                            if (navigator.vibrate) {
                                navigator.vibrate([100, 50, 100]);
                            }

                            fetchProductBySku(text);
                        }
                    }
                );

                if (!isMounted) {
                    controls.stop();
                    isStartingRef.current = false;
                    return;
                }

                controlsRef.current = controls;
                isStartingRef.current = false;
                console.log("✅ Camera active - scanning at optimal efficiency");

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

            if (controlsRef.current) {
                console.log("🛑 Cleaning up camera");
                controlsRef.current.stop();
                controlsRef.current = null;
            }

            setTimeout(() => {
                isStartingRef.current = false;
            }, 500);
        };
    }, [mode, reader, product]);

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

    /* ---------------- DROPDOWN LOGIC (MEMOIZED) ---------------- */
    const uniqueWarehouses = useMemo(() => {
        return Array.from(new Set(stockDetails.map(s => s.warehouse_id)))
            .filter(id => id !== undefined && id !== null)
            .map(id => stockDetails.find(s => s.warehouse_id === id))
            .filter(x => x !== undefined);
    }, [stockDetails]);

    const uniqueRooms = useMemo(() => {
        if (!selectedWarehouseId) return [];
        return Array.from(new Set(stockDetails
            .filter(s => s.warehouse_id === Number(selectedWarehouseId))
            .map(s => s.room_id)))
            .filter(id => id !== undefined && id !== null)
            .map(id => stockDetails.find(s => s.room_id === id))
            .filter(x => x !== undefined);
    }, [selectedWarehouseId, stockDetails]);

    const uniqueShelves = useMemo(() => {
        if (!selectedRoomId) return [];
        return Array.from(new Set(stockDetails
            .filter(s => s.room_id === Number(selectedRoomId) && s.shelf_id)
            .map(s => s.shelf_id)))
            .map(id => stockDetails.find(s => s.shelf_id === id))
            .filter(x => x !== undefined);
    }, [selectedRoomId, stockDetails]);

    const uniqueRacks = useMemo(() => {
        if (!selectedRoomId) return [];
        return Array.from(new Set(stockDetails
            .filter(s => s.room_id === Number(selectedRoomId) && s.rack_id)
            .map(s => s.rack_id)))
            .map(id => stockDetails.find(s => s.rack_id === id))
            .filter(x => x !== undefined);
    }, [selectedRoomId, stockDetails]);

    const returnRoomsFiltered = useMemo(() => {
        if (!returnWarehouseId) return [];
        return allRooms.filter((r: any) => r.warehouse_id === Number(returnWarehouseId));
    }, [returnWarehouseId, allRooms]);

    const returnShelvesFiltered = useMemo(() => {
        if (!returnRoomId) return [];
        return allShelves.filter((s: any) => s.room_id === Number(returnRoomId));
    }, [returnRoomId, allShelves]);

    const returnRacksFiltered = useMemo(() => {
        if (!returnRoomId) return [];
        return allRacks.filter((r: any) => r.room_id === Number(returnRoomId));
    }, [returnRoomId, allRacks]);

    /* ---------------- AUTO-SELECT LOGIC ---------------- */
    // Sell Mode Auto-select
    useEffect(() => {
        if (!isReturnMode && uniqueWarehouses.length === 1 && !selectedWarehouseId) {
            setSelectedWarehouseId(Number(uniqueWarehouses[0]?.warehouse_id));
        }
    }, [uniqueWarehouses, isReturnMode, selectedWarehouseId]);

    useEffect(() => {
        if (!isReturnMode && selectedWarehouseId && uniqueRooms.length === 1 && !selectedRoomId) {
            setSelectedRoomId(Number(uniqueRooms[0]?.room_id));
        }
    }, [uniqueRooms, selectedWarehouseId, isReturnMode, selectedRoomId]);

    useEffect(() => {
        if (!isReturnMode && selectedRoomId && storageType === 'shelf' && uniqueShelves.length === 1 && !selectedShelfId) {
            setSelectedShelfId(Number(uniqueShelves[0]?.shelf_id));
        }
        if (!isReturnMode && selectedRoomId && storageType === 'rack' && uniqueRacks.length === 1 && !selectedRackId) {
            setSelectedRackId(Number(uniqueRacks[0]?.rack_id));
        }
    }, [uniqueShelves, uniqueRacks, selectedRoomId, storageType, isReturnMode, selectedShelfId, selectedRackId]);

    // Return Mode Auto-select
    useEffect(() => {
        if (isReturnMode && allWarehouses.length === 1 && !returnWarehouseId) {
            setReturnWarehouseId(Number(allWarehouses[0]?.warehouse_id));
        }
    }, [allWarehouses, isReturnMode, returnWarehouseId]);

    useEffect(() => {
        if (isReturnMode && returnWarehouseId && returnRoomsFiltered.length === 1 && !returnRoomId) {
            setReturnRoomId(Number(returnRoomsFiltered[0]?.room_id));
        }
    }, [returnRoomsFiltered, returnWarehouseId, isReturnMode, returnRoomId]);

    useEffect(() => {
        if (isReturnMode && returnRoomId && storageType === 'shelf' && returnShelvesFiltered.length === 1 && !returnShelfId) {
            setReturnShelfId(Number(returnShelvesFiltered[0]?.shelf_id));
        }
        if (isReturnMode && returnRoomId && storageType === 'rack' && returnRacksFiltered.length === 1 && !returnRackId) {
            setReturnRackId(Number(returnRacksFiltered[0]?.rack_id));
        }
    }, [returnShelvesFiltered, returnRacksFiltered, returnRoomId, storageType, isReturnMode, returnShelfId, returnRackId]);

    /* ---------------- UI ---------------- */

    if (sold) {
        return <ProductSoldSuccess message={successMessage} onClose={resetScanner} />;
    }

    return (
        <div className="min-h-screen md:min-h-[80%] bg-gray-50 flex flex-col">
            <Header />

            <div className="flex-1">
                <div className="bg-white rounded-xl border shadow-sm p-3">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

                        {/* LEFT: CAMERA SCANNER (HIDDEN WHEN PRODUCT FOUND) */}
                        {!product && (
                            <div className="order-1 overflow-hidden lg:order-1 lg:col-span-8">
                                <div className="aspect-square sm:aspect-auto sm:min-h-[400px] lg:min-h-[700px] rounded-lg border flex flex-col bg-gray-900 overflow-hidden">
                                    <div className="bg-white border-b px-4 py-3 font-semibold text-gray-900 text-sm flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Camera size={18} className="text-gray-700" />
                                            Barcode Scanner
                                        </span>
                                    </div>


                                    {mode === "camera" && (
                                        <div className="flex-1 relative bg-black overflow-hidden">
                                            {!cameraError ? (
                                                <>
                                                    <video
                                                        ref={videoRef}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        autoPlay
                                                        muted
                                                        playsInline
                                                    />

                                                    {/* Scanning Overlay Matching Screenshot */}
                                                    <div className="absolute inset-0 pointer-events-none">
                                                        <div className="absolute inset-8">
                                                            <div className="relative w-full h-full border border-white/20 rounded-2xl overflow-hidden">
                                                                {/* Corner markers - RED and rounded */}
                                                                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-red-500 rounded-tl-2xl"></div>
                                                                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-red-500 rounded-tr-2xl"></div>
                                                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-red-500 rounded-bl-2xl"></div>
                                                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-red-500 rounded-br-2xl"></div>

                                                                {/* Red Scan line */}
                                                                {/* <div className="scan-line"></div> */}
                                                            </div>
                                                        </div>
                                                        {/* Scan Success Hint */}
                                                        {isLoading && (
                                                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-fit">
                                                                <div className="bg-green-500/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-green-400/50 whitespace-nowrap">
                                                                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                                                    <span className="text-white font-bold text-[10px] tracking-wider uppercase">Scan Success: Loading Product...</span>
                                                                </div>
                                                            </div>
                                                        )}
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
                                                className={`w-full max-w-md border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 bg-gray-50"
                                                    }`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                            >
                                                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                <p className="text-gray-700 font-semibold mb-2">Upload Barcode Image</p>
                                                <p className="text-gray-500 text-sm mb-4">
                                                    Drag & drop or click to upload<br />
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
                        )}

                        {/* RIGHT: PRODUCT INFO */}
                        <div className={`order-1 lg:order-1 ${product ? "md:col-span-12" : "hidden lg:block lg:col-span-4"}`}>


                            {!product && (
                                <>
                                    <div className="h-full  border rounded-lg ">
                                        <div className=" bg-gray-50 px-4 py-2 font-semibold border-b text-gray-900 text-sm">
                                            Product Information
                                        </div>
                                        <div className="flex-1 h-full  flex items-center justify-center text-gray-400 text-sm p-6">
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
                                    </div>
                                </>
                            )}


                            {product && (
                                <div className="flex-1 p-3">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                                        {/* Product Details Box */}
                                        <div className="border rounded-lg p-3 bg-white relative ">
                                            <button
                                                onClick={resetScanner}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-lg bg-blue-50 hover:bg-gray-100 z-10 transition"
                                                title="Clear and scan another"
                                            >
                                                <X size={20} />
                                            </button>

                                            <div className="flex gap-3 md:gap-8">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-24 h-28 md:w-32 md:h-36 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-50">
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
                                                <div className="flex-1 space-y-4 mt-2 ">
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <Edit3 className="w-3.5 h-3.5 text-gray-700" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[14px] text-gray-400 mb-0.5">Product Name</p>
                                                            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <Tag className="w-3.5 h-3.5 text-gray-700" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[14px] text-gray-400 uppercase mb-0.5">Category</p>
                                                            <p className="text-sm font-medium text-gray-900">{product.global_category_name || "-"}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <Tag className="w-3.5 h-3.5 text-gray-700" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[14px] text-gray-400 uppercase mb-0.5">Sub Category</p>
                                                            <p className="text-sm font-medium text-gray-900">{product.category_name || "-"}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <Hash className="w-3.5 h-3.5 text-gray-700" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[14px] text-gray-400 uppercase mb-0.5">SKU</p>
                                                            <p className="text-sm font-bold text-gray-900">{product.sku}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <FileText className="w-3.5 h-3.5 text-gray-700" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[14px] text-gray-400 uppercase mb-0.5">HSN Code</p>
                                                            <p className="text-sm font-medium text-gray-900">{product.hsn_code || "-"}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <Type className="w-3.5 h-3.5 text-gray-700" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[14px] text-gray-400 uppercase mb-0.5">Size</p>
                                                            <p className="text-sm font-medium text-gray-900">{product.size || "-"}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2 col-span-full">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                            <FileText className="w-3.5 h-3.5 text-gray-700" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[14px] text-gray-400 uppercase mb-0.5">Description</p>
                                                            <p className="text-sm text-gray-600 leading-relaxed">{product.description || "-"}</p>
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
                                                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${!isReturnMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        Sell
                                                    </button>
                                                    <button
                                                        onClick={() => setIsReturnMode(true)}
                                                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${isReturnMode ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                                                                    {uniqueWarehouses.length === 1 ? (
                                                                        <div className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-gray-50 text-gray-700 flex items-center justify-between h-[32px]">
                                                                            <span className="truncate">{uniqueWarehouses[0]?.warehouse_name}</span>
                                                                            <span className="ml-2 flex-shrink-0 text-[9px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase tracking-tighter font-bold">Auto</span>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <select
                                                                                className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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

                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Room */}
                                                            <div>
                                                                <label className="text-[11px] text-gray-500 mb-1 block">
                                                                    Room <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    {uniqueRooms.length === 1 ? (
                                                                        <div className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-gray-50 text-gray-700 flex items-center justify-between h-[32px]">
                                                                            <span className="truncate">{uniqueRooms[0]?.room_name}</span>
                                                                            <span className="ml-2 flex-shrink-0 text-[9px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase tracking-tighter font-bold">Auto</span>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <select
                                                                                className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
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

                                                                        </>
                                                                    )}
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
                                                                        className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${storageType === 'shelf' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
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
                                                                        className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${storageType === 'rack' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
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
                                                                        {uniqueShelves.length === 1 ? (
                                                                            <div className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-gray-50 text-gray-700 flex items-center justify-between h-[32px]">
                                                                                <span className="truncate">{uniqueShelves[0]?.shelf_name}</span>
                                                                                <span className="ml-2 flex-shrink-0 text-[9px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase tracking-tighter font-bold">Auto</span>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <select
                                                                                    className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
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

                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {storageType === 'rack' && (
                                                                <div>
                                                                    <label className="text-[11px] text-gray-500 mb-1 block">
                                                                        Rack <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        {uniqueRacks.length === 1 ? (
                                                                            <div className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-gray-50 text-gray-700 flex items-center justify-between h-[32px]">
                                                                                <span className="truncate">{uniqueRacks[0]?.rack_name}</span>
                                                                                <span className="ml-2 flex-shrink-0 text-[9px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase tracking-tighter font-bold">Auto</span>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <select
                                                                                    className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
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

                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-sm font-semibold text-gray-900 mt-3">2. Selling Details:</p>

                                                        {/* Selling Mode */}
                                                        <div className="w-[250px]">
                                                            <label className="text-[11px] text-gray-500 mb-1 block">Mode</label>
                                                            <div className="flex p-0.5 bg-gray-100 rounded-lg">
                                                                <button
                                                                    onClick={() => setSellingMode("Online")}
                                                                    className={`flex-1 px-3 py-1 text-[10px] font-medium rounded-md transition ${sellingMode === "Online" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                                                                        }`}
                                                                >
                                                                    Online
                                                                </button>
                                                                <button
                                                                    onClick={() => setSellingMode("Offline")}
                                                                    className={`flex-1 px-3 py-1 text-[10px] font-medium rounded-md transition ${sellingMode === "Offline" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                                                                        }`}
                                                                >
                                                                    Offline
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Quantity */}
                                                        <div className="w-[50px]">
                                                            <label className="text-[11px] text-gray-500 mb-1 block">Quantity</label>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => setQuantity(prev => Math.max(1, (Number(prev) || 1) - 1))}
                                                                    className="w- h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={quantity}
                                                                    onChange={(e) => setQuantity(Number(e.target.value) || "")}
                                                                    className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                                                            className="w-[200px] bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
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
                                                                    {allWarehouses.length === 1 ? (
                                                                        <div className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-gray-50 text-gray-700 flex items-center justify-between h-[32px]">
                                                                            <span className="truncate">{allWarehouses[0]?.name}</span>
                                                                            <span className="ml-2 flex-shrink-0 text-[9px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase tracking-tighter font-bold">Auto</span>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <select
                                                                                className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
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
                                                                                        {w.name || w.warehouse_name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>

                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Room */}
                                                            <div>
                                                                <label className="text-[11px] text-gray-500 mb-1 block">
                                                                    Room <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    {returnRoomsFiltered.length === 1 ? (
                                                                        <div className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-gray-50 text-gray-700 flex items-center justify-between h-[32px]">
                                                                            <span className="truncate">{returnRoomsFiltered[0]?.room_name || returnRoomsFiltered[0]?.name}</span>
                                                                            <span className="ml-2 flex-shrink-0 text-[9px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase tracking-tighter font-bold">Auto</span>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <select
                                                                                className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
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
                                                                                        {r.name || r.room_name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>

                                                                        </>
                                                                    )}
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
                                                                        className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${storageType === 'shelf' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
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
                                                                        className={`px-3 py-1 text-[10px] font-medium rounded-md transition ${storageType === 'rack' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
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
                                                                        {returnShelvesFiltered.length === 1 ? (
                                                                            <div className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-gray-50 text-gray-700 flex items-center justify-between h-[32px]">
                                                                                <span className="truncate">{returnShelvesFiltered[0]?.shelf_name || returnShelvesFiltered[0]?.name}</span>
                                                                                <span className="ml-2 flex-shrink-0 text-[9px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase tracking-tighter font-bold">Auto</span>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <select
                                                                                    className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                                                                                    value={returnShelfId}
                                                                                    onChange={(e) => setReturnShelfId(Number(e.target.value))}
                                                                                    disabled={!returnRoomId}
                                                                                >
                                                                                    <option value="">Select Shelf</option>
                                                                                    {returnShelvesFiltered.map((s: any) => (
                                                                                        <option key={s.shelf_id} value={s.shelf_id}>
                                                                                            {s.shelf_name || s.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>

                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {storageType === 'rack' && (
                                                                <div>
                                                                    <label className="text-[11px] text-gray-500 mb-1 block">
                                                                        Rack <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        {returnRacksFiltered.length === 1 ? (
                                                                            <div className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs bg-gray-50 text-gray-700 flex items-center justify-between h-[32px]">
                                                                                <span className="truncate">{returnRacksFiltered[0]?.rack_name || returnRacksFiltered[0]?.name}</span>
                                                                                <span className="ml-2 flex-shrink-0 text-[9px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded uppercase tracking-tighter font-bold">Auto</span>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <select
                                                                                    className="w-[250px] border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                                                                                    value={returnRackId}
                                                                                    onChange={(e) => setReturnRackId(Number(e.target.value))}
                                                                                    disabled={!returnRoomId}
                                                                                >
                                                                                    <option value="">Select Rack</option>
                                                                                    {returnRacksFiltered.map((r: any) => (
                                                                                        <option key={r.rack_id} value={r.rack_id}>
                                                                                            {r.rack_name || r.name}
                                                                                        </option>
                                                                                    ))}

                                                                                </select>

                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-sm font-semibold text-gray-900 mt-3">2. Return Quantity:</p>

                                                        {/* Quantity */}
                                                        <div>
                                                            <label className="text-[11px] text-gray-500 mb-1 block">Quantity</label>
                                                            <div className="flex w-[200px] items-center gap-2">
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
                                                            className="w-[200px] bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
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

            {/* Enhanced Scan Line Animation CSS */}
            <style>{`
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #ef4444, #ef4444, transparent);
                    box-shadow: 0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4);
                    animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                
                @keyframes scan {
                    0% { 
                        transform: translateY(0); 
                    }
                    50% {
                        transform: translateY(400%);
                    }
                    100% { 
                        transform: translateY(0); 
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
