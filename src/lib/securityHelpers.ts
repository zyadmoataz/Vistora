export const sanitizePlainText = (val: unknown, maxLen = 120): string => {
  if (typeof val !== "string") return "";
  return val
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
};

export const isValidEmail = (email: string): boolean => {
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
};

export const isSafeRedirectPath = (
  raw?: string | null,
  fallback = "/profile"
): string => {
  if (!raw || typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    trimmed.includes("\\") ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
  ) {
    return fallback;
  }
  return trimmed;
};

export const getBrowserRelativeUrl = (fallback = "/"): string =>
  typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : fallback;

export const buildLoginHref = (
  currentPath?: string | null,
  mode: "login" | "register" = "login"
): string => {
  const params = new URLSearchParams();
  if (mode === "register") params.set("mode", "register");
  if (currentPath && !currentPath.startsWith("/login") && isSafeRedirectPath(currentPath, "") === currentPath) {
    params.set("redirect", currentPath);
  }
  const qs = params.toString();
  return qs ? `/login?${qs}` : "/login";
};

export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

export const getCookieSecurityOptions = (days = 7) => ({
  expires: days,
  path: "/",
  sameSite: "lax" as const,
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
});

/** Races async external SDK calls against a bounded timeout so SSR/edge requests never stall. */
export const withTimeout = <T>(promise: Promise<T>, ms = 450): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms)),
  ]);
