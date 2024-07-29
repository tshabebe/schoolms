import { sql } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { generateId } from "@/app/lib/id";
import { userTable } from "./auth";

export const section = pgTable("section", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  departmentId: varchar("department_id", { length: 30 })
    .notNull()
    .references(() => department.id),
  duration: timestamp("section_duration").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
});

export const department = pgTable("department", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  name: varchar("name", { length: 256 }).notNull(),
  userId: varchar("user_id").references(() => userTable.id),
  duration: integer("department_duration").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
});

// export const departmentRelation = relations(department, ({ many }) => ({
//   section: many(section),
//   user: many(userTable),
// }));

// export const sectionRelation = relations(section, ({ one, many }) => ({
//   department: one(department, {
//     fields: [section.departmentId],
//     references: [department.id],
//   }),
//   students: many(student),
//   teachers: many(teacher),
//   subjects: many(subjects),
// }));

export const InsertDepartmentSchema = createInsertSchema(department).omit({
  id: true,
});
export const InsertSectionSchema = createInsertSchema(section).omit({
  id: true,
});
export const SelectSectionSchema = createSelectSchema(section).omit({
  id: true,
});
