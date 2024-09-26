"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import {
  InsertDepartmentSchema,
  InsertSectionSchema,
  section,
} from "@/app/_db/schema";
import { z } from "zod";
import { department } from "@/app/_db/schema";
import { db } from "@/app/_db";
import { getErrorMessage } from "../../../utils/handle-error";
import { eq } from "drizzle-orm";
import { add } from "date-fns";

export async function classAction(
  data: z.infer<typeof InsertDepartmentSchema>,
) {
  noStore();
  try {
    const validatedData = InsertDepartmentSchema.parse(data);
    const test = await db
      .insert(department)
      .values({
        department: validatedData.department,
        departmentDuration: validatedData.departmentDuration,
      })
      .returning({ id: department.id });
    // return test[0].id;
  } catch (err) {
    return getErrorMessage(err);
  }
  // throw new Error("testing");
  revalidatePath("/dashboard");
  return "test";
}

export async function newSection(sectionName: string, departmentId: number) {
  noStore();
  try {
    const validatedData = InsertSectionSchema.parse({
      sectionName,
      departmentId,
    });

    const departmentWithId = await db.query.department.findFirst({
      where: eq(department.id, departmentId),
    });

    const durationDate = add(new Date(), {
      months: departmentWithId?.departmentDuration,
    });

    return await db
      .insert(section)
      .values({
        sectionName: validatedData.sectionName,
        sectionDuration: durationDate,
        departmentId: departmentId,
      })
      .returning({ id: section.sectionName });
  } catch (error) {
    console.log(getErrorMessage(error));
  }
  revalidatePath("/dashboard");
}
