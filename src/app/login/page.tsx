import LoginForm from "@/components/LoginForm";
import React, { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-120px)] container-shell py-12 flex items-center justify-center">
      <Suspense fallback={<div className="w-full max-w-md h-96 rounded-3xl bg-slate-100 animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
