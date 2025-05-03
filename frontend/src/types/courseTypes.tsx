// Định nghĩa kiểu dữ liệu cho lịch học
export interface Schedule {
  startTime: string;
  endTime: string;
  day: string;
  weekType: string;
  customWeeks: string;
  location: string;
}

// Định nghĩa kiểu dữ liệu cho Môn học
export interface Course {
  name: string;
  department: string;
  schedule: Schedule[];
}

// Định nghĩa kiểu dữ liệu cho Kỳ học
export interface SemesterData {
  semester: string;
  startDate: string;
  endDate: string;
  weeks: number;
  courses: Course[];
}
