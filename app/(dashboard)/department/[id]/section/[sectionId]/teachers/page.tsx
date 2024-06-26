"use client";
import { api } from "@/app/lib/trpc/client";
import { ValidateInput } from "./newTeacher";
export default function Student({ params }: { params: { sectionId: string } }) {
  const teachers = api.teacherRouter.getTeacher.useQuery({
    sectionId: params.sectionId,
  });
  const subjects = api.subjectRouter.getSubject.useQuery({
    sectionId: params.sectionId,
  });
  // TODO: if there is an error and then we should say something like
  // hey there is an error here pls check that out
  return (
    <div>
      <div className="flex">
        <div>
          {teachers.data &&
            teachers.data!.map((teacher) => (
              <div key={teacher.id}>{teacher.teacherName}</div>
            ))}
        </div>
        <div>
          {subjects.data &&
            subjects.data!.map((subjects) => (
              <div key={subjects.id}>{subjects.id}</div>
            ))}
        </div>
      </div>
      <ValidateInput sectionId={params.sectionId} />
    </div>
  );
}
