import styles from "./WeekCalendar.module.scss";
import { Icon } from "@iconify/react";

const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

// Tạo nhãn thời gian từ 5AM đến 6PM
const TIME_LABELS = Array.from({ length: 14 }, (_, i) => {
  const hour = 5 + i;
  const ampm = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12} ${ampm}`;
});

function timeToRow(time) {
  const [h, m] = time.split(":").map(Number);
  return (h - 5) * 4 + Math.floor(m / 15) + 3;
}

const COLORS = [
  "#f87171",
  "#60a5fa",
  "#fbbf24",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
];

const getColorForId = (id) => {
  const hash = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
};

export default function WeekCalendar({
  weekData,
  handleChangeWeek,
  currentWeek,
}) {
  const scheduleData = weekData.map((item) => ({
    title: item.name,
    day: parseInt(item.day),
    start: item.startTime.slice(0, 5),
    end: item.endTime.slice(0, 5),
    color: getColorForId(item.id),
    location: item.location,
  }));

  return (
    <div className={styles["week-calendar"]}>
      <div className={styles["week-calendar__header"]}>
        <button onClick={() => handleChangeWeek(-1)}>
          <Icon icon="material-symbols:arrow-back-ios-rounded" />
        </button>
        <span>Tuần {currentWeek}</span>
        <button onClick={() => handleChangeWeek(1)}>
          <Icon
            style={{ transform: "rotate(180deg)" }}
            icon="material-symbols:arrow-back-ios-rounded"
          />
        </button>
      </div>

      <div className={styles["week-calendar__grid"]}>
        <div className={styles["week-calendar__time-column"]}>
          <div style={{ height: 40 }}></div>
          {TIME_LABELS.map((label, idx) => (
            <div
              key={idx}
              className={styles["week-calendar__time-label"]}
              style={{ gridRow: idx * 4 + 2 }}
            >
              {label}
            </div>
          ))}
        </div>

        {DAYS.map((day, colIdx) => (
          <div key={day} className={styles["week-calendar__day-column"]}>
            <div className={styles["week-calendar__day-header"]}>{day}</div>
            {scheduleData
              .filter((item) => item.day === colIdx + 1)
              .map((item, idx) => {
                const startRow = timeToRow(item.start);
                const endRow = timeToRow(item.end);
                if (startRow >= endRow) return null;

                return (
                  <div
                    key={idx}
                    className={styles["week-calendar__class-block"]}
                    style={{
                      gridRow: `${startRow} / ${endRow}`,
                      backgroundColor: item.color,
                    }}
                  >
                    <div className={styles["week-calendar__class-block-time"]}>
                      {item.start} - {item.end}
                    </div>
                    <div className={styles["week-calendar__class-block-title"]}>
                      {item.title}
                    </div>
                    <div
                      className={styles["week-calendar__class-block-location"]}
                    >
                      {item.location}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
