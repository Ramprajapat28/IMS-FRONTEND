import totalProduct from "../../../assets/totalProduct.png"
import lowStock from "../../../assets/lowStock.png"
import outOfStock from "../../../assets/outOfStock.png"
import totalOrder from "../../../assets/totalOrder.png"
const stats = [
  { title: "Total Products", value: 300, image:totalProduct },
  { title: "Low Stock", value: 5, image:lowStock },
  { title: "Out Of Stock", value: 3, image:outOfStock },
  { title: "Total Orders", value: 100, image:totalOrder },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white p-5 rounded-xl border shadow-sm flex gap-2"
        >
            <img src={item.image} className="h-full w-half "/>
            <div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
            </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
