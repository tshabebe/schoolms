import { Input } from "@nextui-org/input";
import { InsertDepartmentSchema } from "@/app/_db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/app/lib/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

type DepartmentType = z.infer<typeof InsertDepartmentSchema>;

export default function App() {
  const queryClient = useQueryClient();
  const departmentsKey = getQueryKey(api.departmentRouter.newDepartment);
  const newDepartment = api.classRouter.newClass.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentsKey });
    },
  });
  const { register, handleSubmit, formState } = useForm<DepartmentType>({
    resolver: zodResolver(InsertDepartmentSchema),
  });

  function submit(datap: DepartmentType) {
    newDepartment.mutate(datap);
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
          {newDepartment.isPending ? "loading" : "submit"}
        </button>
      </div>
    </div>
  );
}
