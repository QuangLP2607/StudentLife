import { useState } from "react";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";
import styles from "./Calendar.module.scss";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";

const cx = classNames.bind(styles);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("vi");

export default function Calendar({ onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf("month").day();
  const daysArray = Array.from(
    { length: firstDayOfMonth + daysInMonth },
    (_, i) => (i >= firstDayOfMonth ? i - firstDayOfMonth + 1 : null)
  );

  const handlePrevMonth = () =>
    setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const handleSelectDate = (day) => {
    if (day) {
      const selectedDay = currentDate.date(day); // Lưu ngày đã chọn
      setSelectedDate(selectedDay); // Cập nhật trạng thái selectedDate
      onDateSelect(selectedDay.format("DD-MM-YYYY")); // Trả về ngày được chọn cho component cha
    }
  };

  return (
    <div className={cx("calendar")}>
      <div className={cx("calendar__header")}>
        <button
          className={cx("calendar__header-btn", "calendar__header-btn--prev")}
          onClick={handlePrevMonth}
        >
          <Icon icon="material-symbols:arrow-back-ios-rounded" />
        </button>
        <span className={cx("calendar__header-title")}>
          {currentDate.format("MMMM YYYY")}
        </span>
        <button
          className={cx("calendar__header-btn", "calendar__header-btn--next")}
          onClick={handleNextMonth}
        >
          <Icon icon="material-symbols:arrow-back-ios-rounded" />
        </button>
      </div>

      <div className={cx("calendar__weekdays")}>
        {["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"].map((day) => (
          <div
            key={day}
            className={cx("calendar__weekday", {
              weekend: day === "Th 7" || day === "CN",
            })}
          >
            {day}
          </div>
        ))}
      </div>

      <div className={cx("calendar__days")}>
        {daysArray.map((day, index) => (
          <div
            key={index}
            className={cx("calendar__day", {
              empty: day === null,
              selected: day === selectedDate.date(), // So sánh ngày đang được chọn
              weekend: index % 7 === 5 || index % 7 === 6,
              today: dayjs().date() === day, // Đánh dấu ngày hôm nay
            })}
            onClick={() => handleSelectDate(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
