import type { Config } from "drizzle-kit";

export default {
  schema: "./app/_db/schema",
  out: "drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:mysecretpassword@localhost:5432",
  },
} satisfies Config;
