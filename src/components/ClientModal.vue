<template>
  <teleport to="body">
    <transition nome="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <transition nome="modal-content">
          <div v-if="modelValue" class="modal-box">
            <div class="modal-header">
              <h3 class="modal-title">{{ isEdit ? 'Editar cliente' : 'Novo cliente' }}</h3>
              <button class="modal-close" @click="$emit('update:modelValue', false)">✕</button>
            </div>

            <form class="modal-body" @submit.prevent="handleSubmit">
              <div class="fields-grid">
                <!-- Nome -->
                <div class="field span-2">
                  <label class="field-label">Nome completo *</label>
                  <input v-model="form.nome" type="text" class="field-input"
                    :class="{ error: errors.nome }" placeholder="João Silva"
                    @blur="validate('nome')" />
                  <span v-if="errors.nome" class="field-error">{{ errors.nome }}</span>
                </div>

                <!-- CPF -->
                <div class="field">
                  <label class="field-label">CPF *</label>
                  <input v-model="form.cpf" type="text" class="field-input"
                    :class="{ error: errors.cpf }" placeholder="000.000.000-00"
                    maxlength="14" inputmode="numeric"
                    @input="onCpfInput" @blur="validate('cpf')" />
                  <span v-if="errors.cpf" class="field-error">{{ errors.cpf }}</span>
                </div>

                <!-- Email -->
                <div class="field">
                  <label class="field-label">E-mail *</label>
                  <input v-model="form.email" type="email" class="field-input"
                    :class="{ error: errors.email }" placeholder="joao@email.com"
                    @blur="validate('email')" />
                  <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
                </div>

                <!-- Telefone -->
                <div class="field">
                  <label class="field-label">Telefone *</label>
                  <input v-model="form.telefone" type="text" class="field-input"
                    :class="{ error: errors.telefone }" placeholder="(11) 91234-5678"
                    maxlength="15" inputmode="numeric"
                    @input="onPhoneInput" @blur="validate('telefone')" />
                  <span v-if="errors.telefone" class="field-error">{{ errors.telefone }}</span>
                </div>

                <!-- Data de nascimento -->
                <div class="field">
                  <label class="field-label">Data de nascimento *</label>
                  <input v-model="form.dataNascimento" type="text" class="field-input"
                    :class="{ error: errors.dataNascimento }" placeholder="dd/mm/aaaa"
                    maxlength="10" inputmode="numeric"
                    @input="onDateInput" @blur="validate('dataNascimento')" />
                  <span v-if="errors.dataNascimento" class="field-error">{{ errors.dataNascimento }}</span>
                  <span class="field-hint">Formato: dd/mm/aaaa</span>
                </div>

                <!-- Status — apenas na edição -->
                <div v-if="isEdit" class="field span-2">
                  <label class="field-label">Status</label>
                  <div class="status-toggle">
                    <button
                      type="button"
                      class="status-btn"
                      :class="{ active: form.status === 'ATIVO' }"
                      @click="form.status = 'ATIVO'"
                    >
                      <span class="status-dot ativo" />
                      Ativo
                    </button>
                    <button
                      type="button"
                      class="status-btn"
                      :class="{ active: form.status === 'INATIVO' }"
                      @click="form.status = 'INATIVO'"
                    >
                      <span class="status-dot inativo" />
                      Inativo
                    </button>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-ghost" @click="$emit('update:modelValue', false)">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner" />
                  <span v-else>{{ isEdit ? 'Salvar alterações' : 'Criar cliente' }}</span>
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useToastStore } from '@/stores/toast'
import { clientService } from '@/services/clientService'
import {
  isValidEmail, isValidCPF, isValidPhone, isValidDate,
  maskCPF, maskPhone, maskDate, dateToISO, dateToDisplay
} from '@/composables/useValidation'

const props = defineProps({
  modelValue: Boolean,
  clientId: { type: [Number, String], default: null }
})
const emit = defineEmits(['update:modelValue', 'saved'])

const toast   = useToastStore()
const loading = ref(false)
const isEdit  = ref(false)

const form = reactive({ nome: '', cpf: '', email: '', telefone: '', dataNascimento: '', status: 'ATIVO' })
const errors = reactive({ nome: '', cpf: '', email: '', telefone: '', dataNascimento: '' })

// ── Masks ──────────────────────────────────────────────────────
function onCpfInput(e)   { form.cpf       = maskCPF(e.target.value) }
function onPhoneInput(e) { form.telefone     = maskPhone(e.target.value) }
function onDateInput(e)  { form.dataNascimento = maskDate(e.target.value) }

// ── Validate single field ──────────────────────────────────────
function validate(field) {
  switch (field) {
    case 'nome':
      if (!form.nome.trim()) { errors.nome = 'Nome é obrigatório.'; return false }
      errors.nome = ''; return true
    case 'cpf':
      if (!form.cpf) { errors.cpf = 'CPF é obrigatório.'; return false }
      if (!isValidCPF(form.cpf)) { errors.cpf = 'CPF inválido.'; return false }
      errors.cpf = ''; return true
    case 'email':
      if (!form.email) { errors.email = 'E-mail é obrigatório.'; return false }
      if (!isValidEmail(form.email)) { errors.email = 'Formato de e-mail inválido.'; return false }
      errors.email = ''; return true
    case 'telefone':
      if (!form.telefone) { errors.telefone = 'Telefone é obrigatório.'; return false }
      if (!isValidPhone(form.telefone)) { errors.telefone = 'Telefone inválido (mínimo 10 dígitos).'; return false }
      errors.telefone = ''; return true
    case 'dataNascimento':
      if (!form.dataNascimento) { errors.dataNascimento = 'Data é obrigatória.'; return false }
      if (!isValidDate(form.dataNascimento)) { errors.dataNascimento = 'Data inválida ou futura.'; return false }
      errors.dataNascimento = ''; return true
  }
}

function validateAll() {
  return ['nome','cpf','email','telefone','dataNascimento'].map(validate).every(Boolean)
}

// ── Load client for editing ────────────────────────────────────
async function loadClient(id) {
  loading.value = true
  try {
    const c = await clientService.getById(id)
    form.nome      = c.nome      || ''
    form.cpf       = maskCPF(c.cpf || '')
    form.email     = c.email     || ''
    form.telefone     = maskPhone(c.telefone || '')
    form.dataNascimento = dateToDisplay(c.dataNascimento || c.birth_date || '')
    form.status    = c.status    || 'ATIVO'
  } catch (err) {
    toast.error('Erro ao carregar cliente: ' + err)
    emit('update:modelValue', false)
  } finally {
    loading.value = false
  }
}

// ── Submit ─────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validateAll()) return
  loading.value = true

  // Remove formatação antes de enviar
  const payload = {
    nome:      form.nome.trim(),
    cpf:       form.cpf.replace(/\D/g, ''),
    email:     form.email.trim(),
    telefone:     form.telefone.replace(/\D/g, ''),
    dataNascimento: dateToISO(form.dataNascimento),
    ...(isEdit.value && { status: form.status })
  }

  try {
    if (isEdit.value) {
      await clientService.update(props.clientId, payload)
      toast.success('Cliente atualizado com sucesso!')
    } else {
      await clientService.create(payload)
      toast.success('Cliente criado com sucesso!')
    }
    emit('update:modelValue', false)
    emit('saved')
  } catch (err) {
    toast.error(err)
  } finally {
    loading.value = false
  }
}

// ── Reset form ─────────────────────────────────────────────────
function reset() {
  Object.keys(form).forEach(k => form[k] = '')
  Object.keys(errors).forEach(k => errors[k] = '')
}

// ── Watch open/close ───────────────────────────────────────────
watch(() => props.modelValue, async (val) => {
  if (val) {
    reset()
    if (props.clientId) {
      isEdit.value = true
      await loadClient(props.clientId)
    } else {
      isEdit.value = false
    }
  }
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}

.modal-box {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  width: 100%; max-width: 580px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  overflow: hidden;
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.modal-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; }
.modal-close {
  background: none; border: 1px solid var(--border); border-radius: var(--radius-sm);
  color: var(--text-muted); cursor: pointer; padding: 4px 8px; font-size: 0.85rem;
  transition: all var(--transition);
}
.modal-close:hover { border-color: var(--danger); color: var(--danger); background: var(--danger-soft); }

.modal-body { padding: 24px; }

.fields-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  margin-bottom: 24px;
}
.span-2 { grid-column: 1 / -1; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 0.82rem; font-weight: 500; color: var(--text-secondary); }
.field-hint   { font-size: 0.72rem; color: var(--text-muted); }

.field-input {
  background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--radius-sm);
  color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem;
  padding: 10px 12px; outline: none; width: 100%;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.field-input::placeholder { color: var(--text-muted); }
.field-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-soft); }
.field-input.error { border-color: var(--danger); }
.field-input.error:focus { box-shadow: 0 0 0 3px var(--danger-soft); }
.field-error { font-size: 0.75rem; color: var(--danger); }

.modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
}

.btn-ghost {
  background: none; border: 1px solid var(--border); border-radius: var(--radius-sm);
  color: var(--text-secondary); padding: 10px 20px; font-family: var(--font-body);
  font-size: 0.88rem; cursor: pointer; transition: all var(--transition);
}
.btn-ghost:hover { border-color: var(--text-secondary); color: var(--text-primary); }

.btn-primary {
  background: var(--accent); color: #fff; border: none; border-radius: var(--radius-sm);
  padding: 10px 24px; font-family: var(--font-body); font-size: 0.88rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 8px;
  transition: all var(--transition);
}
.btn-primary:hover:not(:disabled) { background: #527aff; box-shadow: 0 4px 16px var(--accent-glow); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;
}

@media (max-width: 540px) {
  .fields-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: auto; }
}

/* ── Status Toggle ────────────────────────────────────────────── */
.status-toggle {
  display: flex; gap: 8px;
}

.status-btn {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 16px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}
.status-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}
.status-btn.active[class*="ativo"],
.status-btn.active:first-child {
  border-color: var(--success);
  background: var(--success-soft);
  color: var(--success);
}
.status-btn.active:last-child {
  border-color: var(--danger);
  background: var(--danger-soft);
  color: var(--danger);
}

.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-dot.ativo   { background: var(--success); box-shadow: 0 0 6px var(--success); }
.status-dot.inativo { background: var(--danger);  box-shadow: 0 0 6px var(--danger); }
</style>