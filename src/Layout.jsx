import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./hooks/useTheme"; // Adjust if needed
import AccountDropdown from "./components/AccountDropdown"; // ✅ Account dropdown added

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Futures", path: "/futures" },
    { name: "Perpetual", path: "/perpetual" },
    { name: "Assets", path: "/assets" },
  ];

  const isActive = (path) =>
    location.pathname === path
      ? "text-yellow-400 font-bold"
      : "text-black dark:text-gray-300";

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0d1117] dark:text-white">
      {/* Header */}
      <header className="bg-gray-100 dark:bg-[#161B22] px-6 py-4 flex justify-between items-center shadow sticky top-0 z-50">
        <h1 className="text-xl font-bold text-yellow-500">JKCEX</h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map(({ name, path }) => (
            <Link key={path} to={path} className={`${isActive(path)} hover:text-yellow-400`}>
              {name}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* 👤 Account Dropdown */}
          <AccountDropdown />
        </nav>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-black dark:text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-gray-100 dark:bg-[#161B22] px-6 py-4 space-y-3 text-sm font-medium">
          {navItems.map(({ name, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`${isActive(path)} block hover:text-yellow-400`}
            >
              {name}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 mt-2 hover:text-yellow-400"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
      )}

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
