import { OAuthStrategy, createClient } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const cookies = request.cookies;
  const res = NextResponse.next(); 

//   check if our cookies has our refresh token as if it has our token then continue
  if (cookies.get("refreshToken")) {
    return res;
  }

//   if it has no refresh token then create a client
  const wixClient = createClient({
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
  });

//   lets generate our token, we will take our refresh token and set it into our cookies
// this is necesary as if we are not logged in we cans till access our cart
  const tokens = await wixClient.auth.generateVisitorTokens();
  res.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
};