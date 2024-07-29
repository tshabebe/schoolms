// import { Comment, User } from "@/types/api";

import { InsertDepartmentSchema, InsertUserTable } from "@/app/_db/schema";
import { z } from "zod";
import { User } from "lucia";
import { ReactNode, useCallback } from "react";

export const userROles = InsertUserTable.pick({ userRole: true })
  .shape.userRole.unwrap()
  .unwrap();

type RoleTypes = z.infer<typeof userROles>;

export const POLICIES = {
  "add:teacher": (
    user: User,
    department: z.infer<typeof InsertDepartmentSchema>,
  ) => {
    if (department.userId === user?.id) {
      return true;
    }
    return false;
  },
  "add:attendance": (
    user: User,
    department: z.infer<typeof InsertDepartmentSchema>,
  ) => {
    if (department.userId === user?.id) {
      return true;
    }
    return false;
  },
};

export const useAuthorization = () => {
  // const test = api.getUser.getUser.useQuery();
  // console.log(test);

  const checkAccess = useCallback(
    ({ allowedRoles, user }: { allowedRoles: RoleTypes[]; user: User }) => {
      if (allowedRoles && allowedRoles.length > 0 && user) {
        return allowedRoles?.includes(user.userRole as RoleTypes);
      }

      return true;
    },
    [],
  );

  return { checkAccess };
};

type AuthorizationProps = {
  forbiddenFallback?: ReactNode;
  children: ReactNode;
  user?: User;
} & (
  | {
      allowedRoles: RoleTypes[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
  user,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles && user) {
    canAccess = checkAccess({ allowedRoles, user });
  }

  if (typeof policyCheck !== "undefined") {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
