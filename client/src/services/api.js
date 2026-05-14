import axios from "axios";

import toast from "react-hot-toast";

/* =========================================================
   AXIOS INSTANCE
========================================================= */
const API = axios.create({
  baseURL:
    "http://localhost:5000/api",
});

/* =========================================================
   REQUEST INTERCEPTOR
   - Attach JWT token automatically
========================================================= */
API.interceptors.request.use(
  (config) => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem(
          "userInfo"
        )
      );

      if (userInfo?.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    } catch (error) {
      console.error(
        "Invalid localStorage userInfo:",
        error
      );

      localStorage.removeItem(
        "userInfo"
      );
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/* =========================================================
   RESPONSE INTERCEPTOR
   - Handle session expiry globally
========================================================= */
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status =
      error?.response?.status;

    /* -------------------------------
       SESSION EXPIRED
    -------------------------------- */
    if (status === 401) {
      localStorage.removeItem(
        "userInfo"
      );

      toast.error(
        "Session expired. Please login again."
      );

      setTimeout(() => {
        window.location.href =
          "/login";
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default API;