"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { FormInput, FormSelect } from "@/features/shared/components/form";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { extractPDFData } from "../../actions";
import {
  DIFFICULTY_OPTIONS,
  LANGUAGE_OPTIONS,
  QUIZ_CONFIG,
} from "../../lib/config";
import { createQuizSchema } from "../../lib/schemas";
import { CreateQuizSchemaType } from "../../lib/types";
import FileUploadField from "./file-upload-field";

interface CreateQuizFormProps {
  isLoggedIn: boolean;
  canCreate: boolean;
}

type GenerationStatus = "idle" | "extracting" | "generating";

export default function CreateQuizForm({
  isLoggedIn,
  canCreate,
}: CreateQuizFormProps) {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [isGenerating, startGenerating] = useTransition();

  const form = useForm<CreateQuizSchemaType>({
    resolver: zodResolver(createQuizSchema({ isLoggedIn })),
    defaultValues: {
      file: undefined,
      numberOfQuestions: "5",
      difficulty: "simple",
      language: "English",
    },
    mode: "onTouched",
  });

  const handleCreateQuiz = (data: CreateQuizSchemaType) => {
    if (!canCreate) {
      toast.error("Daily limit reached. Try again tomorrow!");
      return;
    }
    setStatus("extracting");

    startGenerating(async () => {
      const extractResult = await extractPDFData(data.file);

      if (!extractResult.success) {
        toast.error(extractResult.error);
        setStatus("idle");
        return;
      }

      console.log(extractResult.data);

      setStatus("idle");
    });
  };

  const maxQuestions = isLoggedIn
    ? QUIZ_CONFIG.QUESTIONS.MAX_QUESTIONS_LOGGED_IN
    : QUIZ_CONFIG.QUESTIONS.MAX_QUESTIONS_FREE;

  const availableDifficulties = DIFFICULTY_OPTIONS.map((item) => ({
    ...item,
    isDisabled: !isLoggedIn && item.value !== "simple",
  }));

  const getButtonContent = () => {
    switch (status) {
      case "extracting":
        return (
          <>
            <FileText className="h-5 w-5 animate-pulse" />
            Extracting data from PDF...
          </>
        );
      case "generating":
        return (
          <>
            <Sparkles className="h-5 w-5 animate-pulse" />
            Generating questions with AI...
          </>
        );
      default:
        return "Generate Quiz";
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleCreateQuiz)} className="space-y-6">
      {/* Step 1: Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Upload Your PDF</CardTitle>
          <CardDescription>
            Upload a PDF document (max{" "}
            {QUIZ_CONFIG.FILE.MAX_SIZE / (1024 * 1024)}MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadField control={form.control} isGenerating={isGenerating} />
        </CardContent>
      </Card>

      {/* Step 2: Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Customize Your Quiz</CardTitle>
          <CardDescription>Choose your quiz settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup className="gap-6">
            <FormInput
              control={form.control}
              name="numberOfQuestions"
              label="Number of Questions"
              description={`Generate between ${QUIZ_CONFIG.QUESTIONS.MIN} and ${maxQuestions} questions`}
              disabled={isGenerating}
              type="number"
              orientation="horizontal"
              required
            />

            <FormSelect
              control={form.control}
              name="difficulty"
              label="Difficulty Level"
              description="Choose the complexity of questions"
              orientation="horizontal"
            >
              {availableDifficulties.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt?.isDisabled || isGenerating}
                >
                  {opt.label} {opt?.isDisabled && "(Premium)"}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect
              control={form.control}
              name="language"
              label="Language"
              description="Choose the language of the questions"
              orientation="horizontal"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </FormSelect>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isGenerating || canCreate === false}
          >
            {getButtonContent()}
          </Button>

          {!isLoggedIn && (
            <p className="text-xs text-center text-muted-foreground">
              <Link
                href={ROUTES.AUTH.LOGIN}
                className={cn(
                  buttonVariants({ variant: "link", className: "p-0" })
                )}
              >
                Sign in
              </Link>{" "}
              to unlock more questions and difficulty levels
            </p>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
