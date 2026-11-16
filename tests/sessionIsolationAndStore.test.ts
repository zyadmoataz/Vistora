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

import { ENV } from "../src/lib/env";
import { hasRemoteWixCart, loadLocalCart, mergeLocalCartLine, saveLocalCart, setRemoteWixCart } from "../src/lib/cartHelpers";

const { useAuthStore } = require("../src/hooks/useAuthStore") as typeof import("../src/hooks/useAuthStore");
const { useCartStore } = require("../src/hooks/useCartStore") as typeof import("../src/hooks/useCartStore");
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

  useWishlistStore.getState().toggleItem(aliceWatch, true);
  assert.equal(useWishlistStore.getState().isInWishlist("p2"), false);
  assert.equal(useWishlistStore.getState().items.length, 1);
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


import type { WixClient } from "../src/context/wixContext";
import { DEFAULT_VARIANT_ID } from "../src/lib/env";

test("useCartStore prevents zero-counter phantom toasts, isolates item names, and syncs updates/deletes to Wix", async () => {
  mockLocalStorage.clear();
  const mutableEnv = ENV as { IS_WIX_CONFIGURED: boolean };
  const prevConfigured = mutableEnv.IS_WIX_CONFIGURED;
  mutableEnv.IS_WIX_CONFIGURED = true;

  const calls: { updated?: unknown; removed?: unknown; deleted?: boolean } = {};

  try {
    useCartStore.setState({
      cart: { lineItems: [], subtotal: { amount: "0.00" } },
      activeEmail: "alex@vistora.shop",
      isLoading: false,
      counter: 0,
    });

    const emptyAddClient = {
      auth: { loggedIn: () => true },
      currentCart: { addToCurrentCart: async () => ({ cart: { lineItems: [] } }) },
    } as unknown as WixClient;

    await useCartStore.getState().addItem(emptyAddClient, "wix-bag", DEFAULT_VARIANT_ID, 1, {
      name: "Bag",
      price: 20,
      image: "/bag.jpg",
      slug: "bag",
    });

    assert.equal(useCartStore.getState().counter, 1);
    assert.equal(useCartStore.getState().cart.lineItems[0].productName?.original, "Bag");

    useCartStore.setState({
      cart: { lineItems: [], subtotal: { amount: "0.00" } },
      activeEmail: "alex@vistora.shop",
      isLoading: false,
      counter: 0,
    });

    const liveWixClient = {
      auth: { loggedIn: () => true },
      currentCart: {
        addToCurrentCart: async () => ({
          cart: {
            lineItems: [
              {
                id: "guid-chair",
                catalogReference: { catalogItemId: "wix-chair" },
                productName: { original: "Wooden Chair" },
                url: { relativePath: "/product-page/wooden-chair" },
                quantity: 2,
                price: { amount: "49.50" },
                image: { url: "https://cdn.example/chair.jpg" },
              },
              {
                id: "guid-bag",
                catalogReference: { catalogItemId: "wix-bag" },
                productName: { original: "Bag" },
                url: { relativePath: "/product-page/bag" },
                quantity: 1,
                price: { amount: "20.00" },
                image: { url: "https://cdn.example/bag.jpg" },
              },
            ],
          },
        }),
        updateCurrentCartLineItemQuantity: async (updates: unknown) => {
          calls.updated = updates;
        },
        removeLineItemsFromCurrentCart: async (ids: unknown) => {
          calls.removed = ids;
        },
        deleteCurrentCart: async () => {
          calls.deleted = true;
        },
      },
    } as unknown as WixClient;

    await useCartStore.getState().addItem(liveWixClient, "wix-bag", DEFAULT_VARIANT_ID, 1, {
      name: "Bag",
      price: 20,
      image: "/bag.jpg",
      slug: "bag",
    });

    const state = useCartStore.getState();
    assert.equal(state.counter, 3);
    assert.equal(state.cart.subtotal.amount, "119.00");
    assert.equal(state.cart.lineItems[0]._id, "guid-chair");
    assert.equal(state.cart.lineItems[0].productName?.original, "Wooden Chair");
    assert.equal(state.cart.lineItems[1].productName?.original, "Bag");

    useCartStore.getState().updateQuantity("guid-chair", -1, liveWixClient);
    assert.deepEqual(calls.updated, [{ _id: "guid-chair", quantity: 1 }]);
    assert.equal(useCartStore.getState().counter, 2);

    await useCartStore.getState().removeItem(liveWixClient, "guid-chair");
    assert.deepEqual(calls.removed, ["guid-chair"]);
    assert.equal(useCartStore.getState().counter, 1);

    useCartStore.getState().clearCart(liveWixClient);
    assert.equal(calls.deleted, true);
    assert.equal(useCartStore.getState().counter, 0);
  } finally {
    mutableEnv.IS_WIX_CONFIGURED = prevConfigured;
  }
});


const {
  computeRemainingStock,
  getInCartQuantity,
  resolveBaseStock,
  useInventoryStore,
} = require("../src/hooks/useInventoryStore") as typeof import("../src/hooks/useInventoryStore");

test("useInventoryStore deducts purchased quantities per variant and persists across rehydration", () => {
  mockLocalStorage.clear();
  useInventoryStore.setState({ purchased: {}, hydrated: false });
  useInventoryStore.getState().hydrateInventory();

  assert.equal(resolveBaseStock(undefined, { trackQuantity: true, quantity: 8, inStock: true }), 8);
  assert.equal(computeRemainingStock(useInventoryStore.getState().purchased, "prod-vistora-001", "var-0-0-249", 8), 8);

  useInventoryStore.getState().recordPurchase([
    { _id: "prod-vistora-001__var-0-0-249", productId: "prod-vistora-001", variantId: "var-0-0-249", quantity: 2 },
  ]);

  assert.equal(computeRemainingStock(useInventoryStore.getState().purchased, "prod-vistora-001", "var-0-0-249", 8), 6);
  assert.equal(computeRemainingStock(useInventoryStore.getState().purchased, "prod-vistora-001", "var-0-1-249", 8), 8);
  assert.equal(
    getInCartQuantity(
      [{ productId: "prod-vistora-001", variantId: "var-0-0-249", quantity: 3 }],
      "prod-vistora-001",
      "var-0-0-249"
    ),
    3
  );

  // Verify persistence survives fresh store rehydration
  useInventoryStore.setState({ purchased: {}, hydrated: false });
  useInventoryStore.getState().hydrateInventory();
  assert.equal(computeRemainingStock(useInventoryStore.getState().purchased, "prod-vistora-001", "var-0-0-249", 8), 6);

  // Exceeding stock clamps safely to 0
  useInventoryStore.getState().recordPurchase([
    { _id: "prod-vistora-001__var-0-0-249", productId: "prod-vistora-001", variantId: "var-0-0-249", quantity: 10 },
  ]);
  assert.equal(computeRemainingStock(useInventoryStore.getState().purchased, "prod-vistora-001", "var-0-0-249", 8), 0);
});


test("useCartStore.updateQuantity clamps bag increments against remaining post-purchase stock", () => {
  mockLocalStorage.clear();
  useInventoryStore.setState({ purchased: { "prod-vistora-001__var-0-0-249": 2 }, hydrated: true });
  useCartStore.setState({
    cart: {
      lineItems: [
        {
          _id: "prod-vistora-001__var-0-0-249",
          productId: "prod-vistora-001",
          variantId: "var-0-0-249",
          productName: { original: "Atelier Cashmere Trench Coat" },
          quantity: 6,
          price: { amount: "249.00" },
        },
      ],
      subtotal: { amount: "1494.00" },
    },
    activeEmail: "alex@vistora.shop",
    isLoading: false,
    counter: 6,
  });

  useCartStore.getState().updateQuantity("prod-vistora-001__var-0-0-249", 1);
  assert.equal(useCartStore.getState().counter, 6);

  useCartStore.getState().updateQuantity("prod-vistora-001__var-0-0-249", -1);
  assert.equal(useCartStore.getState().counter, 5);
});
