import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/app/_server/app";

export const api = createTRPCReact<AppRouter>({});
