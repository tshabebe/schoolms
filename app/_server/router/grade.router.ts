import { InsertGradeSchema, grade } from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { and, eq, sum } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const gradeRouter = router({
  addStudentsGrade: authedProcedure
    .input(InsertGradeSchema)
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const [sumOfGrades] = await db
        .select({
          average: sum(grade.grade).mapWith(Number),
        })
        .from(grade)
        .where(
          and(
            eq(grade.subjectId, opts.input.subjectId),
            eq(grade.sectionId, opts.input.sectionId),
            eq(grade.studentId, opts.input.studentId),
          ),
        );

      if (sumOfGrades.average + opts.input.grade! > 100)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "hey you can't be having more than 100 average grade right",
        });
      await db.insert(grade).values(opts.input).returning({ id: grade.id });
    }),
  getStudentsGrade: authedProcedure
    .input(InsertGradeSchema)
    .query(async (opts) => {
      const { db } = opts.ctx;
      const studentGrades = await db
        .select()
        .from(grade)
        .where(
          and(
            eq(grade.subjectId, opts.input.subjectId),
            eq(grade.sectionId, opts.input.sectionId),
            eq(grade.studentId, opts.input.studentId),
          ),
        );
      return studentGrades;
    }),
  getStudentGrade: authedProcedure
    .input(InsertGradeSchema)
    .query(async (opts) => {
      const db = opts.ctx.db;
    }),
});
