import { AdminAuthProvider } from "../../../contexts/AdminAuthContext";
import AdminProtectedRoute from "../../../components/admin/AdminProtectedRoute";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>{children}</AdminProtectedRoute>
    </AdminAuthProvider>
  );
}
