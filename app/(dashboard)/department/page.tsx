"use client";
import NewDepartment from "./new-departments";
import { Departments } from "./card";
import { api } from "@/app/lib/trpc/client";
import { Authorization } from "./authorization";

export const dynamic = "force-dynamic";

export default function Departemnt() {
  const departments = api.departmentRouter.getDepartments.useQuery();
  const user = api.userRouter.getUser.useQuery();
  // if (user.isLoading) return <div>hello</div>;
  return (
    <div className="grid grid-cols-3 gap-4">
      <Authorization
        allowedRoles={["admin"]}
        user={user?.data!}
        forbiddenFallback={<div>this is an authorized</div>}
      >
        {departments.data?.map(({ department, section }) => (
          <Departments
            key={department.id}
            id={department.id}
            // duration={department.departmentDuration}
            department={department.name}
            section={section}
          ></Departments>
        ))}
        <NewDepartment />
      </Authorization>
    </div>
  );
}
