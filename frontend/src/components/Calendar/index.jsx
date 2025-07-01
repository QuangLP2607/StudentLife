import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";
import styles from "./Calendar.module.scss";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);

// Cấu hình dayjs để tuần bắt đầu Chủ Nhật (0)
dayjs.locale({
  ...dayjs.Ls.vi,
  weekStart: 0,
});

const cx = classNames.bind(styles);

export default function Calendar({
  onDateSelect,
  className,
  highlightWeek: highlightWeekProp,
  markDays = [],
  value,
}) {
  const initialDate =
    value && dayjs(value, "DD-MM-YYYY").isValid()
      ? dayjs(value, "DD-MM-YYYY")
      : dayjs();
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const highlightWeek = highlightWeekProp ?? false;

  useEffect(() => {
    if (value) {
      const newDate = dayjs(value, "DD-MM-YYYY");
      if (newDate.isValid()) {
        setSelectedDate(newDate);
        setCurrentDate(newDate);
      }
    }
  }, [value]);

  const generateDays = () => {
    const startOfMonth = currentDate.startOf("month");
    // Tuần bắt đầu Chủ Nhật => startDay là số thứ trong tuần của ngày đầu tháng, Chủ Nhật = 0
    const startDay = startOfMonth.day();

    const daysInMonth = currentDate.daysInMonth();

    const prevMonth = currentDate.subtract(1, "month");
    const daysInPrevMonth = prevMonth.daysInMonth();

    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
    const result = [];

    for (let i = 0; i < totalCells; i++) {
      if (i < startDay) {
        result.push({
          day: daysInPrevMonth - (startDay - 1 - i),
          isOutside: true,
          offset: -1,
        });
      } else if (i >= startDay + daysInMonth) {
        result.push({
          day: i - (startDay + daysInMonth) + 1,
          isOutside: true,
          offset: 1,
        });
      } else {
        result.push({
          day: i - startDay + 1,
          isOutside: false,
          offset: 0,
        });
      }
    }

    return result;
  };

  const daysArray = generateDays();

  const handlePrevMonth = () =>
    setCurrentDate((prev) => prev.subtract(1, "month"));

  const handleNextMonth = () => setCurrentDate((prev) => prev.add(1, "month"));

  const handleSelectDate = (item) => {
    let newDate = currentDate;
    if (item.isOutside) {
      newDate = currentDate.add(item.offset, "month");
      setCurrentDate(newDate);
    }
    const selected = newDate.date(item.day);
    setSelectedDate(selected);
    onDateSelect(selected.format("DD-MM-YYYY"));
  };

  // Xác định tuần của ngày đã chọn
  const getWeekOfDate = (date) => {
    return date.week();
  };

  const isSameWeek = (date) => {
    const weekOfSelected = getWeekOfDate(selectedDate);
    const weekOfCurrent = getWeekOfDate(date);
    return weekOfSelected === weekOfCurrent;
  };

  return (
    <div className={cx("calendar", className)}>
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

      <div className={cx("calendar__grid")}>
        {/* Chủ nhật lên đầu */}
        {["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"].map(
          (day, i) => (
            <div
              key={`weekday-${i}`}
              className={cx("calendar__cell", "calendar__weekday", {
                weekend: day === "Th 7" || day === "CN",
              })}
            >
              {day}
            </div>
          )
        )}

        {daysArray.map((item, index) => {
          const actualDate = currentDate
            .add(item.offset, "month")
            .date(item.day);
          const isToday = actualDate.isSame(dayjs(), "day");
          const isSelected = actualDate.isSame(selectedDate, "day");
          const dayOfWeek = actualDate.day();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isWeekHighlighted = highlightWeek && isSameWeek(actualDate);
          const isMarkDays = markDays.includes(actualDate.format("DD-MM-YYYY"));
          return (
            <div
              key={`day-${index}`}
              className={cx("calendar__cell", "calendar__day", {
                today: isToday,
                selected: isSelected,
                weekend: isWeekend,
                outside: item.isOutside,
                weekHighlighted: isWeekHighlighted,
              })}
              onClick={() => handleSelectDate(item)}
            >
              {item.day}
              {isMarkDays ? <div className={cx("dot")} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
