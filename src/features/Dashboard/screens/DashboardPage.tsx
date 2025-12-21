// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// const Dashboard = () => {
//   const data = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//     datasets: [
//       {
//         label: "Orders",
//         data: [12, 19, 8, 15, 22],
//         backgroundColor: "#2563eb"
//       }
//     ]
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold">Dashboard</h1>

//       {/* KPI CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {["Products", "Barcodes", "Orders", "Revenue"].map((item, i) => (
//           <div key={i} className="bg-white p-4 rounded-xl shadow">
//             <p className="text-sm text-gray-500">{item}</p>
//             <p className="text-2xl font-bold mt-1">{Math.floor(Math.random() * 500)}</p>
//           </div>
//         ))}
//       </div>

//       {/* CHART */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="font-medium mb-4">Weekly Orders</h2>
//         <Bar data={data} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import StatsCards from "../components/StatsCards";
import InventoryChart from "../components/InventoryChart";
import RecentActivity from "../components/RecentActivity";
import { useState } from "react";
import FilterSelect from "../components/FilterSelect";
import SellingCard from "../components/SellingCard";

const Dashboard = () => {
  const [month, setMonth] = useState("Month");
  const [year, setYear] = useState("Year");
  return (
    <div className="flex bg-gray-50">
      {/* <Sidebar /> */}

      <main className="flex-1">
        {/* <Navbar /> */}

        <div className="p-6 space-y-6">
          <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="text-gray-500">
              Here is the summary of overall data
            </p>
            </div>
            <div className="flex gap-4">
            <FilterSelect
        value={month}
        onChange={setMonth}
        options={["Month", "January", "February", "March"]}
      />

      <FilterSelect
        value={year}
        onChange={setYear}
        options={["Year", "2023", "2024", "2025"]}
      />
          </div>
          </div>

          <StatsCards />

          {/* <div className="flex gap-6">
            <InventoryChart />
            <div className="flex-row gap-6">
            <RecentActivity />
            <div className="flex gap-3">
            <SellingCard
        title="Top Selling Products"
        type="top"
      />
      <SellingCard
        title="Least Selling Products"
        type="least"
      />
      </div>
      </div>
          </div> */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* LEFT */}
  <InventoryChart />

  {/* RIGHT */}
  <div className="flex flex-col gap-6 lg:col-span-2">
    <RecentActivity />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SellingCard title="Top Selling Products" type="top" />
      <SellingCard title="Least Selling Products" type="least" />
    </div>
  </div>
</div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
