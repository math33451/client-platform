// ─── src/services/authService.js ──────────────────────────────
import api from './api'

export const authService = {
  // POST /auth/login  → { token }
  async login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha })
    return data // espera { token }
  },

  // POST /auth/register  → usuário criado
  async register(nome, email, senha) {
    const { data } = await api.post('/auth/register', { nome, email, senha })
    return data
  }
}
