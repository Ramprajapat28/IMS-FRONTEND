import type { CategoryCount } from "../types";
import { useMemo } from "react";

interface InventoryChartProps {
  categories?: CategoryCount[];
}

const COLORS = ["#FF9F43", "#E8590C", "#102E4A", "#28C76F", "#EA5455", "#7367F0"];

const InventoryByCategory = ({ categories = [] }: InventoryChartProps) => {
  const total = useMemo(() => categories.reduce((acc, item) => acc + item.total_products, 0), [categories]);

  // Assign colors to all categories first to ensure consistency between list and chart
  const categoriesWithColors = useMemo(() => {
    return categories.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length]
    }));
  }, [categories]);

  // Prepare data with percentages and angles for the chart (only > 0)
  const chartData = useMemo(() => {
    let cumulative = 0;
    return categoriesWithColors
      .filter(c => c.total_products > 0)
      .map((item) => {
        const count = item.total_products;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        const angle = total > 0 ? (count / total) * 360 : 0;

        const startAngle = cumulative;
        cumulative += angle;

        return {
          ...item,
          percentage,
          angle,
          startAngle,
          centerAngleRad: ((startAngle + angle / 2) * Math.PI) / 180
        };
      });
  }, [categoriesWithColors, total]);

  const RADIUS = 70;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  return (
    <div className="bg-white rounded-xl border w-full h-full p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
          {/* Simple Icon placeholder if lucide not avail, but it was there before */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
        </div>
        <h2 className="font-semibold text-gray-800 text-lg">
          Inventory By Sub Category
        </h2>
      </div>

      {/* CHART SECTION */}
      <div className="bg-blue-50/50 rounded-2xl p-8 flex justify-center relative mb-8">
        <div className="relative w-[220px] h-[220px]">
          <svg width="220" height="220" viewBox="0 0 220 220" className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="110"
              cy="110"
              r={RADIUS}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="26"
            />

            {/* Segments */}
            {chartData.map((item) => {
              // Logic for rounded caps with gaps
              // We want a visual gap between segments.
              // Visual Length = DashArray + StrokeWidth (due to round caps)
              // We want Visual Length = ArcLength - Gap
              // So DashArray = ArcLength - Gap - StrokeWidth

              const STROKE_WIDTH = 30;
              const GAP_PX = 2; // Desired visual gap in pixels

              const arcLength = (item.percentage / 100) * CIRCUMFERENCE;

              // If segment is too small, fallback
              if (arcLength <= 0) return null;

              let dashValue = arcLength - GAP_PX - STROKE_WIDTH;
              if (dashValue < 0) dashValue = 0.1; // Minimal dot

              const gapValue = CIRCUMFERENCE - dashValue;

              // Calculate offset to center the segment in its sector
              // effectively shifting start by (GAP_PX/2 + STROKE_WIDTH/2)
              const shift = (GAP_PX / 2) + (STROKE_WIDTH / 2);
              const originalOffset = - (item.startAngle / 360) * CIRCUMFERENCE;
              const finalOffset = originalOffset - shift;

              return (
                <circle
                  key={item.category_id}
                  cx="110"
                  cy="110"
                  r={RADIUS}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={`${dashValue} ${gapValue}`}
                  strokeDashoffset={finalOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Bubbles - Absolute positioning over the SVG */}
          {chartData.map((item) => {
            const visualAngleRaw = item.startAngle + item.angle / 2 - 90;
            const rad = (visualAngleRaw * Math.PI) / 180;
            const bubbleR = 85;

            const x = 110 + bubbleR * Math.cos(rad);
            const y = 110 + bubbleR * Math.sin(rad);

            return (
              <div
                key={item.category_id}
                className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-xs font-bold text-gray-600 z-10 transition-all hover:scale-110"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {Math.round(item.percentage)}%
              </div>
            )
          })}
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-gray-400">
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
            <p className="text-gray-600 text-sm">No categories available</p>
          </div>
        ) : (
          categoriesWithColors.map((item) => (
            <div key={item.category_id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 font-medium capitalize">{item.category_name}</span>
              </div>
              <span className="font-bold text-gray-800">{item.total_products}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryByCategory;
