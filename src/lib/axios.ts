import axios from "axios";

// const api = axios.create({
//   // baseURL: import.meta.env.API_BASE_URL,
//   baseURL: "/rest",
// });

// const newApi = axios.create({
//   // baseURL: import.meta.env.VITE_NEWAPI_URL,
//   // baseURL: "http://78.13.6.44:7003",
//   // baseURL: "http://ercom-b.dev:80/portfolio-pool/",
//   baseURL: "https://ercom-b.dev:443/portfolio-pool/",
// });


console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Todas las env vars:', import.meta.env);

// const url = import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : import.meta.env.API_BASE_URL;
// const url = import.meta.env.MODE === 'development' ? "https://portfolio-pool-test.damnserver.com:443" : "https://portfolio-pool-prod.damnserver.com:443";
const url = "https://portfolio-pool-test.damnserver.com:443"

console.log('URL usada:', url);
console.log('cambios de 21 enero');


const apiEnv = axios.create({
  baseURL: url,
  // Si necesitas agregar rutas adicionales, puedes hacerlo así:
  // baseURL: `${import.meta.env.API_BASE_URL}/com.tapaszi.ws/rest`,
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("AuthTokenUpTask");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export { apiEnv };
