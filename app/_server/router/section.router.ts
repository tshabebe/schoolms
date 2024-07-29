import {
  InsertSectionSchema,
  InsertStudentSchema,
  department,
  section,
  student,
  teacher,
} from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { eq, and, or } from "drizzle-orm";
import { add } from "date-fns";

export const sectionRouter = router({
  createSection: authedProcedure
    .input(InsertSectionSchema.pick({ name: true, departmentId: true }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { name, departmentId } = opts.input;
      const departmentWithId = await db.query.department.findFirst({
        where: eq(department.id, departmentId!),
      });
      // it is o probably better to allow the user to end the section when he feels like it
      const sectionDuration = add(new Date(), {
        months: departmentWithId?.duration,
      });

      await db
        .insert(section)
        .values({
          name,
          duration: sectionDuration,
          departmentId: departmentId,
        })
        .returning({ id: section.name });
    }),

  addStudent: authedProcedure
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
  getTeacher: authedProcedure
    .input(InsertSectionSchema.pick({ departmentId: true }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      const sections = await db
        .selectDistinctOn([section.id], {
          section,
          department,
        })
        .from(section)
        .leftJoin(teacher, eq(teacher.sectionId, section.id))
        .leftJoin(department, eq(department.id, section.departmentId))
        .where(
          or(
            and(
              eq(teacher.userId, opts.ctx.user.id),
              eq(department.id, opts.input.departmentId),
            ),
            and(
              eq(section.departmentId, opts.input.departmentId),
              eq(department.userId, opts.ctx.user.id),
            ),
          ),
        );
      // console.log(sections, data, opts.ctx.user.id);
      return sections;
    }),
});
