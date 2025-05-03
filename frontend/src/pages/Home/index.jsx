import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import Calendar from "@components/Calendar";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/new-course");
  };

  return (
    <div className={cx("home")}>
      <div className={cx("home__calendar")}>
        <Calendar />
      </div>
      <div className={cx("home__content")}>
        <h2>Chào mừng bạn đến với ứng dụng hỗ trợ sinh viên!</h2>
        <span>
          Ứng dụng giúp bạn quản lý thời khóa biểu, tài liệu học tập và chi tiêu
          một cách dễ dàng.
        </span>
        <br />
        <span>Hãy bắt đầu bằng cách thêm kỳ học đầu tiên.</span>
        <br />
        <button className={cx("home__content-btn")} onClick={handleStart}>
          Bắt đầu
        </button>
      </div>
    </div>
  );
}
