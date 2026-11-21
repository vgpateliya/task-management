# Task Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=flat)](https://github.com/pmndrs/zustand)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, full-stack project and task management dashboard engineered with **Next.js 14 App Router**, **TypeScript**, **Zustand**, and **Tailwind CSS**. Designed for responsive workflow tracking, kanban-style project status updates, and strictly typed client-server communication.

---

## 🏗️ Architecture & Highlights

- **Next.js 14 App Router**: Route groups separating `(auth)` from `(dashboard)`, backed by unified server-side Route Handlers (`/api/auth`, `/api/projects`, `/api/tasks`).
- **Strict Domain Modeling**: Comprehensive TypeScript definitions for entities (`User`, `Project`, `Task`, `TaskStatus`), component prop interfaces, and API request/response contracts (`ApiResponse<T>`).
- **Predictable State Architecture**: Lightweight, high-performance client state management powered by **Zustand**, enabling optimistic UI updates and reactive project/task synchronization without re-rendering overhead.
- **Route Guarding & Middleware**: Next.js middleware and Firebase Admin token verification securing dashboard routes and authenticated API endpoints.
- **Modern Design System**: Clean dashboard layout built with **Tailwind CSS** and enhanced with Emotion/Material-UI UI components and icons.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router & Route Handlers) |
| **Language** | TypeScript 5 |
| **State Management** | Zustand |
| **Styling** | Tailwind CSS, Emotion, Material-UI Icons (`@mui/icons-material`) |
| **Authentication** | Firebase Authentication & Firebase Admin SDK |
| **Security & Hashing** | bcryptjs, Next.js Middleware |
| **Package Manager** | pnpm / npm |

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── (auth)/                  # Auth route group (Login, Register)
│   ├── (dashboard)/             # Protected dashboard & project views
│   │   ├── dashboard/
│   │   └── page.tsx
│   ├── api/                     # Next.js API Route Handlers
│   │   ├── auth/                # Session & authentication endpoints
│   │   ├── projects/            # Project CRUD operations
│   │   └── tasks/               # Task lifecycle & status updates
│   ├── globals.css              # Global styles & Tailwind directives
│   └── layout.tsx               # Root layout & providers
├── components/                  # Reusable presentation components
│   ├── AuthProvider.tsx         # Client auth context wrapper
│   ├── ProjectCard.tsx          # Project card with task count
│   ├── ProjectModal.tsx         # Modal dialog for project creation
│   ├── TaskCard.tsx             # Interactive task status card
│   └── TaskModal.tsx            # Modal dialog for task creation/editing
├── lib/                         # Utilities & shared configurations
│   ├── api-utils.ts             # API response formatters & error handlers
│   ├── api.ts                   # Client-side API fetch client
│   ├── axios.ts                 # Configured Axios instance
│   ├── firebase-admin.ts        # Server-side Firebase Admin initialization
│   ├── firebase.ts              # Client-side Firebase SDK configuration
│   └── password.ts              # Salt hashing & verification utilities
├── middleware.ts                # Edge route protection & token checks
├── store/                       # Zustand state stores
│   ├── authStore.ts             # Authentication state & session tokens
│   └── projectStore.ts          # Projects and tasks state & actions
└── types/                       # Shared domain TypeScript contracts
    └── index.ts                 # Entity models & API payloads
```

---

## 🚀 Key Features

1. **Project Workspaces**: Create, organize, and inspect multiple independent projects.
2. **Task Tracking**: Assign tasks to projects, set due dates, and transition statuses across **`Todo`**, **`In Progress`**, and **`Done`**.
3. **Optimistic Updates**: Instant UI feedback on task modifications backed by Zustand action dispatchers.
4. **Secure Authentication**: Firebase client authentication paired with server-side token validation and session persistence.
5. **Type Safety**: End-to-end typing across data stores, API request bodies, and component trees.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ (Node 20 LTS recommended)
- pnpm (or npm / yarn)
- Firebase Project credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vgpateliya/task-management.git
   cd task-management
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Client Config
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin Config (Server-side)
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📋 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user session | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `GET` | `/api/projects` | Fetch all projects for authenticated user | Yes |
| `POST` | `/api/projects` | Create a new project workspace | Yes |
| `GET` | `/api/tasks` | Fetch tasks filtered by project | Yes |
| `POST` | `/api/tasks` | Create a new task under a project | Yes |
| `PUT` | `/api/tasks` | Update task title, status, or due date | Yes |
| `DELETE` | `/api/tasks` | Remove an existing task | Yes |

---

## 📸 Screenshots

*(Add application screenshots here — e.g. `docs/screenshots/dashboard.png` and `docs/screenshots/task-modal.png`)*

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
