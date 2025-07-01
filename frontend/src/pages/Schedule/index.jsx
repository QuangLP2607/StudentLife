import { useState, useContext, useEffect, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./Schedule.module.scss";
import WeekCalendar from "./Component/WeekCalendar";
import MonthCalendar from "./Component/MonthCalendar";
import { SemesterContext } from "../../contexts/SemesterContext";
import semesterService from "../../services/semesterService";
import Alert from "@components/Arlert";
import { useAlert } from "../../hooks/useAlert";

const cx = classNames.bind(styles);

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDateToDDMMYYYY(dateObj) {
  const day = padTo2Digits(dateObj.getDate());
  const month = padTo2Digits(dateObj.getMonth() + 1);
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState("");
  const [weekData, setWeekData] = useState([]);
  const [semester, setSemester] = useState({});
  const [currentWeek, setCurrentWeek] = useState(1);
  const { semesterId } = useContext(SemesterContext);
  const { alert, showAlert, clearAlert } = useAlert();

  // Sử dụng useCallback để tránh định nghĩa lại hàm mỗi lần render
  const parseWeekRanges = useCallback((input) => {
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
  }, []);

  // Đưa hàm handleDateSelect ra ngoài useEffect, dùng useCallback để tránh cảnh báo về dependency
  const handleDateSelect = useCallback(
    (dateStr) => {
      if (!semester.start_date) return;

      const formattedSelectedDate = dateStr.split("-").reverse().join("-");
      const selectedDateObj = new Date(formattedSelectedDate);
      const startDateObj = new Date(semester.start_date);

      if (isNaN(selectedDateObj.getTime()) || isNaN(startDateObj.getTime())) {
        console.error("Ngày không hợp lệ");
        return;
      }

      startDateObj.setDate(startDateObj.getDate() - startDateObj.getDay() + 1);
      const dayOfWeek = selectedDateObj.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const mondayOfSelectedWeek = new Date(selectedDateObj);
      mondayOfSelectedWeek.setDate(selectedDateObj.getDate() - diffToMonday);

      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const dayInWeek = new Date(mondayOfSelectedWeek);
        dayInWeek.setDate(mondayOfSelectedWeek.getDate() + i);
        weekDays.push(dayInWeek);
      }

      const diffMillis =
        mondayOfSelectedWeek.getTime() - startDateObj.getTime();
      const diffDays = Math.floor(diffMillis / (1000 * 60 * 60 * 24));
      const weekNumber = Math.floor(diffDays / 7) + 1;

      if (weekNumber < 1) {
        showAlert("Tuần chọn trước kỳ học!", "error");
        setWeekData([]);
        setCurrentWeek(1);
        return;
      }

      if (semester.weeks && weekNumber > semester.weeks) {
        showAlert("Tuần chọn vượt quá kỳ học!", "error");
        setWeekData([]);
        setCurrentWeek(semester.weeks);
        return;
      }

      setCurrentWeek(weekNumber);

      const matchedSchedules = [];

      semester.courses?.forEach((course) => {
        course.schedules.forEach((schedule, idx) => {
          const courseDayOfWeek = parseInt(schedule.day);
          if (!weekDays.some((day) => day.getDay() === courseDayOfWeek)) return;

          let isMatch = false;
          switch (schedule.week_type) {
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
              const validWeeks = parseWeekRanges(schedule.custom_weeks);
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
              startTime: schedule.start_time,
              endTime: schedule.end_time,
              location: schedule.location,
              day: schedule.day,
            });
          }
        });
      });

      matchedSchedules.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setWeekData(matchedSchedules);
    },
    [semester, parseWeekRanges, showAlert]
  );

  // Lấy dữ liệu semester detail
  useEffect(() => {
    if (!semesterId) return;

    let isMounted = true; // Tránh set state khi component unmount

    const fetchSemesterDetail = async () => {
      try {
        const response = await semesterService.getSemesterDetail(semesterId);
        if (isMounted) {
          setSemester(response.data.data.semester);
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết kỳ học:", err);
      }
    };

    fetchSemesterDetail();

    return () => {
      isMounted = false;
    };
  }, [semesterId]);

  // Khi selectedDate thay đổi thì tính toán lại tuần và lịch
  useEffect(() => {
    if (selectedDate) {
      handleDateSelect(selectedDate);
    }
  }, [selectedDate, handleDateSelect]);

  // Khi semester thay đổi thì set ngày mặc định là thứ 2 tuần hiện tại
  useEffect(() => {
    if (!semester.start_date) return;

    const today = new Date();
    const start = new Date(semester.start_date);
    start.setDate(start.getDate() - start.getDay() + 1);

    const diff = today.getTime() - start.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(days / 7) + 1;

    const clampedWeek = Math.min(
      Math.max(weekNum, 1),
      semester.weeks || weekNum
    );
    setCurrentWeek(clampedWeek);

    const monday = new Date();
    const dayOfWeek = monday.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(monday.getDate() - diffToMonday);

    const defaultDateStr = formatDateToDDMMYYYY(monday);
    setSelectedDate(defaultDateStr);
  }, [semester]);

  const handleChangeWeek = (offset) => {
    if (!selectedDate) return;

    const formattedSelectedDate = selectedDate.split("-").reverse().join("-");
    const dateObj = new Date(formattedSelectedDate);

    if (isNaN(dateObj.getTime())) return;

    dateObj.setDate(dateObj.getDate() + offset * 7);

    const newDateStr = formatDateToDDMMYYYY(dateObj);
    setSelectedDate(newDateStr);
  };

  return (
    <div className={cx("calendar")}>
      <Alert alert={alert} clearAlert={clearAlert} />
      <MonthCalendar
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <WeekCalendar
        selectedDate={selectedDate}
        weekData={weekData}
        currentWeek={currentWeek}
        handleChangeWeek={handleChangeWeek}
      />
    </div>
  );
}
