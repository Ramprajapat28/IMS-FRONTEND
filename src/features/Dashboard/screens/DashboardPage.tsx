import { useState, useEffect } from "react";
import StatsCards from "../components/StatsCards";
import InventoryChart from "../components/InventoryChart";
import RecentActivity from "../components/RecentActivity";
import SellingCard from "../components/SellingCard";
// import FilterSelect from "../components/FilterSelect";
// import StockAlerts from "../components/StockAlerts";
import { dashboardApi } from "../api/dashboard.api";
import type { SellingProduct, StockStatusCounts, CategoryCount } from "../types";

const Dashboard = () => {
  // const [month, setMonth] = useState("Month");
  // const [year, setYear] = useState("Year");
  const [topSelling, setTopSelling] = useState<SellingProduct[]>([]);
  const [leastSelling, setLeastSelling] = useState<SellingProduct[]>([]);

  const [stockCounts, setStockCounts] = useState<StockStatusCounts>({ low_stock_products: 0, out_of_stock_products: 0 });
  // const [stockAlerts, setStockAlerts] = useState<StockProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [topRes, leastRes, stockRes, totalProdRes, totalOrdRes, categoryRes] = await Promise.all([
          dashboardApi.getTopSelling(),
          dashboardApi.getLeastSelling(),
          dashboardApi.getStockStatus(),
          dashboardApi.getTotalProducts(),
          dashboardApi.getTotalOrders(),
          dashboardApi.getCategoryCount(),
        ]);

        if (topRes.success && topRes.data) setTopSelling(topRes.data);
        if (leastRes.success && leastRes.data) setLeastSelling(leastRes.data);
        if (stockRes.success && stockRes.data?.stock_status) {
          setStockCounts(stockRes.data.stock_status);
          // setStockAlerts(stockRes.data.products);
        }
        if (totalProdRes.success && totalProdRes.data) setTotalProducts(totalProdRes.data.totalProducts);
        if (totalOrdRes.success && totalOrdRes.data) setTotalOrders(totalOrdRes.data.totalOrder);

        console.log("Category Response:", categoryRes);
        if (categoryRes.success && categoryRes.data) {
          console.log("Setting category counts:", categoryRes.data);
          setCategoryCounts(categoryRes.data);
        } else {
          console.error("Failed to load category counts", categoryRes);
        }

      } catch (err) {
        console.error("Failed to fetch dashboard analytics:", err);
      }
    };

    fetchAnalytics();
  }, []);

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

        {/* <div className="flex gap-3">
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
        </div> */}
      </div>

      {/* STATS */}
      <StatsCards
        totalProducts={totalProducts}
        lowStockCount={stockCounts.low_stock_products}
        outOfStockCount={stockCounts.out_of_stock_products}
        totalOrders={totalOrders}
      />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <InventoryChart categories={categoryCounts} />

        {/* RIGHT */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <RecentActivity />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SellingCard title="Top Selling Products" type="top" products={topSelling} />
            <SellingCard title="Least Selling Products" type="least" products={leastSelling} />
            {/* <StockAlerts products={stockAlerts} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
