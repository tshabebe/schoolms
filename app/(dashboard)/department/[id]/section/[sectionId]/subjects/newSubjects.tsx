"use client";
import { InsertSubjectSchema } from "@/app/_db/schema";
import { api } from "@/app/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
const newSubjectSchema = InsertSubjectSchema.omit({ sectionId: true });
export function ValidateInput({ sectionId }: { sectionId: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newSubjectSchema>
  >({
    resolver: zodResolver(newSubjectSchema),
  });

  const utils = api.useUtils();

  const newSection = api.subjectRouter.createSubject.useMutation({
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
        label="Section"
        {...register("name")}
        placeholder="Enter section"
        errorMessage={formState.errors.name?.message}
        isInvalid={(formState.errors.name && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newSection.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
