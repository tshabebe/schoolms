import { ChangeEvent, useRef, useState } from "react";
import { ZodRawShape, z } from "zod";

export function useForm<T extends z.ZodObject<ZodRawShape>>(signUpSchema: T) {
  const [errors, setErrors] = useState<Partial<z.infer<T>>>({});
  const [beforeSubmit, setBeforeSubmit] = useState(true);

  // we need refs to focus on an input
  const InputRefs = useRef<
    Partial<{
      [key in keyof z.infer<T>]: HTMLInputElement | null;
    }>
  >({});

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target as {
      name: keyof z.infer<T>;
      value: string;
    };
    validateField(name, value);
  }

  function validateField(fieldName: keyof z.infer<T>, value: string) {
    const res = signUpSchema
      .pick({ [fieldName]: true } as Record<
        Exclude<keyof z.infer<T>, string | number>,
        never
      >)
      .safeParse({ [fieldName]: value });
    if (res.success) {
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: undefined }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: res.error.issues[0].message,
      }));
    }
  }

  return {
    errors,
    setErrors,
    beforeSubmit,
    setBeforeSubmit,
    InputRefs,
    onChange,
  };
}
