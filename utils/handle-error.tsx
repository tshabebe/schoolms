import * as z from "zod";

import { unknownError } from "./constants";

export function getErrorMessage(err: unknown) {
  if (err instanceof z.ZodError) {
    return err.errors[0]?.message ?? unknownError;
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}
