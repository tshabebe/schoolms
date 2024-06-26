import { InsertDepartmentSchema, department } from "@/app/_db/schema";
import { publicProcedure, router } from "../trpc";
export const classRouter = router({
  newClass: publicProcedure
    .input(InsertDepartmentSchema)
    .mutation(async (opts) => {
      const { db } = opts.ctx;

      const validatedData = InsertDepartmentSchema.parse(opts.input);
      const test = await db
        .insert(department)
        .values({ department: validatedData.department })
        .returning({ id: department.id });

      return {
        departmentId: test[0],
      };
    }),
});
