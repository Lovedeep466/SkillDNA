import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach the login token to every request automatically,
// so pages never need to pass headers themselves.
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem("skilldna_user"));
    if (stored?.token) {
      config.headers.Authorization = `Bearer ${stored.token}`;
    }
  } catch {
    /* ignore a corrupted value, the request just goes without a token */
  }
  return config;
});

// If the token is rejected (expired or invalid), clear it and go to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("skilldna_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
