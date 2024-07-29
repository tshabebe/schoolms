import { authedProcedure, router } from "../trpc";

export const userRouter = router({
  getUser: authedProcedure.query(async (opts) => {
    // console.log(opts.ctx.user);
    return opts.ctx.user;
  }),
});
