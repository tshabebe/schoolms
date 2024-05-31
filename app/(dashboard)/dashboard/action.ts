"use server";

import { InsertDepartmentSchema, InsertSectionSchema } from "@/app/_db/schema";
import { z } from "zod";
import { section } from "@/app/_db/schema";
import { db } from "@/app/_db";
import { getErrorMessage } from "../../../utils/handle-error";

const mergedSchema = InsertSectionSchema.merge(InsertDepartmentSchema);
export async function classAction(data: z.infer<typeof mergedSchema>) {
  try {
    const validatedData = mergedSchema.parse(data);
    const updatedId = await db
      .insert(section)
      .values({ sectionName: validatedData.sectionName })
      .returning({ id: section.id });
    return updatedId;
  } catch (err) {
    console.log(getErrorMessage(err));
  }
}
