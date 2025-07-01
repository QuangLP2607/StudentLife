import React, { useState, useRef, useEffect } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import classNames from "classnames/bind";
import styles from "./WeekPicker.module.scss";

const cx = classNames.bind(styles);

export default function WeekPicker({ onChange, defaultValue }) {
  const [selectedDay, setSelectedDay] = useState();
  const [hoveredDay, setHoveredDay] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef();

  const getFullWeek = (day) => ({
    from: startOfWeek(day, { weekStartsOn: 1 }),
    to: endOfWeek(day, { weekStartsOn: 1 }),
  });

  const handleDayClick = (day) => {
    setSelectedDay(day);
    const range = getFullWeek(day);
    onChange?.(range);
    setShowPicker(false);
  };

  const handleDayMouseEnter = (day) => {
    setHoveredDay(day);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (defaultValue) {
      setSelectedDay(defaultValue);
      const range = getFullWeek(defaultValue);
      onChange?.(range);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weekStart = selectedDay
    ? startOfWeek(selectedDay, { weekStartsOn: 1 })
    : null;
  const displayValue = weekStart ? format(weekStart, "dd/MM/yyyy") : "";

  const selectedRange = selectedDay ? getFullWeek(selectedDay) : undefined;

  return (
    <div className={cx("container")} ref={ref}>
      <input
        type="text"
        readOnly
        value={displayValue}
        onClick={() => setShowPicker(!showPicker)}
        placeholder="Chọn tuần"
        className={cx("input")}
      />
      {showPicker && (
        <div className={cx("picker")}>
          <DayPicker
            classNames={{
              button_next: cx("customNextButton"),
              button_previous: cx("customPrevButton"),
              day: cx("customDay"),
              month: cx("customMonth"),
            }}
            weekStartsOn={1}
            showOutsideDays
            onDayClick={handleDayClick}
            onDayMouseEnter={handleDayMouseEnter}
            selected={selectedDay}
            modifiers={{
              selectedWeek: selectedRange ? [selectedRange] : [],
              startOfWeek: selectedRange ? [selectedRange.from] : [],
              endOfWeek: selectedRange ? [selectedRange.to] : [],
              hoveredDay: hoveredDay ? [hoveredDay] : [],
            }}
            modifiersStyles={{
              hoveredDay: {
                backgroundColor: "#f59393",
                borderRadius: "20%",
                color: "white",
              },
              selectedWeek: {
                fontWeight: "bold",
                backgroundColor: "#ffb3b3",
                color: "white",
              },
              startOfWeek: {
                borderRadius: "20% 0 0  20%",
              },
              endOfWeek: {
                borderRadius: "0 20%  20% 0",
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
