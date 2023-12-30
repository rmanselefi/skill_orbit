import axios from "axios";

// Create an Axios instance with custom configuration
const instance = axios.create({
  baseURL: process.env.API_URL,
});

// Set an interceptor to add the token to the Authorization header for every request
instance.interceptors.request.use((config) => {
  if (typeof window != undefined) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
