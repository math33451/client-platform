<template>
  <AppLayout>
    <div class="clients-page">
      <!-- Header -->
      <div class="page-header animate-fade-in">
        <div>
          <h1 class="page-title">Clientes</h1>
          <p class="page-sub">Gerencie todos os clientes cadastrados.</p>
        </div>
        <button class="btn-primary" @click="openCreate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo cliente
        </button>
      </div>

      <!-- Filters bar -->
      <div class="filters animate-fade-in-up" style="animation-delay: 0.05s">
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="search" type="text" class="search-input" placeholder="Buscar por nome, email ou CPF..." />
          <button v-if="search" class="search-clear" @click="search = ''">✕</button>
        </div>
        <span class="result-count">{{ filtered.length }} {{ filtered.length === 1 ? 'cliente' : 'clientes' }}</span>
      </div>

      <!-- Table -->
      <div class="table-card animate-fade-in-up" style="animation-delay: 0.1s">
        <!-- Loading -->
        <div v-if="loading" class="loading-rows">
          <div v-for="i in 5" :key="i" class="loading-row">
            <div class="skel skel-avatar" />
            <div class="skel-group">
              <div class="skel skel-text" />
              <div class="skel skel-text-sm" />
            </div>
            <div class="skel skel-text skel-hide-sm" />
            <div class="skel skel-text skel-hide-md" />
            <div class="skel skel-btn" />
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="!filtered.length" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p class="empty-title">{{ search ? 'Nenhum resultado' : 'Nenhum cliente ainda' }}</p>
          <p class="empty-sub">{{ search ? 'Tente uma busca diferente.' : 'Clique em "Novo cliente" para começar.' }}</p>
        </div>

        <!-- Table rows -->
        <div v-else class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th class="hide-sm">CPF</th>
                <th class="hide-sm">Telefone</th>
                <th class="hide-md">Nascimento</th>
                <th class="hide-md">Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(client, i) in filtered" :key="client.id"
                  class="table-row"
                  :style="{ animationDelay: `${i * 0.03}s` }">
                <td>
                  <div class="client-cell">
                    <div class="client-avatar">{{ initials(client.nome) }}</div>
                    <div>
                      <div class="client-nome">{{ client.nome }}</div>
                      <div class="client-email">{{ client.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="hide-sm mono">{{ formatCPF(client.cpf) }}</td>
                <td class="hide-sm">{{ formatPhone(client.telefone) }}</td>
                <td class="hide-md">{{ formatDate(client.dataNascimento || client.birth_date) }}</td>
                <td class="hide-md">
                  <span class="status-badge" :class="(client.status || 'ATIVO').toLowerCase()">
                    <span class="status-dot" />
                    {{ client.status === 'INATIVO' ? 'Inativo' : 'Ativo' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn edit" @click="openEdit(client.id)" title="Editar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ClientModal
      v-model="modalOpen"
      :client-id="editingId"
      @saved="onSaved"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import ClientModal from '@/components/ClientModal.vue'
import { useToastStore } from '@/stores/toast'
import { clientService } from '@/services/clientService'
import { maskCPF, maskPhone } from '@/composables/useValidation'

const route   = useRoute()
const toast   = useToastStore()

const clients   = ref([])
const loading   = ref(true)
const search    = ref('')
const modalOpen = ref(false)
const editingId = ref(null)

// Abre modal de criação se vier ?new=1 na query
watch(() => route.query.new, val => { if (val) openCreate() }, { immediate: true })

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return clients.value
  return clients.value.filter(c =>
    c.nome?.toLowerCase().includes(q) ||
    c.email?.toLowerCase().includes(q) ||
    c.cpf?.includes(q)
  )
})

async function loadClients() {
  loading.value = true
  try {
    clients.value = await clientService.getAll()
  } catch (err) {
    toast.error('Erro ao carregar clientes: ' + err)
  } finally {
    loading.value = false
  }
}

function openCreate() { editingId.value = null; modalOpen.value = true }
function openEdit(id) { editingId.value = id;   modalOpen.value = true }

function onSaved() { loadClients() }

// ── Formatting helpers ─────────────────────────────────────────
function initials(nome = '') {
  return nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}
function formatCPF(cpf = '')   { return maskCPF(cpf) }
function formatPhone(p = '')   { return maskPhone(p) }
function formatDate(d = '')    {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

onMounted(loadClients)
</script>

<style scoped>
.clients-page { display: flex; flex-direction: column; gap: 24px; }

.page-header {
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.page-title { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; }
.page-sub   { color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent); color: #fff; border: none; border-radius: var(--radius-sm);
  padding: 10px 20px; font-family: var(--font-body); font-size: 0.88rem; font-weight: 600;
  cursor: pointer; white-space: nowrap;
  transition: all var(--transition);
}
.btn-primary svg { width: 16px; height: 16px; }
.btn-primary:hover { background: #527aff; transform: translateY(-1px); box-shadow: 0 4px 20px var(--accent-glow); }

/* ── Filters ──────────────────────────────────────────── */
.filters {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
}
.search-wrap {
  position: relative; flex: 1; min-width: 240px;
}
.search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; color: var(--text-muted);
}
.search-input {
  width: 100%; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text-primary); font-family: var(--font-body);
  font-size: 0.9rem; padding: 10px 36px; outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-soft); }
.search-clear {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--text-muted); cursor: pointer;
  font-size: 0.8rem; padding: 2px 6px; border-radius: 4px;
  transition: color var(--transition);
}
.search-clear:hover { color: var(--text-primary); }
.result-count {
  font-size: 0.82rem; color: var(--text-muted); white-space: nowrap;
}

/* ── Table Card ────────────────────────────────────────── */
.table-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); overflow: hidden;
}

/* Loading skeletons */
.loading-rows { display: flex; flex-direction: column; }
.loading-row {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 20px; border-bottom: 1px solid var(--border);
}
.skel {
  background: linear-gradient(90deg, var(--border) 25%, var(--bg-card-hover) 50%, var(--border) 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
  border-radius: var(--radius-sm);
}
.skel-avatar  { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
.skel-group   { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.skel-text    { height: 14px; width: 60%; }
.skel-text-sm { height: 11px; width: 40%; }
.skel-btn     { height: 30px; width: 70px; }
@media (max-width: 640px) { .skel-hide-sm { display: none; } }
@media (max-width: 900px) { .skel-hide-md { display: none; } }

/* Empty */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: 64px 24px; gap: 12px;
}
.empty-icon {
  width: 64px; height: 64px;
  background: var(--accent-soft); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--accent);
}
.empty-icon svg { width: 28px; height: 28px; }
.empty-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); }
.empty-sub   { font-size: 0.85rem; color: var(--text-muted); text-align: center; }

/* Table */
.table-scroll { overflow-x: auto; }
.table {
  width: 100%; border-collapse: collapse;
}
.table thead { background: var(--bg-input); }
.table th {
  text-align: left; padding: 12px 20px;
  font-size: 0.75rem; font-weight: 600;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.table-row {
  border-bottom: 1px solid var(--border);
  transition: background var(--transition);
  animation: fadeIn 0.3s both;
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: var(--bg-card-hover); }
.table td { padding: 14px 20px; vertical-align: middle; }

.client-cell { display: flex; align-items: center; gap: 12px; }
.client-avatar {
  width: 36px; height: 36px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700; color: #fff;
}
.client-nome  { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.client-email { font-size: 0.78rem; color: var(--text-muted); }

.mono { font-family: monospace; font-size: 0.85rem; color: var(--text-secondary); }

.action-buttons { display: flex; gap: 6px; }
.action-btn {
  width: 32px; height: 32px; border: 1px solid var(--border);
  border-radius: var(--radius-sm); background: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); transition: all var(--transition);
}
.action-btn svg { width: 14px; height: 14px; }
.action-btn.edit:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }

.hide-sm { @media (max-width: 640px) { display: none; } }
.hide-md { @media (max-width: 900px) { display: none; } }

@media (max-width: 640px) {
  .hide-sm { display: none; }
  .page-title { font-size: 1.4rem; }
  .page-header { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 900px) {
  .hide-md { display: none; }
}

/* ── Status Badge ──────────────────────────────────────────────── */
.status-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.75rem; font-weight: 600;
  border: 1px solid transparent;
  white-space: nowrap;
}
.status-badge.ativo {
  background: var(--success-soft);
  color: var(--success);
  border-color: rgba(0, 201, 141, 0.25);
}
.status-badge.inativo {
  background: var(--danger-soft);
  color: var(--danger);
  border-color: rgba(255, 77, 109, 0.25);
}
.status-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.status-badge.ativo   .status-dot { background: var(--success); }
.status-badge.inativo .status-dot { background: var(--danger); }
</style>