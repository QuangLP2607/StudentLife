import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./CourseCalendar.module.scss";
import Calendar from "../Calendar";

const cx = classNames.bind(styles);

export default function CourseCalendar({ semester }) {
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
    const startDateObj = new Date(semester.start_date);
    const endDateObj = new Date(semester.end_date);

    if (isNaN(selectedDateObj.getTime()) || isNaN(startDateObj.getTime())) {
      console.error("Ngày không hợp lệ");
      return;
    }

    if (selectedDateObj < startDateObj || selectedDateObj > endDateObj) {
      setSelectedCourses([]);
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

    const selectedDayOfWeek = dayOfWeek;

    const matchedSchedules = [];

    semester.courses.forEach((course) => {
      course.schedules.forEach((s, idx) => {
        const courseDayOfWeek = parseInt(s.day);
        if (courseDayOfWeek !== selectedDayOfWeek) return;

        let isMatch = false;
        switch (s.week_type) {
          case "weekly":
            isMatch = true;
            break;
          case "even":
            isMatch = weekNumber % 2 === 0;
            break;
          case "odd":
            isMatch = weekNumber % 2 !== 0;
            break;
          case "custom": {
            const validWeeks = parseWeekRanges(s.custom_weeks);
            isMatch = validWeeks.includes(weekNumber);
            break;
          }
          default:
            break;
        }

        if (isMatch) {
          matchedSchedules.push({
            id: `${course.id}-${idx}`,
            name: course.name,
            startTime: s.start_time,
            endTime: s.end_time,
            location: s.location,
          });
        }
      });
    });

    // Sắp xếp matchedSchedules theo startTime
    matchedSchedules.sort((a, b) => {
      const [aHour, aMinute] = a.startTime.split(":").map(Number);
      const [bHour, bMinute] = b.startTime.split(":").map(Number);

      return aHour !== bHour ? aHour - bHour : aMinute - bMinute;
    });

    setSelectedCourses(matchedSchedules);
  };

  const getHighlightDates = (semester) => {
    const startDate = new Date(semester.start_date); // Không cần chỉnh về thứ Hai
    const highlightDates = new Set();
    const totalWeeks = semester.weeks;
    const allDates = [];

    for (let week = 1; week <= totalWeeks; week++) {
      for (let day = 0; day < 7; day++) {
        const current = new Date(startDate);
        current.setDate(startDate.getDate() + (week - 1) * 7 + day);

        const dd = String(current.getDate()).padStart(2, "0");
        const mm = String(current.getMonth() + 1).padStart(2, "0");
        const yyyy = current.getFullYear();
        const dateStr = `${dd}-${mm}-${yyyy}`;

        allDates.push({ week, dateStr, dayOfWeek: current.getDay() });
      }
    }

    for (const course of semester.courses) {
      for (const s of course.schedules) {
        const scheduleDay = parseInt(s.day);

        for (const { week, dateStr, dayOfWeek } of allDates) {
          if (scheduleDay !== dayOfWeek) continue;

          let isMatch = false;
          switch (s.week_type) {
            case "weekly":
              isMatch = true;
              break;
            case "even":
              isMatch = week % 2 === 0;
              break;
            case "odd":
              isMatch = week % 2 !== 0;
              break;
            case "custom": {
              const validWeeks = parseWeekRanges(s.custom_weeks);
              isMatch = validWeeks.includes(week);
              break;
            }
          }

          if (isMatch) {
            highlightDates.add(dateStr);
          }
        }
      }
    }

    return Array.from(highlightDates);
  };

  return (
    <div className={cx("course-calendar")}>
      <Calendar
        onDateSelect={handleDateSelect}
        markDays={getHighlightDates(semester)}
      />
      <hr style={{ width: "100%" }} />
      <h3>Thông tin chi tiết</h3>

      {selectedCourses.length > 0 ? (
        <div className={cx("course-calendar__daily-courses")}>
          {selectedCourses.map((course) => (
            <div key={course.id} className={cx("schedule")}>
              <div className={cx("schedule__time")}>
                <div>{course.startTime.slice(0, 5)}</div>|
                <div>{course.endTime.slice(0, 5)}</div>
              </div>
              <div className={cx("schedule__info")}>
                <div className={cx("schedule__info-name")}>{course.name}</div>
                <div className={cx("schedule__info-location")}>
                  Địa điểm: {course.location}
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
