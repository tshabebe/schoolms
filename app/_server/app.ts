import { z } from "zod";
import { procedure, router } from "./trpc";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const test = await db.query.department.findFirst();
      console.log(test);
      return {
        greeting: `hello ${test?.department}`,
      };
    }),
  setDone: procedure
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
});

// const test = router({
//   test: procedure.input((z.object({
//     text: z.string()
//   }))).query(opts => {
//     return {
//       greeting: 'options'
//     }
//   })
// })
//
// export type definition of API
export type AppRouter = typeof appRouter;
