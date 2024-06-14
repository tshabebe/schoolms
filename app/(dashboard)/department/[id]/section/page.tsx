import { db } from "@/app/_db";
import { section } from "@/app/_db/schema";
import { eq } from "drizzle-orm";
import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import { AddTeachers } from "./modal";
import { AddStudents } from "./modal";
import { formatDistanceStrict } from "date-fns";
export default async function Section({ params }: { params: { id: string } }) {
  const sections = await db.query.section.findMany({
    with: {
      department: true,
      students: true,
      teachers: true,
    },
    where: eq(section.department, +params.id),
  });

  // const result = setDate(new Date(2014, 8, 1), 30)
  return (
    <div className="grid grid-cols-3 gap-4">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader className="justify-between">
            <div>sectionName: {section.sectionName}</div>
            <div>
              sectionDuration:{" "}
              {formatDistanceStrict(new Date(), section.sectionDuration)}
            </div>
          </CardHeader>
          <CardFooter className="gap-2">
            <AddTeachers id={section.id} />
            <AddStudents id={section.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
