import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type CardType = "top" | "least";
type Trend = "up" | "down";

const SellingCard = ({ title, type }: { title: string; type: CardType }) => {
  const [date, setDate] = useState<Date | null>(null);
  const isTop = type === "top";

  return (
    <div className="bg-white rounded-xl border">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${isTop ? "bg-emerald-100" : "bg-orange-100"}`}
          >
            {isTop ? (
              <TrendingUp className="text-emerald-600" />
            ) : (
              <TrendingDown className="text-orange-600" />
            )}
          </div>
          <h2 className="font-semibold">{title}</h2>
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-4 py-1.5">
          <Calendar size={16} className="text-gray-500" />
          <DatePicker
            selected={date}
            onChange={(d: Date | null) => setDate(d)}
            dateFormat="dd MMM yyyy"
            placeholderText="Today"
            className="outline-none text-sm w-[110px]"
            popperPlacement="bottom-end"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="divide-y">
        <ProductRow trend="up" />
        <ProductRow trend={isTop ? "up" : "down"} />
        <ProductRow trend={isTop ? "up" : "down"} />
      </div>
    </div>
  );
};

export default SellingCard;

const ProductRow = ({ trend }: { trend: Trend }) => (
  <div className="flex gap-4 px-4 py-4">
    <img
      src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200"
      className="w-12 h-12 rounded-lg object-cover"
    />

    <div className="flex-1">
      <p className="font-medium">Charger Cable - Lighting</p>
      <p className="text-sm text-gray-500">
        $187 • 247 Units sold
      </p>

      <div className="mt-2">
        {trend === "up" ? (
          <span className="text-xs px-2 py-0.5 rounded border border-emerald-500 text-emerald-600">
            ↑ 25%
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded border border-red-500 text-red-600">
            ↓ 21%
          </span>
        )}
      </div>
    </div>
  </div>
);
