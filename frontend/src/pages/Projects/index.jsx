import React, { useContext, useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Projects.module.scss";
import { SemesterContext } from "../../contexts/SemesterContext";
import semesterService from "../../services/semesterService";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

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

function hashStringToNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default function Projects() {
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

  const getColorByProject = (project) => {
    const key = project.name || project.id.toString();
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
      <div className={cx("projects")}>
        <h2>Danh sách đồ án</h2>

        {semester?.projects?.length ? (
          <div className={cx("projects__list")}>
            {semester.projects.map((project) => (
              <div
                key={project.id}
                className={cx("projects__item")}
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div
                  className={cx("projects__item-avatar")}
                  style={{ backgroundColor: getColorByProject(project) }}
                >
                  {getTwoChars(project.name)}
                </div>
                <div className={cx("projects__item-info")}>
                  <div className={cx("projects__item-name")}>
                    {project.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có đồ án nào!</p>
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
