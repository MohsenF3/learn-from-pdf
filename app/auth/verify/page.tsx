import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResendOTPCodeButton from "@/features/auth/components/resend-otp-code-button";
import VerifyOTPCodeForm from "@/features/auth/components/verify-otp-code-form";
import { loginSchema } from "@/features/auth/lib/schemas";
import Fun404 from "@/features/shared/components/fun-404";
import { Logo } from "@/features/shared/components/logo";
import { Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to continue",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function VerifyPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const result = loginSchema.safeParse(searchParams);

  if (!result.success) {
    return <Fun404 />;
  }

  const { email } = result.data;

  return (
    <div className="flex min-h-svh w-full items-center justify-center px-4 py-6">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <Logo
            titleClassName="text-4xl"
            iconClassName="rounded-full"
            linkClassName=" justify-center"
          />
          <p className="text-muted-foreground mt-2">Almost there!</p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Enter verification code</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2 mt-2">
              <Mail className="h-4 w-4" />
              <span>
                We sent a 6-digit code to{" "}
                <strong className="text-foreground">{email}</strong>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerifyOTPCodeForm email={email} />

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <ResendOTPCodeButton email={email} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
