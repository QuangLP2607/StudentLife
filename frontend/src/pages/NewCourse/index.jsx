import { useState } from "react";
import classNames from "classnames/bind";
import Calendar from "../../components/Layout/Calendar";
import ContentFirst from "./Components/ContentFirst";
import ContentSecond from "./Components/ContentSecond";
import styles from "./NewCourse.module.scss";

const cx = classNames.bind(styles);

export default function NewCourses() {
  const [semesterData, setSemesterData] = useState({
    semester: "",
    startDate: "",
    endDate: "",
    weeks: 18,
    courses: [],
  });

  const [course, setCourse] = useState({
    name: "",
    department: "",
    schedule: {
      startTime: "",
      endTime: "",
      day: "",
      weekType: "weekly",
      customWeeks: "",
      location: "",
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

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

    setCourse({
      name: "",
      department: "",
      schedule: {
        startTime: "",
        endTime: "",
        day: "",
        weekType: "weekly",
        customWeeks: "",
        location: "",
      },
    });

    setShowForm(false);
    setEditingCourse(null);
    showAlert("Lưu học phần thành công!", "success");
  };

  const handleDateSelect = (dateStr) => {
    const selectedDateParts = dateStr.split("-");
    const formattedSelectedDate = `${selectedDateParts[2]}-${selectedDateParts[1]}-${selectedDateParts[0]}`;
    const selectedDateObj = new Date(formattedSelectedDate);
    const startDateObj = new Date(semesterData.startDate);

    if (isNaN(selectedDateObj.getTime()) || isNaN(startDateObj.getTime())) {
      console.error("Ngày không hợp lệ");
      return;
    }

    setSelectedDate(selectedDateObj);

    // Điều chỉnh startDate về thứ 2 đầu tiên
    startDateObj.setDate(startDateObj.getDate() - startDateObj.getDay() + 1);

    const dayOfWeek = selectedDateObj.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const mondayOfSelectedWeek = new Date(selectedDateObj);
    mondayOfSelectedWeek.setDate(selectedDateObj.getDate() - diffToMonday);

    const diffMillis = mondayOfSelectedWeek.getTime() - startDateObj.getTime();
    const diffDays = Math.floor(diffMillis / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7) + 1;

    console.log("Week Number:", weekNumber);

    const coursesForSelectedWeek = semesterData.courses.filter((course) => {
      const courseDayOfWeek = parseInt(course.schedule.day);
      const selectedDayOfWeek = selectedDateObj.getDay();

      if (courseDayOfWeek !== selectedDayOfWeek) return false;

      switch (course.schedule.weekType) {
        case "weekly":
          return true;
        case "even":
          return weekNumber % 2 === 0;
        case "odd":
          return weekNumber % 2 !== 0;
        case "custom":
          return (
            Array.isArray(course.schedule.customWeeks) &&
            course.schedule.customWeeks.includes(weekNumber)
          );
        default:
          return false;
      }
    });

    setSelectedCourses(coursesForSelectedWeek);
  };

  return (
    <div className={cx("new-course")}>
      <div className={cx("new-course__calendar")}>
        <Calendar onDateSelect={handleDateSelect} />
        <hr />
        <h3>Thông tin chi tiết</h3>

        {selectedCourses.length > 0 ? (
          <div>
            <ul>
              {selectedCourses.map((course) => (
                <li key={course.id}>
                  <strong>{course.name}</strong> - {course.schedule.startTime}
                  đến {course.schedule.endTime}
                  <br />
                  Địa điểm: {course.schedule.location}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Không có lớp học vào ngày này.</p>
        )}
      </div>

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
