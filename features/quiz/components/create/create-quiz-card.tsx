import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/features/auth/lib/getUser";
import DemoButton from "@/features/home/components/demo-button";
import { AlertCircle, Info } from "lucide-react";
import { checkQuizLimit } from "../../actions";
import { RateLimitInfo } from "../../lib/types";
import CreateQuizForm from "./create-quiz-form";

export default async function CreateQuizCard() {
  const user = await getUser();
  const rateLimitInfo = await checkQuizLimit();

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your PDF</CardTitle>
        <CardDescription>
          Follow the steps below to create your quiz:
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rateLimitInfo.success && (
          <LimitationAlert
            isLoggedIn={!!user}
            canCreate={rateLimitInfo.data.canCreate}
            limit={rateLimitInfo.data.limit}
            remainingQuizzes={rateLimitInfo.data.remainingQuizzes}
          />
        )}

        <CreateQuizForm
          isLoggedIn={!!user}
          canCreate={
            rateLimitInfo.success ? rateLimitInfo.data.canCreate : false
          }
        />

        <div className="mt-6 pt-6">
          <p className="mb-3 text-center text-sm text-muted-foreground">
            Or try with sample questions
          </p>

          <DemoButton
            size="lg"
            variant="outline"
            className="w-full bg-transparent"
          >
            Use Test Data
          </DemoButton>
        </div>
      </CardContent>
    </Card>
  );
}

interface LimitationAlertProps {
  isLoggedIn: boolean;
  canCreate: RateLimitInfo["canCreate"];
  remainingQuizzes: RateLimitInfo["remainingQuizzes"];
  limit: RateLimitInfo["limit"];
}

function LimitationAlert({
  isLoggedIn,
  canCreate,
  limit,
  remainingQuizzes,
}: LimitationAlertProps) {
  return (
    <Alert
      variant={
        !canCreate ? "warning" : remainingQuizzes <= 1 ? "warning" : "default"
      }
      className="mb-6"
    >
      {canCreate ? (
        <Info className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>
        {isLoggedIn ? "Daily Quiz Limit" : "Free Quiz Limit"}
      </AlertTitle>
      <AlertDescription>
        {canCreate ? (
          <span>
            You have <strong>{remainingQuizzes}</strong> of{" "}
            <strong>{limit}</strong> quizzes remaining today.
          </span>
        ) : (
          <span>
            You've reached your daily limit of {limit} quizzes.{" "}
            {isLoggedIn
              ? "Come back tomorrow for more!"
              : "Sign up to unlock more quizzes!"}
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
}
