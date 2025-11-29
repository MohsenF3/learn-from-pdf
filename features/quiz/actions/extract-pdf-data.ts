"use server";

import { getUser } from "@/features/auth/lib/getUser";
import { ActionResult } from "@/lib/types";
import { extractPDFText } from "../lib/extract-pdf";
import { createQuizSchema } from "../lib/schemas";
import { PDFExtractionResult } from "../lib/types";

export const extractPDFData = async (
  file: File
): Promise<ActionResult<PDFExtractionResult>> => {
  const user = await getUser();
  const schema = createQuizSchema({ isLoggedIn: !!user });
  const fileSchema = schema.shape.file;
  const parsed = fileSchema.safeParse(file);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input data",
    };
  }

  const extractedData = await extractPDFText(parsed.data);

  if (!extractedData.success) {
    return {
      success: false,
      error: extractedData.error,
    };
  }
  return {
    success: true,
    data: extractedData.data,
  };
};
