# Estuz Backend

API para o projeto **Estuz** — sistema de organização de estudos.  

Backend em **Node.js** com **Express**, hospedado no **Render**, banco de dados no **Supabase** e frontend no **Vercel**.

---

## 🚀 Tecnologias

- Node.js
- Express
- JWT para autenticação
- CORS configurado para frontend
- dotenv para variáveis de ambiente
- Supabase (PostgreSQL)
- Vercel (frontend)  
- Render (backend)

---

## ⚙️ Funcionalidades principais

- Autenticação de usuários (login, cadastro, reset de senha)
- CRUD de:
  - Subjects (disciplinas)
  - Notes (anotações)
  - Assignments (tarefas)
  - Exams (provas)
  - Absences (faltas)
  - Survival (sobrevivência acadêmica)
- Endpoints seguros com JWT
- Limite de payload (`5mb`) para segurança
- Middleware global para parsing JSON e URL-encoded
- CORS restrito aos domínios do frontend

---

## 📝 Endpoints

| Rota | Método | Proteção | Descrição |
|------|--------|----------|-----------|
| `/api/auth/login` | POST | Não | Login do usuário |
| `/api/auth/register` | POST | Não | Cadastro de usuário |
| `/api/subjects` | GET/POST/PUT/DELETE | JWT | Gerenciamento de disciplinas |
| `/api/notes` | GET/POST/PUT/DELETE | JWT | Gerenciamento de anotações |
| `/api/assignments` | GET/POST/PUT/DELETE | JWT | Gerenciamento de tarefas |
| `/api/exams` | GET/POST/PUT/DELETE | JWT | Gerenciamento de provas |
| `/api/absences` | GET/POST/PUT/DELETE | JWT | Gerenciamento de faltas |
| `/api/password/reset` | POST | Não | Reset de senha |

> ⚠️ JWT obrigatório em todas as rotas protegidas, exceto `/auth` e reset de senha.

---

## 💻 Setup local

1. Clone o repositório:
```bash
git clone (https://github.com/jeanbrito-dev/estuz-backend.git)
cd estuz-backend
