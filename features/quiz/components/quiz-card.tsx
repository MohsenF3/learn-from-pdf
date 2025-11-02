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
  const { questions, currentQuestion, currentAnswer } = useQuizStore(
    useShallow((s) => ({
      questions: s.questions,
      currentQuestion: s.currentQuestion,
      currentAnswer: s.currentAnswer,
    }))
  );

  const selectAnswer = useQuizStore((s) => s.selectAnswer);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl leading-relaxed">
          {questions[currentQuestion]?.question}
        </CardTitle>
        <CardDescription>Select the correct answer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={currentAnswer?.toString() ?? ""}
          onValueChange={(value) => selectAnswer(Number(value))}
        >
          {questions[currentQuestion]?.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                currentAnswer === index
                  ? "border-primary bg-accent"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <span className="flex-1 text-base leading-relaxed">{option}</span>
            </Label>
          ))}
        </RadioGroup>

        <QuizNavigation />
      </CardContent>
    </Card>
  );
}
