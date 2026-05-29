import axios from "axios";

const API_BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000/api"
  : "https://task-management-system-sixe.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const refreshUrl = import.meta.env.MODE === "development"
          ? "http://localhost:8000/api/token/refresh/"
          : "https://task-management-system-sixe.onrender.com/api/token/refresh/";

        const res = await axios.post(refreshUrl, { refresh });
        localStorage.setItem("access", res.data.access);
        API.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;
        originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
        return API(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default API;