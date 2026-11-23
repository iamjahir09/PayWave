import axios from "axios";
import API_BASE_URL from "./api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getApiError(error) {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (data?.errors) return Object.values(data.errors).join(", ");
  if (error?.code === "ECONNABORTED") return "Server response timed out. Please try again.";
  if (!error?.response) return "Cannot connect to PayWave server. Check that backend is running on port 8080.";
  return `Request failed (${error.response.status}). Please check your details.`;
}

export default apiClient;
