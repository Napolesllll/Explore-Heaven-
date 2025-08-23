// src/app/dashboard/admin/layout.tsx
import Providers from "app/providers";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <Providers>{children}</Providers>;
}
