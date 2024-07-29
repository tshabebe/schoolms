import { ReactNode } from "react";
import Provider from "../lib/trpc/react";
import { Authorization, userROles } from "./department/authorization";
import { serverClient } from "../lib/trpc/serverClient";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await serverClient.userRouter.getUser();
  if (!user) return <div>please log in</div>;
  return (
    <Provider>
      <Authorization
        allowedRoles={[userROles.enum.admin, userROles.enum.student]}
        user={user!}
        forbiddenFallback={<div>please log in</div>}
      >
        <div className="flex items-center justify-center h-screen">
          {children}
        </div>
      </Authorization>
    </Provider>
  );
}
