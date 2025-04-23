import React from "react";
import styles from "./Button.module.css";

export default function Button({ children, disabled, className = "", ...props }) {
  return (
    <button
      className={`${styles.btn} ${disabled ? styles.disabled : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
