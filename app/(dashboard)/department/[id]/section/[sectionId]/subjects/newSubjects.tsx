"use client";
import { InsertSubjectsSchema } from "@/app/_db/schema";
import { api } from "@/app/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
const newSubjectSchema = InsertSubjectsSchema.omit({ sectionId: true });
export function ValidateInput({ sectionId }: { sectionId: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newSubjectSchema>
  >({
    resolver: zodResolver(newSubjectSchema),
  });

  const queryClient = useQueryClient();
  const teachersKey = getQueryKey(api.teacherRouter.getTeacher);

  const newSection = api.subjectRouter.newSubject.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersKey });
    },
  });

  function submit(data: z.infer<typeof newSubjectSchema>) {
    newSection.mutate({ ...data, sectionId });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="Section"
        {...register("subjectsName")}
        placeholder="Enter section"
        errorMessage={formState.errors.subjectsName?.message}
        isInvalid={(formState.errors.subjectsName && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newSection.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
