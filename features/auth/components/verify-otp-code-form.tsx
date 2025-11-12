"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ROUTES } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { verifyOTP } from "../lib/actions";
import { verifyOTPSchema } from "../lib/schemas";
import { VerifyOTPSchemaType } from "../lib/types";

interface VerifyOTPFormProps {
  email: string;
}

export default function VerifyOTPForm({ email }: VerifyOTPFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<VerifyOTPSchemaType>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      email,
      code: "",
    },
  });

  const onSubmit = (data: VerifyOTPSchemaType) => {
    startTransition(async () => {
      const result = await verifyOTP(data);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Email verified successfully!");
      router.replace(ROUTES.PUBLIC.HOME);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="text-center">
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <InputOTP
                  autoFocus
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  disabled={isPending}
                  {...field}
                >
                  <InputOTPGroup className="w-full justify-center">
                    {Array.from({ length: 6 }, (_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Check your email inbox and spam folder
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full max-w-sm mx-auto">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Verify & Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
