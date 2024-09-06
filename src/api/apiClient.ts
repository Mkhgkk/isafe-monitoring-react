import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import config from "../config/default.config";

const apiClient = axios.create({
  // baseURL: "http://192.168.0.10:5000",
  baseURL: `http://${config.BACKEND_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization headers if needed
// apiClient.interceptors.request.use(
//   (config: any) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle errors globally
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
