import { Card, CardBody } from "@nextui-org/card";
import App from "./new-departments";
import { Departments } from "./card";
import { db } from "@/app/_db";

export const dynamic = "force-dynamic";

export default async function Departemnt() {
  const departments = await db.query.department.findMany({
    with: {
      section: true,
    },
  });
  // console.log(departments);
  // console.log();
  return (
    <div className="grid grid-cols-3 gap-4">
      {departments.map((department) => (
        <Departments
          key={department.id}
          id={department.id}
          duration={department.departmentDuration}
          department={department.department}
          section={department.section}
        ></Departments>
      ))}
      <App />
    </div>
  );
}
