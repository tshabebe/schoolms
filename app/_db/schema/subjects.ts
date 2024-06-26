import { generateId } from "@/app/lib/id";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { section } from "./classes";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";

export const subjects = pgTable("subjects", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  subjectsName: varchar("subjects_name", { length: 256 }).notNull(),
  sectionId: varchar("section_id")
    .notNull()
    .references(() => section.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
});

export const subjectsRelations = relations(subjects, ({ one }) => ({
  sectionId: one(section, {
    fields: [subjects.sectionId],
    references: [section.id],
  }),
}));

export const InsertSubjectsSchema = createInsertSchema(subjects, {
  subjectsName: zfd.text(z.string().min(10, "no more than 10")),
});

export const SelectSubjectSchema = createSelectSchema(subjects);
