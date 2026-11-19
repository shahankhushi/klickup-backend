# KlickUp Backend API

A clean, production-ready REST API for KlickUp built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**.

---

## 🏗️ Architecture

```
backend/
├── prisma/
│   ├── schema.prisma      # Prisma schema (SQLite / PostgreSQL)
│   └── seed.ts            # Seeds users, spaces, projects, and ClickUp tasks
├── src/
│   ├── config/
│   │   ├── env.ts         # Environment variables configuration
│   │   └── prisma.ts      # Singleton PrismaClient instance
│   ├── controllers/       # HTTP Request/Response handling
│   │   ├── task.controller.ts
│   │   ├── project.controller.ts
│   │   ├── space.controller.ts
│   │   └── user.controller.ts
│   ├── services/          # Business logic and database operations
│   │   ├── task.service.ts
│   │   ├── project.service.ts
│   │   ├── space.service.ts
│   │   └── user.service.ts
│   ├── routes/            # REST API route declarations
│   │   ├── task.routes.ts
│   │   ├── project.routes.ts
│   │   ├── space.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── middlewares/       # Error handling and Zod input validation
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── types/             # Zod schemas & TypeScript types
│   ├── app.ts             # Express application setup
│   └── server.ts          # Server entry point with graceful shutdown
├── .env.example
├── .env
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Initialize Database & Seed ClickUp Data
```bash
npm run db:setup
```
This runs `prisma db push` and seeds:
- Users: `Abdul Rehman` (initials: `AM`, role: Admin), `Abubakar` (Operations), `Elena Rossi`
- Spaces: `Product`, `Operations`, `Engineering`
- Projects: `AbdulRehman` list, `Kisumu Daily Task`
- All 7 ClickUp tasks with `Today` due date and priority flags (`Urgent`, `High`, `Normal`)

### 3. Run Dev Server
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

---

## 📡 API Endpoints

### Tasks
- `GET /api/tasks` — List tasks (query params: `?status=todo`, `?assigneeId=u_abdul`, `?projectId=p_performance`, `?search=blog`)
- `GET /api/tasks/:id` — Get task with subtasks, comments & activity log
- `POST /api/tasks` — Create new task
- `PATCH /api/tasks/:id` — Update task (status, priority, dueDate, assigneeId, etc.)
- `DELETE /api/tasks/:id` — Delete task
- `POST /api/tasks/:id/checklist` — Add subtask checklist item
- `PATCH /api/tasks/:id/checklist/:itemId` — Toggle subtask completion
- `DELETE /api/tasks/:id/checklist/:itemId` — Delete subtask checklist item
- `POST /api/tasks/:id/comments` — Add comment to task

### Projects / Lists
- `GET /api/projects` — List all projects/lists
- `GET /api/projects/:id` — Get project details with tasks
- `POST /api/projects` — Create new project
- `PATCH /api/projects/:id` — Update project
- `DELETE /api/projects/:id` — Delete project

### Spaces
- `GET /api/spaces` — List all spaces with nested projects
- `GET /api/spaces/:id` — Get space by ID
- `POST /api/spaces` — Create new space

### Users
- `GET /api/users` — List workspace team members
- `GET /api/users/:id` — Get user profile with assigned tasks

### Health Check
- `GET /api/health` — Check server status

---

## 🔗 Frontend Repository

The Next.js frontend application for this project is hosted at:
[https://github.com/shahankhushi/klickup-frontend](https://github.com/shahankhushi/klickup-frontend)

