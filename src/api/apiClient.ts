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
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.AccessToken = token;
      config.headers.RefreshToken = refreshToken;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const authorizationError = error.response && error.response.status === 401;

    const originalRequest = error.config;

    if (authorizationError && originalRequest?.url !== "/api/user/auth") {
      const refreshToken = localStorage.getItem("refresh_token");
      const accessToken = localStorage.getItem("access_token");

      if (refreshToken && accessToken) {
        // Refresh token
        try {
          const response = await apiClient.get("/api/user/auth", {
            headers: {
              RefreshToken: refreshToken,
              AccessToken: accessToken,
              "Content-Type": "application/json",
            },
          });
          localStorage.setItem("access_token", response.data.new_access_token);

          const newRequestConfig = { ...originalRequest };
          newRequestConfig.headers = {
            ...newRequestConfig.headers,
            AccessToken: response.data.new_access_token,
          };

          return apiClient.request(newRequestConfig);
        } catch (error) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.replace("/login");
          return Promise.reject(error);
        }
      } else {
        // Logout user
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.replace("/login");
        return Promise.reject(error);
      }
    }
    // Handle errors globally
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
