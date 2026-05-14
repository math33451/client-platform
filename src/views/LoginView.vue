<template>
  <div class="auth-layout">
    <!-- Background decorative -->
    <div class="bg-orb orb-1" />
    <div class="bg-orb orb-2" />
    <div class="bg-grid" />

    <div class="auth-card animate-scale-in">
      <!-- Logo -->
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h1 class="brand-name">ClientFlow</h1>
      </div>

      <h2 class="auth-title">Bem-vindo de volta</h2>
      <p class="auth-sub">Entre com suas credenciais para continuar</p>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="field">
          <label class="field-label">E-mail</label>
          <input
            v-model="form.email"
            type="email"
            class="field-input"
            :class="{ error: errors.email }"
            placeholder="seu@email.com"
            autocomplete="email"
            @blur="validateEmail"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <div class="field">
          <label class="field-label">Senha</label>
          <div class="input-wrapper">
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              class="field-input"
              :class="{ error: errors.password }"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            <button type="button" class="eye-btn" @click="showPass = !showPass">
              {{ showPass ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner" />
          <span v-else>Entrar</span>
        </button>
      </form>

      <p class="auth-footer">
        Não tem uma conta?
        <router-link to="/register" class="auth-link">Cadastre-se</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { isValidEmail } from '@/composables/useValidation'

const router  = useRouter()
const auth    = useAuthStore()
const toast   = useToastStore()

const loading  = ref(false)
const showPass = ref(false)

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

function validateEmail() {
  if (!form.email) { errors.email = 'E-mail é obrigatório.'; return false }
  if (!isValidEmail(form.email)) { errors.email = 'Formato de e-mail inválido.'; return false }
  errors.email = ''; return true
}

function validateForm() {
  let ok = validateEmail()
  if (!form.password) { errors.password = 'Senha é obrigatória.'; ok = false }
  else errors.password = ''
  return ok
}

async function handleLogin() {
  if (!validateForm()) return
  loading.value = true
  try {
    await auth.login(form.email, form.password)
    toast.success('Login realizado com sucesso!')
    router.push('/dashboard')
  } catch (err) {
    toast.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(61,106,255,0.18) 0%, transparent 70%);
  top: -150px; left: -100px;
  animation: gridFloat 8s ease-in-out infinite;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(0,229,195,0.1) 0%, transparent 70%);
  bottom: -100px; right: -80px;
  animation: gridFloat 10s ease-in-out infinite reverse;
}
.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.auth-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 48px 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-card), var(--shadow-glow);
  position: relative;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}
.brand-icon {
  width: 40px; height: 40px;
  background: var(--accent-soft);
  border: 1px solid var(--border-focus);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent);
}
.brand-icon svg { width: 20px; height: 20px; }
.brand-name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
}

.auth-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.auth-sub {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 32px;
}

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.field { display: flex; flex-direction: column; gap: 7px; }
.field-label { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }

.field-input {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 12px 14px;
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none;
  width: 100%;
}
.field-input::placeholder { color: var(--text-muted); }
.field-input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.field-input.error { border-color: var(--danger); }
.field-input.error:focus { box-shadow: 0 0 0 3px var(--danger-soft); }

.field-error { font-size: 0.78rem; color: var(--danger); }

.input-wrapper { position: relative; }
.input-wrapper .field-input { padding-right: 44px; }
.eye-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 1rem; opacity: 0.6;
  transition: opacity var(--transition);
}
.eye-btn:hover { opacity: 1; }

.btn-primary {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 13px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-top: 4px;
}
.btn-primary:hover:not(:disabled) {
  background: #527aff;
  box-shadow: 0 4px 20px var(--accent-glow);
  transform: translateY(-1px);
}
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 0.88rem;
  color: var(--text-secondary);
}
.auth-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition);
}
.auth-link:hover { color: var(--accent-2); }

@media (max-width: 480px) {
  .auth-card { padding: 36px 24px; }
}
</style>
