import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Schedule.module.scss";
import WeekCalendar from "./Component/WeekCalendar";
import MonthCalendar from "./Component/MonthCalendar";

const cx = classNames.bind(styles);

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className={cx("calendar")}>
      <MonthCalendar setSelectedDate={setSelectedDate} />
      <WeekCalendar />
    </div>
  );
}
