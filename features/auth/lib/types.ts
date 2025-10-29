import z from "zod";
import { loginSchema, verifyOTPSchema } from "./schemas";

export type LoginSchemaType = z.infer<typeof loginSchema>;

export type VerifyOTPSchemaType = z.infer<typeof verifyOTPSchema>;
