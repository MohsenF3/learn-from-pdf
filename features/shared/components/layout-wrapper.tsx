import Footer from "./footer";
import Header from "./header";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
