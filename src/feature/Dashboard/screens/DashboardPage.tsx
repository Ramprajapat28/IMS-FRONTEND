import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Orders",
        data: [12, 19, 8, 15, 22],
        backgroundColor: "#2563eb"
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Products", "Barcodes", "Orders", "Revenue"].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">{item}</p>
            <p className="text-2xl font-bold mt-1">{Math.floor(Math.random() * 500)}</p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-medium mb-4">Weekly Orders</h2>
        <Bar data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
