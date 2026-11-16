"use client";

import useWixClient from "@/hooks/useWixClient";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToastStore } from "@/hooks/useToastStore";
import { ENV } from "@/lib/env";
import { isSafeRedirectPath } from "@/lib/securityHelpers";
import { AUTH_MODE, buildMemberProfile, executeWixAuthAction } from "@/services/authService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { EyeIcon, EyeOffIcon } from "@/components/ui/Icons";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TITLES: Record<AUTH_MODE, { form: string; btn: string }> = {
  [AUTH_MODE.LOGIN]: { form: "Welcome Back", btn: "Log In" },
  [AUTH_MODE.REGISTER]: { form: "Create Your Account", btn: "Sign Up" },
  [AUTH_MODE.RESET_PASSWORD]: { form: "Reset Your Password", btn: "Send Reset Link" },
  [AUTH_MODE.EMAIL_VERIFICATION]: { form: "Verify Your Email", btn: "Verify Code" },
};

export default function LoginForm() {
  const wixClient = useWixClient();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, setLoggedInUser, loginAsDemoReviewer } = useAuthStore();
  const { addToast } = useToastStore();

  const [mode, setMode] = useState<AUTH_MODE>(searchParams.get("mode") === "register" ? AUTH_MODE.REGISTER : AUTH_MODE.LOGIN);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const safeRedirect = isSafeRedirectPath(searchParams.get("redirect"));

  useEffect(() => {
    setMode(searchParams.get("mode") === "register" ? AUTH_MODE.REGISTER : AUTH_MODE.LOGIN);
    setError("");
    setMessage("");
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated || wixClient.auth.loggedIn()) router.replace(safeRedirect);
  }, [isAuthenticated, wixClient, router, safeRedirect]);

  const switchMode = (nextMode: AUTH_MODE) => {
    setMode(nextMode);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    const res = await executeWixAuthAction(wixClient, mode, {
      email,
      password,
      username,
      emailCode,
      redirectUrl: window.location.origin + pathname,
    });
    setIsLoading(false);
    if (res.status !== "SUCCESS") {
      if (res.status === "VERIFY") setMode(AUTH_MODE.EMAIL_VERIFICATION);
      if (res.status === "VERIFY" || res.status === "MESSAGE") return setMessage(res.message || "");
      return setError(res.message || "Authentication failed.");
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = username.trim() || cleanEmail.split("@")[0] || "Member";
    setLoggedInUser(buildMemberProfile(cleanName, cleanEmail));
    addToast(`Welcome, ${cleanName}!`, "success", "You are now signed in.");
    router.push(safeRedirect);
  };

  const isLogin = mode === AUTH_MODE.LOGIN;
  const toggleVisibility = (
    <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((p) => !p)} className="p-1 text-slate-600 hover:text-navy-950 rounded-md">
      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-elevated flex flex-col gap-5">
      <div className="flex flex-col gap-1.5 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Vistora Client Portal</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-950">{TITLES[mode].form}</h1>
        <p className="text-xs text-slate-600">Access your saved wishlist, shopping cart, and express checkout.</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {mode === AUTH_MODE.REGISTER && (
          <Input id="username" label="Full Name" type="text" required autoComplete="name" value={username} placeholder="e.g. Zyaad Moataz" onChange={(e) => setUsername(e.target.value)} />
        )}
        {mode !== AUTH_MODE.EMAIL_VERIFICATION ? (
          <Input id="email" label="Email Address" type="email" required autoComplete="email" value={email} placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
        ) : (
          <Input id="emailCode" label="Verification Code" type="text" required value={emailCode} placeholder="Enter 6-digit code" onChange={(e) => setEmailCode(e.target.value)} />
        )}
        {(isLogin || mode === AUTH_MODE.REGISTER) && (
          <Input
            id="password" label="Password" type={showPassword ? "text" : "password"}
            required minLength={6} autoComplete={isLogin ? "current-password" : "new-password"}
            value={password} placeholder="Minimum 6 characters" onChange={(e) => setPassword(e.target.value)}
            rightAction={isLogin ? <button type="button" className="text-xs text-brand-700 hover:underline font-medium" onClick={() => switchMode(AUTH_MODE.RESET_PASSWORD)}>Forgot Password?</button> : undefined}
            rightAdornment={toggleVisibility}
          />
        )}
        {error && <div role="alert" className="text-xs font-medium text-red-700 bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
        {message && <div role="status" className="text-xs font-medium text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">{message}</div>}
        <Button type="submit" size="lg" fullWidth isLoading={isLoading} className="mt-1">{isLoading ? "Authenticating..." : TITLES[mode].btn}</Button>
      </form>

      {isLogin && ENV.DEMO_AUTH_ENABLED && (
        <div className="flex flex-col gap-3">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" /><span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-600 font-medium">or explore without signing up</span><div className="flex-grow border-t border-slate-200" />
          </div>
          <Button variant="secondary" fullWidth onClick={() => { loginAsDemoReviewer(); router.push(safeRedirect); }}>
            Demo VIP Sign-In (Portfolio Reviewer)
          </Button>
        </div>
      )}

      <div className="text-center text-xs text-slate-600 border-t border-slate-100 pt-4">
        <button type="button" className="hover:text-brand-600 font-medium" onClick={() => switchMode(isLogin ? AUTH_MODE.REGISTER : AUTH_MODE.LOGIN)}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}<span className="underline font-semibold text-navy-950">{isLogin ? "Sign Up" : "Log In"}</span>
        </button>
      </div>
    </div>
  );
}
