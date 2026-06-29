import { Suspense } from "react";
import { Navbar, Footer } from "@/components";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-light-100">
      <Suspense fallback={<header className="sticky top-0 z-50 h-16 bg-light-100" />}>
        <Navbar />
      </Suspense>
      <div className="flex-1 w-full">{children}</div>
      <Footer />
    </div>
  );
}
