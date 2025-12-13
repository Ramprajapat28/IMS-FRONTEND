import { Line } from "react-chartjs-2";

const Reports = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [5000, 7000, 9000, 12000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        tension: 0.4,
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <div className="bg-white p-6 rounded-xl shadow h-[350px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Reports;
