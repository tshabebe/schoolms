"use client";

import { Input } from "@nextui-org/input";
import { signIn as signUp } from "./action";
import { Button } from "@nextui-org/button";
import { z } from "zod";
import { useForm } from "../hooks";

const fields: {
  name: keyof SignUpSchema;
  label?: string;
  placeholder: string;
  type?: string;
}[] = [
  { name: "username", placeholder: "Enter Username" },
  /** We can ue zod to validate that our value is of type email */
  { name: "password", placeholder: "Enter password", type: "password" },
];

const signUpSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpSchema = z.infer<typeof signUpSchema>;
export function SignInForm() {
  const {
    errors,
    setErrors,
    beforeSubmit,
    setBeforeSubmit,
    InputRefs,
    onChange,
  } = useForm(signUpSchema);

  async function formAction(formRowData: FormData) {
    const data = Object.fromEntries(formRowData);
    const res = signUpSchema.safeParse(data);
    if (!res.success) {
      const errors: Partial<SignUpSchema> = res.error.issues.reduce(
        (acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        },
        {} as Record<string, string>,
      );
      setErrors(errors);

      for (const fieldName in errors) {
        const inputRef = InputRefs.current[fieldName as keyof SignUpSchema];
        if (inputRef) {
          inputRef.focus();
          break;
        }
      }
      setBeforeSubmit(false);
      return;
    }
    await signUp(formRowData);
  }

  return (
    <form action={formAction}>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="text-2xl font-semibold leading-none tracking-tight">
            Login to your school
          </div>
          <div className="text-sm text-muted-foreground">
            username and password.
          </div>
        </div>
        {fields.map(({ name, placeholder, type, label }) => (
          <div className="p-6 pt-0 flex flex-col gap-2" key={name}>
            <label htmlFor={name}>{label ?? name}</label>
            <Input
              type={type}
              name={name}
              id={name}
              placeholder={placeholder}
              onChange={beforeSubmit ? undefined : onChange}
              ref={(ref) => {
                InputRefs.current[name] = ref;
              }}
            />
            {errors[name] && <ErrorMessage name={name} errors={errors} />}
          </div>
        ))}
        <div className="flex items-center p-6 pt-0">
          <Button type="submit" className="w-full">
            signUp
          </Button>
        </div>
      </div>
    </form>
  );
}

function ErrorMessage({
  name,
  errors,
}: {
  name: keyof SignUpSchema;
  errors: Partial<SignUpSchema>;
}) {
  return <p className="text-red-500 text-sm">{errors[name]}</p>;
}
