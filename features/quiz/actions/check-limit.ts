"use server";

import { getUser } from "@/features/auth/lib/getUser";
import { SupabaseService } from "@/lib/supabase/database.types";
import { createClientFromServer } from "@/lib/supabase/server";
import { ActionResult } from "@/lib/types";
import { headers } from "next/headers";
import { QUIZ_CONFIG } from "../lib/config";
import { RateLimitInfo } from "../lib/types";

export const checkQuizLimit = async (): Promise<
  ActionResult<RateLimitInfo>
> => {
  const user = await getUser();
  const supabase = await createClientFromServer();

  if (!user) {
    return await checkAnonymousUserLimit(supabase);
  }

  return await checkLoggedInUserLimit(supabase, user.id);
};

const checkAnonymousUserLimit = async (
  supabase: SupabaseService
): Promise<ActionResult<RateLimitInfo>> => {
  const ip = await getClientIP();

  const { data: canCreate, error } = await supabase.rpc(
    "check_anonymous_quiz_limit",
    {
      p_ip_address: ip,
      p_max_daily_quizzes: QUIZ_CONFIG.QUESTIONS.FREE_USER_DAILY,
    }
  );

  if (error) {
    return {
      success: false,
      error: "Failed to check quiz limit",
    };
  }

  const today = new Date().toISOString().split("T")[0];
  const { data: sessions } = await supabase
    .from("quiz_sessions")
    .select("id")
    .eq("ip_address", ip)
    .is("user_id", null)
    .gte("created_at", today);

  const currentCount = sessions?.length || 0;

  return {
    success: true,
    data: {
      canCreate: canCreate as boolean,
      remainingQuizzes: Math.max(
        0,
        QUIZ_CONFIG.QUESTIONS.FREE_USER_DAILY - currentCount
      ),
      limit: QUIZ_CONFIG.QUESTIONS.FREE_USER_DAILY,
      isLoggedIn: false,
    },
  };
};

const checkLoggedInUserLimit = async (
  supabase: SupabaseService,
  userId: string
): Promise<ActionResult<RateLimitInfo>> => {
  const { data: canCreate, error } = await supabase.rpc(
    "check_daily_quiz_limit",
    {
      p_user_id: userId,
      p_max_daily_quizzes: QUIZ_CONFIG.QUESTIONS.LOGGED_IN_DAILY,
    }
  );

  if (error) {
    return {
      success: false,
      error: "Failed to check quiz limit",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("daily_quiz_count, last_quiz_date")
    .eq("id", userId)
    .single();

  const dailyCount = profile?.daily_quiz_count || 0;
  const isToday =
    profile?.last_quiz_date === new Date().toISOString().split("T")[0];
  const currentCount = isToday ? dailyCount : 0;

  return {
    success: true,
    data: {
      canCreate: canCreate as boolean,
      remainingQuizzes: Math.max(
        0,
        QUIZ_CONFIG.QUESTIONS.LOGGED_IN_DAILY - currentCount
      ),
      limit: QUIZ_CONFIG.QUESTIONS.LOGGED_IN_DAILY,
      isLoggedIn: true,
    },
  };
};

export const getClientIP = async (): Promise<string> => {
  const h = await headers(); // Next.js headers() is now called directly here

  const forwarded = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");
  const vercelIp = h.get("x-vercel-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (vercelIp) return vercelIp.split(",")[0].trim();
  if (realIp) return realIp;

  return "unknown";
};
