import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import BoardsPage from "@/pages/BoardsPage";
import { RequireAuth } from "@/components/RequireAuth";
import { Layout } from "@/components/Layout";
import BoardDetailPage from "@/pages/BoardDetailPage";
import { RequireGuest } from "@/components/RequireGuest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },

      {
        element: <RequireGuest />,
        children: [{ path: "login", element: <LoginPage /> }],
      },

      {
        element: <RequireAuth />,
        children: [
          { path: "boards", element: <BoardsPage /> },
          { path: "boards/:boardId", element: <BoardDetailPage /> },
        ],
      },
    ],
  },
]);
