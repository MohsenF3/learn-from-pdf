// Setup polyfills BEFORE any imports
if (typeof global !== "undefined") {
  if (!global.DOMMatrix) {
    global.DOMMatrix = class DOMMatrix {
      constructor(public values: any = []) {}
    } as any;
  }

  if (!global.DOMPoint) {
    global.DOMPoint = class DOMPoint {
      constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 1
      ) {}
    } as any;
  }

  if (!global.CanvasRenderingContext2D) {
    global.CanvasRenderingContext2D = class CanvasRenderingContext2D {} as any;
  }
}

import { ActionResult } from "@/lib/types";
import { PDFParse } from "pdf-parse";
import "server-only";
import { QUIZ_CONFIG } from "./config";
import { PDFExtractionResult } from "./types";

const MAX_FILE_SIZE = QUIZ_CONFIG.FILE.MAX_SIZE;
const MIN_TEXT_LENGTH = 100;
const MAX_CONTEXT_LENGTH = 15000;

export const extractPDFText = async (
  file: File
): Promise<ActionResult<PDFExtractionResult>> => {
  let parser: any = null;

  try {
    // Validate file type
    if (!file.type.includes("pdf")) {
      return {
        success: false,
        error: "File must be a PDF document",
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      };
    }

    if (file.size === 0) {
      return {
        success: false,
        error: "File is empty",
      };
    }

    // Convert to buffer and validate PDF structure
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const header = buffer.toString("utf-8", 0, 8);
    if (!header.startsWith("%PDF-")) {
      return {
        success: false,
        error: "Invalid PDF file",
      };
    }

    // Extract text
    parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();

    if (!textResult.text?.trim()) {
      return {
        success: false,
        error: "PDF contains no extractable text",
      };
    }

    if (textResult.text.length < MIN_TEXT_LENGTH) {
      return {
        success: false,
        error: "PDF content is too short",
      };
    }

    // Clean the text
    const cleanedText = cleanTextContent(textResult.text);
    const characterCount = cleanedText.length;
    const pageCount = textResult.total || 1;

    // Determine if chunking is needed
    const isChunked = characterCount > MAX_CONTEXT_LENGTH;
    const chunks = isChunked
      ? createIntelligentChunks(cleanedText, MAX_CONTEXT_LENGTH)
      : [cleanedText];

    return {
      success: true,
      data: {
        pdfName: file.name,
        fullText: cleanedText,
        chunks,
        pageCount,
        characterCount,
        isChunked,
      },
    };
  } catch (error) {
    console.error("PDF extraction error:", error);

    if (error instanceof Error) {
      if (error.name === "PasswordException") {
        return {
          success: false,
          error: "PDF is password protected",
        };
      }
      if (error.name === "InvalidPDFException") {
        return {
          success: false,
          error: "Invalid PDF document",
        };
      }
      console.error("Error details:", error.message, error.stack);
    }

    return {
      success: false,
      error: "Failed to extract text from PDF",
    };
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};

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
