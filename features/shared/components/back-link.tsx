import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
  href?: string;
  text?: string;
};

export default function BackLink({
  href = ROUTES.PUBLIC.HOME,
  text = "Back to home",
}: BackLinkProps) {
  return (
    <Link
      className={cn(
        buttonVariants({
          variant: "ghost",
          className: "mb-4",
        })
      )}
      href={href}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {text}
    </Link>
  );
}
