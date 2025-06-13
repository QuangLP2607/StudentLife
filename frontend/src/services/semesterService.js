import apiClient from "./apiClient";

// Thêm kỳ học
const addSemester = (semester) => {
  return apiClient.post("/semesters/add", semester);
};

// Lấy danh sách kỳ học với user_id
const getSemesters = () => {
  return apiClient.get("/semesters/list");
};

// Đổi tên kỳ học
const renameSemester = (semester_id, new_name) => {
  return apiClient.post("/semesters/rename", { semester_id, new_name });
};

// Xóa kỳ học
const deleteSemester = (semester_id) => {
  return apiClient.post("/semesters/delete", { semester_id });
};

export default { addSemester, getSemesters, renameSemester, deleteSemester };
