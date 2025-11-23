import { getUser } from "@/features/auth/lib/getUser";
import { extractPDFText } from "@/features/quiz/lib/extract-pdf";
import { createQuizSchema } from "@/features/quiz/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Vercel edge function timeout

// Setup polyfills before any pdf-parse imports
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

export async function POST(request: NextRequest) {
  try {
    // Get user for schema validation
    const user = await getUser();

    // Parse form data
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

    // Extract PDF text
    const extractedData = await extractPDFText(parsed.data);

    if (!extractedData.success) {
      return NextResponse.json(
        { success: false, error: extractedData.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: extractedData.data,
    });
  } catch (error) {
    console.error("PDF extraction API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to extract PDF. Please try again.",
      },
      { status: 500 }
    );
  }
}
