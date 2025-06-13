import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@components/Arlert";
import { useAlert } from "../../hooks/useAlert";
import classNames from "classnames/bind";
import CourseCalendar from "@components/CourseCalendar";
import ContentFirst from "./Components/ContentFirst";
import ContentSecond from "./Components/ContentSecond";
import styles from "./NewCourse.module.scss";
import { initialSemester, initialCourse } from "../../constants/initialState";
import semesterService from "../../services/semesterService";

const cx = classNames.bind(styles);

export default function NewCourses() {
  const [semester, setSemester] = useState(initialSemester);
  const [course, setCourse] = useState(initialCourse);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { alert, showAlert, clearAlert } = useAlert();
  const navigate = useNavigate();

  const handleSaveSemester = async () => {
    if (
      !semester.name ||
      !semester.start_date ||
      !semester.end_date ||
      !semester.weeks
    ) {
      showAlert("Vui lòng điền đầy đủ thông tin học kỳ!", "error");
      return;
    }

    try {
      await semesterService.addSemester(semester);
      showAlert("Lưu học kỳ thành công!", "success");
      localStorage.setItem("semester", JSON.stringify(semester));
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      showAlert("Có lỗi xảy ra khi lưu học kỳ!", "error");
      console.error(error);
    }
  };

  const handleSaveCourse = () => {
    const { name, schedules } = course;
    if (!name) return showAlert("Vui lòng điền đầy đủ thông tin!", "error");
    if (!schedules.length)
      return showAlert("Vui lòng thêm ít nhất một lịch học!", "error");

    for (let i = 0; i < schedules.length; i++) {
      const { start_time, end_time, day, location } = schedules[i];
      if (!start_time || !end_time || !day || !location) {
        showAlert(`Lịch học ${i + 1} chưa đầy đủ thông tin!`, "error");
        return;
      }
    }

    setSemester((prev) => {
      const currentCourses = prev.courses || [];
      let updatedCourses;

      if (editingCourse) {
        updatedCourses = currentCourses.map((c) =>
          c.id === editingCourse.id ? { ...course, id: editingCourse.id } : c
        );
      } else {
        const newCourse = { ...course, id: Date.now() };
        updatedCourses = [...currentCourses, newCourse];
      }

      return {
        ...prev,
        courses: updatedCourses,
      };
    });

    setShowForm(false);
    setCourse(initialCourse);
    setEditingCourse(null);
    showAlert("Lưu học phần thành công!", "success");
  };

  return (
    <div className={cx("new-course")}>
      <CourseCalendar semester={semester} />
      <div className={cx("new-course__content")}>
        <ContentFirst
          semester={semester}
          setSemester={setSemester}
          onAddCourse={() => {
            setCourse(initialCourse);
            setEditingCourse(null);
            setShowForm(true);
          }}
          onEditCourse={(course) => {
            setEditingCourse(course);
            setShowForm(true);
          }}
        />

        <div
          style={{ width: "1px", backgroundColor: "#ccc", margin: "20px 0" }}
        />

        <ContentSecond
          showForm={showForm}
          setShowForm={setShowForm}
          editingCourse={editingCourse}
          course={course}
          setCourse={setCourse}
          handleSaveCourse={handleSaveCourse}
          handleSaveSemester={handleSaveSemester}
        />
      </div>
      <Alert alert={alert} clearAlert={clearAlert} />
    </div>
  );
}
