import { eq, or, sql } from "drizzle-orm";
import { authedProcedure, router } from "../trpc";
import {
  InsertDepartmentSchema,
  SelectSectionSchema,
  department,
  section,
  teacher,
} from "@/app/_db/schema";
import { z } from "zod";

export const departmentRouter = router({
  createDepartment: authedProcedure
    .input(InsertDepartmentSchema)
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { userId, name } = opts.input;

      const [TeacherDepartment] = await db
        .insert(department)
        .values({
          name,
          userId: userId ? userId : user.id,
        })
        .returning({ id: department.id });

      return TeacherDepartment;
    }),
  getTeacher: authedProcedure.query(async (opts) => {
    const { db, user } = opts.ctx;

    type Section = z.infer<typeof SelectSectionSchema>;
    const userDepartments = await db
      .selectDistinctOn([department.id], {
        department,
        section: sql<Section[]>`
      COALESCE(
        (
          SELECT json_agg(DISTINCT sub_section)
          FROM (
            SELECT ${section}
            FROM ${section}
            WHERE ${section.departmentId} = ${department.id}
          ) AS sub_section
        ),
        '[]'::json
      )`,
      })
      .from(department)
      .leftJoin(section, eq(section.departmentId, department.id))
      .leftJoin(teacher, eq(teacher.sectionId, section.id))
      .where(or(eq(teacher.userId, user.id), eq(department.userId, user.id)));
    return userDepartments;
  }),
});
