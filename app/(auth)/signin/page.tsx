import { redirect } from "next/navigation";
import { SignInForm } from "./signInForm";
import { validateSession } from "../validateSession";

export default async function Signup() {
  // const { user } = await validateSession();
  // if (user) redirect("/");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        welcome to stms
      </h1>
      <div className="flex flex-col justify-center items-center">
        <SignInForm />
      </div>
    </div>
  );
}
