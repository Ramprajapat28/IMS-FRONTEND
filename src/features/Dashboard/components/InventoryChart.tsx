import { ShoppingCart } from "lucide-react";
// import FilterSelect from "./FilterSelect";
// import { useState } from "react";

const InventoryByCategory = () => {
    // const [week, setWeek] = useState("Week");
  return (
    <div className="bg-white rounded-xl border w-full max-w-md">
      {/* HEADER */}
      <div className="flex items-center justify-between px-2 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
            <ShoppingCart className="text-pink-500" size={20} />
          </div>
          <h2 className="font-semibold text-gray-800">
            Inventory By Category
          </h2>
        </div>
        <div className="flex px-2 py-1.5">
        {/* <FilterSelect
        value={week}
        onChange={setWeek}
        options={["Week", "Monday", "Tuesday", "Wednesday","Thusday", "Friday", "Saturday", "Sunday"]}
      /> */}
      </div>
      </div>

      {/* CHART CONTAINER */}
      <div className="p-5">
        <div className="bg-gray-50 rounded-xl flex items-center justify-center py-6 relative">
          {/* DONUT CHART */}
          <svg width="220" height="220" viewBox="0 0 220 220">
            <g transform="translate(110,110)">
              {/* BASE */}
              <circle
                r="70"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="26"
              />

              {/* 50% */}
              <circle
                r="70"
                fill="none"
                stroke="#FFA24A"
                strokeWidth="26"
                strokeDasharray="219.9 439.8"
                strokeDashoffset="0"
                strokeLinecap="round"
              />

              {/* 24% */}
              <circle
                r="70"
                fill="none"
                stroke="#E8590C"
                strokeWidth="26"
                strokeDasharray="105.5 439.8"
                strokeDashoffset="-230"
                strokeLinecap="round"
              />

              {/* 16% */}
              <circle
                r="70"
                fill="none"
                stroke="#0B2C48"
                strokeWidth="26"
                strokeDasharray="70.3 439.8"
                strokeDashoffset="-350"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* PERCENTAGE BUBBLES */}
          <Bubble text="16%" className="top-14 left-1/3 -translate-x-1/2" />
          <Bubble text="24%" className="right-20 top-1/4 -translate-y-1/2" />
          <Bubble text="50%" className="left-15 bottom-10" />
        </div>

        {/* CATEGORY LIST */}
        <div className="mt-6 space-y-3">
          <CategoryItem color="bg-blue-600" label="T-shirts" value="698" />
          <CategoryItem color="bg-orange-500" label="Bottle" value="7899" />
          <CategoryItem color="bg-orange-500" label="Bottle" value="7899" />
          <CategoryItem color="bg-orange-500" label="Bottle" value="7899" />
        </div>
      </div>
    </div>
  );
};

export default InventoryByCategory;
const Bubble = ({
  text,
  className,
}: {
  text: string;
  className: string;
}) => (
  <div
    className={`absolute bg-white text-gray-700 text-sm font-medium
      px-3 py-1 rounded-full shadow ${className}`}
  >
    {text}
  </div>
);

const CategoryItem = ({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between border rounded-lg px-4 py-3">
    <div className="flex items-center gap-3">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
);
