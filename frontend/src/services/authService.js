import apiClient from "./apiClient";

const login = (email, password) => {
  return apiClient.post("/auth/login", { email, password });
};

const signup = (name, email, password) => {
  return apiClient.post("/auth/signup", { name, email, password });
};

export default { login, signup };
