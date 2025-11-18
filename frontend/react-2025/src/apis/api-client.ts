import axios from 'axios'
import { ensureUserId } from '../lib/userIdentity'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${window.location.origin}/api`,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const userId = ensureUserId()
    config.headers['x-user-id'] = userId
    config.withCredentials = true
    return config
  },
  (error) => Promise.reject(error),
)

export interface AppError {
  statusCode: number
  timestamp: string
  path: string
  customErrorResponse: Array<{
    customErrorCode: number
    message: string
    property: string
    constraints: string | number
  }>
}

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { data, status } = error.response

    // 如果收到 401 未授權（或是 token 過期），則導頁到登入頁面
    if (status === 401) {
      window.location.href = '/login'
      return
    }

    // 返回標準化的 AppError
    return Promise.reject({
      statusCode: status,
      timestamp: data?.timestamp,
      path: data?.path,
      customErrorResponse: data?.customErrorResponse,
    } as AppError)
  },
)

export { axiosInstance }
