import { db } from "@/app/_db";
import { section } from "@/app/_db/schema";
import { eq } from "drizzle-orm";
import { setDate, formatDistanceToNow, format } from "date-fns";
export default async function Section({ params }: { params: { id: string } }) {
  const sections = await db.query.section.findMany({
    with: {
      department: true,
    },
    where: eq(section.department, +params.id),
  });

  // const result = setDate(new Date(2014, 8, 1), 30)
  return (
    <div>
      {sections.map((section) => (
        <div key={section.id}>
          section {section.sectionName} enteryDate{" "}
          {format(section.createdAt, "yyyy")} expries in 2025
        </div>
      ))}
    </div>
  );
}
