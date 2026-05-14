<template>
  <AppLayout>
    <div class="dashboard">
      <!-- Header -->
      <div class="dash-header animate-fade-in">
        <div>
          <h1 class="dash-title">Olá, {{ firstName }} 👋</h1>
          <p class="dash-sub">Aqui está um resumo da sua base de clientes.</p>
        </div>
        <router-link to="/clients" class="btn-accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
          Ver clientes
        </router-link>
      </div>

      <!-- Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card animate-fade-in-up" style="animation-delay: 0.05s">
          <div class="stat-icon accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Clientes ativos</span>
            <div class="stat-value">
              <span v-if="loading" class="skeleton" />
              <span v-else>{{ stats.totalActive ?? '—' }}</span>
            </div>
          </div>
          <div class="stat-badge accent">Ativo</div>
        </div>

        <div class="stat-card animate-fade-in-up" style="animation-delay: 0.1s">
          <div class="stat-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Novos este mês</span>
            <div class="stat-value">
              <span v-if="loading" class="skeleton" />
              <span v-else>{{ stats.lastMonth ?? '—' }}</span>
            </div>
          </div>
          <div class="stat-badge success">Último mês</div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="section animate-fade-in-up" style="animation-delay: 0.2s">
        <h3 class="section-title">Ações rápidas</h3>
        <div class="actions-grid">
          <button class="action-card" @click="$router.push('/clients')">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <div class="action-text">
              <strong>Ver todos os clientes</strong>
              <span>Gerencie sua base de clientes</span>
            </div>
            <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          <button class="action-card" @click="showNewClient">
            <div class="action-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <div class="action-text">
              <strong>Novo cliente</strong>
              <span>Adicionar um novo cliente</span>
            </div>
            <svg class="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { clientService } from '@/services/clientService'

const router = useRouter()
const auth   = useAuthStore()
const toast  = useToastStore()

const loading = ref(true)
const stats   = reactive({ totalActive: null, lastMonth: null })

const firstName = computed(() => {
  const name = auth.user?.name || auth.user?.email || 'Usuário'
  return name.split(' ')[0]
})

async function loadStats() {
  loading.value = true
  try {
    const [active, monthly] = await Promise.all([
      clientService.getTotalActive(),
      clientService.getCreatedLastMonth()
    ])
    // Aceita tanto { count: N } quanto N direto
    stats.totalActive = typeof active === 'object' ? active.count ?? active.total ?? active : active
    stats.lastMonth   = typeof monthly === 'object' ? monthly.count ?? monthly.total ?? monthly : monthly
  } catch (err) {
    toast.error('Erro ao carregar estatísticas: ' + err)
  } finally {
    loading.value = false
  }
}

function showNewClient() {
  router.push({ path: '/clients', query: { new: '1' } })
}

onMounted(loadStats)
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 32px; }

.dash-header {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  flex-wrap: wrap;
}
.dash-title { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; }
.dash-sub   { color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px; }

.btn-accent {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent); color: #fff;
  text-decoration: none;
  padding: 10px 20px; border-radius: var(--radius-sm);
  font-size: 0.88rem; font-weight: 600;
  transition: all var(--transition);
  white-space: nowrap;
}
.btn-accent svg { width: 16px; height: 16px; }
.btn-accent:hover { background: #527aff; transform: translateY(-1px); box-shadow: 0 4px 20px var(--accent-glow); }

/* ── Stat Cards ────────────────────────────────────────── */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex; align-items: center; gap: 18px;
  position: relative; overflow: hidden;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.stat-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 60%, rgba(61,106,255,0.05));
  pointer-events: none;
}
.stat-card:hover { border-color: var(--accent); box-shadow: var(--shadow-glow); }

.stat-icon {
  width: 48px; height: 48px; flex-shrink: 0;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
}
.stat-icon svg { width: 22px; height: 22px; }
.stat-icon.accent { background: var(--accent-soft); color: var(--accent); border: 1px solid rgba(61,106,255,0.25); }
.stat-icon.success { background: var(--success-soft); color: var(--success); border: 1px solid rgba(0,201,141,0.25); }

.stat-content { flex: 1; }
.stat-label { font-size: 0.8rem; color: var(--text-secondary); display: block; margin-bottom: 6px; }
.stat-value { font-family: var(--font-display); font-size: 2rem; font-weight: 800; line-height: 1; }

.skeleton {
  display: block; width: 60px; height: 32px;
  background: linear-gradient(90deg, var(--border) 25%, var(--bg-card-hover) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--radius-sm);
}

.stat-badge {
  position: absolute; top: 16px; right: 16px;
  font-size: 0.68rem; font-weight: 600; padding: 3px 8px;
  border-radius: 99px;
}
.stat-badge.accent { background: var(--accent-soft); color: var(--accent); }
.stat-badge.success { background: var(--success-soft); color: var(--success); }

/* ── Section ──────────────────────────────────────────── */
.section { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--text-secondary); }

/* ── Action Cards ─────────────────────────────────────── */
.actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }

.action-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 20px; display: flex; align-items: center; gap: 16px;
  cursor: pointer; text-align: left; width: 100%;
  transition: all var(--transition);
}
.action-card:hover {
  border-color: var(--accent); background: var(--bg-card-hover);
  transform: translateY(-2px); box-shadow: var(--shadow-card);
}

.action-icon {
  width: 40px; height: 40px; flex-shrink: 0;
  background: var(--accent-soft); border: 1px solid rgba(61,106,255,0.2);
  border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;
  color: var(--accent);
}
.action-icon svg { width: 18px; height: 18px; }
.action-icon.success { background: var(--success-soft); border-color: rgba(0,201,141,0.2); color: var(--success); }

.action-text { flex: 1; }
.action-text strong { display: block; font-size: 0.9rem; color: var(--text-primary); }
.action-text span { font-size: 0.78rem; color: var(--text-muted); }

.action-arrow { width: 18px; height: 18px; color: var(--text-muted); }

@media (max-width: 480px) {
  .dash-title { font-size: 1.4rem; }
  .dash-header { flex-direction: column; align-items: flex-start; }
  .stat-value { font-size: 1.6rem; }
}
</style>
