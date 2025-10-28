import { Logo } from "./logo";
import ThemeToggle from "./theme-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  return (
    <header className="border-b border-border/40 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Logo />

        <div className="flex items-center gap-3">
          <UserMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
