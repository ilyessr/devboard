# DevBoard

DevBoard is a full-stack web application inspired by tools like **Trello** or **Jira**.
The project demonstrates a modern **React + Django architecture** with secure authentication, clean frontend structure, and scalable API design.

At the current stage, the project includes:

- A **React frontend** with React Query and Axios
- A **Django REST API**
- A secure **JWT authentication system**
- **HttpOnly refresh cookies**
- Protected routes and automatic token refresh

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
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
│       │   │   ├── api.ts
│       │   │   ├── hooks.ts
│       │   │   └── tokenStore.ts
│       │   │
│       │   └── health/
│       │       ├── api.ts
│       │       ├── hooks.ts
│       │       └── HealthPanel.tsx
│       │
│       ├── components/
│       │   ├── Layout.tsx
│       │   └── RequireAuth.tsx
│       │
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── LoginPage.tsx
│       │   └── BoardsPage.tsx
│       │
│       ├── router/
│       │   └── router.tsx
│       │
│       └── lib/
│           ├── apiClient.ts
│           ├── queryClient.ts
│           └── authRefresh.ts
│
├── backend/
│   ├── config/
│   ├── core/        # technical endpoints (health check)
│   └── accounts/    # authentication logic
│
├── infra/
│
├── Makefile
└── README.md
```

---

# Backend Architecture

The backend is organized into dedicated Django apps.

## core

Contains technical endpoints used for system checks.

Example:

```
GET /api/health/
```

Used to verify communication between the frontend and backend.

---

## accounts

Handles authentication and user management.

Key elements:

- Custom **User model based on email**
- DRF **serializers for validation**
- **Class-based views** (`CreateAPIView`, `RetrieveAPIView`)
- JWT authentication with **SimpleJWT**

---

# Authentication System

The application uses a **secure JWT authentication strategy**.

| Token         | Storage              | Purpose                    |
| ------------- | -------------------- | -------------------------- |
| Access Token  | In memory (frontend) | Authenticate API requests  |
| Refresh Token | **HttpOnly cookie**  | Generate new access tokens |

This design protects the refresh token from **XSS attacks**, while keeping authentication seamless for the user.

---

# Authentication Endpoints

```
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/me/
POST /api/auth/logout/
```

---

# Login Flow

1. The user sends credentials:

```
POST /api/auth/login/
```

2. The backend returns:

- an **access token** in the JSON response
- a **refresh token stored in an HttpOnly cookie**

Example response headers:

```
Set-Cookie: refresh_token=...; HttpOnly; SameSite=Lax
```

The browser **automatically stores the cookie** when it receives the response.

The frontend stores the access token **in memory only**.

---

# Token Refresh Flow

When the access token expires:

1. An API request returns **401 Unauthorized**
2. The Axios interceptor automatically sends:

```
POST /api/auth/refresh/
```

3. The browser automatically includes the refresh cookie:

```
Cookie: refresh_token=...
```

4. The backend validates the refresh token and returns a new access token
5. The original request is retried automatically

This entire process happens **without interrupting the user experience**.

---

# Logout

Logging out removes the refresh cookie:

```
POST /api/auth/logout/
```

The backend clears the cookie using:

```
response.delete_cookie(...)
```

---

# Frontend Architecture

The frontend follows a **feature-based architecture**.

Each feature groups related logic together:

```
features/auth
  api.ts
  hooks.ts
  tokenStore.ts
```

Benefits:

- better scalability
- easier maintenance
- clear separation of concerns

---

# API Client

All HTTP requests go through a centralized Axios client:

```
src/lib/apiClient.ts
```

Responsibilities:

- attach `Authorization: Bearer <access_token>`
- automatically send cookies
- refresh expired tokens
- retry failed requests

This avoids duplicating authentication logic across the application.

---

# Routing

The application uses **React Router** with a shared layout.

Current routes:

```
/
/login
/boards
```

Protected routes use a `RequireAuth` component to ensure the user is authenticated.

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

Backend runs on:

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

Frontend runs on:

```
http://localhost:5173
```

---

# Development Commands

A **Makefile** simplifies development commands.

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

are proxied to:

```
http://127.0.0.1:8000
```

This avoids CORS issues and mirrors a production reverse-proxy setup.

---

# Security Considerations

The authentication system follows several best practices:

- Refresh tokens stored in **HttpOnly cookies**
- Access tokens stored **only in memory**
- Automatic token refresh with Axios interceptors
- Protected endpoints using `IsAuthenticated`
- Custom user model with **email-based authentication**

---

# Current Features

## Backend

- Django REST API
- Custom user model (email login)
- JWT authentication with cookie-based refresh
- `/api/auth/me/` endpoint

## Frontend

- React + TypeScript
- React Router navigation
- React Query for data fetching
- Axios API client with automatic refresh
- Protected routes

---

# Next Steps

Planned features include:

- Boards CRUD API
- Cards and Kanban board system
- Drag & Drop interactions
- Docker environment
- CI/CD pipeline
- Deployment on a VPS
