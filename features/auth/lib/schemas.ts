import { z } from "zod";

const emailSchema = z
  .email("Please enter a valid email address.")
  .trim()
  .min(1, "Email is required.")
  .refine(
    (value) => !/^[^@]+@example\.com$/.test(value),
    "Emails from 'example.com' are not allowed."
  );

const pinSchema = z
  .string()
  .trim()
  .min(6, "Please enter a 6-digit code.")
  .max(6, "Please enter a 6-digit code.")
  .refine((value) => !/\D/.test(value), "Please enter a 6-digit code.");

export const loginSchema = z.object({
  email: emailSchema,
});

export const verifyOTPSchema = z.object({
  code: pinSchema,
  email: emailSchema,
});
