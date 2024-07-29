"use client";
import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import { AddSubjects, AddTeachers } from "./modal";
import { AddStudents } from "./modal";
import { formatDistanceStrict } from "date-fns";
import { api } from "@/app/lib/trpc/client";
import { Authorization, POLICIES } from "../../authorization";
import { Button } from "@nextui-org/button";
import { usePathname, useRouter } from "next/navigation";

export default function Section({ params }: { params: { id: string } }) {
  const sections = api.sectionRouter.getTeacher.useQuery({
    departmentId: params.id,
  });
  const user = api.userRouter.getUser.useQuery();
  const router = useRouter();
  const test = usePathname();
  return (
    <div className="grid grid-cols-2 gap-4">
      {sections.data?.map(({ section, department }) => (
        <Card key={section.id}>
          <CardHeader className="justify-between">
            <div>sectionName: {section.name}</div>
            <div>
              sectionDuration:{" "}
              {formatDistanceStrict(new Date(), section.duration)}
            </div>
          </CardHeader>
          <CardFooter className="gap-2">
            <Authorization
              policyCheck={POLICIES["add:teacher"](user.data!, department!)}
            >
              <AddTeachers id={section.id} />
              <AddStudents id={section.id} />
              <AddSubjects id={section.id} />
            </Authorization>
            <Button
              onClick={() => router.push(`${test}/${section.id}/attendances`)}
            >
              get attendance for today
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
