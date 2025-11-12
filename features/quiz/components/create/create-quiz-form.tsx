"use client";

import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Sparkles } from "lucide-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createNewQuiz } from "../../lib/actions";
import { DIFFICULTY_OPTIONS, QUIZ_CONFIG } from "../../lib/config";
import { createQuizSchema } from "../../lib/schemas";
import { CreateQuizSchemaType } from "../../lib/types";
import FileUploadField from "./file-upload-field";

interface CreateQuizFormProps {
  isLoggedIn: boolean;
}

type GenerationStatus = "idle" | "extracting" | "generating";

export default function CreateQuizForm({ isLoggedIn }: CreateQuizFormProps) {
  const [isGenerating, startGenerating] = useTransition();
  const [status, setStatus] = React.useState<GenerationStatus>("idle");

  const form = useForm<CreateQuizSchemaType>({
    resolver: zodResolver(createQuizSchema({ isLoggedIn })),
    defaultValues: {
      file: undefined,
      numberOfQuestions: "5",
      difficulty: "simple",
    },
    mode: "onTouched",
  });

  const handleCreateQuiz = (data: CreateQuizSchemaType) => {
    setStatus("extracting");

    startGenerating(async () => {
      const generatingTimer = setTimeout(() => {
        setStatus("generating");
      }, 3000);

      const result = await createNewQuiz(data);

      clearTimeout(generatingTimer);

      if (!result.success) {
        toast.error(result.error);
        setStatus("idle");
        return;
      }

      const questions = result.data;

      toast.success(`Generated ${questions.length} questions successfully!`);
      setStatus("idle");
      console.log({ questions });
    });
  };

  const maxQuestions = isLoggedIn
    ? QUIZ_CONFIG.QUESTIONS.MAX
    : QUIZ_CONFIG.QUESTIONS.DEFAULT;

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
        {" "}
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
                  {opt.label}
                </SelectItem>
              ))}
            </FormSelect>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isGenerating}
          >
            {getButtonContent()}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
