import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { X, Printer, Check } from "lucide-react";
import { formatCurrency } from "@/utils";

interface ProductData {
    name: string;
    sku: string;
    barcode_image?: any;
    mrp?: number;
    discounted_price?: number;
    size?: string;
}

interface BulkBarcodePrintModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: ProductData[];
}

const templates = [
    { id: 1, name: "Only Barcode", description: "Clean barcode view" },
    { id: 2, name: "Standard", description: "Name + SKU + Barcode" },
    { id: 3, name: "Retail", description: "Name + SKU + Barcode + MRP" },
    { id: 4, name: "Promo", description: "Name + SKU + Barcode + MRP + Discounted Price" },
];

const BulkBarcodePrintModal: React.FC<BulkBarcodePrintModalProps> = ({ isOpen, onClose, products }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(2);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Bulk-Barcodes-${new Date().getTime()}`,
    });

    if (!isOpen) return null;

    const resolveUrl = (image: any): string => {
        if (!image) return "";
        if (typeof image === 'object') {
            return image.file_path || image.cdnUrl || image.url || "";
        }
        if (typeof image === 'string') {
            if (image.startsWith('{') || image.startsWith('[')) {
                try {
                    const parsed = JSON.parse(image);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].file_path || parsed[0].url || "";
                    return parsed.file_path || parsed.url || "";
                } catch { return image; }
            }
            return image;
        }
        return "";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2">
                        <Printer className="text-blue-600" size={20} />
                        <h2 className="text-lg font-bold text-gray-800">Bulk Print Barcode Labels ({products.length})</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Options */}
                    <div className="space-y-4 lg:col-span-1">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Select Template</p>
                        <div className="grid grid-cols-1 gap-2">
                            {templates.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedTemplate === t.id
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-100 hover:border-blue-200 bg-white"
                                        }`}
                                >
                                    <div>
                                        <p className={`font-bold ${selectedTemplate === t.id ? "text-blue-700" : "text-gray-700"}`}>
                                            {t.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{t.description}</p>
                                    </div>
                                    {selectedTemplate === t.id && (
                                        <div className="bg-blue-600 text-white p-1 rounded-full">
                                            <Check size={14} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-2 flex flex-col items-center">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Print Preview</p>
                        <div className="bg-gray-100 rounded-2xl p-6 w-full flex items-center justify-center border-2 border-dashed border-gray-300 overflow-y-auto max-h-[500px]">
                            {/* This is the printable area */}
                            <div
                                ref={printRef}
                                className="bg-white p-4 shadow-sm flex flex-col gap-[0.1in] items-center"
                                style={{ width: "fit-content" }}
                            >
                                {products.map((product, idx) => {
                                    const barcodeUrl = resolveUrl(product.barcode_image);
                                    return (
                                        <div
                                            key={`${product.sku}-${idx}`}
                                            className="border border-gray-100 flex flex-col items-center justify-center text-center overflow-hidden printable-label"
                                            style={{
                                                width: "2in",
                                                height: "1in",
                                                fontFamily: "monospace",
                                                padding: "4px",
                                                pageBreakAfter: "always",
                                                marginBottom: "4px"
                                            }}
                                        >
                                            {selectedTemplate >= 2 && (
                                                <h3 className="text-[10px] font-bold uppercase truncate w-full mb-1" style={{ margin: "0 0 2px 0" }}>{product.name}</h3>
                                            )}

                                            {barcodeUrl ? (
                                                <img
                                                    src={barcodeUrl}
                                                    alt="Barcode"
                                                    className="w-full h-auto object-contain"
                                                    style={{ maxHeight: "0.45in", imageRendering: "pixelated" }}
                                                />
                                            ) : (
                                                <div className="h-6 w-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-400">No Barcode</div>
                                            )}
                                            <p className="text-[9px] font-bold" style={{ margin: "1px 0 0 0" }}>{product.sku}</p>

                                            <div className="flex gap-2">
                                                {selectedTemplate >= 3 && (
                                                    <p className={`text-[8px] font-bold ${selectedTemplate === 4 ? 'line-through text-gray-400' : ''}`} style={{ margin: 0 }}>
                                                        MRP: {formatCurrency(product.mrp || 0)}
                                                    </p>
                                                )}
                                                {selectedTemplate === 4 && (
                                                    <p className="text-[8px] font-bold text-black" style={{ margin: 0 }}>
                                                        SALE: {formatCurrency(product.discounted_price || 0)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-4 italic">Optimized for 2" x 1" labels. Scroll to see all.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-white transition-all text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handlePrint()}
                        className="flex-[2] px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                    >
                        <Printer size={18} />
                        Print {products.length} Labels
                    </button>
                </div>
            </div>

            <style>{`
                @media print {
                    @page {
                        margin: 0;
                        size: 2in 1in;
                    }
                    body {
                        margin: 0;
                    }
                    .printable-label {
                        border: none !important;
                        margin: 0 !important;
                        page-break-after: always !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BulkBarcodePrintModal;
