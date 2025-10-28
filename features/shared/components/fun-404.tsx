import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Fun404() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Oopsie!</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2 mt-2">
              <span>
                Come on, use the app like a normal person! 😜 No URL tricks,
                okay?
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={ROUTES.AUTH.LOGIN}
              className={cn(
                buttonVariants({
                  variant: "default",
                })
              )}
            >
              Back to Sign Up
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
