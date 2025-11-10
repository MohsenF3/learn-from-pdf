import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/features/auth/lib/getUser";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CreateQuizForm from "./create-quiz-form";

export default async function CreateQuizCard() {
  const user = await getUser();

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your PDF</CardTitle>
        <CardDescription>
          Follow the steps below to create your quiz:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateQuizForm isLoggedIn={!!user} />

        <div className="mt-6 pt-6">
          <p className="mb-3 text-center text-sm text-muted-foreground">
            Or try with sample questions
          </p>
          <Link
            href={ROUTES.PUBLIC.QUIZ_DEMO}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full bg-transparent",
              })
            )}
          >
            Use Test Data
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
