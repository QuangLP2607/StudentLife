import React from "react";
import Calendar from "@components/Calendar";
import classNames from "classnames/bind";
import styles from "./MonthCalendar.module.scss";

const cx = classNames.bind(styles);

export default function MonthCalendar({ setSelectedDate }) {
  return (
    <div className={cx("wrapper")}>
      <Calendar
        className={cx("custom-calendar")}
        onDateSelect={(date) => setSelectedDate(date)}
        highlightWeek={true}
      />
    </div>
  );
}
