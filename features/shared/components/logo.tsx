import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export function LogoIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      {...props}
    >
      <circle cx="17.5" cy="17.5" r="17.5" fill="black"></circle>
      <path
        d="M11.0389 19.8912L11.0392 28.5579C12.6769 28.5579 14.0028 27.2273 13.9972 25.5897L13.9712 18.071L13.9899 13.8938C13.9996 11.7406 15.753 10.003 17.9061 10.0126C20.0593 10.0223 21.797 11.7756 21.7873 13.9288L21.7686 18.106L21.7686 18.7764C21.7686 19.3921 22.2677 19.8912 22.8833 19.8911C23.499 19.8911 23.998 19.392 23.998 18.7764L23.998 13.5232C23.998 9.95254 21.1035 7.05796 17.5328 7.05796C13.9735 7.05796 11.0836 9.93487 11.0677 13.4942L11.0389 19.8912Z"
        fill="white"
      ></path>
    </svg>
  );
}

interface LogoProps {
  linkClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
}

export function Logo({
  linkClassName,
  iconClassName,
  titleClassName,
}: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", linkClassName)}>
      <div className="rounded-lg bg-primary/10 p-2">
        <LogoIcon className={iconClassName} />
      </div>
      <h1 className={cn("text-xl font-bold text-foreground", titleClassName)}>
        Learn from PDF
      </h1>
    </Link>
  );
}
