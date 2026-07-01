"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SocialProviders from "./SocialProviders";
import { authClient } from "@/lib/auth-client";

type Props = {
  mode: "sign-in" | "sign-up";
};

export default function AuthForm({ mode }: Props) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "").trim();

    try {
      if (mode === "sign-in") {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
          callbackURL: nextPath,
        });

        if (signInError) {
          setError(signInError.message ?? "Sign in failed. Check your email and password.");
          return;
        }
      } else {
        if (!name) {
          setError("Please enter your name.");
          return;
        }

        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: nextPath,
        });

        if (signUpError) {
          setError(signUpError.message ?? "Sign up failed. Try a different email.");
          return;
        }
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSocial = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true";

  return (
    <div className="relative z-10 space-y-6">
      <div className="text-center">
        <p className="text-caption text-dark-700">
          {mode === "sign-in" ? "Don’t have an account? " : "Already have an account? "}
          <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"} className="underline">
            {mode === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </p>
        <h1 className="mt-3 text-heading-3 text-dark-900">
          {mode === "sign-in" ? "Welcome Back!" : "Join Naga Apparel"}
        </h1>
        <p className="mt-1 text-body text-dark-700">
          {mode === "sign-in"
            ? "Sign in to track orders and shop new drops"
            : "Create your account to shop drops and track orders"}
        </p>
      </div>

      {showSocial && (
        <>
          <SocialProviders variant={mode} />
          <div className="flex items-center gap-4">
            <hr className="h-px w-full border-0 bg-light-300" />
            <span className="shrink-0 text-caption text-dark-700">
              Or {mode === "sign-in" ? "sign in" : "sign up"} with email
            </span>
            <hr className="h-px w-full border-0 bg-light-300" />
          </div>
        </>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "sign-up" && (
          <div className="space-y-1">
            <label htmlFor="name" className="text-caption text-dark-900">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className="focus-ring w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 placeholder:text-dark-700 focus-visible:outline-none"
              autoComplete="name"
              required
            />
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-caption text-dark-900">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@gmail.com"
            className="focus-ring w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-body text-dark-900 placeholder:text-dark-700 focus-visible:outline-none"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-caption text-dark-900">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              placeholder="minimum 8 characters"
              className="focus-ring w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 pr-12 text-body text-dark-900 placeholder:text-dark-700 focus-visible:outline-none"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={8}
              required
            />
            <button
              type="button"
              className="focus-ring absolute inset-y-0 right-0 min-w-11 px-3 text-caption text-dark-700 focus-visible:outline-none"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-[--color-red]/20 bg-[--color-red]/5 px-3 py-2 text-caption text-[--color-red]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="naga-btn naga-btn-gold focus-ring mt-2 w-full focus-visible:outline-none"
        >
          {loading ? "Please wait…" : mode === "sign-in" ? "Sign In" : "Sign Up"}
        </button>

        {mode === "sign-up" && (
          <p className="text-center text-footnote text-dark-700">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
