import { Logo } from "./logo";

export default function Header() {
  return (
    <header className="border-b border-border/40 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Logo />
      </div>
    </header>
  );
}
