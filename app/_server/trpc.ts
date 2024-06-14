import { initTRPC } from "@trpc/server";
import { db } from "../_db";

export const createTRPCContext = (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create();

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
