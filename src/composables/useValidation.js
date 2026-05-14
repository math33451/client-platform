// ─── src/composables/useValidation.js ─────────────────────────

// ── Email ──────────────────────────────────────────────────────
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

// ── CPF ───────────────────────────────────────────────────────
export function isValidCPF(cpf) {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += +digits[i] * (10 - i)
  let rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== +digits[9]) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += +digits[i] * (11 - i)
  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  return rest === +digits[10]
}

// ── Phone ─────────────────────────────────────────────────────
// Aceita (11) 91234-5678 ou (11) 1234-5678 com ou sem formatação
export function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 || digits.length === 11
}

// ── Date (dd/MM/yyyy) — formato exibido ao usuário ────────────
export function isValidDate(date) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false
  const [day, month, year] = date.split('/').map(Number)
  const d = new Date(year, month - 1, day)
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day &&
    d < new Date()
  )
}

// Converte dd/MM/yyyy → yyyy-MM-dd (para enviar ao backend)
export function dateToISO(date) {
  const [day, month, year] = date.split('/')
  return `${year}-${month}-${day}`
}

// Converte yyyy-MM-dd → dd/MM/yyyy (para exibir vindo do backend)
export function dateToDisplay(date) {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

// ── Masks ─────────────────────────────────────────────────────
export function maskCPF(value) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

export function maskPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 10)
    return d.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '')
  return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '')
}

export function maskDate(value) {
  const d = value.replace(/\D/g, '').slice(0, 8)
  return d
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/\/(\d{2})(\d)/, '/$1/$2')
}

// ── Raw values (remove formatting) ────────────────────────────
export function rawCPF(value)   { return value.replace(/\D/g, '') }
export function rawPhone(value) { return value.replace(/\D/g, '') }