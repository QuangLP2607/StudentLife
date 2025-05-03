import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./CourseCalendar.module.scss";
import Calendar from "../Calendar";

const cx = classNames.bind(styles);

export default function CourseCalendar({ semesterData }) {
  const [selectedCourses, setSelectedCourses] = useState([]);

  function parseWeekRanges(input) {
    const result = [];

    if (typeof input !== "string") return result;

    input.split(",").forEach((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            result.push(i);
          }
        }
      } else {
        const num = Number(part);
        if (!isNaN(num)) result.push(num);
      }
    });

    return result;
  }

  const handleDateSelect = (dateStr) => {
    const selectedDateParts = dateStr.split("-");
    const formattedSelectedDate = `${selectedDateParts[2]}-${selectedDateParts[1]}-${selectedDateParts[0]}`;
    const selectedDateObj = new Date(formattedSelectedDate);
    const startDateObj = new Date(semesterData.startDate);

    if (isNaN(selectedDateObj.getTime()) || isNaN(startDateObj.getTime())) {
      console.error("Ngày không hợp lệ");
      return;
    }

    startDateObj.setDate(startDateObj.getDate() - startDateObj.getDay() + 1);

    const dayOfWeek = selectedDateObj.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const mondayOfSelectedWeek = new Date(selectedDateObj);
    mondayOfSelectedWeek.setDate(selectedDateObj.getDate() - diffToMonday);

    const diffMillis = mondayOfSelectedWeek.getTime() - startDateObj.getTime();
    const diffDays = Math.floor(diffMillis / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7) + 1;

    const coursesForSelectedWeek = semesterData.courses.filter((course) => {
      const courseDayOfWeek = parseInt(course.schedule.day);
      const selectedDayOfWeek = selectedDateObj.getDay();

      if (courseDayOfWeek !== selectedDayOfWeek) return false;

      switch (course.schedule.weekType) {
        case "weekly":
          return true;
        case "even":
          return weekNumber % 2 === 0;
        case "odd":
          return weekNumber % 2 !== 0;
        case "custom": {
          const customWeeksStr = course.schedule.customWeeks;
          const validWeeks = parseWeekRanges(customWeeksStr);
          return validWeeks.includes(weekNumber);
        }

        default:
          return false;
      }
    });

    setSelectedCourses(coursesForSelectedWeek);
  };

  return (
    <div className={cx("course-calendar")}>
      <Calendar onDateSelect={handleDateSelect} />
      <hr style={{ width: "100%" }} />
      <h3>Thông tin chi tiết</h3>

      {selectedCourses.length > 0 ? (
        <div className={cx("course-calendar__daily-courses")}>
          {selectedCourses.map((course) => (
            <div key={course.id} className={cx("schedule")}>
              <div className={cx("schedule__time")}>
                <div>{course.schedule.startTime}</div>|
                <div>{course.schedule.endTime}</div>
              </div>
              <div className={cx("schedule__info")}>
                <div className={cx("schedule__info-name")}>{course.name}</div>
                <div className={cx("schedule__info-location")}>
                  Địa điểm: {course.schedule.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có tiết học</p>
      )}
    </div>
  );
}
