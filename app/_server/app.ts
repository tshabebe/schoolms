import { router } from "./trpc";
import { classRouter } from "./router/class.router";
import { departmentRouter } from "./router/departemnt.router";
import { sectionRouter } from "./router/section.router";
import { teacherRouter } from "./router/teacher.router";
import { subjectRouter } from "./router/subject.router";
import { userRouter } from "./router/user.router";
import { studentRouter } from "./router/student.router";
import { gradeRouter } from "./router/grade.router";
import { attendanceRouter } from "./router/attendance.router";
import { sceduleRouter } from "./router/scedule.router";

export const appRouter = router({
  userRouter,
  classRouter,
  departmentRouter,
  sectionRouter,
  teacherRouter,
  subjectRouter,
  studentRouter,
  gradeRouter,
  attendanceRouter,
  sceduleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
