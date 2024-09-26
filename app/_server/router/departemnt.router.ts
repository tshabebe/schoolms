import { and, eq, or, count } from "drizzle-orm";
import { authedProcedure, router } from "../trpc";
import {
  InsertDepartmentSchema,
  department,
  scedule,
  sceduleDay,
  section,
  teacher,
} from "@/app/_db/schema";
import { format } from "date-fns";

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
  getDepartments: authedProcedure.query(async (opts) => {
    const { db, user } = opts.ctx;

    const userDepartments = await db
      .selectDistinctOn([department.id], {
        department,
        section: count(section.id),
      })
      .from(department)
      .leftJoin(section, eq(section.departmentId, department.id))
      .leftJoin(teacher, eq(teacher.sectionId, section.id))
      .where(or(eq(teacher.userId, user.id), eq(department.userId, user.id)))
      .groupBy(department.id);

    return userDepartments;
  }),
});
