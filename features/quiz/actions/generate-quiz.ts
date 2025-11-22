"use server";

import { getUser } from "@/features/auth/lib/getUser";
import { SupabaseService } from "@/lib/supabase/database.types";
import { createClientFromServer } from "@/lib/supabase/server";
import { ActionResult } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { QUIZ_CONFIG } from "../lib/config";
import {
  generateQuestionsFromMultipleChunks,
  generateQuestionsFromSingleChunk,
  questionsToJson,
} from "../lib/helpers";
import {
  CreateQuizSchemaType,
  PDFExtractionResult,
  QuizDifficulty,
  QuizQuestion,
  QuizSession,
  SafeQuizQuestion,
} from "../lib/types";
import { getClientIP } from "./check-limit";

interface GenerateQuizParams extends Omit<CreateQuizSchemaType, "file"> {
  extractedData: PDFExtractionResult;
}

export const generateQuizQuestions = async ({
  numberOfQuestions,
  difficulty,
  language,
  extractedData,
}: GenerateQuizParams): Promise<ActionResult<QuizSession>> => {
  const user = await getUser();

  const validationResult = validateQuestionLimit(user, numberOfQuestions);
  if (!validationResult.success) {
    return validationResult;
  }

  const supabase = await createClientFromServer();

  const rateLimitResult = await checkRateLimit(supabase, user);
  if (!rateLimitResult.success) {
    return rateLimitResult;
  }

  const questionsResult = await generateQuestions(
    extractedData,
    difficulty,
    numberOfQuestions,
    language
  );
  if (!questionsResult.success) {
    return questionsResult;
  }

  return await createQuizSession(
    supabase,
    user,
    questionsResult.data,
    extractedData.pdfName,
    difficulty as QuizDifficulty,
    language
  );
};

const validateQuestionLimit = (
  user: User | null,
  numberOfQuestions: string
): ActionResult<null> => {
  const maxQuestions = user
    ? QUIZ_CONFIG.QUESTIONS.MAX_QUESTIONS_LOGGED_IN
    : QUIZ_CONFIG.QUESTIONS.MAX_QUESTIONS_FREE;

  if (Number(numberOfQuestions) > maxQuestions) {
    return {
      success: false,
      error: `Maximum ${maxQuestions} questions allowed${
        !user ? " for free users" : ""
      }`,
    };
  }

  return { success: true, data: null };
};

const checkRateLimit = async (
  supabase: SupabaseService,
  user: User | null
): Promise<ActionResult<null>> => {
  if (user) {
    const { data: canCreate, error } = await supabase.rpc(
      "check_daily_quiz_limit",
      {
        p_user_id: user.id,
        p_max_daily_quizzes: QUIZ_CONFIG.QUESTIONS.LOGGED_IN_DAILY,
      }
    );

    if (error) {
      return {
        success: false,
        error: "Failed to check quiz limit",
      };
    }

    if (!canCreate) {
      return {
        success: false,
        error: `Daily limit of ${QUIZ_CONFIG.QUESTIONS.LOGGED_IN_DAILY} quizzes reached. Try again tomorrow!`,
      };
    }
  } else {
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

    if (!canCreate) {
      return {
        success: false,
        error: `Daily limit of ${QUIZ_CONFIG.QUESTIONS.FREE_USER_DAILY} free quizzes reached. Sign up for more!`,
      };
    }
  }

  return { success: true, data: null };
};

const generateQuestions = async (
  extractedData: PDFExtractionResult,
  difficulty: QuizDifficulty,
  numberOfQuestions: string,
  language: string
): Promise<ActionResult<QuizQuestion[]>> => {
  const { chunks, isChunked, pageCount } = extractedData;
  const totalQuestions = Number(numberOfQuestions);

  return isChunked
    ? await generateQuestionsFromMultipleChunks({
        chunks,
        difficulty,
        language,
        totalQuestions,
        pageCount,
      })
    : await generateQuestionsFromSingleChunk({
        chunk: chunks[0],
        difficulty,
        language,
        totalQuestions,
      });
};

const createQuizSession = async (
  supabase: SupabaseService,
  user: User | null,
  fullQuestions: QuizQuestion[],
  pdfName: string,
  difficulty: QuizDifficulty,
  language: string
): Promise<ActionResult<QuizSession>> => {
  const ip = !user ? await getClientIP() : null;

  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .insert({
      user_id: user?.id || null,
      ip_address: ip,
      questions: questionsToJson(fullQuestions),
      pdf_name: pdfName,
      difficulty,
      language,
    })
    .select()
    .single();

  if (sessionError || !session) {
    return {
      success: false,
      error: "Failed to create quiz session",
    };
  }

  if (user) {
    const { error } = await supabase.rpc("increment_quiz_count", {
      p_user_id: user.id,
    });

    if (error) {
      return {
        success: false,
        error: "Failed to increment quiz count",
      };
    }
  }

  const safeQuestions: SafeQuizQuestion[] = fullQuestions.map((q, index) => ({
    id: `q_${index}`,
    question: q.question,
    options: q.options,
  }));

  return {
    success: true,
    data: {
      sessionId: session.id,
      questions: safeQuestions,
      totalQuestions: fullQuestions.length,
      pdfName,
      difficulty,
    },
  };
};
