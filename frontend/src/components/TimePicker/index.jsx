import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./TimePicker.module.scss";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

export default function TimePicker({ value, onChange }) {
  const [mode, setMode] = useState("hour");
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmPm] = useState("AM");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);

  // Đồng bộ state khi value (string 24h: "HH:mm") thay đổi
  useEffect(() => {
    if (value && typeof value === "string") {
      const [h, m] = value.split(":").map(Number);
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const ampmValue = h >= 12 ? "PM" : "AM";

      setHour(h12);
      setMinute(m);
      setAmPm(ampmValue);
    }
  }, [value]);

  // Đóng popup khi click ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
        setMode("hour");
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Tính góc quay kim đồng hồ
  const getRotation = () => {
    if (mode === "hour") {
      return (hour % 12) * 30;
    } else {
      return minute * 6;
    }
  };

  // Xử lý chọn số (giờ hoặc phút)
  const handleSelect = (val) => {
    if (mode === "hour") {
      setHour(val);
      setMode("minute");
    } else {
      setMinute(val);
      setOpen(false);
      setMode("hour");

      // Tính giờ theo 24h để trả về
      let finalHour = hour;
      if (ampm === "AM" && hour === 12) finalHour = 0;
      if (ampm === "PM" && hour < 12) finalHour = hour + 12;

      const timeString = `${finalHour.toString().padStart(2, "0")}:${val
        .toString()
        .padStart(2, "0")}`;

      onChange?.({
        target: {
          value: timeString,
        },
      });
    }
  };

  // Chuyển AM/PM, cập nhật và trigger onChange theo giờ 24h
  const handleAmPmChange = (value) => {
    setAmPm(value);

    let finalHour = hour;
    if (value === "AM" && hour === 12) finalHour = 0;
    else if (value === "PM" && hour < 12) finalHour = hour + 12;
    else if (value === "AM" && hour < 12) finalHour = hour;
    else if (value === "PM" && hour === 12) finalHour = 12;

    const timeString = `${finalHour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    onChange?.({
      target: {
        value: timeString,
      },
    });
  };

  // Hiển thị input với định dạng 24h (ví dụ 13:05)
  const formatTime24h = (h, m, ampm) => {
    let finalHour = h;
    if (ampm === "AM" && h === 12) finalHour = 0;
    else if (ampm === "PM" && h < 12) finalHour = h + 12;
    return `${finalHour.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
  };

  // Render số trên mặt đồng hồ
  const renderNumbers = () => {
    const values =
      mode === "hour"
        ? [...Array(12).keys()].map((i) => i + 1)
        : [...Array(12).keys()].map((i) => i * 5);
    const radius = 100;

    return values.map((val, i) => {
      const angle = (360 / values.length) * i - 90;
      const x = radius + radius * 0.8 * Math.cos((angle * Math.PI) / 180);
      const y = radius + radius * 0.8 * Math.sin((angle * Math.PI) / 180);
      return (
        <div
          key={val}
          className={cx("picker__number")}
          style={{ left: `${x}px`, top: `${y}px` }}
          onClick={() => handleSelect(val)}
        >
          {val.toString().padStart(2, "0")}
        </div>
      );
    });
  };

  return (
    <div className={cx("picker")} ref={wrapperRef}>
      <div className={cx("picker__input")}>
        <input
          type="text"
          readOnly
          className={cx("picker__input-button")}
          value={formatTime24h(hour, minute, ampm)}
          onClick={() => setOpen(!open)}
          aria-label="Chọn giờ phút"
        />
        <Icon icon="tabler:clock" className={cx("picker__input-icon")} />
      </div>

      {open && (
        <div className={cx("picker__clock")}>
          <button
            className={cx("picker__clock-toggle")}
            onClick={() => setMode(mode === "hour" ? "minute" : "hour")}
          >
            {mode === "hour" ? "Chọn giờ" : "Chọn phút"}
          </button>

          <div className={cx("picker__ampm-toggle")}></div>

          <div className={cx("picker__clock-1")}>
            <div
              className={cx("picker__clock-hand")}
              style={{ transform: `rotate(${getRotation()}deg)` }}
            />
            <div className={cx("picker__clock-dot")} />
            {renderNumbers()}
            <div className={cx("picker__ampm")}>
              <button
                type="button"
                className={cx("picker__ampm-button", { active: ampm === "AM" })}
                onClick={() => handleAmPmChange("AM")}
              >
                AM
              </button>
              <button
                type="button"
                className={cx("picker__ampm-button", { active: ampm === "PM" })}
                onClick={() => handleAmPmChange("PM")}
              >
                PM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
