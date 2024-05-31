"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@nextui-org/input";

const schema = z.object({
  name: z.string().min(10),
  age: z.number().min(20),
});

// we will use the schema from the database
type Schema = z.infer<typeof schema>;

export default function Student() {
  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Schema) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name")}
        errorMessage={formState.errors.name?.message}
        isInvalid={(formState.errors.name && true) || false}
      />
      <Input
        {...register("age", { valueAsNumber: true })}
        type="number"
        errorMessage={formState.errors.age?.message}
        isInvalid={(formState.errors.age && true) || false}
      />
      <button type="submit" className="">
        hello
      </button>
    </form>
  );
}
