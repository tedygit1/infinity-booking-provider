// src/api/index.js
import axios from "axios";

// ✅ Use /api — Vite proxy handles the rest (dev + production-ready)
const http = axios.create({
  baseURL: "/api", // 👈 All requests go to /api/* → proxied to backend
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach provider token if available
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("provider_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error logging
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return Promise.reject(
      error.response?.data || { message: "⚠️ Network or server error" }
    );
  }
);

export default http;