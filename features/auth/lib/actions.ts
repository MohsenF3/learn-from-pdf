"use server";

import { ROUTES } from "@/lib/routes";
import { createClientFromServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import * as z from "zod";
import { loginSchema, verifyOTPSchema } from "./schemas";
import type {
  ActionResult,
  LoginSchemaType,
  VerifyOTPSchemaType,
} from "./types";

export async function login(
  input: LoginSchemaType
): Promise<ActionResult<{ email: string }>> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      success: false,
      error: fieldErrors.email?.[0] ?? "Invalid email",
      field: "email",
    };
  }

  const supabase = await createClientFromServer();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    if (error.status === 429) {
      return {
        success: false,
        error: "Too many requests. Please wait a minute.",
        field: "email",
      };
    }

    if (error.status === 400) {
      return {
        success: false,
        error: "Please enter a valid email address.",
        field: "email",
      };
    }

    return {
      success: false,
      error: "Failed to send code. Try again.",
      field: "email",
    };
  }

  return { success: true, data: { email: parsed.data.email } };
}

export async function verifyOTP(
  input: VerifyOTPSchemaType
): Promise<ActionResult> {
  const parsed = verifyOTPSchema.safeParse(input);

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      success: false,
      error: fieldErrors.code?.[0] ?? "Invalid code",
      field: "code",
    };
  }

  const supabase = await createClientFromServer();
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.code,
    type: "email",
  });

  if (error) {
    if (error.status === 400) {
      return {
        success: false,
        error: "Invalid or expired code. Try again.",
        field: "code",
      };
    }

    return {
      success: false,
      error: "Verification failed.",
      field: "code",
    };
  }

  return { success: true, data: undefined };
}

export async function resendOTP(email: string): Promise<ActionResult> {
  const parsed = loginSchema.shape.email.safeParse(email);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid email address.",
      field: "email",
    };
  }

  const supabase = await createClientFromServer();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    if (error.status === 429) {
      return {
        success: false,
        error: "Too many requests. Please wait a minute.",
      };
    }

    return {
      success: false,
      error: "Failed to resend code. Try again.",
    };
  }

  return { success: true, data: undefined };
}

export async function logout() {
  const supabase = await createClientFromServer();
  await supabase.auth.signOut();
  redirect(ROUTES.PUBLIC.HOME);
}
