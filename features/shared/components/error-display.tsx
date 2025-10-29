import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

type ErrorDisplayProps = {
  title?: string;
  message: string;
  retryLink?: string;
};

export default function ErrorDisplay({
  title = "Something went wrong",
  message,
  retryLink,
}: ErrorDisplayProps) {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl min-h-svh">
      <Card className="border-destructive bg-destructive/10">
        <CardHeader className="flex flex-row items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{message}</p>
          {retryLink && (
            <Link
              className={cn(
                buttonVariants({ variant: "outline", className: "mt-4" })
              )}
              href={retryLink}
            >
              Try again
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
