"use client";
import {
  InsertTeacherToSubjectSchema,
  InsertTeacherSchema,
} from "@/app/_db/schema";
import { api } from "@/app/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const newTeacherSchema = InsertTeacherSchema.merge(InsertTeacherToSubjectSchema)
  .omit({ sectionId: true })
  .partial({ teacherId: true });

export function ValidateInput({ sectionId }: { sectionId: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newTeacherSchema>
  >({
    resolver: zodResolver(newTeacherSchema),
  });

  const queryClient = useQueryClient();
  const teachersKey = getQueryKey(api.teacherRouter.getTeacher);

  const newSection = api.teacherRouter.addTeacherSubject.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersKey });
    },
  });
  type test = z.infer<typeof newTeacherSchema>;
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
        {...register("subjectId")}
        placeholder="Enter Subjects"
        errorMessage={formState.errors.teacherName?.message}
        isInvalid={(formState.errors.teacherName && true) || false}
      />
      {/* used for adding teacher from other section*/}
      <Input
        autoFocus
        label="userId"
        {...register("teacherId")}
        placeholder="Enter userId to registor"
        errorMessage={formState.errors.teacherId?.message}
        isInvalid={(formState.errors.teacherId && true) || false}
      />
      <Input
        autoFocus
        label="userId"
        {...register("userId")}
        placeholder="Enter userId to registor"
        errorMessage={formState.errors.userId?.message}
        isInvalid={(formState.errors.userId && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newSection.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
