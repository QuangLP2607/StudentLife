import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Alert.module.scss";

const cx = classNames.bind(styles);

export default function Alert({ alert, clearAlert }) {
  useEffect(() => {
    if (!alert?.message) return;
    const timer = setTimeout(clearAlert, 3000);
    return () => clearTimeout(timer);
  }, [alert, clearAlert]);

  if (!alert?.message) return null;

  return (
    <div className={cx("alert", alert.type)}>
      {alert.message}
      <button className={cx("close")} onClick={clearAlert}>
        &times;
      </button>
      <div className={cx("progress")} />
    </div>
  );
}
