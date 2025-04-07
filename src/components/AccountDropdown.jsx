import React, { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";

const AccountDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        title="Account"
      >
        <User size={18} className="text-black dark:text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg text-sm z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-black dark:text-white">Christina D.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">christina@jkcex.com</p>
          </div>
          <div className="px-4 py-2">
            <p className="text-black dark:text-white">Wallet: <span className="font-medium">$4,230.00</span></p>
            <p className="text-black dark:text-white">Tier: <span className="text-yellow-400 font-bold">Pro</span></p>
          </div>
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-left text-red-500 hover:underline">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
