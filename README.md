# DevBoard

DevBoard is a full-stack web application inspired by tools like Trello or Jira.
The project is built to demonstrate a modern **React + Django** architecture with a clean frontend structure, API layer separation, and scalable data management.

At this stage, the project provides the foundational architecture for a full-stack application, including a React frontend, a Django REST API, and a structured development workflow.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- TanStack Query (React Query)
- Axios

## Backend

- Django
- Django REST Framework

## Tooling

- Makefile for development commands
- Git for version control
- Vite proxy for local API communication

---

# Project Structure

```
devboard/
│
├── frontend/
│   └── src/
│       ├── features/
│       │   └── health/
│       │       ├── api.ts
│       │       ├── hooks.ts
│       │       └── HealthPanel.tsx
│       │
│       ├── pages/
│       │   └── HomePage.tsx
│       │
│       ├── components/
│       └── lib/
│           └── apiClient.ts
│
├── backend/
│   ├── config/
│   └── core/
│
├── infra/
│
├── Makefile
└── README.md
```

The frontend follows a **feature-based architecture**, where each feature groups its API calls, hooks, and UI components together.

---

# Current Features

### Backend

- Django REST API setup
- Basic application structure
- Health check endpoint

```
GET /api/health/
```

Example response:

```
{
  "status": "ok"
}
```

### Frontend

- React + TypeScript setup with Vite
- Axios API client
- React Query for server state management
- Feature-based frontend architecture
- Health check request to the backend API

---

# Development Setup

## Requirements

- Node.js (v18+ recommended)
- Python 3.10+
- npm

---

# Running the Project

## Start the backend

```
cd backend
source .venv/bin/activate
python manage.py runserver
```

The API will run on:

```
http://127.0.0.1:8000
```

---

## Start the frontend

```
cd frontend
npm install
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

# Development Commands

A **Makefile** is provided to simplify development commands.

Run backend:

```
make backend
```

Run frontend:

```
make frontend
```

Run both services:

```
make dev
```

---

# API Communication

During development, the frontend communicates with Django through a **Vite proxy**.

Frontend requests:

```
/api/*
```

are automatically proxied to:

```
http://127.0.0.1:8000
```

This avoids CORS issues and mimics the behavior of a reverse proxy used in production.

---

# Architecture Notes

The frontend follows a **feature-first architecture**, which improves scalability and maintainability.

Each feature contains:

- API calls
- React Query hooks
- UI components

Example:

```
features/health
  api.ts
  hooks.ts
  HealthPanel.tsx
```

This approach avoids spreading logic across multiple folders and keeps related code together.

---

# Future Improvements

Planned features include:

- Authentication (JWT)
- Boards and cards management
- Drag and drop interactions
- Docker environment
- CI/CD pipeline
- Deployment on a VPS
