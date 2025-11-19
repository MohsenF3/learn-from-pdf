"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useShallow } from "zustand/shallow";
import { useQuizStore } from "../store/quiz-store";
import QuizNavigation from "./quiz-navigation";

export default function QuizCard() {
  const { questions, currentQuestion, currentAnswer, language } = useQuizStore(
    useShallow((s) => ({
      questions: s.questions,
      currentQuestion: s.currentQuestion,
      currentAnswer: s.currentAnswer,
      language: s.language,
    }))
  );

  const selectAnswer = useQuizStore((s) => s.selectAnswer);

  const currentQuestionData = questions[currentQuestion];
  const questionNumber = currentQuestion + 1;
  const totalQuestions = questions.length;

  const isRTL = language === "فارسی";

  return (
    <Card className="border-2">
      <CardHeader>
        {/* Progress indicator for screen readers */}
        <div className="sr-only" role="status" aria-live="polite">
          Question {questionNumber} of {totalQuestions}
        </div>

        <CardTitle
          className="text-2xl leading-relaxed"
          id="question-title"
          tabIndex={-1}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {currentQuestionData?.question}
        </CardTitle>

        <CardDescription id="question-description">
          Select the correct answer. Question {questionNumber} of{" "}
          {totalQuestions}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <fieldset>
          <legend className="sr-only">
            Answer options for question {questionNumber}
          </legend>

          <RadioGroup
            value={currentAnswer?.toString() ?? ""}
            onValueChange={(value) => selectAnswer(Number(value))}
            aria-labelledby="question-title"
            aria-describedby="question-description"
            aria-required="true"
          >
            {currentQuestionData?.options.map((option, index) => {
              const isSelected = currentAnswer === index;
              const optionId = `option-${currentQuestion}-${index}`;

              return (
                <Label
                  key={index}
                  htmlFor={optionId}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
                    isSelected
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/50"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={optionId}
                    aria-label={`Option ${String.fromCharCode(
                      65 + index
                    )}: ${option}`}
                  />
                  <span
                    className="flex-1 text-base leading-relaxed"
                    aria-hidden="true"
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </span>
                </Label>
              );
            })}
          </RadioGroup>
        </fieldset>

        <QuizNavigation />
      </CardContent>
    </Card>
  );
}
