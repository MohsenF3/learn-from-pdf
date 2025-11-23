import { getUser } from "@/features/auth/lib/getUser";
import { createQuizSchema } from "@/features/quiz/lib/schemas";
import { QUIZ_CONFIG } from "@/features/quiz/lib/config";
import { NextRequest, NextResponse } from "next/server";
import * as pdfjs from "pdfjs-dist";

export const maxDuration = 60;

const MIN_TEXT_LENGTH = 100;
const MAX_CONTEXT_LENGTH = 15000;

// Set worker source for pdfjs v5.x
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.394/pdf.worker.min.js`;

function cleanTextContent(text: string): string {
  return text
    .replace(/-- \d+ of \d+ --/g, "")
    .replace(/Page \d+ of \d+/gi, "")
    .replace(/^\s*\d+\s*$/gm, "")
    .replace(/[\r\n\t\f\v\u00A0\u200B\u2028\u2029]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s*[-•·▪▫]\s*/gm, "• ")
    .replace(/^\s*◦\s*/gm, "◦ ")
    .replace(/^\s*\d+\.\s+/gm, (match, offset, str) => {
      const prev = str.slice(Math.max(0, offset - 50), offset);
      return /\n/.test(prev) ? `\n${match.trim()} ` : match;
    })
    .replace(/\|\s*\|/g, " ")
    .replace(/(\s*\|\s*){2,}/g, " ")
    .replace(/^\s*\|\s*/gm, "")
    .replace(/[^\S\r\n]*\bh[yY]phen\b[^\S\r\n]*/g, "-")
    .replace(/\s+…\s+/g, "… ")
    .replace(/[\u2013\u2014]/g, "—")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .reduce((acc: string[], line: string) => {
      const last = acc[acc.length - 1];
      const isHeader =
        /^[A-ZÀ-Ú]([A-ZÀ-Ú\s&:-]+[A-ZÀ-Ú])?$/.test(line) || /:$/.test(line);
      const isListItem = /^• |^\d+\.\s/.test(line);

      if (acc.length === 0) {
        acc.push(line);
      } else if (isHeader || isListItem) {
        acc.push("\n" + line);
      } else if (last && !last.endsWith("\n")) {
        acc[acc.length - 1] += " " + line;
      } else {
        acc.push(line);
      }

      return acc;
    }, [])
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function createIntelligentChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];
  const sections = text.split(/\n\n+/).filter((s) => s.trim().length > 0);

  let currentChunk = "";

  for (const section of sections) {
    const sectionWithBreak = currentChunk ? `\n\n${section}` : section;

    if (
      currentChunk &&
      currentChunk.length + sectionWithBreak.length > maxChunkSize
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = section;
    } else {
      currentChunk += sectionWithBreak;
    }

    if (currentChunk.length > maxChunkSize) {
      const sentenceChunks = splitBySentences(currentChunk, maxChunkSize);
      chunks.push(...sentenceChunks.slice(0, -1));
      currentChunk = sentenceChunks[sentenceChunks.length - 1] || "";
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

function splitBySentences(text: string, maxSize: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk && currentChunk.length + sentence.length > maxSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file against schema
    const schema = createQuizSchema({ isLoggedIn: !!user });
    const fileSchema = schema.shape.file;
    const parsed = fileSchema.safeParse(file);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid file",
        },
        { status: 400 }
      );
    }

    // Validate file size
    const MAX_FILE_SIZE = QUIZ_CONFIG.FILE.MAX_SIZE;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: "File is empty" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate PDF header
    const header = buffer.toString("utf-8", 0, 8);
    if (!header.startsWith("%PDF-")) {
      return NextResponse.json(
        { success: false, error: "Invalid PDF file" },
        { status: 400 }
      );
    }

    // Extract text using pdfjs
    try {
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || "")
          .join(" ");
        fullText += pageText + "\n";
      }

      if (!fullText.trim()) {
        return NextResponse.json(
          { success: false, error: "PDF contains no extractable text" },
          { status: 400 }
        );
      }

      if (fullText.length < MIN_TEXT_LENGTH) {
        return NextResponse.json(
          { success: false, error: "PDF content is too short" },
          { status: 400 }
        );
      }

      // Clean and chunk
      const cleanedText = cleanTextContent(fullText);
      const characterCount = cleanedText.length;
      const pageCount = pdf.numPages;

      const isChunked = characterCount > MAX_CONTEXT_LENGTH;
      const chunks = isChunked
        ? createIntelligentChunks(cleanedText, MAX_CONTEXT_LENGTH)
        : [cleanedText];

      return NextResponse.json({
        success: true,
        data: {
          pdfName: file.name,
          fullText: cleanedText,
          chunks,
          pageCount,
          characterCount,
          isChunked,
        },
      });
    } catch (extractError) {
      console.error("PDF extraction error:", extractError);
      return NextResponse.json(
        { success: false, error: "Failed to extract text from PDF" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process PDF. Please try again.",
      },
      { status: 500 }
    );
  }
}
