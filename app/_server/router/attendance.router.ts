import {
  attendanceRecord,
  InsertAttendanceRecordSchema,
  scedule,
  sceduleDay,
  teacher,
} from "@/app/_db/schema";
import { authedProcedure, router } from "../trpc";
import { eq, and, lte, gte } from "drizzle-orm";
import { format } from "date-fns";

export const attendanceRouter = router({
  addAttendance: authedProcedure
    .input(InsertAttendanceRecordSchema.omit({ sceduleId: true }))
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const day = format(new Date(), "yyyy-MM-dd");
      const time = format(new Date(), "hh:mm");

      const [teacherWithCurrentScedule] = await db
        .select({
          sceduleId: scedule.id,
        })
        .from(teacher)
        .leftJoin(sceduleDay, eq(sceduleDay.teacherId, teacher.id))
        .leftJoin(scedule, eq(scedule.sceduleId, sceduleDay.id))
        .where(
          and(
            lte(scedule.startTime, time),
            gte(scedule.endTime, time),
            eq(sceduleDay.day, day),
            eq(teacher.id, opts.input.teacherId),
          ),
        );
      if (!teacherWithCurrentScedule) {
        throw new Error(
          "No active schedule found for the teacher at this time",
        );
      }

      // check if the attendance is already assinged
      const [assignedAttendance] = await db
        .select()
        .from(attendanceRecord)
        .where(
          and(
            eq(attendanceRecord.teacherId, opts.input.teacherId),
            eq(
              attendanceRecord.sceduleId,
              teacherWithCurrentScedule.sceduleId!,
            ),
          ),
        );

      if (assignedAttendance) {
        throw new Error("it has already been assigned");
      }

      await db.insert(attendanceRecord).values({
        teacherId: opts.input.teacherId,
        password: opts.input.password,
        sectionId: opts.input.sectionId,
        sceduleId: teacherWithCurrentScedule.sceduleId!,
      });
    }),

  getSubjectAttendances: authedProcedure
    .input(InsertAttendanceRecordSchema)
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { sectionId } = opts.input;
      const teacherWithCurrentScedule = await db
        .select()
        .from(attendanceRecord)
        .where(eq(attendanceRecord.id, teacher.id));
      return teacherWithCurrentScedule;
    }),
});
