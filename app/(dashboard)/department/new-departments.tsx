import { Input } from "@nextui-org/input";
import { InsertDepartmentSchema } from "@/app/_db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/app/lib/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { zfd } from "zod-form-data";
const ZInsertDepartmentSchema = InsertDepartmentSchema.extend({
  duration: zfd.numeric(z.number()),
});
type DepartmentType = z.infer<typeof ZInsertDepartmentSchema>;

export default function App() {
  const queryClient = useQueryClient();
  const departmentsKey = getQueryKey(api.departmentRouter.createDepartment);
  const newDepartment = api.classRouter.newClass.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentsKey });
    },
  });
  const { register, handleSubmit, formState } = useForm<DepartmentType>({
    resolver: zodResolver(ZInsertDepartmentSchema),
  });

  function submit(datap: DepartmentType) {
    newDepartment.mutate(datap);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Input
          {...register("name")}
          placeholder="department"
          errorMessage={formState.errors.name?.message}
          isInvalid={(formState.errors.name && true) || false}
        />
        <Input
          {...register("duration")}
          placeholder="department"
          errorMessage={formState.errors.duration?.message}
          isInvalid={(formState.errors.duration && true) || false}
        />
        <button onClick={handleSubmit(submit)} type="submit">
          {newDepartment.isPending ? "loading" : "submit"}
        </button>
      </div>
    </div>
  );
}
