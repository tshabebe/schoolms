"use client";
import { InsertAttendanceRecordSchema } from "@/app/_db/schema";
import { api } from "@/app/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
const newSubjectSchema = InsertAttendanceRecordSchema.omit({
  sectionId: true,
  sceduleId: true,
});
export function ValidateInput({ sectionId }: { sectionId: string }) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newSubjectSchema>
  >({
    resolver: zodResolver(newSubjectSchema),
  });

  const utils = api.useUtils();

  const newSection = api.attendanceRouter.addAttendance.useMutation({
    onSuccess: async () => {
      await utils.sectionRouter.getTeacher.invalidate();
    },
  });

  function submit(data: z.infer<typeof newSubjectSchema>) {
    newSection.mutate({ ...data, sectionId });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="teacherId"
        {...register("teacherId")}
        placeholder="Enter your teacherId"
        errorMessage={formState.errors.teacherId?.message}
        isInvalid={(formState.errors.teacherId && true) || false}
      />
      <Input
        autoFocus
        label="Attendance password"
        {...register("password")}
        placeholder="Enter your attendance password"
        errorMessage={formState.errors.password?.message}
        isInvalid={(formState.errors.password && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newSection.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
