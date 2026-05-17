import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laila-collections-production.up.railway.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<any>) => {
    console.error("========== API ERROR ==========");
    console.error("MESSAGE:", error.message);
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("URL:", error.config?.url);
    console.error("METHOD:", error.config?.method);
    console.error("FULL ERROR:", error);
    console.error("================================");

    const status = error.response?.status;

    if (typeof window !== "undefined") {
      if (status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }

      if (!error.response) {
        console.error(
          "Backend tidak merespon / CORS / Network Error"
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;