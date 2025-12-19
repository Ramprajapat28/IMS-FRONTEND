const BarcodeHistory = () => {
  const history = ["SKU123", "SKU456", "SKU789"];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Barcode History</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((code, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{code}</td>
                <td className="p-3">Today</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarcodeHistory;
