"use server";

import { getUser } from "@/features/auth/lib/getUser";
import { QuizQuestion } from "@/features/history/lib/types";
import { tryCatch } from "@/lib/try-catch";
import { ActionResult } from "@/lib/types";
import { huggingface } from "@ai-sdk/huggingface";
import { generateText } from "ai";
import { extractPDFText } from "./extract-pdf";
import { createQuizSchema } from "./schemas";
import {
  BuildPromptParams,
  CreateQuizSchemaType,
  GenerateMultipleChunksParams,
  GenerateSingleChunkParams,
} from "./types";

const HF_MODEL = huggingface("Qwen/Qwen2.5-7B-Instruct");

export const createNewQuiz = async (
  data: CreateQuizSchemaType
): Promise<ActionResult<QuizQuestion[]>> => {
  const user = await getUser();
  const schema = createQuizSchema({ isLoggedIn: !!user });
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input data";
    return {
      success: false,
      error: firstError,
    };
  }

  const { difficulty, file, numberOfQuestions } = parsed.data;

  const pdfResult = await extractPDFText(file);

  if (!pdfResult.success) {
    return {
      success: false,
      error: pdfResult.error,
    };
  }

  const { chunks, isChunked, pageCount } = pdfResult.data;
  const totalQuestions = Number(numberOfQuestions);

  const result = isChunked
    ? await generateQuestionsFromMultipleChunks({
        chunks,
        difficulty,
        totalQuestions,
        pageCount,
      })
    : await generateQuestionsFromSingleChunk({
        chunk: chunks[0],
        difficulty,
        totalQuestions,
      });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

const generateQuestionsFromSingleChunk = async ({
  chunk,
  difficulty,
  totalQuestions,
  chunkIndex,
  totalChunks,
  pageCount,
}: GenerateSingleChunkParams): Promise<ActionResult<QuizQuestion[]>> => {
  const prompt = buildPrompt({
    content: chunk,
    difficulty,
    questionsNeeded: totalQuestions,
    chunkIndex,
    totalChunks,
    pageCount,
  });

  const [result, error] = await tryCatch(
    generateText({
      model: HF_MODEL,
      prompt,
      maxRetries: 3,
      temperature: 0.1,
      topP: 0.7,
    })
  );

  if (error) {
    return {
      success: false,
      error: "Failed to generate questions",
    };
  }

  return parseAndValidateQuizResponse(result.text);
};

// Multi-chunk strategy: distribute questions across representative sections
const generateQuestionsFromMultipleChunks = async ({
  chunks,
  difficulty,
  totalQuestions,
  pageCount,
}: GenerateMultipleChunksParams): Promise<ActionResult<QuizQuestion[]>> => {
  const selectedChunks = selectRepresentativeChunks(chunks, totalQuestions);
  const questionsPerChunk = Math.ceil(totalQuestions / selectedChunks.length);

  const allQuestions: QuizQuestion[] = [];
  const errors: string[] = [];

  for (let i = 0; i < selectedChunks.length; i++) {
    const questionsNeeded = Math.min(
      questionsPerChunk,
      totalQuestions - allQuestions.length
    );

    if (questionsNeeded <= 0) break;

    const result = await generateQuestionsFromSingleChunk({
      chunk: selectedChunks[i],
      difficulty,
      totalQuestions: questionsNeeded,
      chunkIndex: i + 1,
      totalChunks: selectedChunks.length,
      pageCount,
    });

    if (result.success) {
      allQuestions.push(...result.data);
    } else {
      errors.push(`Chunk ${i + 1}: ${result.error}`);
    }

    if (allQuestions.length >= totalQuestions) break;
  }

  if (allQuestions.length === 0) {
    return {
      success: false,
      error: "Failed to generate any questions. " + errors.join(". "),
    };
  }

  const finalQuestions = allQuestions.slice(0, totalQuestions);

  return {
    success: true,
    data: finalQuestions,
  };
};

const buildPrompt = ({
  content,
  difficulty,
  questionsNeeded,
  chunkIndex,
  totalChunks,
  pageCount,
}: BuildPromptParams): string => {
  const contextInfo =
    chunkIndex && totalChunks && pageCount
      ? `This is section ${chunkIndex} of ${totalChunks} from a ${pageCount}-page document.\n\n`
      : "";

  const difficultyGuide = getDifficultyGuide(difficulty);

  return `You are a precise quiz generator. Generate **exactly** ${questionsNeeded} multiple-choice questions at "${difficulty}" difficulty.

${contextInfo}Content:
${content}

Return **only** a valid JSON object with this exact shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0
    }
  ]
}

Rules:
- Exactly ${questionsNeeded} unique questions${
    chunkIndex ? " from THIS section" : ""
  }.
- Each question has **exactly 4** non-empty, unique options.
- correctAnswer is an integer 0–3.
- Questions must be based **solely** on the provided content.
- Difficulty: ${difficultyGuide}
- **No markdown, no backticks, no explanations, no extra text.**
- JSON must be 100% parsable (no trailing commas, escaped quotes).

Return only the JSON object.`;
};

const getDifficultyGuide = (difficulty: string): string => {
  const guides: Record<string, string> = {
    simple: "factual recall and basic comprehension",
    medium: "inference, application, and deeper understanding",
    hard: "analysis, synthesis, and critical thinking",
  };

  return guides[difficulty] || guides.simple;
};

const parseAndValidateQuizResponse = (
  rawText: string
): ActionResult<QuizQuestion[]> => {
  const cleanedText = rawText
    .replace(/```json?/gi, "")
    .replace(/```/g, "")
    .trim();

  const jsonStart = cleanedText.indexOf("{");
  const jsonEnd = cleanedText.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    return {
      success: false,
      error: "Failed to extract JSON from response",
    };
  }

  const jsonPayload = cleanedText.slice(jsonStart, jsonEnd + 1);

  let quizData: { questions: QuizQuestion[] };

  try {
    quizData = JSON.parse(jsonPayload);
  } catch (err) {
    return {
      success: false,
      error: "Failed to parse JSON response",
    };
  }

  if (!Array.isArray(quizData.questions) || quizData.questions.length === 0) {
    return {
      success: false,
      error: "Invalid JSON response: no questions array",
    };
  }

  const validQuestions = quizData.questions.filter(isValidQuestion);

  if (validQuestions.length === 0) {
    return {
      success: false,
      error: "No valid questions in response",
    };
  }

  return {
    success: true,
    data: validQuestions,
  };
};

const isValidQuestion = (q: any): q is QuizQuestion => {
  return (
    typeof q.question === "string" &&
    q.question.trim() !== "" &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every(
      (opt: unknown) => typeof opt === "string" && opt.trim() !== ""
    ) &&
    Number.isInteger(q.correctAnswer) &&
    q.correctAnswer >= 0 &&
    q.correctAnswer <= 3
  );
};

// Select representative chunks: first + evenly distributed samples
const selectRepresentativeChunks = (
  chunks: string[],
  targetQuestions: number
): string[] => {
  if (chunks.length <= 3) {
    return chunks;
  }

  const maxChunks = Math.min(Math.ceil(targetQuestions / 2), 5);

  if (chunks.length <= maxChunks) {
    return chunks;
  }

  const selected: string[] = [chunks[0]];
  const step = (chunks.length - 1) / (maxChunks - 1);

  for (let i = 1; i < maxChunks; i++) {
    const index = Math.round(i * step);
    if (index < chunks.length && index > 0) {
      selected.push(chunks[index]);
    }
  }

  return selected;
};
