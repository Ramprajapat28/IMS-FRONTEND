import React, { useEffect, useRef, useState } from "react";
import {
    X,
    Tag,
    Hash,
    Image as ImageIcon,
    Edit3,
    ChevronDown,
} from "lucide-react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import ProductSoldSuccess from "./ProductSoldSuccess";

/* ---------------- Types ---------------- */

type Mode = "camera" | "upload";

interface ProductInfo {
    name: string;
    category: string;
    size: string;
    sku: string;
    image: string;
}

/* ---------------- Component ---------------- */

const BarcodeScannerPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const mode = (location.state?.mode as Mode) ?? "camera";

    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [product, setProduct] = useState<ProductInfo | null>(null);
    const [sold, setSold] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    /* ---------------- CAMERA SCAN ---------------- */
    useEffect(() => {
        if (mode !== "camera" || !videoRef.current || product) return;

        const reader = new BrowserMultiFormatReader();

        reader.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result, _err, controls) => {
                if (result) {
                    controlsRef.current = controls;

                    setProduct({
                        name: "Blue Jersey T-shirt",
                        category: "T-shirts",
                        size: "MEDIUM",
                        sku: result.getText(),
                        image: "https://via.placeholder.com/140x170.png",
                    });

                    controls.stop();
                }
            }
        );

        return () => {
            controlsRef.current?.stop();
        };
    }, [mode, product]);

    /* ---------------- IMAGE UPLOAD ---------------- */
    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const image = files[0];
        if (!image.type.startsWith("image/")) return;

        setProduct({
            name: "Blue Jersey T-shirt",
            category: "T-shirts",
            size: "MEDIUM",
            sku: "TS01-BL-M",
            image: URL.createObjectURL(image),
        });
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

    /* ---------------- CLEANUP IMAGE PREVIEW ---------------- */
    useEffect(() => {
        return () => {
            if (product?.image?.startsWith("blob:")) {
                URL.revokeObjectURL(product.image);
            }
        };
    }, [product]);

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

                                {!product && !sold && (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                                        The result will appear here
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
                                                                <img
                                                                    src={product.image}
                                                                    alt="Product"
                                                                    className="w-full h-full object-cover"
                                                                />
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
                                                                    <p className="text-sm font-medium text-gray-900">{product.category}</p>
                                                                </div>
                                                            </div>

                                                            {/* Size */}
                                                            <div className="flex items-start gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                                    <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <path d="M4 7h16M4 12h16M4 17h10"></path>
                                                                    </svg>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-[10px] text-gray-400 uppercase mb-0.5">Size</p>
                                                                    <p className="text-sm font-bold text-gray-900">{product.size}</p>
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
                                                        {/* Location Selection */}
                                                        <div>
                                                            <p className="text-sm font-semibold mb-2 text-gray-900">1. Select Location :</p>

                                                            <div className="space-y-1.5">
                                                                <div>
                                                                    <label className="text-[11px] text-gray-500 mb-1 block">
                                                                        Warehouse <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent">
                                                                            <option>Select Warehouse</option>
                                                                        </select>
                                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-center">
                                                                    <ChevronDown className="w-3 h-3 text-gray-300" />
                                                                </div>

                                                                <div>
                                                                    <label className="text-[11px] text-gray-500 mb-1 block">
                                                                        Room <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent">
                                                                            <option>Select Warehouse</option>
                                                                        </select>
                                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                    <p className="text-[10px] text-gray-400 mt-0.5">Select a warehouse first</p>
                                                                </div>

                                                                <div className="flex items-center justify-center">
                                                                    <ChevronDown className="w-3 h-3 text-gray-300" />
                                                                </div>

                                                                <div>
                                                                    <label className="text-[11px] text-gray-500 mb-1 block">
                                                                        Shelf <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent">
                                                                            <option>Select Warehouse</option>
                                                                        </select>
                                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                    <p className="text-[10px] text-gray-400 mt-0.5">Select a warehouse first</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Selling Mode */}
                                                        <div>
                                                            <p className="text-sm font-semibold mb-2 text-gray-900">2. Select mode of selling :</p>
                                                            <div className="flex gap-6">
                                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="selling-mode"
                                                                        defaultChecked
                                                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <span className="text-sm text-gray-900">Online</span>
                                                                </label>
                                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="selling-mode"
                                                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <span className="text-sm text-gray-900">Offline</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sell Button - Below boxes, inside container */}
                                            <div className="flex justify-end mt-3">
                                                <button
                                                    onClick={() => setSold(true)}
                                                    className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                                                >
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                                    </svg>
                                                    Sell
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {sold && (
                                    <ProductSoldSuccess />
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

                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
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
                                                You can upload up to 15 images, each not exceeding 5 MB in size and 7000 × 7000 pixels resolution.
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
