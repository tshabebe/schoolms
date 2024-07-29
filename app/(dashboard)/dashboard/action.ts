"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { InsertDepartmentSchema } from "@/app/_db/schema";
import { z } from "zod";
import { department } from "@/app/_db/schema";
import { db } from "@/app/_db";
import { getErrorMessage } from "../../../utils/handle-error";
import { permanentRedirect } from "next/navigation";

export async function classAction(
  data: z.infer<typeof InsertDepartmentSchema>,
) {
  noStore();
  try {
    const validatedData = InsertDepartmentSchema.parse(data);
    await db
      .insert(department)
      .values({ name: validatedData.name })
      .returning({ id: department.id });
  } catch (err) {
    return console.log(getErrorMessage(err));
  }
  revalidatePath("/dashboard");
  permanentRedirect("/department");
}
