"use client";
import { InsertTeachersSchema } from "@/app/_db/schema";
import { api } from "@/app/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
const newTeacherSchema = InsertTeachersSchema.omit({ sectionId: true });
export function ValidateInput({ sectionId }: { sectionId: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newTeacherSchema>
  >({
    resolver: zodResolver(newTeacherSchema),
  });

  const queryClient = useQueryClient();
  const teachersKey = getQueryKey(api.teacherRouter.getTeacher);

  const newSection = api.teacherRouter.newTeacher.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersKey });
    },
  });

  function submit(data: z.infer<typeof newTeacherSchema>) {
    newSection.mutate({ ...data, sectionId });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="teacher"
        {...register("teacherName")}
        placeholder="Enter teacher"
        errorMessage={formState.errors.teacherName?.message}
        isInvalid={(formState.errors.teacherName && true) || false}
      />
      <Input
        autoFocus
        label="subjects"
        {...register("subjectsId")}
        placeholder="Enter Subjects"
        errorMessage={formState.errors.teacherName?.message}
        isInvalid={(formState.errors.teacherName && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newSection.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
