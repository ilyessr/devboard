# DevBoard

DevBoard is a full-stack web application inspired by tools like **Trello** or **Jira**.
The goal of this project is to demonstrate a modern **React + Django architecture** with clean frontend structure, secure authentication, and scalable API design.

The application currently supports:

- User authentication with **JWT**
- **HttpOnly refresh cookies**
- Boards with **columns and cards**
- A **Kanban-style interface**
- React Query data management
- Automatic token refresh with Axios
- Demo data seeding for quick testing

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod validation
- TanStack Query (React Query)
- Axios

## Backend

- Django
- Django REST Framework
- SimpleJWT

## Tooling

- Makefile for development commands
- Vite proxy for local API communication
- Feature-based frontend architecture

---

# Project Structure

```
devboard/
│
├── frontend/
│   └── src/
│       ├── features/
│       │   ├── auth/
│       │   ├── boards/
│       │   ├── columns/
│       │   ├── cards/
│       │   └── health/
│       │
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── BoardsPage.tsx
│       │   └── BoardDetailPage.tsx
│       │
│       ├── components/
│       ├── router/
│       └── lib/
│
├── backend/
│   ├── config/
│   ├── accounts/
│   ├── boards/
│   └── core/
│
├── infra/
├── Makefile
└── README.md
```

---

# Backend Architecture

The backend is organized into dedicated Django apps.

## accounts

Handles authentication and user management.

Features:

- Custom **User model based on email**
- JWT authentication with **SimpleJWT**
- Refresh tokens stored in **HttpOnly cookies**
- DRF class-based views and serializers

## boards

Handles the Kanban domain model.

Entities:

```
Board
 └── Column
       └── Card
```

Each board belongs to a user.
Columns belong to a board.
Cards belong to a column.

API endpoints are protected with `IsAuthenticated`.

---

# Authentication System

The application uses a **secure JWT strategy**.

| Token         | Storage              | Purpose                   |
| ------------- | -------------------- | ------------------------- |
| Access Token  | In memory (frontend) | Authenticate API requests |
| Refresh Token | **HttpOnly cookie**  | Issue new access tokens   |

### Security benefits

- Refresh tokens cannot be accessed by JavaScript
- Protection against **XSS token theft**
- Automatic token refresh handled by Axios interceptors

---

# Authentication Endpoints

```
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/me/
POST /api/auth/logout/
```

### Login flow

1. User submits credentials
2. Backend returns:
   - an **access token**
   - a **refresh token stored in an HttpOnly cookie**

Example response header:

```
Set-Cookie: refresh_token=...; HttpOnly; SameSite=Lax
```

The browser automatically stores the cookie.

---

# Kanban Features

The current application allows users to:

- create boards
- create columns inside boards
- create cards inside columns
- delete boards, columns, and cards
- navigate through boards with React Router

Example structure:

```
Demo Project

Todo
  Setup project
  Create authentication

Doing
  Build board UI

Done
  Design architecture
```

---

# Frontend Architecture

The frontend follows a **feature-based architecture**.

Example:

```
features/
  boards/
    api.ts
    hooks.ts
    types.ts
  columns/
    ColumnPanel.tsx
    CreateColumnForm.tsx
  cards/
    CreateCardForm.tsx
```

Benefits:

- separation of concerns
- easier scaling
- clearer domain logic

---

# API Client

All HTTP requests go through a centralized Axios client:

```
src/lib/apiClient.ts
```

Responsibilities:

- attach `Authorization: Bearer <token>`
- send cookies automatically
- refresh expired tokens
- retry failed requests

---

# Routing

Routes currently implemented:

```
/
/login
/boards
/boards/:boardId
```

Protected routes are handled by a `RequireAuth` component.

---

# Development Setup

## Requirements

- Node.js (v18+ recommended)
- Python 3.10+
- npm

---

# Install Dependencies

```
npm install --prefix frontend
pip install -r backend/requirements.txt
```

---

# Running the Project

Start backend:

```
cd backend
python manage.py runserver
```

Start frontend:

```
cd frontend
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://127.
```
