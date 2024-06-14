import { appRouter } from "@/app/_server/app";
import { createCallerFactory, createTRPCContext } from "@/app/_server/trpc";
import { headers } from "next/headers";
import { cache } from "react";

const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    headers: heads,
  });
});

export const serverClient = createCallerFactory(appRouter)(createContext);
