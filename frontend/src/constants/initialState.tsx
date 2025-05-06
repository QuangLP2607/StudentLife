import { Semester, Course } from "../types/courseTypes";

// Đặt giá trị khởi tạo cho Kỳ học
export const initialSemester: Semester = {
  name: "",
  start_date: "",
  end_date: "",
  weeks: 18,
  courses: [],
};

// Đặt giá trị khởi tạo cho Môn học
export const initialCourse = {
  name: "",
  schedules: [
    {
      start_time: "",
      end_time: "",
      day: "",
      week_type: "weekly",
      location: "",
    },
  ],
};

export const initialSchedule = {
  start_time: "",
  end_time: "",
  day: "",
  week_type: "weekly",
  custom_weeks: "",
  location: "",
};
