import apiClient from "./apiClient";

// Thêm note
const addNote = (content) => {
  return apiClient.post("/notes/add", { content });
};

// lấy danh sách note
const getNotes = () => {
  return apiClient.get("/notes");
};

// lấy danh sách note
const updateNote = (id, data) => {
  return apiClient.put(`/notes/${id}`, data);
};

// xoá note
const deleteNote = (noteId) => {
  return apiClient.delete(`/notes/${noteId}`);
};

export default { addNote, getNotes, updateNote, deleteNote };
