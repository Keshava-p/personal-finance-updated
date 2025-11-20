import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Remove redirect logic – it was breaking login page
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // simply remove token; DO NOT redirect
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export const auth = {
  //------------------------------------
  // LOGIN
  //------------------------------------
  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });

    // Expected backend format: { success, token, user, message }
    if (!res.data.success) {
      return { success: false, error: res.data.message };
    }

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return {
      success: true,
      token: res.data.token,
      user: res.data.user,
    };
  },

  //------------------------------------
  // REGISTER
  //------------------------------------
  register: async (userData: any) => {
    const res = await api.post("/auth/register", userData);

    if (!res.data.success) {
      return { success: false, error: res.data.message };
    }

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return {
      success: true,
      token: res.data.token,
      user: res.data.user,
    };
  },

  //------------------------------------
  // GET CURRENT USER
  //------------------------------------
  getMe: async () => {
    const res = await api.get("/auth/me");

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch user");
    }

    return res.data.user; // return ONLY `user`
  },

  //------------------------------------
  // LOGOUT
  //------------------------------------
  logout: () => {
    localStorage.removeItem("token");
  },
};

export default api;
