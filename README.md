# Estuz Backend

API do **Estuz** — sistema de organização de estudos para estudantes. Permite gerenciar disciplinas, anotações, tarefas, provas e faltas de forma centralizada e segura.  

Backend em **Node.js** com **Express**, hospedado no **Render**, banco de dados no **Supabase** e frontend no **Vercel**.

---

## 🚀 Tecnologias

- Node.js
- Express
- JWT para autenticação
- CORS configurado para frontend
- dotenv para variáveis de ambiente
- Supabase (PostgreSQL)
- Render (backend)  
- Vercel (frontend)

---

## ⚙️ Funcionalidades principais

- Autenticação de usuários: login, cadastro e reset de senha
- CRUD de:
  - Subjects (disciplinas)
  - Notes (anotações)
  - Assignments (tarefas)
  - Exams (provas)
  - Absences (faltas)
  - Survival (sobrevivência acadêmica)
- Endpoints protegidos com JWT
- Limite de payload de 5MB
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
