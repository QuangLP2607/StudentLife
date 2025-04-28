import classNames from "classnames/bind";
import styles from "./contentFirst.module.scss";

const cx = classNames.bind(styles);

export default function ContentFirst({
  semesterData,
  setSemesterData,
  onAddCourse,
  onEditCourse,
}) {
  const updateSemesterField = (field, value) => {
    setSemesterData({ ...semesterData, [field]: value });
  };

  const calculateEndDate = (startDate, weeks) => {
    if (startDate && weeks) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + weeks * 7);
      return start.toISOString().split("T")[0];
    }
    return "";
  };

  const handleStartDateChange = (e) => {
    let newStartDate = e.target.value;
    let selectedDate = new Date(newStartDate);

    if (selectedDate.getDay() !== 1) {
      selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const newEndDate = calculateEndDate(formattedDate, semesterData.weeks);

    setSemesterData({
      ...semesterData,
      startDate: formattedDate,
      endDate: newEndDate,
    });
  };

  const handleWeeksChange = (e) => {
    const newWeeks = parseInt(e.target.value);
    const newEndDate = calculateEndDate(semesterData.startDate, newWeeks);

    setSemesterData({
      ...semesterData,
      weeks: newWeeks,
      endDate: newEndDate,
    });
  };

  return (
    <div className={cx("content-first")}>
      <h2>Thông tin kỳ học</h2>
      <div className={cx("form-grid")}>
        <div className={cx("form-grid__row")}>
          <label className={cx("form-grid__label")}>Học kỳ:</label>
          <input
            className={cx("form-grid__input")}
            placeholder="Nhập học kỳ"
            value={semesterData.semester}
            onChange={(e) => updateSemesterField("semester", e.target.value)}
          />
        </div>

        <div className={cx("form-grid__row")}>
          <label className={cx("form-grid__label")}>Thời gian:</label>
          <div className={cx("form-grid__time-range")}>
            <input
              type="date"
              className={cx("form-grid__input")}
              value={semesterData.startDate}
              onChange={handleStartDateChange}
            />
            <span className={cx("form-grid__separator")}>đến</span>
            <input
              type="date"
              className={cx("form-grid__input")}
              value={semesterData.endDate}
              readOnly
            />
          </div>
        </div>

        <div className={cx("form-grid__row")}>
          <label className={cx("form-grid__label")}>Số tuần học:</label>
          <input
            type="number"
            className={cx("form-grid__input")}
            value={semesterData.weeks}
            onChange={handleWeeksChange}
            min="1"
          />
        </div>
      </div>

      <h2>Danh sách học phần</h2>
      <div className={cx("course-list")}>
        {semesterData.courses.map((course, index) => (
          <div
            key={index}
            className={cx("course-list_item")}
            onClick={() => onEditCourse(course)}
          >
            <div className={cx("course-list_item-index")}>{index + 1}</div>
            <div className={cx("course-list_item-name")}>{course.name}</div>
          </div>
        ))}
      </div>

      <div className={cx("add-course")}>
        <button className={cx("add-course__btn")} onClick={onAddCourse}>
          Thêm học phần +
        </button>
      </div>
    </div>
  );
}
