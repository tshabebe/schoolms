import {
  InsertTeachersSchema,
  SelectTeachersSchema,
  teacher,
} from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { eq } from "drizzle-orm";

export const teacherRouter = router({
  newTeacher: authedProcedure
    .input(
      InsertTeachersSchema.pick({
        subjectsId: true,
        teacherName: true,
        sectionId: true,
      }),
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { teacherName, subjectsId, sectionId } = opts.input;
      await db
        .insert(teacher)
        .values({
          teacherName: teacherName,
          sectionId: sectionId,
          subjectsId: subjectsId,
        })
        .returning({ id: teacher.id });
    }),
  getTeacher: authedProcedure
    .input(SelectTeachersSchema.pick({ sectionId: true }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { sectionId } = opts.input;
      const test = await db.query.teacher.findMany({
        where: eq(teacher.sectionId, sectionId),
      });
      return test;
    }),
});
