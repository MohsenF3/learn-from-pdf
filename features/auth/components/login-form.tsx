"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ROUTES } from "@/lib/routes";
import { tryCatch } from "@/lib/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
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
      const [result, error] = await tryCatch(login(data));

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      if (!result.success) {
        if (result.field) {
          form.setError(result.field as keyof LoginSchemaType, {
            message: result.error,
          });
        } else {
          toast.error(result.error);
        }
        return;
      }

      toast.success("Code sent to your email");
      router.push(
        `${ROUTES.AUTH.VERIFY}?email=${encodeURIComponent(result.data.email)}`
      );
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSendCode)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          Send verification code
        </Button>
      </form>
    </Form>
  );
}
