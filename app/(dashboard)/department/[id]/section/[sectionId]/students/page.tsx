"use client";
import { api } from "@/app/lib/trpc/client";
import { ValidateInput } from "./new-student";
import { usePathname, useRouter } from "next/navigation";
export default function Student({ params }: { params: { sectionId: string } }) {
  const student = api.studentRouter.getStudent.useQuery({
    sectionId: params.sectionId,
  });
  // TODO: if there is an error and then we should say something like
  // hey there is an error here pls check that out
  // students are also users so it should refrence the userId of that student
  // students could go different sections

  const router = useRouter();
  const test = usePathname();
  return (
    <div>
      hello from students
      {student.data &&
        student.data!.map((students) => (
          <div key={students.id}>
            <div>{students.studentName}</div>
            <div>assign grade</div>
            <div>assign attendance</div>
            <button onClick={() => router.push(`${test}/${students.id}`)}>
              manage grade
            </button>
          </div>
        ))}
      <ValidateInput sectionId={params.sectionId} />
    </div>
  );
}
