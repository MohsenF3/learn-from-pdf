import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  QuizQuestion,
  QuizQuestionWithAnswers,
} from "@/features/quiz/lib/types";
import { getOptionClasses } from "../lib/utils";

interface QuestionReviewCardProps {
  question: QuizQuestionWithAnswers;
  questionIndex: number;
  totalQuestions: number;
  userAnswer?: number;
}

export default function QuestionReviewCard({
  question,
  questionIndex,
  totalQuestions,
}: QuestionReviewCardProps) {
  const isCorrect = question.correctAnswer === question.userAnswer;

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="sm:text-xl leading-relaxed">
              {question.question}
            </CardTitle>
            <CardDescription className="mt-2">
              Question {questionIndex + 1} of {totalQuestions}
            </CardDescription>
          </div>
          <Badge variant={isCorrect ? "success" : "destructive"}>
            {isCorrect ? "Correct" : "Incorrect"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <OptionsList
          options={question.options}
          userAnswer={question.userAnswer}
          correctAnswer={question.correctAnswer}
        />
      </CardContent>
    </Card>
  );
}

interface OptionsListProps {
  options: QuizQuestion["options"];
  userAnswer: number;
  correctAnswer: number;
}

function OptionsList({ correctAnswer, options, userAnswer }: OptionsListProps) {
  return (
    <div className="space-y-3">
      {options.map((option, optionIndex) => {
        const isUserAnswer = userAnswer === optionIndex;
        const isCorrectAnswer = correctAnswer === optionIndex;

        return (
          <div
            key={optionIndex}
            className={getOptionClasses(isUserAnswer, isCorrectAnswer)}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm leading-relaxed flex-1">{option}</span>
              {isCorrectAnswer && (
                <Badge variant="success">Correct Answer</Badge>
              )}
              {isUserAnswer && !isCorrectAnswer && (
                <Badge variant="destructive">Your Answer</Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
