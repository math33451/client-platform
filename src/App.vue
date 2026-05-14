<template>
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- Toast Notifications -->
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toast"
          :class="toast.type"
          @click="toastStore.remove(toast.id)"
        >
          <span class="toast-icon">{{ icons[toast.type] }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  width: calc(100vw - 48px);
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  background: var(--bg-card);
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1.4;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.toast-icon {
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.toast-msg { flex: 1; color: var(--text-primary); }

.toast.success { border-color: var(--success); }
.toast.success .toast-icon { color: var(--success); }

.toast.error   { border-color: var(--danger); }
.toast.error   .toast-icon { color: var(--danger); }

.toast.warning { border-color: var(--warning); }
.toast.warning .toast-icon { color: var(--warning); }

.toast.info    { border-color: var(--accent); }
.toast.info    .toast-icon { color: var(--accent); }
</style>
