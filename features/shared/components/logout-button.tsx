"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/lib/actions";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Button
      className="w-full justify-start rounded-sm px-2 py-1.5 bg-destructive/20"
      variant="destructive"
      onClick={handleLogout}
      disabled={isPending}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isPending ? "Logging out..." : "Log out"}</span>
    </Button>
  );
}
