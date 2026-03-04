import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import BoardsPage from "@/pages/BoardsPage";

import { RequireAuth } from "@/components/RequireAuth";
import { Layout } from "@/components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },

      {
        element: <RequireAuth />,
        children: [{ path: "boards", element: <BoardsPage /> }],
      },
    ],
  },
]);
