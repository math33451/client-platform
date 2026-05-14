// ─── src/services/api.js ───────────────────────────────────────
// Configure a URL base do seu backend Java aqui:
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

import axios from 'axios'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
})

// Injeta o Bearer token em toda requisição se existir
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Trata respostas e erros globalmente
api.interceptors.response.use(
  res => res,
  err => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.response?.data ||
      err?.message ||
      'Ocorreu um erro inesperado.'

    // Se token inválido/expirado, desloga
    if (err?.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
)

export default api
