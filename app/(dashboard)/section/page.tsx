"use client";
import { api } from "@/app/lib/trpc/client";
// import { serverClient } from "@/app/lib/trpc/serverClient";
import { usePersonStore } from "../store";

export default function Section() {
  const hello = api.hello.useQuery({ text: "hello from tRPC" });
  const department = api.classRouter.newClass.useMutation();
  // const helloform = await serverClient.hello({ text: "from tRPC" });
  // if (hello.isLoading) {
  //   return <div>loading...</div>;
  // }
  console.log();
  return (
    <div className="flex flex-row gap-2">
      <div className="w-full flex flex-col gap-y-2">
        hello {hello.data?.greeting}
        <div>hello {department.data?.departmentId.id}</div>
        <div>hello {department.error?.message}</div>
      </div>
    </div>
  );
}
