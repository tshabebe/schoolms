"use client";
import { Input } from "@nextui-org/input";
import { InsertDepartmentSchema } from "@/app/_db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { classAction } from "./action";

type DepartmentType = z.infer<typeof InsertDepartmentSchema>;

export default function App() {
  // TODO: create a calass if there is no class
  const [isPending, setTransition] = useTransition();
  const [data, setData] = useState<string>();

  const { register, handleSubmit, formState } = useForm<DepartmentType>({
    resolver: zodResolver(InsertDepartmentSchema),
  });

  function submit(datap: DepartmentType) {
    setTransition(async () => {
      const data = await classAction(datap);
      setData(data);
      console.log('test')
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Input
          {...register("department")}
          placeholder="department"
          errorMessage={formState.errors.department?.message}
          isInvalid={(formState.errors.department && true) || false}
        />
        <button onClick={handleSubmit(submit)} type="submit">
          {isPending ? "loading" : "submit"}
        </button>
      </div>
    </div>
  );
}
