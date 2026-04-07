import axios from "axios"

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001"

const api = axios.create({
  baseURL: apiBaseUrl
})

let isRefreshing = false
let pendingQueue = []

const flushQueue = (error, token = "") => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
      return
    }

    resolve(token)
  })

  pendingQueue = []
}

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token")

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const shouldRefresh =
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/api/auth/login") &&
      !originalRequest?.url?.includes("/api/auth/signup") &&
      !originalRequest?.url?.includes("/api/auth/forgot-password") &&
      !originalRequest?.url?.includes("/api/auth/refresh")

    if (!shouldRefresh) {
      return Promise.reject(error)
    }

    const savedRefreshToken = localStorage.getItem("refreshToken")
    if (!savedRefreshToken) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/refresh`, {
        refreshToken: savedRefreshToken
      })

      const { accessToken, refreshToken, user } = response.data
      localStorage.setItem("token", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("user", JSON.stringify(user))

      flushQueue(null, accessToken)

      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      flushQueue(refreshError)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
