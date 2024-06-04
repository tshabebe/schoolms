import { ReactNode } from "react";
import { validateSession } from "../(auth)/validateSession";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = validateSession();
  if (!user) return <div>please log in</div>;
  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
}
