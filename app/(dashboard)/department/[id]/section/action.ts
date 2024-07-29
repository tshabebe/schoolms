"use server";
import { db } from "@/app/_db";
import {
  InsertStudentSchema,
  InsertTeacherSchema,
  student,
  teacher,
} from "@/app/_db/schema";
import { unstable_noStore as noStore } from "next/cache";
export async function newStudent(name: string, sectionId: string) {
  noStore();
  try {
    const validatedData = InsertStudentSchema.parse({ name, sectionId });
    await db
      .insert(student)
      .values({ name: validatedData.name })
      .returning({ id: student.id });
    console.log("testing");
  } catch (err) {
    console.log(err);
  }
  // console.log("test");
}

export async function newTeacher(name: string, sectionId: number) {
  noStore();
  try {
    const validatedData = InsertTeachersSchema.parse({
      name,
      sectionId,
    });
    await db
      .insert(teacher)
      .values({ name: validatedData.name })
      .returning({ id: teacher.id });
  } catch (err) {
    console.log(err);
  }
}
