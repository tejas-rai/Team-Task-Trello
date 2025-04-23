import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import styles from "./Header.module.css";

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  return (
    <nav className={styles.nav}>
      <Link to="/dashboard" className={styles.logo}>
        <span>📝</span> QuickTasks
      </Link>
      <div className={styles.links}>
        <Link to="/dashboard" className={styles.link}>Dashboard</Link>
        <Link to="/teams"      className={styles.link}>Teams</Link>
        <Link to="/tasks"      className={styles.link}>Tasks</Link>
        {user?.role === "admin" && (
          <Link to="/dashboard/admin" className={styles.link}>Admin</Link>
        )}
        <button
          onClick={() => dispatch(logout())}
          className={styles.logout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
