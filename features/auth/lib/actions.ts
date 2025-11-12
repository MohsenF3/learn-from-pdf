"use server";

import { ROUTES } from "@/lib/routes";
import { createClientFromServer } from "@/lib/supabase/server";
import { ActionResult } from "@/lib/types";
import { redirect } from "next/navigation";
import { loginSchema, verifyOTPSchema } from "./schemas";
import type { LoginSchemaType, VerifyOTPSchemaType } from "./types";

export async function login(
  input: LoginSchemaType
): Promise<ActionResult<{ email: string }>> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input data";
    return {
      success: false,
      error: firstError,
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
      };
    }

    if (error.status === 400) {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }

    return {
      success: false,
      error: "Failed to send code. Try again.",
    };
  }

  return { success: true, data: { email: parsed.data.email } };
}

export async function verifyOTP(
  input: VerifyOTPSchemaType
): Promise<ActionResult> {
  const parsed = verifyOTPSchema.safeParse(input);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input data";
    return {
      success: false,
      error: firstError,
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
      };
    }

    return {
      success: false,
      error: "Verification failed.",
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
