import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

function AuthFormFallback() {
  return <div className="h-80 animate-pulse rounded-xl bg-light-200" aria-hidden="true" />;
}

export default function Page() {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
