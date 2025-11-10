import { z } from "zod";
import { QUIZ_CONFIG } from "./config";

export const createQuizSchema = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const maxQuestions = isLoggedIn
    ? QUIZ_CONFIG.QUESTIONS.MAX
    : QUIZ_CONFIG.QUESTIONS.DEFAULT;

  const availableDifficulties = isLoggedIn
    ? QUIZ_CONFIG.DIFFICULTIES
    : QUIZ_CONFIG.DIFFICULTIES.filter((d) => d === "simple");

  return z.object({
    file: z
      .file({
        error: "Please import your PDF file",
      })
      .max(QUIZ_CONFIG.FILE.MAX_SIZE, {
        error: `File size must be less than ${
          QUIZ_CONFIG.FILE.MAX_SIZE / (1024 * 1024)
        }MB`,
      })
      .mime(["application/pdf"], {
        error: "Only PDF files are accepted",
      }),

    numberOfQuestions: z
      .string()
      .regex(/^\d+$/, "Please enter your number of questions")
      .refine(
        (val) => parseInt(val) >= QUIZ_CONFIG.QUESTIONS.MIN,
        `Must have at least ${QUIZ_CONFIG.QUESTIONS.MIN} questions`
      )
      .refine(
        (val) => parseInt(val) <= maxQuestions,
        `Cannot exceed ${maxQuestions} questions`
      ),

    difficulty: z.enum(availableDifficulties, {
      error: ({ code }) => {
        if (code === "invalid_value") {
          return "Please select a difficulty level";
        }
      },
    }),
  });
};
