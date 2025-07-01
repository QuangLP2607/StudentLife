import React, { useContext, useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Courses.module.scss";
import { SemesterContext } from "../../contexts/SemesterContext";
import semesterService from "../../services/semesterService";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

// List màu đẹp để chọn random
const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#556270",
  "#C7F464",
  "#FF6F91",
  "#845EC2",
  "#D65DB1",
  "#FF9671",
  "#00C9A7",
  "#0081CF",
];

// Hàm hash đơn giản từ chuỗi sang số
function hashStringToNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default function Courses() {
  const navigate = useNavigate();
  const [semester, setSemester] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const { semesterId } = useContext(SemesterContext);
  const [activeSemesterId, setActiveSemesterId] = useState(null);

  useEffect(() => {
    if (semesterId) {
      setActiveSemesterId(semesterId);

      const fetchSemesterDetail = async () => {
        try {
          const response = await semesterService.getSemesterDetail(semesterId);
          setSemester(response.data.data.semester);
        } catch (err) {
          console.error("Lỗi khi lấy chi tiết kỳ học:", err);
        }
      };

      fetchSemesterDetail();
    }
  }, [semesterId]);

  useEffect(() => {
    async function fetchSemesters() {
      try {
        const response = await semesterService.getSemesters();
        setSemesters(response.data.data.semesters);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách kỳ học:", err);
      }
    }

    fetchSemesters();
  }, []);

  const getTwoChars = (str) => {
    if (!str) return "";
    const words = str.trim().split(" ");
    const firstChar = words[0]?.charAt(0).toUpperCase() || "";
    const secondChar = words[1]?.charAt(0).toUpperCase() || "";
    return firstChar + secondChar;
  };

  // Lấy màu dựa trên tên course (hoặc id)
  const getColorByCourse = (course) => {
    const key = course.name || course.id.toString();
    const index = hashStringToNumber(key) % colors.length;
    return colors[index];
  };

  const handleSemesterClick = async (semesterId) => {
    setActiveSemesterId(semesterId);

    try {
      const response = await semesterService.getSemesterDetail(semesterId);
      setSemester(response.data.data.semester);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết kỳ học:", err);
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("courses")}>
        <h2>Danh sách môn học</h2>

        {semester?.courses?.length ? (
          <div className={cx("courses__list")}>
            {semester.courses.map((course) => (
              <div
                key={course.id}
                className={cx("courses__item")}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div
                  className={cx("courses__item-avatar")}
                  style={{ backgroundColor: getColorByCourse(course) }}
                >
                  {getTwoChars(course.name)}
                </div>
                <div className={cx("courses__item-info")}>
                  <div className={cx("courses__item-name")}>{course.name}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có khóa học nào!</p>
        )}
      </div>

      <div className={cx("dashboard")}>
        <h3 style={{ margin: "0" }}>Học Kỳ</h3>
        <hr style={{ width: "100%" }}></hr>
        {semesters.map((semesterItem) => (
          <div
            key={semesterItem.id}
            className={cx("dashboard__item", {
              active: semesterItem.id === activeSemesterId,
            })}
            onClick={() => handleSemesterClick(semesterItem.id)}
          >
            {semesterItem.name}
          </div>
        ))}
      </div>
    </div>
  );
}
