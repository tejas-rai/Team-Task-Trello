import React from "react";
import styles from "./FormControls.module.css";

export function Input(props) {
  return <input className={styles.input} {...props} />;
}
export function Select(props) {
  return <select className={styles.input} {...props} />;
}
