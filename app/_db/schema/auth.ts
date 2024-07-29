// import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
// import { department } from "./classes";
// import { teacher } from "./teachers";
import { createInsertSchema } from "drizzle-zod";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username"),
  userRole: text("user_role", { enum: ["admin", "user", "student"] }),
  password: text("password").notNull(),
});

// export const userRelations = relations(userTable, ({ one }) => ({
//   departmentId: one(department, {
//     fields: [userTable.id],
//     references: [department.userId],
//   }),
//   teacherId: one(teacher, {
//     fields: [userTable.id],
//     references: [teacher.userId],
//   }),
// }));

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const InsertUserTable = createInsertSchema(userTable).omit({id: true});;
