"use client";
import { InsertStudentSchema } from "@/app/_db/schema";
import { api } from "@/app/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
const newSubjectSchema = InsertStudentSchema.omit({ sectionId: true });
export function ValidateInput({ sectionId }: { sectionId: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newSubjectSchema>
  >({
    resolver: zodResolver(newSubjectSchema),
  });

  const utils = api.useUtils();

  const newSection = api.studentRouter.newStudent.useMutation({
    onSuccess: async () => {
      await utils.teacherRouter.getTeacher.invalidate();
    },
  });

  function submit(data: z.infer<typeof newSubjectSchema>) {
    newSection.mutate({ ...data, sectionId });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="Student"
        {...register("studentName")}
        placeholder="Enter new student"
        errorMessage={formState.errors.studentName?.message}
        isInvalid={(formState.errors.studentName && true) || false}
      />
      <Input
        autoFocus
        label="Student userId"
        {...register("userId")}
        placeholder="put userId if it has an account"
        errorMessage={formState.errors.studentName?.message}
        isInvalid={(formState.errors.studentName && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newSection.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
