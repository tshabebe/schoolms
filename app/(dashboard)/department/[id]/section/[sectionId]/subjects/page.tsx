"use client";
import { api } from "@/app/lib/trpc/client";
import { ValidateInput } from "./newSubjects";
export default function Student({ params }: { params: { sectionId: string } }) {
  const subjects = api.subjectRouter.getSubject.useQuery({
    sectionId: params.sectionId,
  });
  // TODO: if there is an error and then we should say something like
  // hey there is an error here pls check that out
  return (
    <div>
      hello from teachers
      {subjects.data &&
        subjects.data!.map((subject) => (
          <div key={subject.id}>{subject.name}</div>
        ))}
      <ValidateInput sectionId={params.sectionId} />
    </div>
  );
}
