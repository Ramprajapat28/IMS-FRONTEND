import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { X, Printer, Check, Minus, Plus } from "lucide-react";
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

// Sticker sheet: 2 columns of 6cm×4cm stickers, sheet is 12cm wide
const STICKER_W = "6cm";
const STICKER_H = "4cm";
const COLS = 2;

const BulkBarcodePrintModal: React.FC<BulkBarcodePrintModalProps> = ({ isOpen, onClose, products }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(2);
    // qty per product — map from sku to quantity
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Bulk-Barcodes-${new Date().getTime()}`,
    });

    if (!isOpen) return null;

    const getQty = (sku: string) => quantities[sku] ?? 1;

    const setQty = (sku: string, val: number) => {
        setQuantities(prev => ({ ...prev, [sku]: Math.max(1, Math.min(99, val)) }));
    };

    const resolveUrl = (image: any): string => {
        if (!image) return "";
        if (typeof image === "object") return image.file_path || image.cdnUrl || image.url || "";
        if (typeof image === "string") {
            if (image.startsWith("{") || image.startsWith("[")) {
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

    // Expand products by quantity — e.g. qty=3 means 3 copies of that label
    const expandedLabels = products.flatMap(p => Array(getQty(p.sku)).fill(p));
    const totalLabels = expandedLabels.length;
    const rows = Math.ceil(totalLabels / COLS);

    const LabelCell = ({ product }: { product: ProductData }) => {
        const barcodeUrl = resolveUrl(product.barcode_image);
        return (
            <div
                className="printable-label"
                style={{
                    width: STICKER_W,
                    height: STICKER_H,
                    fontFamily: "monospace",
                    padding: "3mm",
                    boxSizing: "border-box",
                    breakInside: "avoid",
                    pageBreakInside: "avoid",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    overflow: "hidden",
                }}
            >
                {selectedTemplate >= 2 && (
                    <p style={{ margin: "0 0 1px 0", fontSize: "8px", fontWeight: "bold", textTransform: "uppercase", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {product.name}
                    </p>
                )}
                {barcodeUrl ? (
                    <img
                        src={barcodeUrl}
                        alt="Barcode"
                        style={{ width: "100%", height: "auto", maxHeight: "2cm", objectFit: "contain" }}
                    />
                ) : (
                    <div style={{ height: "2cm", width: "100%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#999" }}>
                        No Barcode
                    </div>
                )}
                <p style={{ margin: "1px 0 0 0", fontSize: "9px", fontWeight: "bold" }}>{product.sku}</p>
                <div style={{ display: "flex", gap: "6px" }}>
                    {selectedTemplate >= 3 && (
                        <p style={{ margin: 0, fontSize: "7px", fontWeight: "bold", textDecoration: selectedTemplate === 4 ? "line-through" : "none", color: selectedTemplate === 4 ? "#aaa" : "inherit" }}>
                            MRP: {formatCurrency(product.mrp || 0)}
                        </p>
                    )}
                    {selectedTemplate === 4 && (
                        <p style={{ margin: 0, fontSize: "7px", fontWeight: "bold" }}>
                            SALE: {formatCurrency(product.discounted_price || 0)}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2">
                        <Printer className="text-blue-600" size={20} />
                        <h2 className="text-lg font-bold text-gray-800">Bulk Print Barcode Labels</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left panel: template + quantities */}
                    <div className="space-y-5 lg:col-span-1">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Template</p>
                            <div className="grid grid-cols-1 gap-2">
                                {templates.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t.id)}
                                        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between ${selectedTemplate === t.id ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-blue-200 bg-white"}`}
                                    >
                                        <div>
                                            <p className={`font-bold text-sm ${selectedTemplate === t.id ? "text-blue-700" : "text-gray-700"}`}>{t.name}</p>
                                            <p className="text-xs text-gray-400">{t.description}</p>
                                        </div>
                                        {selectedTemplate === t.id && (
                                            <div className="bg-blue-600 text-white p-1 rounded-full"><Check size={12} /></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity per product */}
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Quantity per Label</p>
                            <div className="space-y-2">
                                {products.map((p) => (
                                    <div key={p.sku} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                                        <p className="text-xs text-gray-700 font-medium truncate max-w-[120px]" title={p.name}>{p.name}</p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setQty(p.sku, getQty(p.sku) - 1)}
                                                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <input
                                                type="number"
                                                min={1} max={99}
                                                value={getQty(p.sku)}
                                                onChange={(e) => setQty(p.sku, parseInt(e.target.value) || 1)}
                                                className="w-10 text-center text-sm font-bold border rounded-lg py-0.5 outline-none focus:border-blue-400"
                                            />
                                            <button
                                                onClick={() => setQty(p.sku, getQty(p.sku) + 1)}
                                                className="w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-700 transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700 space-y-0.5">
                                <p>Total labels: <strong>{totalLabels}</strong></p>
                                <p>Rows on sheet: <strong>{rows}</strong> (2 per row)</p>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-2 flex flex-col items-center">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Print Preview</p>
                        <div className="bg-gray-100 rounded-2xl p-4 w-full flex items-start justify-center border-2 border-dashed border-gray-300 overflow-auto max-h-[460px]">
                            <div
                                ref={printRef}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${COLS}, ${STICKER_W})`,
                                    gap: "0",
                                    margin: "0",
                                    padding: "0",
                                    width: "fit-content",
                                    border: "1px dashed #ccc",
                                }}
                            >
                                {expandedLabels.map((product, idx) => (
                                    <LabelCell key={`${product.sku}-${idx}`} product={product} />
                                ))}
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 italic">
                            {totalLabels} labels — {rows} rows × 2 cols — sticker: 6cm × 4cm
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-white transition-all text-gray-700">
                        Cancel
                    </button>
                    <button
                        onClick={() => handlePrint()}
                        className="flex-[2] px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                    >
                        <Printer size={18} />
                        Print {totalLabels} Labels
                    </button>
                </div>
            </div>

            <style>{`
                @media print {
                    @page {
                        margin: 0 !important;
                        size: 12cm auto;
                    }
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .printable-label {
                        border: none !important;
                        width: 6cm !important;
                        height: 4cm !important;
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BulkBarcodePrintModal;
