import classNames from "classnames/bind";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "./Defaultlayout.module.scss";

const cx = classNames.bind(styles);

export default function DefaultLayout({ children }) {
  return (
    <div className={cx("wrapper")}>
      <Sidebar />
      <div className={cx("container")}>
        <Header />
        <div className={cx("content")}>{children}</div>
      </div>
    </div>
  );
}
