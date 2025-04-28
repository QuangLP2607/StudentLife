import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ContentSecond.module.scss";

const cx = classNames.bind(styles);

export default function ContentSecond({
  showForm,
  setShowForm,
  editingCourse,
  course,
  setCourse,
  handleSaveCourse,
}) {
  const title = editingCourse ? "Thông tin học phần" : "Thêm học phần";

  useEffect(() => {
    if (editingCourse) {
      setCourse(editingCourse);
    }
  }, [editingCourse, setCourse]);

  const onChangeField = (field, value) => {
    setCourse({ ...course, [field]: value });
  };

  const onChangeScheduleField = (field, value) => {
    setCourse({
      ...course,
      schedule: {
        ...course.schedule,
        [field]: value,
      },
    });
  };

  return (
    <div className={cx("content-second")}>
      {showForm && (
        <>
          <h2>{title}</h2>

          <div className={cx("content-second__details")}>
            <div className={cx("form-grid")}>
              <div className={cx("form-grid__row")}>
                <label className={cx("form-grid__label")}>Tên môn học:</label>
                <input
                  className={cx("form-grid__input")}
                  value={course.name}
                  onChange={(e) => onChangeField("name", e.target.value)}
                  placeholder="Nhập tên môn học"
                />
              </div>

              <div className={cx("form-grid__row")}>
                <label className={cx("form-grid__label")}>Khoa:</label>
                <input
                  className={cx("form-grid__input")}
                  value={course.department}
                  onChange={(e) => onChangeField("department", e.target.value)}
                  placeholder="Nhập tên khoa"
                />
              </div>
            </div>

            <hr />
            <div>Lịch học</div>
            <br />

            <div className={cx("form-grid")}>
              <div className={cx("form-grid__row")}>
                <input
                  type="time"
                  className={cx("form-grid__input")}
                  value={course.schedule.startTime}
                  onChange={(e) =>
                    onChangeScheduleField("startTime", e.target.value)
                  }
                />
                <input
                  type="time"
                  className={cx("form-grid__input")}
                  value={course.schedule.endTime}
                  onChange={(e) =>
                    onChangeScheduleField("endTime", e.target.value)
                  }
                />
                <select
                  className={cx("form-grid__input")}
                  value={course.schedule.day}
                  onChange={(e) => onChangeScheduleField("day", e.target.value)}
                >
                  <option value="">Chọn thứ</option>
                  <option value="1">Thứ 2</option>
                  <option value="2">Thứ 3</option>
                  <option value="3">Thứ 4</option>
                  <option value="4">Thứ 5</option>
                  <option value="5">Thứ 6</option>
                  <option value="6">Thứ 7</option>
                  <option value="0">Chủ nhật</option>
                </select>
              </div>

              <div className={cx("form-grid__row")}>
                <select
                  className={cx("form-grid__input")}
                  value={course.schedule.weekType}
                  onChange={(e) =>
                    onChangeScheduleField("weekType", e.target.value)
                  }
                >
                  <option value="weekly">Hằng tuần</option>
                  <option value="even">Tuần chẵn</option>
                  <option value="odd">Tuần lẻ</option>
                  <option value="custom">Tùy chỉnh</option>
                </select>

                {course.schedule.weekType === "custom" && (
                  <input
                    type="text"
                    className={cx("form-grid__input")}
                    value={course.schedule.customWeeks}
                    onChange={(e) =>
                      onChangeScheduleField("customWeeks", e.target.value)
                    }
                    placeholder="VD: 1,12-16"
                  />
                )}
              </div>

              <div className={cx("form-grid__row")}>
                <input
                  type="text"
                  className={cx("form-grid__input")}
                  value={course.schedule.location}
                  onChange={(e) =>
                    onChangeScheduleField("location", e.target.value)
                  }
                  placeholder="Nhập địa điểm"
                />
              </div>
            </div>

            <div className={cx("add_subject")}>
              <button
                className={cx("add_subject__btn")}
                onClick={handleSaveCourse}
              >
                Lưu học phần
              </button>
            </div>
          </div>
        </>
      )}

      <div className={cx("content-second__actions")}>
        <button className={cx("content-second__actions-save")}>
          Lưu học kỳ
        </button>
        <button
          className={cx("content-second__actions-cancel")}
          onClick={() => setShowForm(false)}
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
