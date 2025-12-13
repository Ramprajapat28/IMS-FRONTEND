import { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const BarcodeGenerate = () => {
  const [value, setValue] = useState("");
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (value && svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: false
      });
    }
  }, [value]);

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Barcode Generator</h1>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter SKU / Code"
        className="w-full border px-4 py-2 rounded-lg"
      />

      <div className="bg-white p-4 rounded-xl shadow">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default BarcodeGenerate;
