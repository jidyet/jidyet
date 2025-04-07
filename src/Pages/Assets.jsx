import React, { useState } from "react";
import jsPDF from "jspdf";

const Assets = () => {
  const assets = [
    { symbol: "BTC", name: "Bitcoin", balance: 0.5421, usd: 32750 },
    { symbol: "ETH", name: "Ethereum", balance: 3.85, usd: 3025 },
    { symbol: "USDT", name: "Tether", balance: 1220, usd: 1 },
  ];

  const totalValue = assets.reduce((sum, asset) => sum + asset.balance * asset.usd, 0).toFixed(2);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const generatePDF = (start, end) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Statement", 14, 20);

    // Date Range
    doc.setFontSize(12);
    doc.text(`From: ${start}`, 14, 30);
    doc.text(`To: ${end}`, 14, 40);

    // Asset table
    doc.autoTable({
      startY: 50,
      head: [["Asset", "Balance", "USD Value"]],
      body: assets.map((asset) => [
        asset.symbol,
        asset.balance,
        `$${(asset.balance * asset.usd).toFixed(2)}`,
      ]),
    });

    // Total Wallet Value
    doc.text(`Total Wallet Value: $${totalValue}`, 14, doc.lastAutoTable.finalY + 10);

    // Save PDF
    doc.save(`statement_${start}_to_${end}.pdf`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!");
      return;
    }
    generatePDF(startDate, endDate);
  };

  return (
    <div className="space-y-8">
      {/* Total Wallet Value */}
      <div className="bg-white dark:bg-[#161b22] text-black dark:text-white p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Total Wallet Value</h2>
          <p className="text-2xl font-semibold mt-1">${totalValue}</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Deposit</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Withdraw</button>
        </div>
      </div>

      {/* Asset Table */}
      <div className="overflow-x-auto bg-white dark:bg-[#161b22] text-black dark:text-white rounded-xl shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Balance</th>
              <th className="px-6 py-3">USD Value</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => (
              <tr key={i} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4">{asset.symbol} ({asset.name})</td>
                <td className="px-6 py-4">{asset.balance}</td>
                <td className="px-6 py-4">${(asset.balance * asset.usd).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transfer Form */}
      <div className="bg-white dark:bg-[#161b22] text-black dark:text-white p-6 rounded-xl shadow max-w-xl mx-auto">
        <h3 className="text-lg font-bold mb-4">Transfer Funds</h3>
        <form className="space-y-4">
          <input
            type="number"
            placeholder="Amount"
            className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700"
          />
          <select className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700">
            {assets.map((a, i) => (
              <option key={i} value={a.symbol}>{a.symbol}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500 transition"
          >
            Submit Transfer
          </button>
        </form>
      </div>

      {/* Statement Generator */}
      <div className="bg-white dark:bg-[#161b22] text-black dark:text-white p-6 rounded-xl shadow max-w-xl mx-auto">
        <h3 className="text-lg font-bold mb-4">Generate Statement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                type="date"
                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="date"
                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
          >
            Generate Statement
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assets;
