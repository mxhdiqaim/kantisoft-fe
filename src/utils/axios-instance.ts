import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true, // Include credentials if needed
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add the token to the header
    }
    return config;
  },
  (error) => Promise.reject(error), // Handle request errors
);

export default axiosInstance;
