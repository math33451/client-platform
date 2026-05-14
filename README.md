# ClientHub — Frontend Vue 3

Frontend completo para plataforma de cadastro de clientes, construído com **Vue 3 + Pinia + Vue Router + Axios**.

---

## 🚀 Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a URL do backend

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o `.env` e coloque a URL do seu backend Java:

```env
VITE_API_URL=http://localhost:8080
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:5173**

### 4. Build para produção

```bash
npm run build
```

---

## 📁 Estrutura do projeto

```
src/
├── main.js                    # Ponto de entrada
├── App.vue                    # Componente raiz + sistema de toasts
├── styles/
│   └── global.css             # Design tokens, animações e reset
├── router/
│   └── index.js               # Rotas com guards de autenticação
├── stores/
│   ├── auth.js                # Estado de autenticação (Pinia)
│   └── toast.js               # Notificações toast (Pinia)
├── services/
│   ├── api.js                 # Instância Axios com interceptors JWT
│   ├── authService.js         # Login e registro
│   └── clientService.js       # CRUD de clientes + stats
├── composables/
│   └── useValidation.js       # Validações (CPF, email, phone, date) e máscaras
├── components/
│   ├── AppLayout.vue          # Layout com sidebar + topbar
│   └── ClientModal.vue        # Modal de criar/editar cliente
└── views/
    ├── LoginView.vue           # Tela de login
    ├── RegisterView.vue        # Tela de cadastro
    ├── DashboardView.vue       # Dashboard com estatísticas
    └── ClientsView.vue         # Listagem e gestão de clientes
```

---

## 🔌 Endpoints esperados do backend

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | Login → `{ token }` |
| POST | `/auth/register` | Registro |

### Clientes (requer Bearer token)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/clients` | Lista todos |
| GET | `/clients/:id` | Busca por ID |
| POST | `/clients` | Cria novo |
| PUT | `/clients/:id` | Atualiza |
| DELETE | `/clients/:id` | Remove |

### Estatísticas (requer Bearer token)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/clients/stats/total-active` | Total de clientes ativos |
| GET | `/clients/stats/created-last-month` | Criados no último mês |

> **Adaptar endpoints:** Se as rotas do seu backend forem diferentes, edite o arquivo `src/services/clientService.js` e `src/services/authService.js`.

---

## 🎨 Personalização

### Cores e tema
Todas as cores e espaçamentos estão como variáveis CSS em `src/styles/global.css`:

```css
:root {
  --accent:   #3d6aff;   /* Cor de destaque principal */
  --accent-2: #00e5c3;   /* Cor de destaque secundária */
  --bg-base:  #0a0d14;   /* Fundo da página */
  /* ... */
}
```

### URL do backend
Configure em `.env`:
```env
VITE_API_URL=http://seu-backend.com
```

### Campos dos clientes
O payload enviado ao criar/editar um cliente é:
```json
{
  "name": "string",
  "cpf": "string (apenas dígitos)",
  "email": "string",
  "phone": "string (apenas dígitos)",
  "birthDate": "yyyy-MM-dd"
}
```

---

## ✅ Funcionalidades

- [x] Login com JWT (token salvo no localStorage)
- [x] Cadastro de usuário com confirmação de senha
- [x] Proteção de rotas (guard de autenticação)
- [x] Dashboard com estatísticas em tempo real
- [x] Listagem de clientes com busca
- [x] Criar novo cliente
- [x] Editar cliente (carrega dados pelo ID)
- [x] Validação de CPF (algoritmo oficial)
- [x] Validação e máscara de telefone
- [x] Validação de e-mail
- [x] Validação de data de nascimento
- [x] Tratamento de erros da API (exibe mensagens do backend)
- [x] Logout automático em token expirado (401)
- [x] Notificações toast
- [x] Design responsivo (mobile-first)
- [x] Animações e transições fluidas
- [x] Skeleton loading
