import apiClient from "./apiClient";

// Thêm bài đăng
const addPost = (postData) => {
  return apiClient.post("/posts/add", postData);
};

// lấy danh sách bài đăng
const getPosts = ({ courseId, studyGroupId }) => {
  const params = new URLSearchParams();
  if (courseId) params.append("courseId", courseId);
  if (studyGroupId) params.append("studyGroupId", studyGroupId);
  return apiClient.get(`/posts?${params.toString()}`);
};

// lấy danh sách tất cả bài đăng
const getAllPosts = () => {
  return apiClient.get("/posts/all");
};

export default { addPost, getPosts, getAllPosts };
