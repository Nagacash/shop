"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

type Props = { variant?: "sign-in" | "sign-up" };

const hasGoogleOAuth =
  typeof process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "string" &&
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true";

export default function SocialProviders({ variant = "sign-in" }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!hasGoogleOAuth) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="space-y-3" aria-hidden="true">
        <div className="h-[50px] animate-pulse rounded-xl bg-light-200" />
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="focus-ring flex min-h-11 w-full items-center justify-center gap-3 rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body-medium text-dark-900 hover:bg-light-200 focus-visible:outline-none"
        aria-label={`${variant === "sign-in" ? "Continue" : "Sign up"} with Google`}
      >
        <Image src="/google.svg" alt="" width={18} height={18} unoptimized />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}
