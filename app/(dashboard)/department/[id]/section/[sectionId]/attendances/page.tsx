"use client";
import { api } from "@/app/lib/trpc/client";
import { ValidateInput } from "./registor-attendance";
import { usePathname, useRouter } from "next/navigation";
export default function Student({ params }: { params: { sectionId: string } }) {
  // const student = api.attendanceRouter.getSubject.useQuery({
  //   sectionId: params.sectionId,
  // });

  const router = useRouter();
  const test = usePathname();
  return (
    <div>
      {/*   hello from students */}
      {/*   {student.data && */}
      {/*     student.data!.map((students) => ( */}
      {/*       <div key={students.id}> */}
      {/*         <div>{students.studentName}</div> */}
      {/*         <div>assign grade</div> */}
      {/*         <div>assign attendance</div> */}
      {/*         <button onClick={() => router.push(`${test}/${students.id}`)}> */}
      {/*           manage grade */}
      {/*         </button> */}
      {/*       </div> */}
      {/*     ))} */}
      <ValidateInput sectionId={params.sectionId} />
    </div>
  );
}
