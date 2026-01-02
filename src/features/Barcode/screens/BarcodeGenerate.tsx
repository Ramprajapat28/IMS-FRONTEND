import React from "react";
import {
  // ArrowLeft,
  Camera,
  Upload,
  ScanLine,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const BarcodeScannerPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="bg-white rounded-2xl border shadow-sm px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Scan Area (Left) */}
          <div className="col-span-12 lg:col-span-8">
            <div className="h-[420px] w-full rounded-xl border bg-gray-100 flex flex-col items-center justify-center">
              <h2 className="text-base font-semibold text-gray-800 tracking-wide mb-8">
                CHOOSE AN OPTION TO SCAN
              </h2>

              <div className="flex gap-6">
                {/* Open Camera */}
                <button
                  onClick={() =>
                    navigate("/barcode/scanner", { state: { mode: "camera" } })
                  }
                  className="flex items-center gap-2 px-6 py-3 mx-2 rounded-lg border border-blue-500 bg-white text-sm font-medium
             hover:bg-blue-50 transition"
                >
                  <Camera className="w-4 h-4" />
                  Open Camera
                </button>

                <button
                  onClick={() =>
                    navigate("/barcode/scanner", { state: { mode: "upload" } })
                  }
                  className="flex items-center gap-2 px-6 py-3 mx-2 rounded-lg border border-blue-500 bg-white text-sm font-medium
             hover:bg-blue-50 transition"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>

              </div>
            </div>
          </div>

          {/* QR Section (Right) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="h-[420px] rounded-xl border flex flex-col items-center justify-center px-6 text-center">
              <p className="text-sm text-blue-600 font-medium mb-1">
                To use your Mobile Device,
              </p>
              <p className="text-lg font-semibold tracking-wide mb-6">
                SCAN THE QR BELOW
              </p>

              {/* QR Box */}
              <div className="w-40 h-40 border rounded-xl flex items-center justify-center shadow-sm mb-5 bg-white">
                <ScanLine className="w-16 h-16 text-gray-400" />
              </div>

              <a
                href="#"
                className="text-sm text-gray-500 underline break-all"
              >
                www.ims-fitistan.com/barcode-scanner
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerPage;
