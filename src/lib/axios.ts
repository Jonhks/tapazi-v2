import axios from "axios";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "https://ercom-b.dev:8443/com.tapaszi.ws/rest",
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("AuthTokenUpTask");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
