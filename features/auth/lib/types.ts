import z from "zod";
import { loginSchema, verifyOTPSchema } from "./schemas";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string };

export type LoginSchemaType = z.infer<typeof loginSchema>;

export type VerifyOTPSchemaType = z.infer<typeof verifyOTPSchema>;
