import React from "react";
import { Flame, BarChart2 } from "lucide-react";

const Home = () => {
  const contracts = [
    { name: "BTC/USDT", price: "$67,500", change: "+0.8%", volume: "12.4M" },
    { name: "ETH/USDT", price: "$3,025", change: "+0.5%", volume: "1.9M" },
    { name: "ADA/USDT", price: "0.51", change: "+1.2%", volume: "1.7M" },
  ];

  const gainers = [
    { name: "MDX/USDT", price: "0.03453", change: "+12.48%" },
    { name: "XMR/USDT", price: "118.7", change: "0.00%" },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold">Welcome to JKCEX</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Trade ultra-short crypto futures with confidence. Fast, secure, and built for the bold.
      </p>

      {/* Popular Contracts */}
      <section>
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <Flame className="text-orange-500" size={20} />
          Popular Contracts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {contracts.map((contract, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#161b22] text-black dark:text-white rounded-lg p-5 shadow hover:shadow-lg transition"
            >
              <div className="font-medium text-sm text-gray-500 dark:text-gray-400">{contract.name}</div>
              <div className="text-2xl font-bold">{contract.price}</div>
              <div className="text-green-500 text-sm">{contract.change}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Volume: {contract.volume}</div>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded">
                Trade Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Gainers */}
      <section>
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <BarChart2 className="text-purple-500" size={20} />
          Gainers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {gainers.map((g, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#161b22] text-black dark:text-white rounded-lg p-5 shadow hover:shadow-lg transition flex justify-between"
            >
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{g.name}</div>
                <div className="text-lg font-semibold">{g.price}</div>
              </div>
              <div className="text-green-500 font-bold">{g.change}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
