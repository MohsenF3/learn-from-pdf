import { Logo } from "@/features/shared/components/logo";

export default function LoginHeader() {
  return (
    <div className="mb-8 text-center">
      <Logo
        titleClassName="text-4xl"
        iconClassName="rounded-full"
        linkClassName=" justify-center"
      />

      <p className="text-muted-foreground mt-2">
        Transform your PDFs into interactive quizzes
      </p>
    </div>
  );
}
