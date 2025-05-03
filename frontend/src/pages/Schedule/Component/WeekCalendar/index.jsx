import React, { useState } from "react";
import styles from "./WeekCalendar.module.scss";

const HOURS = Array.from({ length: 13 }, (_, i) => 6 + i); // 6AM -> 6PM
const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

const scheduleData = [
  {
    title: "Phương trình vi phân và chuỗi",
    day: 2,
    start: "06:45",
    end: "08:25",
    color: "#f87171",
    week: 3,
  },
  {
    title: "Tiếng Nhật 8",
    day: 3,
    start: "08:30",
    end: "10:15",
    color: "#60a5fa",
    week: 3,
  },
  {
    title: "Quản trị phần mềm",
    day: 4,
    start: "06:45",
    end: "08:25",
    color: "#f87171",
    week: 3,
  },
  {
    title: "Nhập môn khoa học dữ liệu",
    day: 4,
    start: "10:15",
    end: "11:45",
    color: "#fbbf24",
    week: 3,
  },
  {
    title: "Kỹ năng ITSS học bằng tiếng Nhật",
    day: 5,
    start: "14:10",
    end: "17:30",
    color: "#60a5fa",
    week: 3,
  },
];

function timeToRow(time) {
  const [h, m] = time.split(":").map(Number);
  return (h - 6) * 4 + Math.floor(m / 15) + 1;
}

export default function WeekCalendar() {
  const [week, setWeek] = useState(3);

  const weekData = scheduleData.filter((item) => item.week === week);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => setWeek((w) => Math.max(w - 1, 1))}>
          {"<"}
        </button>
        <span>Tuần {week}</span>
        <button onClick={() => setWeek((w) => w + 1)}>{">"}</button>
      </div>

      <div className={styles.grid}>
        <div className={styles.timeColumn}>
          {HOURS.map((h) => (
            <div key={h} className={styles.timeLabel}>
              {h < 12 ? `${h} AM` : `${h - 12} PM`}
            </div>
          ))}
        </div>

        {DAYS.map((day, colIdx) => (
          <div key={day} className={styles.dayColumn}>
            <div className={styles.dayHeader}>{day}</div>
            {weekData
              .filter((item) => item.day === colIdx + 2) // Thứ 2 → 2, Chủ nhật → 8
              .map((item, idx) => {
                const startRow = timeToRow(item.start);
                const endRow = timeToRow(item.end);
                return (
                  <div
                    key={idx}
                    className={styles.classBlock}
                    style={{
                      gridRow: `${startRow} / ${endRow}`,
                      backgroundColor: item.color,
                    }}
                  >
                    <div className={styles.timeText}>
                      {item.start} - {item.end}
                    </div>
                    <div>{item.title}</div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
