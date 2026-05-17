import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { EditorPage } from "@/pages/EditorPage";
import { AdminHomePage } from "@/pages/AdminHomePage";
import { AdminEditorPage } from "@/pages/AdminEditorPage";
import { AdminLayout } from "@/layouts/AdminLayout";
import { NotFound } from "@/pages/NotFound";

export const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    {
      path: "/administration",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminHomePage /> },
        { path: ":ficheSlug", element: <AdminEditorPage /> },
      ],
    },
    { path: "/:ficheSlug", element: <EditorPage /> },
    { path: "*", element: <NotFound /> },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" },
);
