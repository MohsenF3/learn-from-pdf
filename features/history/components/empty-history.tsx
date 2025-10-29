import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function EmptyHistory() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-semibold mb-2">No quiz history yet</p>
        <p className="text-muted-foreground mb-4">
          Start creating quizzes to see your history here
        </p>
        <Link
          className={cn(buttonVariants({ variant: "default" }))}
          href={ROUTES.PUBLIC.UPLOAD}
        >
          Create your first quiz
        </Link>
      </CardContent>
    </Card>
  );
}
