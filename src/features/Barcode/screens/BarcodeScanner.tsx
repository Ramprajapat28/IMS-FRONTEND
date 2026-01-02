import React, { useEffect, useRef, useState } from "react";
import {
    X,
    Package,
    Tag,
    Ruler,
    Hash,
    Image as ImageIcon,
    // Check,
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
            sku: "IMG-UPLOAD-001",
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
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* RIGHT PANEL — FIRST ON MOBILE */}
                    <div
                        className={`order-1 lg:order-2 lg:col-span-4 transition-all duration-300
    ${sold ? "h-0 w-0 opacity-0 overflow-hidden" : "h-auto w-auto opacity-100"}
  `}
                    >
                        <div className="h-[460px] rounded-xl border relative overflow-hidden">

                            {/* CAMERA MODE */}
                            {mode === "camera" && !sold && (
                                <div className="h-full bg-black relative">
                                    <button
                                        onClick={() => {
                                            controlsRef.current?.stop();
                                            navigate(-1);
                                        }}
                                        className="absolute top-3 right-3 z-10 bg-white rounded-full p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <video
                                        ref={videoRef}
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                                        <p className="font-semibold">SCAN THE BARCODE</p>
                                        <p className="text-xs text-gray-200 mb-4">
                                            Line up the barcode inside the red corners.
                                        </p>
                                        <div className="border-2 border-red-500 w-56 h-24" />
                                        <p className="text-xs mt-3 opacity-80">Scanning…</p>
                                    </div>
                                </div>
                            )}

                            {/* UPLOAD MODE */}
                            {mode === "upload" && !sold && (
                                <div className="h-full flex flex-col items-center justify-center px-6 text-center relative">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="absolute top-3 right-3 bg-gray-200 rounded-full p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        className={`w-full border-2 border-dashed rounded-xl p-6 cursor-pointer transition
                      flex flex-col items-center justify-center
                      ${dragActive
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        <ImageIcon className="mb-3 text-gray-400" />

                                        <p className="text-sm text-gray-700">
                                            Drag image(s) here or{" "}
                                            <span className="text-blue-600 font-medium">
                                                Browse Images
                                            </span>
                                        </p>

                                        <p className="text-xs text-gray-400 mt-2">
                                            PNG, JPG up to 5 MB
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

                    {/* PRODUCT INFO / SUCCESS */}
                    <div className={`order-2 lg:order-1 lg:col-span-8 ${sold ? "lg:col-span-12 col-span-1" : "lg:col-span-8 col-span-1"}`}>
                        <div className="min-h-[460px] max-h-[800px] lg:h-[460px] rounded-xl border overflow-hidden">


                            {!sold && (
                                <div className="bg-gray-100 px-4 py-3 font-semibold">
                                    Product Information
                                </div>
                            )}

                            {!product && !sold && (
                                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                    The result will appear here
                                </div>
                            )}
                            {product && !sold && (
                                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

                                    {/* LEFT DETAILS */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <img
                                            src={product.image}
                                            alt="Product"
                                            className="w-28 h-36 sm:w-32 sm:h-40 rounded-md border object-cover"
                                        />
                                        <div className="space-y-4">
                                            <InfoRow icon={<Package />} label="Product Name" value={product.name} />
                                            <InfoRow icon={<Tag />} label="Category" value={product.category} />
                                            <InfoRow icon={<Ruler />} label="Size" value={product.size} />
                                            <InfoRow icon={<Hash />} label="SKU" value={product.sku} />
                                        </div>
                                    </div>

                                    {/* RIGHT FORM */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium mb-1">
                                                1. Select Location :
                                            </p>

                                            <label className="text-xs text-gray-500">
                                                Warehouse <span className="text-red-500">*</span>
                                            </label>
                                            <select className="w-full border rounded-md px-3 py-2 text-sm mb-2">
                                                <option>Select Warehouse</option>
                                            </select>

                                            <label className="text-xs text-gray-500">
                                                Room <span className="text-red-500">*</span>
                                            </label>
                                            <select className="w-full border rounded-md px-3 py-2 text-sm mb-2">
                                                <option>Select Room</option>
                                            </select>

                                            <label className="text-xs text-gray-500">
                                                Shelf <span className="text-red-500">*</span>
                                            </label>
                                            <select className="w-full border rounded-md px-3 py-2 text-sm">
                                                <option>Select Shelf</option>
                                            </select>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium mb-1">
                                                2. Select mode of selling :
                                            </p>
                                            <div className="flex gap-4 text-sm">
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" checked readOnly />
                                                    Online
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" />
                                                    Offline
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSold(true)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ml-auto block"
                                        >
                                            Sell
                                        </button>
                                    </div>
                                </div>
                            )}

                            {sold && (
                                <ProductSoldSuccess />
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

/* ---------------- Reusable Info Row ---------------- */

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex gap-3">
        <div className="bg-blue-50 p-2 rounded-full text-blue-600">
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
        </div>
    </div>
);

export default BarcodeScannerPage;
