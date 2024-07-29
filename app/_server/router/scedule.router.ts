import {
  // InsertAttendanceRecordSchema,
  InsertSceduleDaySchema,
  InsertSceduleSchema,
  scedule,
  sceduleDay,
  student,
  teacher,
} from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { eq, gte, lte, or, and } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const sceduleRouter = router({
  getStudentScedules: authedProcedure.query(async (opts) => {
    const { db, user } = opts.ctx;
    const studentScedules = await db
      .select({
        section: teacher.sectionId,
        teacher: teacher.teacherName,
        // student: student.id,
        sceduleDay: sceduleDay.day,
        scedule,
      })
      .from(sceduleDay)
      .innerJoin(scedule, eq(scedule.sceduleId, sceduleDay.id))
      .innerJoin(teacher, eq(teacher.id, sceduleDay.teacherId))
      .leftJoin(student, eq(student.sectionId, teacher.sectionId))
      .where(eq(student.userId, user.id));
    console.log(studentScedules);
    return studentScedules;
  }),
  addTeacherScedule: authedProcedure
    .input(
      InsertSceduleDaySchema.merge(InsertSceduleSchema).extend({
        teacherId: z.string(),
        sectionId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { day, endTime, startTime, teacherId, sectionId } = opts.input;
      console.log(sectionId);

      await db.transaction(async (tx) => {
        const [currentTeacherWithSceduleDay] = await tx
          .select()
          .from(sceduleDay)
          .where(
            and(eq(sceduleDay.teacherId, teacherId), eq(sceduleDay.day, day!)),
          );

        if (!currentTeacherWithSceduleDay) {
          const [{ id: sceduleDayId }] = await tx
            .insert(sceduleDay)
            .values({
              day,
              teacherId,
            })
            .returning({ id: sceduleDay.id });
          await tx
            .insert(scedule)
            .values({
              startTime,
              endTime,
              sceduleId: sceduleDayId,
            })
            .returning({ id: scedule.id });
          return;
        }

        const [scedulesSection] = await tx
          .select()
          .from(scedule)
          .innerJoin(sceduleDay, eq(sceduleDay.id, scedule.sceduleId))
          .innerJoin(teacher, eq(teacher.id, sceduleDay.teacherId))
          .where(
            and(
              eq(sceduleDay.day, day!),
              eq(teacher.sectionId, sectionId!),
              or(
                and(
                  gte(scedule.startTime, startTime!),
                  lte(scedule.endTime, endTime!),
                ),
                and(
                  lte(scedule.startTime, startTime!),
                  gte(scedule.endTime, startTime!),
                ),
                and(
                  gte(scedule.startTime, endTime!),
                  lte(scedule.endTime, endTime!),
                ),
                and(
                  lte(scedule.startTime, startTime!),
                  gte(scedule.endTime, endTime!),
                ),
              ),
            ),
          );

        if (scedulesSection) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "This teacher is already assigned to this section on this day",
          });
        }

        const [sceduleId] = await tx
          .select()
          .from(scedule)
          .where(
            and(
              eq(scedule.sceduleId, currentTeacherWithSceduleDay.id!),
              or(
                and(
                  gte(scedule.startTime, startTime!),
                  lte(scedule.endTime, endTime!),
                ),
                and(
                  lte(scedule.startTime, startTime!),
                  gte(scedule.endTime, startTime!),
                ),
                and(
                  gte(scedule.startTime, endTime!),
                  lte(scedule.endTime, endTime!),
                ),
                and(
                  lte(scedule.startTime, startTime!),
                  gte(scedule.endTime, endTime!),
                ),
              ),
            ),
          );
        if (!sceduleId) {
          await tx
            .insert(scedule)
            .values({
              startTime,
              endTime,
              sceduleId: currentTeacherWithSceduleDay.id,
            })
            .returning({ id: scedule.id });
          console.log("test");
        }
      });
    }),
});
