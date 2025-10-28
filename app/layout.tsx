import { Toaster } from "@/components/ui/sonner";
import { LayoutWrapper } from "@/features/shared/components/layout-wrapper";
import { Providers } from "@/features/shared/providers";
import { cormorant, firaSansCondensed, geistMono } from "@/lib/fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LearnfromPDF",
    template: "%s - LearnfromPDF",
  },
  description:
    "Generate AI-powered quizzes from your PDF documents with LearnfromPDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${firaSansCondensed.variable} ${geistMono.variable} ${cormorant.variable}`}
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>

          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
