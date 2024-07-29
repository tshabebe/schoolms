import {
  InsertSubjectSchema,
  SelectSubjectSchema,
  subject,
} from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { eq } from "drizzle-orm";

export const subjectRouter = router({
  createSubject: authedProcedure
    .input(InsertSubjectSchema.pick({ name: true, sectionId: true }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { name, sectionId } = opts.input;
      await db
        .insert(subject)
        .values({ name, sectionId })
        .returning({ id: subject.id });
    }),
  getSubject: authedProcedure
    .input(SelectSubjectSchema.pick({ sectionId: true }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { sectionId } = opts.input;
      const test = await db.query.subject.findMany({
        where: eq(subject.sectionId, sectionId),
      });
      return test;
    }),
});
