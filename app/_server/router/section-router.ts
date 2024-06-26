import { InsertSectionSchema, department, section } from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { eq } from "drizzle-orm";
import { add } from "date-fns";

export const sectionRouter = router({
  newSection: authedProcedure
    .input(InsertSectionSchema.pick({ sectionName: true, departmentId: true }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { sectionName, departmentId } = opts.input;
      console.log(sectionName, departmentId);
      const departmentWithId = await db.query.department.findFirst({
        where: eq(department.id, departmentId!),
      });

      const durationDate = add(new Date(), {
        months: departmentWithId?.departmentDuration,
      });

      await db
        .insert(section)
        .values({
          sectionName: sectionName,
          sectionDuration: durationDate,
          departmentId: departmentId,
        })
        .returning({ id: section.sectionName });
      return "test";
    }),
});
