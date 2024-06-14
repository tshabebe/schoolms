"use client";
import { Input } from "@nextui-org/input";
import { InsertDepartmentSchema } from "@/app/_db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { classAction } from "./action";

type DepartmentType = z.infer<typeof InsertDepartmentSchema>;

export default function App() {
  // TODO: create a calass if there is no class
  const [isPending, setTransition] = useTransition();
  const [data, setData] = useState<string>();

  const { register, handleSubmit, formState } = useForm<DepartmentType>({
    resolver: zodResolver(InsertDepartmentSchema),
  });

  function submit(datap: DepartmentType) {
    setTransition(async () => {
      const data = await classAction(datap);
      setData(data);
      console.log("test");
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Input
          {...register("department")}
          placeholder="department"
          errorMessage={formState.errors.department?.message}
          isInvalid={(formState.errors.department && true) || false}
        />
        <Input
          {...register("departmentDuration")}
          placeholder="department"
          errorMessage={formState.errors.departmentDuration?.message}
          isInvalid={(formState.errors.departmentDuration && true) || false}
        />
        {/* <Date /> */}
        <button onClick={handleSubmit(submit)} type="submit">
          {isPending ? "loading" : "submit"}
        </button>
      </div>
    </div>
  );
}

// import { DateRangePicker } from "@nextui-org/date-picker";
// import { parseDate, getLocalTimeZone } from "@internationalized/date";
// import { useDateFormatter } from "@react-aria/i18n";
//
// function Date() {
//   const [value, setValue] = useState({
//     start: parseDate("2024-04-01"),
//     end: parseDate("2024-04-08"),
//   });
//
//   let formatter = useDateFormatter({ dateStyle: "short" });
//   const [loading, setTransition] = useTransition()
//   return (
//     <div className="flex flex-row gap-2">
//       <div className="w-full flex flex-col gap-y-2">
//         <DateRangePicker
//           label="Date range (controlled)"
//           value={value}
//           onChange={(e) => {
//             setTransition(async () => {
//               await setDuration()
//               setValue(e)
//             })
//           }}
//         />
//         <p className="text-default-500 text-sm">
//           {value
//             ? formatter.formatRange(
//                 value.start.toDate(getLocalTimeZone()),
//                 value.end.toDate(getLocalTimeZone()),
//               )
//             : "--"}
//         </p>
//       </div>
//     </div>
//   );
// }
