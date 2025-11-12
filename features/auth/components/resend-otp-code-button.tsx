"use client";

import { Button } from "@/components/ui/button";
import { Loader, RefreshCw } from "lucide-react";
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
      const result = await resendOTP(email);

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
          <Loader className="mr-1.5 h-3 w-3 animate-spin" />
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
