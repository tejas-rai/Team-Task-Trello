import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg px-8 py-4 flex items-center justify-between sticky top-0 z-50 text-white">
      {/* Logo + App Name */}
      <div className="flex items-center space-x-3">
        <span className="text-3xl">📝</span>
        <Link
          to="/dashboard"
          className="text-3xl font-bold hover:text-yellow-300 transition"
        >
          QuickTasks
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-8">
        <Link
          to="/dashboard"
          className="hover:text-yellow-300 transition text-lg"
        >
          Dashboard
        </Link>
        <Link to="/teams" className="hover:text-yellow-300 transition text-lg">
          Teams
        </Link>
        <Link to="/tasks" className="hover:text-yellow-300 transition text-lg">
          Tasks
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/dashboard/admin"
            className="hover:text-yellow-300 transition text-lg"
          >
            Admin
          </Link>
        )}
        <button
          onClick={() => dispatch(logout())}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
} 