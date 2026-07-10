import { Suspense } from "react";
import AmbientTrackPlayer from "@/components/AmbientTrackPlayer";
import Navbar, { NavbarFallback } from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavbarMotion from "@/components/motion/NavbarMotion";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[--color-urban-canvas]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-dark-900 focus:px-4 focus:py-2.5 focus:text-body-medium focus:text-light-100 focus-ring"
      >
        Skip to content
      </a>
      <Suspense fallback={<NavbarFallback />}>
        <NavbarMotion>
          <Navbar />
        </NavbarMotion>
      </Suspense>
      <main id="main-content" className="flex-1 w-full scroll-mt-24">
        {children}
      </main>
      <Footer />
      <AmbientTrackPlayer />
    </div>
  );
}
