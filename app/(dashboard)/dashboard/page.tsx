"use client";
import { Input } from "@nextui-org/input";
import { InsertDepartmentSchema } from "@/app/_db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { classAction } from "./action";

type DepartmentType = z.infer<typeof InsertDepartmentSchema>;

export default function Dashboard() {
  // TODO: create a calass if there is no class
  const [loading, setTransition] = useTransition();

  const { register, handleSubmit, formState } = useForm<DepartmentType>({
    resolver: zodResolver(InsertDepartmentSchema),
  });

  function submit(data: DepartmentType) {
    setTransition(async () => {
      await classAction(data);
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <Input
          {...register("name")}
          placeholder="department"
          errorMessage={formState.errors.name?.message}
          isInvalid={(formState.errors.name && true) || false}
        />
        <button type="submit">{loading ? "loading" : "submit"}</button>
      </form>
    </div>
  );
}
