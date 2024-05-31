"use client";
import { Input } from "@nextui-org/input";
import { InsertClassSchema } from "@/app/_db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { classAction } from "./action";

export default function Dashboard() {
  // TODO: create a calass if there is no class
  const [loading, setTransition] = useTransition();

  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof InsertClassSchema>
  >({
    resolver: zodResolver(InsertClassSchema),
  });

  function submit(data: z.infer<typeof InsertClassSchema>) {
    setTransition(async () => {
      await classAction(data);
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <Input
          {...register("className")}
          placeholder="inter your class name"
          errorMessage={formState.errors.className?.message}
          isInvalid={(formState.errors.className && true) || false}
        />
        <button type="submit">{loading ? "loading" : "submit"}</button>
      </form>
    </div>
  );
}
