import { z } from "zod";
import { authedProcedure, publicProcedure, router } from "./trpc";
import { classRouter } from "./router/class-router";
import { departmentRouter } from "./router/departemnt-router";
import { sectionRouter } from "./router/section-router";
import { teacherRouter } from "./router/teacher-router";
import { subjectRouter } from "./router/subject-router";

export const appRouter = router({
  hello: authedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const test = await db.query.department.findFirst();
      // console.log(test);
      return {
        greeting: `hello ${test?.department}`,
      };
    }),
  setDone: authedProcedure
    .input(
      z.object({
        id: z.number(),
        done: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      // console.log(db);
      console.log("hello world");
      return "test";
    }),
  classRouter: classRouter,
  departmentRouter: departmentRouter,
  sectionRouter: sectionRouter,
  teacherRouter: teacherRouter,
  subjectRouter: subjectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
