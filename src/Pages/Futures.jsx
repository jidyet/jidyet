import React, { useState, useEffect } from "react";
import { exportToCSV } from "../utils/export";
import { exportToPDF } from "../utils/pdf";
import { Line } from "react-chartjs-2"; // For rendering live chart
import Chart from "chart.js/auto"; // Import chart.js for line chart

const cycleTimes = ["60s", "120s", "5m", "10m"];
const filters = ["All", "Win", "Call", "Put"];
const quantityOptions = [1, 5, 10, 20, 50, 100]; // Quantity options for dropdown

const Futures = () => {
  const [selectedCycle, setSelectedCycle] = useState(cycleTimes[0]);
  const [quantity, setQuantity] = useState(1); // Default value set to 1
  const [probability, setProbability] = useState(Math.random() * 100);
  const [selected, setSelected] = useState("BTC/USDT");
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const tradesPerPage = 5;
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "BTC/USDT Price",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
    ],
  });

  // Set initial trades data from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem("jkcex_trades");
    if (stored) setTrades(JSON.parse(stored));

    const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const price = parseFloat(message.p); // Get the price from the WebSocket message
      updateChartData(price);
    };

    return () => {
      socket.close(); // Cleanup the socket when component is unmounted
    };
  }, []);

  // Update chart data with new price
  const updateChartData = (newPrice) => {
    setChartData((prevData) => {
      const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
      const newPrices = [...prevData.datasets[0].data, newPrice];

      // Limit data to last 30 entries for performance
      if (newLabels.length > 30) {
        newLabels.shift();
        newPrices.shift();
      }

      return {
        labels: newLabels,
        datasets: [
          {
            label: "BTC/USDT Price",
            data: newPrices,
            borderColor: "rgb(75, 192, 192)",
            fill: false,
          },
        ],
      };
    });
  };

  // Handle trade action (Call or Put)
  const handleTrade = (type) => {
    const result = Math.random() > 0.5 ? "Win" : "Loss"; // Simulate result
    const newTrade = {
      id: Date.now(),
      cycle: selectedCycle,
      quantity,
      type,
      result,
      probability: probability.toFixed(2),
      time: new Date().toLocaleTimeString(),
    };
    setTrades([newTrade, ...trades]);
  };

  // Filter trades based on selected filter (All, Win, Call, Put)
  const filteredTrades = trades.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Win") return t.result === "Win";
    return t.type === filter;
  });

  // Paginate trades
  const pageTrades = filteredTrades.slice((page - 1) * tradesPerPage, page * tradesPerPage);
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
      {/* Left Column: Contract List */}
      <div className="bg-[#161b22] rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Futures</h2>
        {["BTC/USDT", "ETH/USDT", "LTC/USDT"].map((pair) => (
          <button
            key={pair}
            onClick={() => setSelected(pair)}
            className={`block w-full text-left px-4 py-2 rounded mb-2 ${selected === pair ? "bg-yellow-400 text-black font-semibold" : "hover:bg-gray-800"}`}
          >
            {pair}
          </button>
        ))}
      </div>

      {/* Center Column: Chart & Trades */}
      <div className="bg-[#161b22] rounded p-4 flex flex-col gap-4">
        <div className="text-center text-gray-300 mb-6">
          [ Chart for <strong>{selected}</strong> ]
        </div>

        {/* Chart Component */}
        <Line data={chartData} options={{ maintainAspectRatio: false }} />

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-3 py-1 text-sm rounded ${filter === f ? "bg-yellow-400 text-black font-semibold" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cycle Time */}
        <div className="mb-4">
          <label className="text-sm font-medium">Cycle</label>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
          >
            {cycleTimes.map((cycle) => (
              <option key={cycle} value={cycle}>
                {cycle}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Dropdown and Manual Input */}
        <div className="mb-4">
          <label className="text-sm font-medium">Quantity</label>
          <div className="flex items-center gap-4">
            {/* Dropdown for Quantity */}
            <select
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              {quantityOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} USDT
                </option>
              ))}
            </select>

            {/* Manual Input for Quantity */}
            <input
              type="number"
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />
          </div>
        </div>

        {/* Probability */}
        <div className="mb-4">
          <p>Probability: {probability.toFixed(2)}%</p>
        </div>

        {/* Recent Trades */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Recent Trades</h2>
          {pageTrades.length > 0 ? (
            <table className="w-full text-xs table-auto mb-2">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-1">Pair</th>
                  <th>Action</th>
                  <th>Result</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {pageTrades.map((t) => (
                  <tr key={t.id} className={`${t.result === "Win" ? "bg-green-900/40" : ""}`}>
                    <td>{t.symbol}</td>
                    <td className={`font-bold ${t.type === "Call" ? "text-green-500" : "text-red-500"}`}>{t.type}</td>
                    <td className={`${t.result === "Win" ? "text-green-400" : "text-red-400"}`}>{t.result}</td>
                    <td>${t.quantity}</td>
                    <td className="text-gray-400">{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No trades to display.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
            <div className="space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-2 py-1 bg-gray-700 text-xs rounded disabled:opacity-30"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-2 py-1 bg-gray-700 text-xs rounded disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>

          {/* Export */}
          <button onClick={() => exportToCSV(pageTrades)} className="mt-3 px-4 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 text-xs">
            Export to CSV
          </button>
        </div>
      </div>

      {/* Right Column: Order Book + Controls */}
      <div className="bg-[#161b22] rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Order Book</h2>
        <p className="text-sm text-gray-400 mb-4">[ Order book for {selected} ]</p>

        <h3 className="text-md font-semibold mb-2">Cycle Times</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {cycleTimes.map((time) => (
            <button key={time} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm">{time}</button>
          ))}
        </div>

        <h3 className="text-md font-semibold mb-2">Trade</h3>
        <div className="flex gap-4">
          <button onClick={() => handleTrade("Call")} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">
            Call
          </button>
          <button onClick={() => handleTrade("Put")} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white">
            Put
          </button>
        </div>
      </div>
    </div>
  );
};

export default Futures;
