"use client";

import { InsertGradeSchema } from "@/app/_db/schema";
import { api } from "@/app/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function StudentAttendance({
  params,
}: {
  params: { studentId: string; sectionId: string };
}) {
  const grades = api.gradeRouter.getStudentsGrade.useQuery({
    studentId: params.studentId,
    sectionId: params.sectionId,
    subjectId: "FE0kEwyAhNQz",
  });
  return (
    <div>
      grades{" "}
      {grades.data?.map((grades) => <div key={grades.id}>{grades.grade}</div>)}
      <ValidateInput
        sectionId={params.sectionId}
        studentId={params.studentId}
      />
    </div>
  );
}

const newGradeSchema = InsertGradeSchema.omit({
  sectionId: true,
  studentId: true,
});
export function ValidateInput({
  sectionId,
  studentId,
}: {
  sectionId: string;
  studentId: string;
}) {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof newGradeSchema>
  >({
    resolver: zodResolver(newGradeSchema),
  });

  const utils = api.useUtils();

  const newSection = api.gradeRouter.addStudentsGrade.useMutation({
    onSuccess: async () => {
      await utils.gradeRouter.getStudentsGrade.invalidate();
    },
  });

  function submit(data: z.infer<typeof newGradeSchema>) {
    newSection.mutate({ ...data, sectionId, studentId });
  }

  return (
    <div className="flex">
      <Input
        autoFocus
        label="grade"
        {...register("grade")}
        placeholder="Enter new grade"
        errorMessage={formState.errors.grade?.message}
        isInvalid={(formState.errors.grade && true) || false}
      />
      <Input
        autoFocus
        label="subject"
        {...register("subjectId")}
        placeholder="Enter subjectId"
        errorMessage={formState.errors.subjectId?.message}
        isInvalid={(formState.errors.subjectId && true) || false}
      />
      <Input
        autoFocus
        label="description"
        {...register("description")}
        placeholder="Enter your reason"
        errorMessage={formState.errors.subjectId?.message}
        isInvalid={(formState.errors.subjectId && true) || false}
      />
      <Button onClick={handleSubmit(submit)}>
        {newSection.isPending ? "loading" : "submit"}
      </Button>
      <Button>add new section</Button>
    </div>
  );
}
