import { OAuthStrategy, createClient } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "./lib/env";

const withFastTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    ),
  ]);

export const middleware = async (request: NextRequest) => {
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";

  const res = NextResponse.next();

  if (isPrefetch || request.cookies.get("refreshToken")) {
    return res;
  }

  const secure = request.nextUrl.protocol === "https:";

  if (!ENV.IS_WIX_CONFIGURED) {
    res.cookies.set("refreshToken", JSON.stringify({ role: "visitor" }), {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      secure,
    });
    return res;
  }

  try {
    const wixClient = createClient({
      auth: OAuthStrategy({ clientId: ENV.WIX_CLIENT_ID }),
    });
    const tokens = await withFastTimeout(
      wixClient.auth.generateVisitorTokens(),
      350
    );
    res.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure,
    });
  } catch {
    res.cookies.set("refreshToken", JSON.stringify({ role: "visitor" }), {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      secure,
    });
  }

  return res;
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|ico|webp|avif)$).*)",
  ],
};
