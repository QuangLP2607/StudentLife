import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Alert.module.scss";

const cx = classNames.bind(styles);

export default function Alert({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={cx("alert", type, {
        "alert-exit": !isVisible,
      })}
    >
      {message}
      <button className={cx("close")} onClick={onClose}>
        &times;
      </button>
    </div>
  );
}
