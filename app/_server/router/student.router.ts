import { InsertStudentSchema, student } from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { eq } from "drizzle-orm";

export const studentRouter = router({
  createStudent: authedProcedure
    .input(
      InsertStudentSchema.pick({
        name: true,
        sectionId: true,
        userId: true,
      }),
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { name, sectionId, userId } = opts.input;
      await db
        .insert(student)
        .values({
          name,
          sectionId,
          userId,
        })
        .returning({ id: student.id });
    }),
  getSectionStudents: authedProcedure
    .input(InsertStudentSchema.pick({ sectionId: true }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { sectionId } = opts.input;
      const students = await db
        .select()
        .from(student)
        .where(eq(student.sectionId, sectionId));

      return students;
    }),
});
