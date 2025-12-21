import { useState } from "react";
import StatsCards from "../components/StatsCards";
import InventoryChart from "../components/InventoryChart";
import RecentActivity from "../components/RecentActivity";
import SellingCard from "../components/SellingCard";
import FilterSelect from "../components/FilterSelect";

const Dashboard = () => {
  const [month, setMonth] = useState("Month");
  const [year, setYear] = useState("Year");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-gray-500">
            Here is the summary of overall data
          </p>
        </div>

        <div className="flex gap-3">
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

      {/* STATS */}
      <StatsCards />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <InventoryChart />

        {/* RIGHT */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <RecentActivity />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SellingCard title="Top Selling Products" type="top" />
            <SellingCard title="Least Selling Products" type="least" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
