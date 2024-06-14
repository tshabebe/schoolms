// "use client";
import { api } from "@/app/lib/trpc/client";
import { serverClient } from "@/app/lib/trpc/serverClient";

export default async function Section() {
  // const hello = api.hello.useQuery({ text: "from tRPC" });
  const helloform = await serverClient.hello({ text: "from tRPC" });
  // if (hello.isLoading) {
  //   return <div>loading...</div>;
  // }
  console.log();
  return (
    <div className="flex flex-row gap-2">
      <div className="w-full flex flex-col gap-y-2">
        hello {helloform.greeting}
      </div>
    </div>
  );
}
