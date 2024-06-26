"use client";
import NewDepartment from "./new-departments";
import { Departments } from "./card";
import { api } from "@/app/lib/trpc/client";

export const dynamic = "force-dynamic";

export default function Departemnt() {
  const departments = api.departmentRouter.newDepartment.useQuery();
  // console.log(departments.data);
  return (
    <div className="grid grid-cols-3 gap-4">
      {departments.data?.map((department) => (
        <Departments
          key={department.id}
          id={department.id}
          // duration={department.departmentDuration}
          department={department.department}
          section={department.section}
        ></Departments>
      ))}
      <NewDepartment />
    </div>
  );
}
