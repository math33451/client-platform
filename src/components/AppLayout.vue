<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span class="brand-name">ClientFlow</span>
        </div>
        <button class="sidebar-close" @click="sidebarOpen = false">✕</button>
      </div>

      <nav class="nav">
        <router-link to="/dashboard" class="nav-item" @click="sidebarOpen = false">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </span>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/clients" class="nav-item" @click="sidebarOpen = false">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          <span>Clientes</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-details">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">Administrador</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout" title="Sair">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>

    <!-- Overlay mobile -->
    <div class="overlay" :class="{ show: sidebarOpen }" @click="sidebarOpen = false" />

    <!-- Main Content -->
    <div class="main">
      <header class="topbar">
        <button class="menu-btn" @click="sidebarOpen = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <h2 class="page-title">{{ pageTitle }}</h2>
        <div class="topbar-right">
          <div class="user-chip">
            <div class="chip-avatar">{{ userInitial }}</div>
            <span class="chip-name">{{ userName }}</span>
          </div>
        </div>
      </header>

      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()
const toast  = useToastStore()

const sidebarOpen = ref(false)

const userName    = computed(() => auth.user?.name || auth.user?.email || 'Usuário')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())
const pageTitle   = computed(() => route.name === 'Dashboard' ? 'Dashboard' : 'Clientes')

function handleLogout() {
  auth.logout()
  toast.info('Sessão encerrada.')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

/* ── Sidebar ─────────────────────────────────────────── */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  z-index: 100;
  transition: transform var(--transition-slow);
}

.sidebar-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border);
}
.brand { display: flex; align-items: center; gap: 10px; }
.brand-icon {
  width: 34px; height: 34px;
  background: var(--accent-soft); border: 1px solid var(--border-focus);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center; color: var(--accent);
}
.brand-icon svg { width: 16px; height: 16px; }
.brand-name { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; }

.sidebar-close { display: none; background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 1rem; }

.nav {
  flex: 1;
  padding: 16px 12px;
  display: flex; flex-direction: column; gap: 4px;
}

.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background var(--transition), color var(--transition);
}
.nav-item:hover { background: var(--accent-soft); color: var(--text-primary); }
.nav-item.router-link-active {
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid rgba(61,106,255,0.2);
}
.nav-icon { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
.nav-icon svg { width: 18px; height: 18px; }

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
}
.user-info { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.user-avatar {
  width: 34px; height: 34px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.85rem; color: #fff;
}
.user-details { display: flex; flex-direction: column; min-width: 0; }
.user-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 0.72rem; color: var(--text-muted); }

.logout-btn {
  width: 32px; height: 32px; flex-shrink: 0;
  background: none; border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text-muted);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
}
.logout-btn:hover { border-color: var(--danger); color: var(--danger); background: var(--danger-soft); }
.logout-btn svg { width: 16px; height: 16px; }

/* ── Main ─────────────────────────────────────────────── */
.main {
  flex: 1;
  margin-left: 240px;
  display: flex; flex-direction: column;
  min-height: 100vh;
}

.topbar {
  height: 64px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center;
  padding: 0 24px; gap: 16px;
  position: sticky; top: 0; z-index: 50;
}
.menu-btn {
  display: none; background: none; border: none; color: var(--text-secondary);
  cursor: pointer; padding: 4px;
}
.menu-btn svg { width: 22px; height: 22px; }

.page-title {
  font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; flex: 1;
}
.topbar-right { display: flex; align-items: center; gap: 12px; }

.user-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px 6px 6px;
  background: var(--bg-base); border: 1px solid var(--border);
  border-radius: 99px;
}
.chip-avatar {
  width: 24px; height: 24px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 700; color: #fff;
}
.chip-name { font-size: 0.82rem; color: var(--text-secondary); }

.content { flex: 1; padding: 32px 28px; }

.overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 90;
  backdrop-filter: blur(4px);
}
.overlay.show { display: block; }

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .sidebar-close { display: block; }
  .main { margin-left: 0; }
  .menu-btn { display: flex; }
  .user-chip { display: none; }
  .content { padding: 20px 16px; }
}
</style>
