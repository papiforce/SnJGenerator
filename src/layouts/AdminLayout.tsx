import { Outlet } from "react-router-dom";
import { AdminGate } from "@/components/AdminGate";

export function AdminLayout() {
  return (
    <AdminGate>
      <Outlet />
    </AdminGate>
  );
}
