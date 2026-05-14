// ─── src/services/clientService.js ────────────────────────────
import api from './api'

export const clientService = {
  // GET /clients → lista de clientes
  async getAll() {
    const { data } = await api.get('/cliente')
    return data.content
  },

  // GET /clients/:id → cliente por id
  async getById(id) {
    const { data } = await api.get(`/cliente/${id}`)
    return data
  },

  // POST /clients → cria cliente
  async create(client) {
    const { data } = await api.post('/cliente', client)
    return data
  },

  // PUT /cliente/:id → atualiza cliente
  async update(id, client) {
    const { data } = await api.put(`/cliente/editar/${id}`, client)
    return data
  },

  // DELETE /cliente/:id → remove cliente
  async remove(id) {
    const { data } = await api.delete(`/cliente/${id}`)
    return data
  },

  // GET /cliente/stats/total-active → quantidade de clientes ativos
  async getTotalActive() {
    const { data } = await api.get('/cliente/status/total-ativo')
    return data
  },

  // GET /cliente/stats/created-last-month → clientes criados no último mês
  async getCreatedLastMonth() {
    const { data } = await api.get('/cliente/status/criado-ultimo-mes')
    return data
  }
}
