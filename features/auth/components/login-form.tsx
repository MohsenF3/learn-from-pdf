"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ROUTES } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { login } from "../lib/actions";
import { loginSchema } from "../lib/schemas";
import { LoginSchemaType } from "../lib/types";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSendCode = (data: LoginSchemaType) => {
    startTransition(async () => {
      const result = await login(data);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Code sent to your email");
      router.push(
        `${ROUTES.AUTH.VERIFY}?email=${encodeURIComponent(result.data.email)}`
      );
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSendCode)} className="space-y-8">
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        )}
      />

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        Send verification code
      </Button>
    </form>
  );
}
