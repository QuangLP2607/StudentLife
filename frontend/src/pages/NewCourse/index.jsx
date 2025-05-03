import { useState } from "react";
import classNames from "classnames/bind";
import CourseCalendar from "@components/CourseCalendar";
import ContentFirst from "./Components/ContentFirst";
import ContentSecond from "./Components/ContentSecond";
import styles from "./NewCourse.module.scss";
import {
  initialSemesterData,
  initialCourse,
} from "../../constants/initialState";

const cx = classNames.bind(styles);

export default function NewCourses() {
  const [semesterData, setSemesterData] = useState(initialSemesterData);
  const [course, setCourse] = useState(initialCourse);

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const showAlert = (message, type = "success") => {
    alert(`${type}: ${message}`);
  };

  const handleSaveCourse = () => {
    const {
      name,
      department,
      schedule: { startTime, endTime, day, location },
    } = course;

    if (!name || !department || !startTime || !endTime || !day || !location) {
      showAlert("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    setSemesterData((prev) => {
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

    setCourse(initialCourse);

    setShowForm(false);
    setEditingCourse(null);
    showAlert("Lưu học phần thành công!", "success");
  };

  return (
    <div className={cx("new-course")}>
      <CourseCalendar semesterData={semesterData} />

      <div className={cx("new-course__content")}>
        <ContentFirst
          semesterData={semesterData}
          setSemesterData={setSemesterData}
          onAddCourse={() => {
            setShowForm(true);
            setEditingCourse(null);
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
        />
      </div>
    </div>
  );
}
