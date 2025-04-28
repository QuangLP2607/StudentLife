import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const login = (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};

const signup = (name, email, password) => {
  return axios.post(`${API_URL}/auth/signup`, { name, email, password });
};

export default { login, signup };
