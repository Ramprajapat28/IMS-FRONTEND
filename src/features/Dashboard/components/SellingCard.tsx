import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import React from "react";
type CustomInputProps = {
  value?: string;
  onClick?: () => void;
};

type CardType = "top" | "least";

const SellingCard = ({ title, type }: { title: string; type: CardType }) => {
    const [date, setDate] = useState<Date | null>(new Date());
    const isTop = type === "top";

  return (
    <div className="bg-white rounded-xl border w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${isTop ? "bg-emerald-100" : "bg-orange-100"}`}
          >
            {isTop ? (
              <TrendingUp className="text-emerald-600" size={20} />
            ) : (
              <TrendingDown className="text-orange-600" size={20} />
            )}
          </div>

          <h2 className="font-semibold text-gray-800">
            {title}
          </h2>
        </div>

        <button className="flex items-center gap-2 text-sm border rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-100">
          <Calendar size={20} />
          <DatePicker
        selected={date}
        onChange={(d: Date | null) => setDate(d)}
        dateFormat="dd MMM yyyy"
        // customInput={<DateInput />}
        className="
          w-full border border-gray-300 rounded-lg
          px-4 py-2 pr-10 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-600
        "
        popperPlacement="bottom-end"
      />
        </button>
      </div>

      {/* LIST */}
      <div className="divide-y">
        <ProductRow trend={isTop ? "up" : "up"} />
        <ProductRow trend={isTop ? "up" : "down"} />
        <ProductRow trend={isTop ? "up" : "down"} />
      </div>
    </div>
  );
};
type Trend = "up" | "down";

export default SellingCard;

const ProductRow = ({ trend }: { trend: Trend }) => {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      {/* IMAGE */}
      <img
        src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200"
        alt="product"
        className="w-12 h-12 rounded-lg object-cover"
      />

      {/* INFO */}
      <div className="flex-1">
        <p className="font-medium text-gray-800">
          Charger Cable - Lighting
        </p>

        <p className="text-sm text-gray-500 mt-0.5">
          $187 <span className="mx-1 text-xl text-emerald-400">•</span> 247 Units sold
        </p>

        {/* BADGE */}
        <div className="mt-2">
          {trend === "up" ? (
            <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border border-emerald-500 text-emerald-600">
              ↑ 25%
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border border-red-500 text-red-600">
              ↓ 21%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
const DateInput = React.forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ value, onClick }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className="
        w-full flex items-center justify-between
        border border-gray-300 rounded-lg
        px-4 py-2 text-sm
        bg-white hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-blue-600
      "
    >
      <span className={value ? "text-gray-900" : "text-gray-500"}>
        {value || "Today"}
      </span>
    </button>
  )
);

DateInput.displayName = "DateInput";