import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";
import styles from "./ContentSecond.module.scss";
import CustomDropdown from "@components/CustomDropdown";
import { initialSchedule } from "../../../../constants/initialState";
import TimePicker from "@components/TimePicker";

const cx = classNames.bind(styles);

export default function ContentSecond({
  showForm,
  setShowForm,
  editingCourse,
  course,
  setCourse,
  handleSaveCourse,
  handleDeleteCourse,
  handleSaveSemester,
}) {
  const title = editingCourse ? "Thông tin học phần" : "Thêm học phần";
  const [activeTab, setActiveTab] = useState(0);

  const dayOptions = [
    { value: "1", label: "Thứ 2" },
    { value: "2", label: "Thứ 3" },
    { value: "3", label: "Thứ 4" },
    { value: "4", label: "Thứ 5" },
    { value: "5", label: "Thứ 6" },
    { value: "6", label: "Thứ 7" },
    { value: "0", label: "Chủ nhật" },
  ];

  const weekTypeOptions = [
    { value: "weekly", label: "Hằng tuần" },
    { value: "even", label: "Tuần chẵn" },
    { value: "odd", label: "Tuần lẻ" },
    { value: "custom", label: "Tùy chỉnh" },
  ];

  useEffect(() => {
    if (editingCourse) {
      setCourse({ ...editingCourse, schedules: editingCourse.schedules || [] });
      setActiveTab(0);
    }
  }, [editingCourse, setCourse]);

  const onChangeField = (field, value) => {
    setCourse({ ...course, [field]: value });
  };

  const onChangeScheduleField = (index, field, value) => {
    const updatedSchedules = [...course.schedules];
    updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };
    setCourse({ ...course, schedules: updatedSchedules });
  };

  const handleAddSchedule = () => {
    setCourse({
      ...course,
      schedules: [...course.schedules, initialSchedule],
    });
    setActiveTab(course.schedules.length);
  };

  const handleRemoveSchedule = (index) => {
    const updatedSchedules = course.schedules.filter((_, i) => i !== index);
    setCourse({ ...course, schedules: updatedSchedules });
    setActiveTab(Math.max(0, updatedSchedules.length - 1));
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
            </div>

            <hr />

            {/* Lịch học Tabs */}
            <div className={cx("tabs")}>
              <div style={{ marginRight: "10px" }}>Lịch học</div>
              {course.schedules.map((_, index) => (
                <button
                  key={index}
                  className={cx("tabs__item-button", {
                    "tabs__item-button--active": activeTab === index,
                  })}
                  onClick={() => setActiveTab(index)}
                >
                  {index + 1}
                  {course.schedules.length > 1 && (
                    <span
                      className={cx("tabs__item-button-remove")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSchedule(index);
                      }}
                    >
                      <Icon
                        className={cx("tabs__item-button-remove-icon")}
                        icon="mi:delete"
                      />
                    </span>
                  )}
                </button>
              ))}
              {course.schedules.length < 5 && (
                <button className={cx("tabs__add")} onClick={handleAddSchedule}>
                  <Icon
                    className={cx("tabs__add-icon")}
                    icon="icon-park-outline:add"
                  />
                </button>
              )}
            </div>

            {/* Form Lịch học */}
            <div className={cx("form-grid")}>
              {course.schedules.length > 0 && (
                <>
                  <div className={cx("form-grid__row")}>
                    <TimePicker
                      value={course.schedules[activeTab]?.start_time}
                      onChange={(e) =>
                        onChangeScheduleField(
                          activeTab,
                          "start_time",
                          e.target.value
                        )
                      }
                    ></TimePicker>

                    <TimePicker
                      value={course.schedules[activeTab]?.end_time}
                      onChange={(e) =>
                        onChangeScheduleField(
                          activeTab,
                          "end_time",
                          e.target.value
                        )
                      }
                    ></TimePicker>
                    <CustomDropdown
                      placeholder="Chọn thứ"
                      options={dayOptions}
                      selectedValue={course.schedules[activeTab]?.day || ""}
                      onChange={(value) =>
                        onChangeScheduleField(activeTab, "day", value)
                      }
                    />
                  </div>

                  <CustomDropdown
                    placeholder="Chọn tuần học"
                    options={weekTypeOptions}
                    selectedValue={course.schedules[activeTab]?.week_type || ""}
                    onChange={(value) =>
                      onChangeScheduleField(activeTab, "week_type", value)
                    }
                  />

                  {course.schedules[activeTab]?.week_type === "custom" && (
                    <div className={cx("form-grid__row")}>
                      <input
                        type="text"
                        className={cx("form-grid__input")}
                        value={course.schedules[activeTab]?.custom_weeks || ""}
                        onChange={(e) =>
                          onChangeScheduleField(
                            activeTab,
                            "custom_weeks",
                            e.target.value
                          )
                        }
                        placeholder="VD: 1,12-16"
                      />
                    </div>
                  )}

                  <div className={cx("form-grid__row")}>
                    <input
                      type="text"
                      className={cx("form-grid__input")}
                      value={course.schedules[activeTab]?.location || ""}
                      onChange={(e) =>
                        onChangeScheduleField(
                          activeTab,
                          "location",
                          e.target.value
                        )
                      }
                      placeholder="Nhập địa điểm"
                    />
                  </div>
                </>
              )}
            </div>

            <div className={cx("add_subject")}>
              <button
                className={cx("add_subject__btn")}
                onClick={handleSaveCourse}
              >
                Lưu
              </button>
              {editingCourse && (
                <button
                  className={cx("add_subject__btn", "add_subject__btn--danger")}
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <div className={cx("content-second__actions")}>
        <button
          className={cx("content-second__actions-save")}
          onClick={handleSaveSemester}
        >
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
