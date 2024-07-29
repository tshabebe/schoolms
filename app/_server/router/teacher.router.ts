import {
  InsertTeacherToSubjectSchema,
  InsertTeacherSchema,
  SelectTeacherSchema,
  teacher,
  teacherToSubject,
} from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { eq } from "drizzle-orm";

export const teacherRouter = router({
  addTeacherSubject: authedProcedure
    .input(
      InsertTeacherSchema.merge(InsertTeacherToSubjectSchema)
        .pick({
          subjectId: true,
          sectionId: true,
          teacherName: true,
          teacherId: true,
          userId: true,
        })
        .partial({ teacherId: true }),
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const {
        subjectId,
        teacherName,
        teacherId: newTeacherId,
        sectionId,
        userId,
      } = opts.input;
      await db.transaction(async (tx) => {
        //TODO: for this section the teacher should not be assigned another subject
        // const alreadyAssigned = await tx.query.section.findMany({
        //   with: { teachers: true },
        // });
        if (newTeacherId) {
          await tx.insert(teacherToSubject).values({
            subjectId,
            teacherId: newTeacherId,
          });
          return;
        }

        const [{ id: teacherId }] = await tx
          .insert(teacher)
          .values({
            teacherName: teacherName,
            sectionId: sectionId,
            userId: userId ? userId : opts.ctx.user.id,
          })
          .returning({ id: teacher.id });
        await tx.insert(teacherToSubject).values({
          subjectId,
          teacherId,
        });
      });
    }),
  getTeacher: authedProcedure
    .input(SelectTeacherSchema.pick({ sectionId: true }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { sectionId } = opts.input;
      const teachers = await db
        .select()
        .from(teacher)
        .where(eq(teacher.sectionId, sectionId));
      return teachers;
    }),
});
