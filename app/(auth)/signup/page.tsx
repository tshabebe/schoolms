import { SignUpForm } from "./signUpForm";

export default function Signup() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Header />
      <div className=" flex flex-col w-72 justify-center">
        <SignUpForm />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        welcome to stms
      </h1>
    </div>
  );
}
