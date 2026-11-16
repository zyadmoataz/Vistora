import { LoginState } from "@wix/sdk";
import Cookies from "js-cookie";
import type { WixClient } from "../context/wixContext";
import { ENV } from "../lib/env";
import { getCookieSecurityOptions, isValidEmail, sanitizePlainText } from "../lib/securityHelpers";

export enum AUTH_MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

export interface AuthActionResult {
  status: "SUCCESS" | "VERIFY" | "MESSAGE" | "ERROR";
  message?: string;
}

export type DirectAuthClient = {
  auth: Pick<
    WixClient["auth"],
    "login" | "register" | "sendPasswordResetEmail" | "processVerification" | "getMemberTokensForDirectLogin" | "setTokens"
  >;
};

export const buildMemberProfile = (name: string, email: string) => ({
  name,
  email,
  role: "Member" as const,
  avatarInitials: name.slice(0, 2).toUpperCase() || "VM",
  joinedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
});

const mapFailureMessage = (mode: AUTH_MODE, errorCode?: string, errorMsg?: string): string => {
  if (errorCode === "emailAlreadyExists") {
    return "An account with this email already exists. Please log in instead.";
  }
  if (errorCode === "invalidEmail" || errorCode === "invalidPassword") {
    return "Invalid email or password. Please check your credentials and try again.";
  }
  if (errorCode === "resetPassword") {
    return "Password reset required before signing in.";
  }
  if (errorCode === "missingCaptchaToken" || errorCode === "invalidCaptchaToken") {
    return "Wix security verification is still enabled on signup. Check Wix Dashboard Sign-Up Security & Allowed Domains.";
  }
  const cleanDetail = sanitizePlainText(errorMsg, 140);
  if (cleanDetail && !cleanDetail.toLowerCase().includes("unknown")) return cleanDetail;
  return mode === AUTH_MODE.REGISTER
    ? "Registration could not be completed by Wix. Verify Headless OAuth settings in Wix Dashboard."
    : "Authentication declined. Please check your credentials.";
};

/**
 * Executes genuine Wix Headless member authentication (login, signup, reset, and email
 * verification) with input sanitization and OAuth member token exchange.
 */
export const executeWixAuthAction = async (
  wixClient: DirectAuthClient,
  mode: AUTH_MODE,
  payload: { email: string; password?: string; username?: string; emailCode?: string; redirectUrl: string },
  isWixConfigured: boolean = ENV.IS_WIX_CONFIGURED
): Promise<AuthActionResult> => {
  if (!isWixConfigured) {
    return { status: "ERROR", message: "Wix OAuth Client ID is not configured in environment variables." };
  }

  const email = sanitizePlainText(payload.email, 254).toLowerCase();
  const username = sanitizePlainText(payload.username, 60);
  const password = payload.password || "";

  if (!isValidEmail(email) && mode !== AUTH_MODE.EMAIL_VERIFICATION) {
    return { status: "ERROR", message: "Please enter a valid email address." };
  }
  if ((mode === AUTH_MODE.LOGIN || mode === AUTH_MODE.REGISTER) && password.length < 6) {
    return { status: "ERROR", message: "Password must be at least 6 characters long." };
  }

  try {
    let response;
    if (mode === AUTH_MODE.LOGIN) {
      response = await wixClient.auth.login({ email, password });
    } else if (mode === AUTH_MODE.REGISTER) {
      response = await wixClient.auth.register({ email, password, profile: { nickname: username || "Member" } });
    } else if (mode === AUTH_MODE.RESET_PASSWORD) {
      await wixClient.auth.sendPasswordResetEmail(email, payload.redirectUrl);
      return { status: "MESSAGE", message: "If an account exists, a password reset link has been sent." };
    } else {
      response = await wixClient.auth.processVerification({ verificationCode: sanitizePlainText(payload.emailCode, 16) });
    }

    if (response?.loginState === LoginState.SUCCESS) {
      const tokens = await wixClient.auth.getMemberTokensForDirectLogin(response.data.sessionToken!);
      Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), getCookieSecurityOptions(7));
      wixClient.auth.setTokens(tokens);
      return { status: "SUCCESS" };
    }
    if (response?.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED) {
      return { status: "VERIFY", message: "Please enter the verification code sent to your email." };
    }
    if (response?.loginState === LoginState.OWNER_APPROVAL_REQUIRED) {
      return { status: "MESSAGE", message: "Account created and awaiting administrator approval." };
    }
    if (response?.loginState === LoginState.USER_CAPTCHA_REQUIRED || response?.loginState === LoginState.SILENT_CAPTCHA_REQUIRED) {
      return { status: "ERROR", message: mapFailureMessage(mode, "missingCaptchaToken") };
    }
    if (response?.loginState === LoginState.FAILURE) {
      return { status: "ERROR", message: mapFailureMessage(mode, response.errorCode, response.error) };
    }
    return { status: "ERROR", message: "Unable to complete authentication. Please try again." };
  } catch (err) {
    if (mode === AUTH_MODE.RESET_PASSWORD) {
      return { status: "MESSAGE", message: "If an account matches that email, a reset link has been sent." };
    }
    const detail = err instanceof Error ? sanitizePlainText(err.message, 120) : "";
    return { status: "ERROR", message: detail || "Authentication service error. Verify Wix Headless Redirect URIs & CORS/CSP." };
  }
};
