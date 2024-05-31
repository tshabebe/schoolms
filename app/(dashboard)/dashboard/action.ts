"use server";

import { InsertClassSchema } from "@/app/_db/schema";
import { z } from "zod";
import { classes } from "@/app/_db/schema";
import { db } from "@/app/_db";
import { getErrorMessage } from "../../../utils/handle-error";

export async function classAction(data: z.infer<typeof InsertClassSchema>) {
  try {
    const validatedData = InsertClassSchema.parse(data);
    const updatedId = await db
      .insert(classes)
      .values(validatedData)
      .returning({ id: classes.id });
    return updatedId;
  } catch (err) {
    console.log(getErrorMessage(err));
  }
}
