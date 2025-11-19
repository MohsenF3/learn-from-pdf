"use server";

import { getUser } from "@/features/auth/lib/getUser";
import { Json, SupabaseService } from "@/lib/supabase/database.types";
import { createClientFromServer } from "@/lib/supabase/server";
import { ActionResult } from "@/lib/types";
import { jsonToQuestions } from "../lib/helpers";
import {
  QuizAnswers,
  QuizQuestion,
  QuizResult,
  QuizResultDetail,
  QuizSessionDB,
} from "../lib/types";

export const submitQuizAnswers = async (
  sessionId: string,
  answers: QuizAnswers
): Promise<ActionResult<QuizResult>> => {
  const user = await getUser();
  const supabase = await createClientFromServer();

  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return {
      success: false,
      error: "Quiz session not found or expired",
    };
  }

  if (session.is_completed) {
    return {
      success: false,
      error: "Quiz already submitted",
    };
  }

  const questions = jsonToQuestions(session.questions);
  const { score, results } = calculateScore(questions, answers);

  const { error: updateError } = await supabase
    .from("quiz_sessions")
    .update({ is_completed: true })
    .eq("id", sessionId);

  if (updateError) {
    return {
      success: false,
      error: "Failed to update quiz session",
    };
  }

  if (user) {
    const saveResult = await saveToHistory(
      supabase,
      user.id,
      session,
      questions,
      results,
      score
    );

    if (!saveResult.success) {
      return saveResult;
    }
  }

  return {
    success: true,
    data: {
      score,
      total: questions.length,
      results,
    },
  };
};

const calculateScore = (
  questions: QuizQuestion[],
  answers: QuizAnswers
): { score: number; results: QuizResultDetail[] } => {
  let score = 0;

  const results: QuizResultDetail[] = questions.map((q, index) => {
    const questionId = `q_${index}`;
    const userAnswer = answers[questionId];
    const isCorrect = userAnswer === q.correctAnswer;

    if (isCorrect) score++;

    return {
      questionId,
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
    };
  });

  return { score, results };
};

const saveToHistory = async (
  supabase: SupabaseService,
  userId: string,
  session: QuizSessionDB,
  questions: QuizQuestion[],
  results: QuizResultDetail[],
  score: number
): Promise<ActionResult<null>> => {
  const quizData = {
    config: {
      language: session.language,
      difficulty: session.difficulty,
      pdfFileName: session.pdf_name,
      numQuestions: results.length,
    },
    questions: results.map((r, index) => ({
      question: r.question,
      options: questions[index].options,
      correctAnswer: r.correctAnswer,
      userAnswer: r.userAnswer,
    })),
  };

  const { error } = await supabase.from("quiz_history").insert({
    user_id: userId,
    quiz_data: quizData as unknown as Json,
    score,
    total_questions: results.length,
    difficulty: session.difficulty,
  });

  if (error) {
    return {
      success: false,
      error: "Failed to save quiz to history",
    };
  }

  return {
    success: true,
    data: null,
  };
};
