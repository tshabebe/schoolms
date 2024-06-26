import { publicProcedure, router } from "../trpc";

export const departmentRouter = router({
  newDepartment: publicProcedure.query(async (opts) => {
    const { db } = opts.ctx;
    const department = await db.query.department.findMany({
      with: {
        section: true,
      },
    });
    return department;
  }),
});
