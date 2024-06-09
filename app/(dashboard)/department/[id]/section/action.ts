"use server";
import { db } from "@/app/_db";
import {
  InsertStudentSchema,
  InsertTeachersSchema,
  student,
  teacher,
} from "@/app/_db/schema";
import { unstable_noStore as noStore } from "next/cache";
export async function newStudent(studentName: string, sectionId: number) {
  noStore();
  try {
    const validatedData = InsertStudentSchema.parse({ studentName, sectionId });
    await db
      .insert(student)
      .values({ studentName: validatedData.studentName })
      .returning({ id: student.id });
    console.log("testing");
  } catch (err) {
    console.log(err);
  }
  // console.log("test");
}

export async function newTeacher(teacherName: string, sectionId: number) {
  noStore();
  try {
    const validatedData = InsertTeachersSchema.parse({
      teacherName,
      sectionId,
    });
    await db
      .insert(teacher)
      .values({ teacherName: validatedData.teacherName })
      .returning({ id: teacher.id });
  } catch (err) {
    console.log(err);
  }
}
