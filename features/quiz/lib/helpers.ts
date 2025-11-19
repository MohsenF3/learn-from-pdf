import { Json } from "@/lib/supabase/database.types";
import { tryCatch } from "@/lib/try-catch";
import { ActionResult } from "@/lib/types";
import { huggingface } from "@ai-sdk/huggingface";
import { generateText } from "ai";
import { headers } from "next/headers";
import { cache } from "react";
import {
  BuildPromptParams,
  GenerateMultipleChunksParams,
  GenerateSingleChunkParams,
  QuizDifficulty,
  QuizQuestion,
} from "./types";

export const getClientIP = cache(async (): Promise<string> => {
  const h = await headers(); // ← Next.js headers() in server context

  const forwarded = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip"); // fallback, rarely needed on Vercel
  const vercelIp = h.get("x-vercel-forwarded-for"); // sometimes present

  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; the first one is the original client
    return forwarded.split(",")[0].trim();
  }
  if (vercelIp) return vercelIp.split(",")[0].trim();
  if (realIp) return realIp;

  return "unknown";
});

export function isValidQuestion(q: any): q is QuizQuestion {
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
}

export function parseAndValidateQuizResponse(
  rawText: string
): ActionResult<QuizQuestion[]> {
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

  try {
    const quizData = JSON.parse(jsonPayload) as { questions: QuizQuestion[] };

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
  } catch (err) {
    return {
      success: false,
      error: "Failed to parse JSON response",
    };
  }
}

const HF_MODEL = huggingface("Qwen/Qwen2.5-7B-Instruct");

function getDifficultyGuide(difficulty: QuizDifficulty): string {
  const guides: Record<string, string> = {
    simple: "factual recall and basic comprehension",
    medium: "inference, application, and deeper understanding",
    hard: "analysis, synthesis, and critical thinking",
  };
  return guides[difficulty] || guides.simple;
}

function buildPrompt({
  content,
  difficulty,
  questionsNeeded,
  chunkIndex,
  totalChunks,
  pageCount,
  language,
}: BuildPromptParams): string {
  const contextInfo =
    chunkIndex && totalChunks && pageCount
      ? `This is section ${chunkIndex} of ${totalChunks} from a ${pageCount}-page document.\n\n`
      : "";
  const difficultyGuide = getDifficultyGuide(difficulty);

  return `You are a precise quiz generator expert in ${language}, with deep knowledge of linguistics and cultural nuances. Generate **exactly** ${questionsNeeded} multiple-choice questions at "${difficulty}" difficulty. ${contextInfo}Content: ${content}
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
- Output must be written entirely in **${language}**, using correct script (e.g., Persian script for Farsi), grammar, natural phrasing, spelling, spacing, and punctuation. For Farsi, ensure proper RTL formatting and use Persian question marks (؟).
- For English words, proper nouns, or technical terms in the content that lack a good, natural corresponding word or transliteration in ${language} (e.g., specific names like "Aboriginal", "Australia", or tech terms like "programming"), **do not translate or transliterate them**. Keep them in their original Latin/English script embedded within the ${language} text for accuracy and readability.
- If the content is not fully in ${language}, accurately adapt and translate only the necessary parts to create questions and options fully in ${language}, but follow the no-translation rule above for untranslatable terms.
- Exactly ${questionsNeeded} unique, high-quality questions${
    chunkIndex ? " from THIS section" : ""
  }. Questions should be clear, engaging, and free of errors or absurdities.
- Each question has **exactly 4** non-empty, unique, plausible distractor options that are full, natural phrases or sentences. Make distractors realistic and based on common misconceptions from the content.
- Options are an array of strings (actual choice texts, without prefixes like "A:" or "B:").
- correctAnswer is an integer 0–3 indicating the index of the correct option.
- Questions and options must be based **solely** on the provided content—do not add external knowledge, assumptions, or implausible scenarios.
- Difficulty: ${difficultyGuide}. Ensure questions challenge appropriately without being misleading.
- **No markdown, no backticks, no explanations, no extra text.**
- JSON must be 100% parsable (no trailing commas, properly escaped quotes if needed).
Return only the JSON object.`;
}

export async function generateQuestionsFromSingleChunk({
  chunk,
  difficulty,
  totalQuestions,
  chunkIndex,
  totalChunks,
  language,
  pageCount,
}: GenerateSingleChunkParams): Promise<ActionResult<QuizQuestion[]>> {
  const prompt = buildPrompt({
    content: chunk,
    difficulty,
    language,
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
}

export function selectRepresentativeChunks(
  chunks: string[],
  targetQuestions: number
): string[] {
  if (chunks.length <= 3) return chunks;

  const maxChunks = Math.min(Math.ceil(targetQuestions / 2), 5);
  if (chunks.length <= maxChunks) return chunks;

  const selected: string[] = [chunks[0]];
  const step = (chunks.length - 1) / (maxChunks - 1);

  for (let i = 1; i < maxChunks; i++) {
    const index = Math.round(i * step);
    if (index < chunks.length && index > 0) {
      selected.push(chunks[index]);
    }
  }

  return selected;
}

export async function generateQuestionsFromMultipleChunks({
  chunks,
  difficulty,
  totalQuestions,
  language,
  pageCount,
}: GenerateMultipleChunksParams): Promise<ActionResult<QuizQuestion[]>> {
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
      language,
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
      error: "Failed to generate any questions.",
    };
  }

  return {
    success: true,
    data: allQuestions.slice(0, totalQuestions),
  };
}

// Helper to convert QuizQuestion[] to Json type
export const questionsToJson = (questions: QuizQuestion[]): Json => {
  return questions as unknown as Json;
};

// Helper to convert Json back to QuizQuestion[]
export const jsonToQuestions = (json: Json): QuizQuestion[] => {
  return json as unknown as QuizQuestion[];
};
