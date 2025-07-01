import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const accessToken = localStorage.getItem("accessToken");

const uploadFile = (formData, course_id) => {
  return axios.post(`${API_URL}/upload?course_id=${course_id}`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const getFileList = (course_id) => {
  return axios.get(`${API_URL}/upload/list`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      course_id,
    },
  });
};

export default {
  uploadFile,
  getFileList,
};
