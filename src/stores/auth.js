// ─── src/stores/auth.js ────────────────────────────────────────
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, senha) {
    const data = await authService.login(email, senha)
    token.value = data.token
    // Guarda dados básicos do usuário se vier no payload
    user.value = data.user || { email }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  async function register(nome, email, senha) {
    return authService.register(nome, email, senha)
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, login, register, logout }
})
