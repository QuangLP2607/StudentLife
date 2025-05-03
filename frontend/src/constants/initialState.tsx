import { SemesterData, Course } from "../types/courseTypes";

// Đặt giá trị khởi tạo cho Kỳ học
export const initialSemesterData: SemesterData = {
  semester: "",
  startDate: "",
  endDate: "",
  weeks: 18,
  courses: [],
};

// Đặt giá trị khởi tạo cho Môn học
export const initialCourse: Course = {
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
};
