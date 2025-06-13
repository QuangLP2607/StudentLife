// Định nghĩa kiểu dữ liệu cho lịch học
export interface Schedule {
  start_time: string;
  end_time: string;
  day: string;
  week_type: string;
  custom_weeks: string;
  location: string;
}

// Định nghĩa kiểu dữ liệu cho Môn học
export interface Course {
  name: string;
  schedules: Schedule[];
}

// Định nghĩa kiểu dữ liệu cho Kỳ học
export interface Semester {
  name: string;
  start_date: string;
  end_date: string;
  weeks: number;
  courses: Course[];
}
