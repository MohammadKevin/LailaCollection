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

  (error: AxiosError<any>) => {
    const status = error.response?.status;

    const data = error.response?.data;

    console.error(
  "API ERROR FULL:",
  error,
);

console.error(
  "API RESPONSE:",
  error.response,
);

console.error(
  "API DATA:",
  error.response?.data,
);

console.error(
  "API STATUS:",
  error.response?.status,
);

console.error(
  "API URL:",
  error.config?.url,
);

    if (
      typeof window !== "undefined" &&
      status === 401
    ) {
      localStorage.removeItem("access_token");

      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;