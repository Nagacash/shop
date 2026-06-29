import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-light-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-dark-900 focus:px-4 focus:py-2.5 focus:text-body-medium focus:text-light-100 focus-ring"
      >
        Skip to content
      </a>
      <Suspense fallback={<header className="sticky top-0 z-50 h-16 border-b border-light-300/80 bg-light-100" />}>
        <Navbar />
      </Suspense>
      <main id="main-content" className="flex-1 w-full scroll-mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
