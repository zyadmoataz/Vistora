// /lib/wixClientServer.ts

import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from '@wix/stores';

export const wixClientServer = async () => {
  const wixClient = createClient({
    modules: {
      products,
      collections,
    },
    auth: OAuthStrategy({
      // The clientId is ALWAYS required.
      // The SDK will automatically use the WIX_CLIENT_SECRET from your environment.
      clientId: process.env.WIX_CLIENT_ID!,
    }),
  });

  return wixClient;
};