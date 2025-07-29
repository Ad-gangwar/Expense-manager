import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, SquarePen, User } from "lucide-react";

const Navbar: React.FC = () => {
  const token = localStorage.getItem("expToken");
  const user = localStorage.getItem("expUser")
    ? JSON.parse(localStorage.getItem("expUser")!)
    : null;

  return (
    <nav className="w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] px-8 py-4 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-3xl font-extrabold tracking-wide text-white">
        Expense<span className="gradient-text">Ease</span>
      </Link>

      <div className="flex items-center gap-4">
        {!token ? (
          <Link
            to="/login"
            className="text-white px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-200"
          >
            Login
          </Link>
        ) : (
          <>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/transactions"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e293b] text-white font-medium hover:bg-[#0f172a] transition"
            >
              <SquarePen size={18} />
              Add Transaction
            </Link>

            <div
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 text-white font-bold text-lg shadow-md hover:scale-105 transition cursor-pointer"
              title={user?.name}
            >
              <User size={22} />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
