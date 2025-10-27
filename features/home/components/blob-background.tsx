export function BlobBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-blob rounded-full bg-primary/20 opacity-70 blur-3xl mix-blend-multiply dark:mix-blend-soft-light" />
      <div className="animation-delay-2000 absolute -right-1/4 -top-1/4 h-[600px] w-[600px] animate-blob rounded-full bg-accent/20 opacity-70 blur-3xl mix-blend-multiply dark:mix-blend-soft-light" />
      <div className="animation-delay-4000 absolute -bottom-1/4 left-1/3 h-[600px] w-[600px] animate-blob rounded-full bg-primary/30 opacity-70 blur-3xl mix-blend-multiply dark:mix-blend-soft-light" />
    </div>
  );
}
