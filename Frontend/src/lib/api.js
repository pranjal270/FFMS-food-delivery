import axios from "axios"

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true  // sends HttpOnly cookies cross-site
})

export default api
