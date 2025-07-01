import classNames from "classnames/bind";
import styles from "./contentFirst.module.scss";
import CourseList from "@components/CourseList";
import WeekPicker from "@components/WeekPicker";
import { format } from "date-fns";

const cx = classNames.bind(styles);

export default function ContentFirst({
  semester,
  setSemester,
  onAddCourse,
  onEditCourse,
}) {
  const calculateEndDate = (start_date, weeks) => {
    if (start_date && weeks) {
      const start = new Date(start_date);
      start.setDate(start.getDate() + weeks * 7);
      return start.toISOString().split("T")[0];
    }
    return "";
  };

  const handleWeekChange = (range) => {
    const formattedStart = format(range.from, "yyyy-MM-dd");
    const newEndDate = calculateEndDate(formattedStart, semester.weeks);

    setSemester({
      ...semester,
      start_date: formattedStart,
      end_date: newEndDate,
    });
  };

  const updateSemesterField = (field, value) => {
    setSemester({ ...semester, [field]: value });
  };

  const handleWeeksChange = (e) => {
    const newWeeks = parseInt(e.target.value);
    const newEndDate = calculateEndDate(semester.start_date, newWeeks);

    setSemester({
      ...semester,
      weeks: newWeeks,
      end_date: newEndDate,
    });
  };

  return (
    <div className={cx("content-first")}>
      <h2>Thông tin học kỳ</h2>
      <div className={cx("form-grid")}>
        <div className={cx("form-grid__row")}>
          <label className={cx("form-grid__label")}>Học kỳ:</label>
          <input
            className={cx("form-grid__input")}
            placeholder="Nhập học kỳ"
            value={semester.name}
            onChange={(e) => updateSemesterField("name", e.target.value)}
          />
        </div>

        <div className={cx("form-grid__row")}>
          <label className={cx("form-grid__label")}>Thời gian:</label>
          <div className={cx("form-grid__time-range")}>
            <WeekPicker
              onChange={handleWeekChange}
              defaultValue={semester.start_date}
            />
            <span className={cx("form-grid__separator")}>đến</span>
            <input
              type="date"
              className={cx("form-grid__input")}
              value={semester.end_date}
              readOnly
            />
          </div>
        </div>

        <div className={cx("form-grid__row")}>
          <label className={cx("form-grid__label")}>Số tuần học:</label>
          <input
            type="number"
            className={cx("form-grid__input")}
            value={semester.weeks}
            onChange={handleWeeksChange}
            min="1"
          />
        </div>
      </div>
      <h2>Danh sách học phần</h2>
      <CourseList semester={semester} handleClickCourse={onEditCourse} />
      <div className={cx("add-course")}>
        <button className={cx("add-course__btn")} onClick={onAddCourse}>
          Thêm học phần +
        </button>
      </div>
    </div>
  );
}
