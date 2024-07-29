"use client";
import { useState } from "react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { Calendar } from "@nextui-org/calendar";
import { TimeInput } from "@nextui-org/date-input";
import { api } from "@/app/lib/trpc/client";
import { format } from "date-fns";
export default function teacherScedule({
  params,
}: {
  params: { teacherId: string; sectionId: string };
}) {
  console.log(params);
  return (
    <div>
      <AppTime
        teacherId={params.teacherId}
        sectionId={params.sectionId}
      ></AppTime>
    </div>
  );
}

export function AppTime({
  teacherId,
  sectionId,
}: {
  teacherId: string;
  sectionId: string;
}) {
  // this holds no functionality for the currentTime
  const currentTime = now(getLocalTimeZone());
  // console.log(getLocalTimeZone());
  const [startTime, setStartTime] = useState(currentTime);
  const [endTime, setEndTime] = useState(currentTime);

  const [value, setValue] = useState(currentTime);
  // console.log(/* startingTime, */ currentTime.day);
  const teacherScedule = api.sceduleRouter.addTeacherScedule.useMutation();
  console.log(/* startingTime, */ teacherScedule.data);

  return (
    <div className="w-full flex flex-row gap-2">
      <div className="w-full flex flex-col gap-y-2">
        <Calendar
          aria-label="Date (Controlled)"
          value={value}
          onChange={setValue}
        />
        <TimeInput
          label="Start Time (controlled)"
          value={startTime}
          onChange={setStartTime}
          isInvalid={false}
        />
        <TimeInput
          label="End Time (controlled)"
          value={endTime}
          onChange={setEndTime}
          isInvalid={endTime.compare(startTime) < 0}
          errorMessage={(value) => {
            if (value.isInvalid) {
              return "End time should be greater than start time";
            }
            return "test";
          }}
        />
        <button
          onClick={() => {
            teacherScedule.mutate({
              startTime: format(startTime.toDate(), "hh:mm"),
              endTime: format(endTime.toDate(), "hh:mm"),
              day: format(value.toDate(), "yyyy-MM-dd"),
              teacherId: teacherId,
              sectionId: sectionId,
            });
          }}
        >
          {teacherScedule.isPending ? "loading" : "submit"}
        </button>
      </div>
    </div>
  );
}
