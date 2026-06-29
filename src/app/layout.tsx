import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Naga Apparel",
  description:
    "Urban streetwear — hoodies, tees, and headwear. Knowledge and quality over ignorance.",
};

export default function RootShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${jost.className} min-h-full antialiased bg-light-100`}>
        {children}
      </body>
    </html>
  );
}
