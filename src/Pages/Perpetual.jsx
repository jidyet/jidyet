import React, { useState, useEffect } from "react";
import { exportToCSV } from "../utils/export";
import { exportToPDF } from "../utils/pdf";

const perpetuals = ["BTC/USDT", "ETH/USDT", "LTC/USDT", "SOL/USDT", "DOGE/USDT"];
const cycleTimes = ["1m", "2m", "3m", "5m", "10m"];
const filters = ["All", "Win", "Call", "Put"];

const Perpetual = () => {
  const [selected, setSelected] = useState(perpetuals[0]);
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const tradesPerPage = 5;

  useEffect(() => {
    const stored = localStorage.getItem("jkcex_trades");
    if (stored) setTrades(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("jkcex_trades", JSON.stringify(trades));
  }, [trades]);

  const handleTrade = (type) => {
    const newTrade = {
      id: Date.now(),
      symbol: selected,
      action: type,
      time: new Date().toLocaleTimeString(),
      result: Math.random() > 0.5 ? "Win" : "Loss",
      amount: (Math.random() * 100).toFixed(2),
    };
    const updated = [newTrade, ...trades];
    setTrades(updated.slice(0, 50));
    setPage(1);
  };

  const filteredTrades = trades.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Win") return t.result === "Win";
    return t.action === filter;
  });

  const pageTrades = filteredTrades.slice((page - 1) * tradesPerPage, page * tradesPerPage);
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  const successRate = trades.length
    ? ((trades.filter((t) => t.result === "Win").length / trades.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
      {/* Left: Contracts */}
      <div className="bg-[#161b22] rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Perpetuals</h2>
        {perpetuals.map((pair) => (
          <button
            key={pair}
            onClick={() => setSelected(pair)}
            className={`block w-full text-left px-4 py-2 rounded mb-2 ${
              selected === pair ? "bg-yellow-400 text-black font-semibold" : "hover:bg-gray-800"
            }`}
          >
            {pair}
          </button>
        ))}
      </div>

      {/* Center: Chart & Trades */}
      <div className="bg-[#161b22] rounded p-4">
        <div className="text-center text-gray-300 mb-6">
          [ Chart for <strong>{selected}</strong> ]
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-3 py-1 text-sm rounded ${
                filter === f
                  ? "bg-yellow-400 text-black font-semibold"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Success Rate */}
        <p className="text-sm text-green-400 mb-2">
          Success Rate: <span className="font-bold">{successRate}%</span>
        </p>

        {/* Trade Table */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Recent Trades</h2>
          {pageTrades.length > 0 ? (
            <>
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
                    <tr
                      key={t.id}
                      className={`text-sm ${t.result === "Win" ? "bg-green-900/40" : ""}`}
                    >
                      <td>{t.symbol}</td>
                      <td className={`font-bold ${t.action === "Call" ? "text-green-500" : "text-red-500"}`}>
                        {t.action}
                      </td>
                      <td className={t.result === "Win" ? "text-green-400" : "text-red-400"}>{t.result}</td>
                      <td>${t.amount}</td>
                      <td className="text-gray-400">{t.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <div className="space-x-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="px-2 py-1 bg-gray-700 text-xs rounded disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="px-2 py-1 bg-gray-700 text-xs rounded disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => exportToCSV(filteredTrades)}
                  className="px-4 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 text-xs"
                >
                  Export to CSV
                </button>
                <button
                  onClick={() => exportToPDF(filteredTrades)}
                  className="px-4 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 text-xs"
                >
                  Export to PDF
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400">No trades to display.</p>
          )}
        </div>
      </div>

      {/* Right: Order Book & Trade */}
      <div className="bg-[#161b22] rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Order Book</h2>
        <p className="text-sm text-gray-400 mb-4">[ Order book for {selected} ]</p>

        <h3 className="text-md font-semibold mb-2">Cycle Times</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {cycleTimes.map((time) => (
            <button key={time} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm">
              {time}
            </button>
          ))}
        </div>

        <h3 className="text-md font-semibold mb-2">Trade</h3>
        <div className="flex gap-4">
          <button
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
            onClick={() => handleTrade("Call")}
          >
            Call
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
            onClick={() => handleTrade("Put")}
          >
            Put
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perpetual;
