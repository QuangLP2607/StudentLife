import classNames from "classnames/bind";
import styles from "./contentFirst.module.scss";
import CourseList from "@components/CourseList";
import WeekPicker from "@components/WeekPicker";

const cx = classNames.bind(styles);

export default function ContentFirst({
  semesterData,
  setSemesterData,
  onAddCourse,
  onEditCourse,
}) {
  // Hàm tính toán ngày kết thúc từ ngày bắt đầu và số tuần
  const calculateEndDate = (startDate, weeks) => {
    if (startDate && weeks) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + weeks * 7);
      return start.toISOString().split("T")[0];
    }
    return "";
  };

  // Hàm xử lý thay đổi tuần học (dùng cho WeekPicker)
  const handleWeekChange = (range) => {
    const formattedStart = range.from.toISOString().split("T")[0]; // Lấy ngày bắt đầu của tuần
    const newEndDate = calculateEndDate(formattedStart, semesterData.weeks); // Tính ngày kết thúc dựa trên số tuần

    setSemesterData({
      ...semesterData,
      startDate: formattedStart,
      endDate: newEndDate,
    });
  };

  // Hàm cập nhật dữ liệu cho kỳ học
  const updateSemesterField = (field, value) => {
    setSemesterData({ ...semesterData, [field]: value });
  };

  // Hàm thay đổi số tuần học
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
      {/* Gọi WeekPicker để lấy ngày bắt đầu tuần */}
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

        {/* Thời gian bắt đầu và kết thúc được thay thế bằng WeekPicker */}
        <div className={cx("form-grid__row")}>
          <label className={cx("form-grid__label")}>Thời gian:</label>
          <div className={cx("form-grid__time-range")}>
            <WeekPicker onChange={handleWeekChange} />
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
      <CourseList
        semesterData={semesterData}
        handleClickCourse={onEditCourse}
      />
      <div className={cx("add-course")}>
        <button className={cx("add-course__btn")} onClick={onAddCourse}>
          Thêm học phần +
        </button>
      </div>
    </div>
  );
}
