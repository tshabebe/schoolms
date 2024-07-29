"use server";
import { db } from "@/app/_db";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia } from "../authIntegration";
import { redirect } from "next/navigation";
import { userTable } from "@/app/_db/schema";
import { z } from "zod";
import { generateId } from "@/app/lib/id";

const signUpSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string(),
});

export async function signUp(formData: FormData) {
  const data = Object.fromEntries(formData);
  const res = signUpSchema.safeParse(data);

  if (!res.success) return "invalid Input";
  const { username, password, role } = res.data;

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId();

  // TODO: check if username is already used
  await db.insert(userTable).values({
    id: userId,
    username: username,
    password: hashedPassword,
    userRole: role,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  console.log("working");
  return redirect("/");
}
