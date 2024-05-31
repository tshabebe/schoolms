import { integer, pgTable, serial, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const classes = pgTable("class", {
  id: serial("id").primaryKey(),
  className: varchar("class_name", { length: 256 }).notNull().unique(),
});

export const InsertClassSchema = createInsertSchema(classes, {
  className: zfd.text(
    z.string().max(2, "className should not be more than 2 characters"),
  ),
}).omit({ id: true });
