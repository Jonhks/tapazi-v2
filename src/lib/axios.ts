import axios from "axios";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "https://ercom-b.dev:8443/com.tapaszi.ws/rest",
});

const newApi = axios.create({
  // baseURL: import.meta.env.VITE_NEWAPI_URL,
  // baseURL: "http://78.13.6.44:7003",
  baseURL: "http://ercom-b.dev:80/portfolio-pool/",
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("AuthTokenUpTask");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export { api, newApi };
