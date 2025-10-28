"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/try-catch";
import { Loader2, RefreshCw } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { resendOTP } from "../lib/actions";

interface ResendOTPCodeButtonProps {
  email: string;
}

export default function ResendOTPCodeButton({
  email,
}: ResendOTPCodeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleResend = () => {
    startTransition(async () => {
      const [result, error] = await tryCatch(resendOTP(email));

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("New code sent! Check your inbox.");
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleResend}
      disabled={isPending}
      className="text-sm"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
          Sending…
        </>
      ) : (
        <>
          <RefreshCw className="mr-1.5 h-3 w-3" />
          Resend verification code
        </>
      )}
    </Button>
  );
}
