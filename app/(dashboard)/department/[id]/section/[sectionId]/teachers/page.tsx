"use client";
import { api } from "@/app/lib/trpc/client";
import { ValidateInput } from "./newTeacher";
import { usePathname, useRouter } from "next/navigation";
export default function Student({ params }: { params: { sectionId: string } }) {
  const teachers = api.teacherRouter.getTeacher.useQuery({
    sectionId: params.sectionId,
  });
  const subjects = api.subjectRouter.getSubject.useQuery({
    sectionId: params.sectionId,
  });
  // const section = api.sectionRouter.getSection.useQuery();
  const router = useRouter();
  const test = usePathname();
  return (
    <div>
      <div className="flex">
        <div>
          {teachers.data &&
            teachers.data!.map((teacher) => (
              <div key={teacher.id}>
                <div>{teacher.name} </div>{" "}
                <button onClick={() => router.push(`${test}/${teacher.id}`)}>
                  manage scedule
                </button>
              </div>
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
      <div>
        <button onClick={undefined}>go teacherId</button>
        {/* <App></App> */}
      </div>
    </div>
  );
}
