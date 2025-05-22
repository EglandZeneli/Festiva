// src/axiosConfig.js
import axios from 'axios'

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
})

// grab token from your stored user object
API.interceptors.request.use(config => {
  try {
    const raw = localStorage.getItem('festivaUser')
    if (raw) {
      const { token } = JSON.parse(raw)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch (err) {
    // invalid JSON or missing token — fail silently
  }
  return config
})

export default API
