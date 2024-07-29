import { InsertDepartmentSchema, department } from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
export const classRouter = router({
  newClass: authedProcedure
    .input(InsertDepartmentSchema)
    .mutation(async (opts) => {
      const { db, user } = opts.ctx;
      const { userId } = opts.input;

      const validatedData = InsertDepartmentSchema.parse(opts.input);
      const test = await db
        .insert(department)
        .values({
          name: validatedData.name,
          userId: userId ? userId : user.id,
        })
        .returning({ id: department.id });

      return {
        departmentId: test[0],
      };
    }),
});
