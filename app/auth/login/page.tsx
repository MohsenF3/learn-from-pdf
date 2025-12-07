import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/features/auth/components/login-form";
import LoginHeader from "@/features/auth/components/login-header";
import SignInBenefits from "@/features/auth/components/sign-in-benefits";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your LearnfromPDF account",
};

export default function LoginPage() {
  return (
    <div className="flex w-full min-h-svh items-center justify-center px-4 py-6 md:py-10 ">
      <div className="w-full max-w-xl">
        <LoginHeader />

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Sign in to unlock full access
            </CardTitle>
            <CardDescription>
              Enter your email to receive a verification code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <SignInBenefits />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
