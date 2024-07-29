import { Input } from "@nextui-org/input";
import { InsertDepartmentSchema } from "@/app/_db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/app/lib/trpc/client";
import { match } from "ts-pattern";
import { zfd } from "zod-form-data";

const ZCreateDepartment = InsertDepartmentSchema.extend({
  duration: zfd.numeric(z.number()),
});
type TCreateDepartment = z.infer<typeof ZCreateDepartment>;

export default function App() {
  const utils = api.useUtils();
  const newDepartment = api.departmentRouter.createDepartment.useMutation({
    onSuccess: async () => {
      await utils.departmentRouter.getTeacher.invalidate();
    },
  });
  const Test = match(newDepartment)
    .with({ isPending: true }, () => <div>hello world</div>)
    .otherwise(() => <div>things are not nice</div>);
  const { register, handleSubmit, formState } = useForm<TCreateDepartment>({
    resolver: zodResolver(ZCreateDepartment),
  });

  function submit(datap: TCreateDepartment) {
    newDepartment.mutate(datap);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Input
          {...register("name")}
          placeholder="department name"
          errorMessage={formState.errors.name?.message}
          isInvalid={(formState.errors.name && true) || false}
        />
        <Input
          {...register("duration")}
          placeholder="department duration"
          errorMessage={formState.errors.duration?.message}
          isInvalid={(formState.errors.duration && true) || false}
        />
        <Input
          {...register("userId")}
          placeholder="user Id to be invited"
          errorMessage={formState.errors.userId?.message}
          isInvalid={(formState.errors.userId && true) || false}
        />
        {/* <Test /> */}
        <button onClick={handleSubmit(submit)} type="submit">
          {newDepartment.isPending ? "loading" : "submit"}
        </button>
      </div>
    </div>
  );
}
