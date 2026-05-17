import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { router } from "@/router";

export function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
