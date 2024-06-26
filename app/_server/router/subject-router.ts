import {
  InsertSubjectsSchema,
  SelectSubjectSchema,
  subjects,
} from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { eq } from "drizzle-orm";

export const subjectRouter = router({
  newSubject: authedProcedure
    .input(InsertSubjectsSchema.pick({ subjectsName: true, sectionId: true }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { subjectsName, sectionId } = opts.input;
      await db
        .insert(subjects)
        .values({ subjectsName: subjectsName, sectionId: sectionId })
        .returning({ id: subjects.id });
    }),
  getSubject: authedProcedure
    .input(SelectSubjectSchema.pick({ sectionId: true }))
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { sectionId } = opts.input;
      const test = await db.query.subjects.findMany({
        where: eq(subjects.sectionId, sectionId),
      });
      return test;
    }),
});
