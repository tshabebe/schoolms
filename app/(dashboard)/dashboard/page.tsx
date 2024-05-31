"use client";
import { Input } from "@nextui-org/input";
import { InsertSectionSchema } from "@/app/_db/schema";
import { InsertDepartmentSchema } from "@/app/_db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { classAction } from "./action";


const mergedSchema = InsertSectionSchema.merge(InsertDepartmentSchema)
type MergedType = z.infer<typeof mergedSchema>

export default function Dashboard() {
  // TODO: create a calass if there is no class
  const [loading, setTransition] = useTransition();

  const { register, handleSubmit, formState } = useForm<
    MergedType
  >({
    resolver: zodResolver(mergedSchema),
  });

  function submit(data: z.infer<typeof InsertSectionSchema>) {
    setTransition(async () => {
      await classAction(data);
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <Input
          {...register("department")}
          placeholder="inter your class name"
          errorMessage={formState.errors.department?.message}
          isInvalid={(formState.errors.department && true) || false}
        />
        <Input
          {...register("sectionName")}
          placeholder="inter your class name"
          errorMessage={formState.errors.sectionName?.message}
          isInvalid={(formState.errors.sectionName && true) || false}
        />
        <button type="submit">{loading ? "loading" : "submit"}</button>
      </form>
    </div>
  );
}
