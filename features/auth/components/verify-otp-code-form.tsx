"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
import { Controller, useForm } from "react-hook-form";
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={form.control}
        name="code"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="text-center">
            <FieldLabel htmlFor={field.name} className="justify-center">
              Verification Code
            </FieldLabel>
            <InputOTP
              {...field}
              id={field.name}
              autoFocus
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              disabled={isPending}
              aria-invalid={fieldState.invalid}
            >
              <InputOTPGroup className="w-full justify-center">
                {Array.from({ length: 6 }, (_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Check your email inbox and spam folder
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="w-full max-w-sm mx-auto">
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? "Verifying..." : "Verify & Continue"}
        </Button>
      </div>
    </form>
  );
}
