import { db } from "@/app/_db";

export default async function Section() {
  const section = await db.query.section.findMany();
  return (
    <div>
      {section.map((sections) => (
        <div key={sections.id}>{sections.sectionName}</div>
      ))}
    </div>
  );
}
