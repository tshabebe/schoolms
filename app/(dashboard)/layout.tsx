import { ReactNode } from "react";
import { Layout } from "@/components/layout/layout";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
