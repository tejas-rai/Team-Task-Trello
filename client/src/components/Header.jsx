// client/src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  return (
    <nav className="p-4 bg-gray-100 flex items-center justify-between">
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/teams"     className="hover:underline">Teams</Link>
        <Link to="/tasks"     className="hover:underline">Tasks</Link>
        {user?.role === "admin" && (
          <Link to="/dashboard/admin" className="hover:underline">Admin</Link>
        )}
      </div>
      <button
        onClick={() => dispatch(logout())}
        className="text-red-600 hover:underline"
      >
        Logout
      </button>
    </nav>
  );
}
