import test from "node:test";
import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";

const distSrc = path.resolve(__dirname, "../src");
const mod = Module as unknown as {
  _resolveFilename: (req: string, ...rest: unknown[]) => string;
};
const origResolve = mod._resolveFilename;
mod._resolveFilename = function (request: string, ...rest: unknown[]) {
  if (request.startsWith("@/")) {
    return origResolve.call(this, path.join(distSrc, request.slice(2)), ...rest);
  }
  return origResolve.call(this, request, ...rest);
};

const memoryStore = new Map<string, string>();
const mockLocalStorage = {
  getItem: (k: string) => memoryStore.get(k) ?? null,
  setItem: (k: string, v: string) => {
    memoryStore.set(k, String(v));
  },
  removeItem: (k: string) => {
    memoryStore.delete(k);
  },
  clear: () => memoryStore.clear(),
};

Object.assign(globalThis, {
  window: { location: { protocol: "https:", origin: "https://vistora.shop" } },
  localStorage: mockLocalStorage,
  document: { cookie: "" },
});

import { hasRemoteWixCart, loadLocalCart, mergeLocalCartLine, saveLocalCart, setRemoteWixCart } from "../src/lib/cartHelpers";

const { useAuthStore } = require("../src/hooks/useAuthStore") as typeof import("../src/hooks/useAuthStore");
const { useWishlistStore } = require("../src/hooks/useWishlistStore") as typeof import("../src/hooks/useWishlistStore");

test("carts are strictly isolated per user email and resist corrupted storage payloads", () => {
  mockLocalStorage.clear();

  saveLocalCart(
    [{ _id: "item-1", productId: "prod-vistora-001", productName: { original: "Coat" }, quantity: 2, price: { amount: "249" } }],
    "alice@vistora.shop"
  );

  assert.equal(loadLocalCart("alice@vistora.shop").length, 1);
  assert.equal(loadLocalCart("bob@vistora.shop").length, 0);
  assert.equal(loadLocalCart(undefined).length, 0);

  mockLocalStorage.setItem("vistora_cart_v2_alice@vistora.shop", "{corrupted_json");
  assert.deepEqual(loadLocalCart("alice@vistora.shop"), []);
});

test("useAuthStore starts unhydrated for SSR parity and isolates order histories cleanly", async () => {
  mockLocalStorage.clear();
  useAuthStore.setState({ user: null, isAuthenticated: false, orders: [], isHydrated: false });
  assert.equal(useAuthStore.getState().isHydrated, false);

  useAuthStore.getState().hydrateAuth();
  assert.equal(useAuthStore.getState().isHydrated, true);
  assert.equal(useAuthStore.getState().isAuthenticated, false);

  useAuthStore.getState().setLoggedInUser({
    name: "Alice",
    email: "alice@vistora.shop",
    role: "Member",
    avatarInitials: "AL",
    joinedAt: "Nov 2026",
  });

  useAuthStore.getState().addOrderRecord({
    orderId: "ORD-111222",
    createdAt: "Nov 16, 2026",
    total: 249,
    status: "Processing",
    paymentMethod: "Credit / Debit Card",
    items: [{ id: "1", name: "Coat", quantity: 1, price: 249 }],
  });

  assert.equal(useAuthStore.getState().isAuthenticated, true);
  assert.equal(useAuthStore.getState().orders.length, 1);

  await useAuthStore.getState().logoutUser();
  assert.equal(useAuthStore.getState().isAuthenticated, false);
  assert.equal(useAuthStore.getState().user, null);
  assert.equal(useAuthStore.getState().orders.length, 0);

  useAuthStore.getState().setLoggedInUser({
    name: "Bob",
    email: "bob@vistora.shop",
    role: "Member",
    avatarInitials: "BO",
    joinedAt: "Nov 2026",
  });
  assert.equal(useAuthStore.getState().orders.length, 0);

  await useAuthStore.getState().logoutUser();
});

test("useWishlistStore supports guest saving, auto-merges into signed-in accounts, and isolates between users", () => {
  mockLocalStorage.clear();
  useWishlistStore.setState({ items: [], activeEmail: undefined, hydrated: false });
  useWishlistStore.getState().syncForUser(undefined);

  const guestCoat = { id: "p1", slug: "coat", name: "Coat", price: 249, imageUrl: "/product.png" };
  const aliceWatch = { id: "p2", slug: "watch", name: "Watch", price: 320, imageUrl: "/product.png" };

  useWishlistStore.getState().toggleItem(guestCoat);
  assert.equal(useWishlistStore.getState().isInWishlist("p1"), true);

  useWishlistStore.getState().syncForUser("alice@vistora.shop");
  useWishlistStore.getState().toggleItem(aliceWatch);
  assert.equal(useWishlistStore.getState().items.length, 2);

  useWishlistStore.getState().syncForUser(undefined);
  assert.equal(useWishlistStore.getState().items.length, 0);

  useWishlistStore.getState().syncForUser("bob@vistora.shop");
  assert.equal(useWishlistStore.getState().items.length, 0);

  useWishlistStore.getState().syncForUser("alice@vistora.shop");
  assert.equal(useWishlistStore.getState().items.length, 2);
});

test("cart remote existence flags track member session cleanly and mergeLocalCartLine updates quantities safely", () => {
  mockLocalStorage.clear();
  setRemoteWixCart(undefined, false);
  assert.equal(hasRemoteWixCart("newuser@vistora.shop"), false);
  setRemoteWixCart("newuser@vistora.shop", true);
  assert.equal(hasRemoteWixCart("newuser@vistora.shop"), true);
  setRemoteWixCart("newuser@vistora.shop", false);
  assert.equal(hasRemoteWixCart("newuser@vistora.shop"), false);

  const mergedOnce = mergeLocalCartLine([], {
    productId: "prod-vistora-001",
    variantId: "v1",
    quantity: 2,
    name: "Atelier Trench",
    price: 249,
    image: "/product.png",
  });
  const mergedTwice = mergeLocalCartLine(mergedOnce, {
    productId: "prod-vistora-001",
    variantId: "v1",
    quantity: 3,
    name: "Atelier Trench",
    price: 249,
    image: "/product.png",
  });
  assert.equal(mergedTwice.length, 1);
  assert.equal(mergedTwice[0].quantity, 5);
});
