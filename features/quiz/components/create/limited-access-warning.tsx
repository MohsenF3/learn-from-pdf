import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getUser } from "@/features/auth/lib/getUser";
import { Crown } from "lucide-react";
import Link from "next/link";

export default async function LimitedAccessWarning() {
  const user = await getUser();

  if (user) return null;

  return (
    <Alert className="mb-6" variant="warning">
      <Crown className="h-4 w-4 " />
      <AlertTitle>Free Plan Limitations</AlertTitle>
      <AlertDescription>
        You're currently limited to 5 questions and simple difficulty.{" "}
        <Link href="/auth/login" className="font-semibold underline">
          Sign in
        </Link>{" "}
        to unlock unlimited questions and all difficulty levels!
      </AlertDescription>
    </Alert>
  );
}
