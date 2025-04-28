import React from "react";
import classNames from "classnames/bind";
import styles from "./Modal.module.scss";

const cx = classNames.bind(styles);

export default function Modal({ message, onConfirm, onReject }) {
  return (
    <div className={cx("modal")}>
      <div className={cx("modal-content")}>
        <p>{message}</p>
        <div className={cx("modal-actions")}>
          <button onClick={onConfirm}>Có</button>
          <button onClick={onReject}>Không</button>
        </div>
      </div>
    </div>
  );
}
