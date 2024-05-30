import { ReactNode } from "react";
import { Layout } from "@/components/layout/layout";
import { validateSession } from "../(auth)/validateSession";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = validateSession();
  if (!user) return <div>please log in</div>;
  return <Layout>{children}</Layout>;
}
