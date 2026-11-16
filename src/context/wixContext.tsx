"use client";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import Cookies from "js-cookie";
import { createContext, ReactNode } from "react";
import { ENV } from "@/lib/env";

const getInitialRefreshToken = () => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(Cookies.get("refreshToken") || "{}");
  } catch {
    return {};
  }
};

const wixClient = createClient({
  modules: { products, collections, currentCart },
  auth: OAuthStrategy({
    clientId: ENV.WIX_CLIENT_ID,
    tokens: {
      refreshToken: getInitialRefreshToken(),
      accessToken: { value: "", expiresAt: 0 },
    },
  }),
});

export type WixClient = typeof wixClient;
export const WixClientContext = createContext<WixClient>(wixClient);

export const WixClientContextProvider = ({ children }: { children: ReactNode }) => (
  <WixClientContext.Provider value={wixClient}>{children}</WixClientContext.Provider>
);
