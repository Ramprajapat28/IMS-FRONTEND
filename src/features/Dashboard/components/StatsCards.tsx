import totalProduct from "../../../assets/totalProduct.png";
import lowStock from "../../../assets/lowStock.png";
import outOfStock from "../../../assets/outOfStock.png";
import totalOrder from "../../../assets/totalOrder.png";

interface StatsCardsProps {
  totalProducts?: number;
  lowStockCount?: number;
  outOfStockCount?: number;
  totalOrders?: number; // Kept for now, even if not fully dynamic yet
}

const StatsCards = ({ totalProducts = 0, lowStockCount = 0, outOfStockCount = 0, totalOrders = 0 }: StatsCardsProps) => {

  const stats = [
    { title: "Total Products", value: totalProducts, image: totalProduct },
    { title: "Low Stock", value: lowStockCount, image: lowStock },
    { title: "Out Of Stock", value: outOfStockCount, image: outOfStock },
    { title: "Total Orders", value: totalOrders, image: totalOrder },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white p-4 rounded-xl border flex items-center gap-3"
        >
          <img
            src={item.image}
            className="w-12 h-12 object-contain"
          />
          <div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-xl font-bold">{item.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
