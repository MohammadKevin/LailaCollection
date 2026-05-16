import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laila-collections-production.up.railway.app/api";

export const api = axios.create({
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
    if (typeof window !== "undefined") {
      const status = error.response?.status;

      const data = error.response?.data;

      let message = "Terjadi kesalahan";

      if (data) {
        if (typeof data.message === "string") {
          message = data.message;
        } else if (Array.isArray(data.message)) {
          message = data.message.join(", ");
        } else if ((data as any).error) {
          message = (data as any).error;
        }
      } else if (error.message) {
        message = error.message;
      }

      console.error("API ERROR:", {
        status,
        message,
        data,
        url: error.config?.url,
        method: error.config?.method,
      });

      if (status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");

        alert("Token telah kadaluarsa, silakan login ulang");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const uploadFile = async (
  url: string,
  file: File,
  extraData?: Record<string, any>
) => {
  const formData = new FormData();

  formData.append("file", file);

  if (extraData) {
    Object.keys(extraData).forEach((key) => {
      formData.append(key, extraData[key]);
    });
  }

  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const downloadFile = async (
  url: string,
  filename = "file"
) => {
  const res = await api.get(url, {
    responseType: "blob",
  });

  const blob = new Blob([res.data]);

  const link = document.createElement("a");

  link.href = window.URL.createObjectURL(blob);

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();
};

export default api;