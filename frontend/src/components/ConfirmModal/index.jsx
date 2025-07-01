import classNames from "classnames/bind";
import styles from "./ConfirmModal.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";

const cx = classNames.bind(styles);

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className={cx("modal")}>
      <div className={cx("modal__overlay")} />
      <div className={cx("modal__container")}>
        <div className={cx("modal__container--close")}>
          <Icon icon="tabler:x" style={{ strokeWidth: 12 }} />
        </div>
        <div className={cx("modal__title")}>
          {title || "Xác nhận hành động"}
        </div>
        <hr />
        <p className={cx("modal__message")}>
          {message || "Bạn có chắc chắn muốn tiếp tục?"}
        </p>
        <hr />
        <div className={cx("modal__actions")}>
          <button
            className={cx("modal__btn", "modal__btn--cancel")}
            onClick={onCancel}
          >
            Huỷ
          </button>
          <button
            className={cx("modal__btn", "modal__btn--confirm")}
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
