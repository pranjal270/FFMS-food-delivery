import axios from "axios"

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true 
})


api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token")

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

export default api