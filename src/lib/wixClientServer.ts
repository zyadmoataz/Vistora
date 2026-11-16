import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { ENV } from "./env";

let cachedPublicClient: ReturnType<typeof createPublicClient> | null = null;

function createPublicClient() {
  return createClient({
    modules: {
      products,
      collections,
    },
    auth: OAuthStrategy({
      clientId: ENV.WIX_CLIENT_ID,
    }),
  });
}

export const wixClientServer = async () => {
  if (!cachedPublicClient) {
    cachedPublicClient = createPublicClient();
  }
  return cachedPublicClient;
};
