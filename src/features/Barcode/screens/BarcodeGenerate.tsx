import React, { useState } from "react";
import {
  Camera,
  Upload,
  ScanLine,
  Search,
  Loader2,
  Hash
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const BarcodeGeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualSkuInput, setManualSkuInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleManualSearch = () => {
    if (!manualSkuInput.trim()) return;
    setIsLoading(true);
    // Navigate to scanner with the found SKU
    setTimeout(() => {
      navigate("/barcode/scanner", { state: { sku: manualSkuInput.trim(), mode: "camera" } });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 px-4 pb-4">
        <div className="bg-white rounded-2xl border shadow-sm p-6">

          {/* Top Actions: Manual Entry Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${showManualInput
                ? 'bg-blue-600 text-white hover:bg-blue-700 ring-4 ring-blue-500/10'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95'
                }`}
            >
              <Search size={18} />
              {showManualInput ? "Cancel Search" : "Manual Entry / Search SKU"}
            </button>
          </div>

          {/* Manual Input Field (Top) */}
          {showManualInput && (
            <div className="mb-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-4">
              <div className="max-w-2xl mx-auto">
                <label className="block text-[10px] font-black text-blue-900 mb-2.5 uppercase tracking-widest">
                  Quick Search by SKU ID
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Hash size={18} className="text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Type SKU (e.g. TS01, BK05...)"
                      value={manualSkuInput}
                      onChange={(e) => setManualSkuInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                      className="w-full bg-white border-2 border-blue-100 rounded-xl pl-11 pr-4 py-3.5 text-base font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-blue-200"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleManualSearch}
                    disabled={isLoading || !manualSkuInput.trim()}
                    className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-200 shadow-lg shadow-blue-500/20 flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Verify SKU"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Scan Area (Left) */}
            <div className="col-span-12 lg:col-span-8">
              <div className="h-[380px] w-full rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/[0.02] transition-colors pointer-events-none" />

                <h2 className="text-xs font-black text-gray-400 tracking-[0.2em] mb-10 uppercase">
                  CHOOSE AN OPTION TO SCAN
                </h2>

                <div className="flex flex-wrap justify-center gap-4">
                  {/* Open Camera */}
                  <button
                    onClick={() =>
                      navigate("/barcode/scanner", { state: { mode: "camera" } })
                    }
                    className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-blue-500 bg-white text-blue-600 text-sm font-bold
               hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-500/10 active:scale-95 transition-all min-w-[180px] justify-center"
                  >
                    <Camera className="w-5 h-5" />
                    Open Camera
                  </button>

                  <button
                    onClick={() =>
                      navigate("/barcode/scanner", { state: { mode: "upload" } })
                    }
                    className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-blue-500 bg-white text-blue-600 text-sm font-bold
               hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-500/10 active:scale-95 transition-all min-w-[180px] justify-center"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </button>
                </div>
              </div>
            </div>

            {/* QR Section (Right) */}
            <div className="col-span-12 lg:col-span-4">
              <div className="h-[380px] rounded-2xl border border-gray-100 flex flex-col items-center justify-center px-6 text-center bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/10" />
                <p className="text-[10px] text-blue-600 font-black tracking-widest mb-2 uppercase">
                  Mobile Device Link
                </p>
                <p className="text-xl font-bold tracking-tight text-gray-900 mb-8">
                  SCAN THE QR BELOW
                </p>

                {/* QR Box */}
                <div className="w-44 h-44 border-2 border-gray-50 rounded-3xl flex items-center justify-center shadow-inner mb-6 bg-gray-50/30 group">
                  <ScanLine className="w-20 h-20 text-gray-200 group-hover:text-blue-200 transition-colors duration-500" />
                </div>

                <a
                  href="#"
                  className="text-xs text-blue-500/60 font-medium hover:text-blue-500 border-b border-transparent hover:border-blue-500 transition-all"
                >
                  www.ims-fitistan.com/barcode-scanner
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGeneratePage;
