import apiClient from "./apiClient";

// Thêm kỳ học
const addSemester = (semester) => {
  return apiClient.post("/semesters/add", semester);
};

// Update học kỳ
const updateSemester = (semester) => {
  return apiClient.put(`/semesters/${semester.id}`, semester);
};

// Lấy danh sách kỳ học với
const getSemesters = () => {
  return apiClient.get("/semesters");
};

// Lấy chi tiết thông tin học kỳ
const getSemesterDetail = (semester_id) => {
  return apiClient.get(`/semesters/detail/${semester_id}`);
};

// Lấy chi tiết thông tin học kỳ
const getCourseDetail = (course_id) => {
  return apiClient.get(`/courses/detail/${course_id}`);
};

// Đổi tên kỳ học
const renameSemester = (semester_id, new_name) => {
  return apiClient.post("/semesters/rename", { semester_id, new_name });
};

// Xóa kỳ học
const deleteSemester = (semester_id) => {
  return apiClient.post("/semesters/delete", { semester_id });
};

export default {
  addSemester,
  updateSemester,
  getSemesters,
  getSemesterDetail,
  renameSemester,
  deleteSemester,
  getCourseDetail,
};
