import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/app/_server/app";
import { createTRPCContext } from "@/app/_server/trpc";
import { NextRequest } from "next/server";
import { db } from "@/app/_db";

const createContext = (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
  });
}
export { handler as GET, handler as POST };
