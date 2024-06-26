import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { section } from "./classes";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { generateId } from "@/app/lib/id";
import { subjects } from "./subjects";

export const teacher = pgTable(
  "teacher",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(), // prefix_ + nanoid (12)
    teacherName: varchar("teacher_name", { length: 256 }).notNull(),
    subjectsId: varchar("subjects_id")
      .references(() => subjects.id)
      .notNull(),
    sectionId: varchar("section_id")
      .references(() => section.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`current_timestamp`)
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      teacherNameUnique: unique("unique_teachers_name").on(
        table.teacherName,
        table.sectionId,
      ),
      uniqueSubject: unique("unique_teachers_name_with_subject").on(
        table.sectionId,
        table.subjectsId,
      ),
    };
  },
);

export const teachersRelations = relations(teacher, ({ one }) => ({
  sectionId: one(section, {
    fields: [teacher.sectionId],
    references: [section.id],
  }),
}));

export const InsertTeachersSchema = createInsertSchema(teacher, {});
export const SelectTeachersSchema = createSelectSchema(teacher);
