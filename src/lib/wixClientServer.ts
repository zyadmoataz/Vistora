// /lib/wixClientServer.ts

import { createClient, OAuthStrategy, TokenRole } from "@wix/sdk";
import { collections, products } from '@wix/stores';

export const wixClientServer = async () => {

  const wixClient = createClient({
    modules: {
      products,
      collections,
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        accessToken: { value: "", expiresAt: 0 },
        refreshToken: { value: "", role: TokenRole.VISITOR },
      },
    }),
  });

  const tokens = await wixClient.auth.generateVisitorTokens();
  wixClient.auth.setTokens(tokens);

  return wixClient;
};