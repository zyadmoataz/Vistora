import test from "node:test";
import assert from "node:assert/strict";
import { products } from "@wix/stores";
import { filterAndSortLocalProducts } from "../src/services/catalogFilterHelper";
import {
  buildCatalogReferenceOptions,
  computeCartTotals,
  mapWixLineItems,
  mergeRemoteAndLocalItems,
  resolveCartImageUrl,
  resolveDefaultProductSelection,
} from "../src/lib/cartHelpers";
import { DEFAULT_VARIANT_ID } from "../src/lib/env";
import { buildOrderRecord, calculateCheckoutTotal } from "../src/lib/checkoutHelper";

const SAMPLE_PRODUCTS: products.Product[] = [
  {
    _id: "p1",
    name: "Cashmere Coat",
    slug: "cashmere-coat",
    description: "Italian wool outerwear",
    productType: products.ProductType.physical,
    price: { price: 400, discountedPrice: 300 },
  },
  {
    _id: "p2",
    name: "Atelier Gift Pass",
    slug: "atelier-gift-pass",
    description: "Digital membership pass",
    productType: products.ProductType.digital,
    price: { price: 150, discountedPrice: 150 },
  },
  {
    _id: "p3",
    name: "Milano Weekender Bag",
    slug: "milano-weekender-bag",
    description: "Full-grain leather luggage",
    productType: products.ProductType.physical,
    price: { price: 500, discountedPrice: 500 },
  },
];

test("filterAndSortLocalProducts filters by search query, price range, deals, and sorts cleanly", () => {
  const searchRes = filterAndSortLocalProducts(SAMPLE_PRODUCTS, { name: "leather" }, 8);
  assert.equal(searchRes.totalCount, 1);
  assert.equal(searchRes.items[0]._id, "p3");

  const dealsRes = filterAndSortLocalProducts(SAMPLE_PRODUCTS, { dealsOnly: true }, 8);
  assert.equal(dealsRes.totalCount, 1);
  assert.equal(dealsRes.items[0]._id, "p1");

  const sortedAsc = filterAndSortLocalProducts(SAMPLE_PRODUCTS, { sort: "asc price" }, 8);
  assert.deepEqual(sortedAsc.items.map((p) => p._id), ["p2", "p1", "p3"]);

  const paged = filterAndSortLocalProducts(SAMPLE_PRODUCTS, { page: "1" }, 2);
  assert.equal(paged.items.length, 1);
  assert.equal(paged.hasPrev, true);
  assert.equal(paged.hasNext, false);

  const excluded = filterAndSortLocalProducts(SAMPLE_PRODUCTS, { excludeId: "p2" }, 8);
  assert.equal(excluded.items.some((p) => p._id === "p2"), false);
  assert.equal(excluded.totalCount, 2);
});

test("computeCartTotals & calculateCheckoutTotal compute accurate subtotal and VISTORA20 discount", () => {
  const { cart, counter } = computeCartTotals([
    { _id: "1", productId: "p1", productName: { original: "Coat" }, quantity: 2, price: { amount: "100.00" } },
    { _id: "2", productId: "p2", productName: { original: "Bag" }, quantity: 1, price: { amount: "50.00" } },
  ]);

  assert.equal(counter, 3);
  assert.equal(cart.subtotal.amount, "250.00");

  const totals = calculateCheckoutTotal(parseFloat(cart.subtotal.amount), true);
  assert.equal(totals.rawSubtotal, 250);
  assert.equal(totals.discountAmount, 50);
  assert.equal(totals.finalTotal, 200);

  const order = buildOrderRecord(cart.lineItems, totals.finalTotal, "Credit / Debit Card");
  assert.match(order.orderId, /^ORD-\d{6}$/);
  assert.equal(order.total, 200);
  assert.equal(order.items.length, 2);
});


test("mapWixLineItems preserves Wix line item ids, images, names, and scopes fallback metadata", () => {
  const mapped = mapWixLineItems(
    [
      {
        id: "guid-chair-1",
        catalogReference: { catalogItemId: "prod-chair" },
        productName: { original: "Sculpted Chair" },
        url: { relativePath: "/product-page/sculpted-chair" },
        quantity: 2,
        price: { amount: "49.50" },
        image: { url: "https://static.wixstatic.com/media/chair.jpg" },
      },
      {
        id: "guid-bag-2",
        catalogReference: { catalogItemId: "prod-bag" },
        url: { relativePath: "/product-page/tote-bag" },
        quantity: 1,
        price: { amount: "20.00" },
        image: { url: "https://static.wixstatic.com/media/bag.jpg" },
      },
    ],
    "prod-bag",
    { name: "Bag", price: 20, image: "/fallback-bag.jpg", slug: "bag" }
  );

  assert.equal(mapped[0]._id, "guid-chair-1");
  assert.equal(mapped[0].productName?.original, "Sculpted Chair");
  assert.equal(mapped[0].slug, "sculpted-chair");
  assert.equal(resolveCartImageUrl(mapped[0].image), "https://static.wixstatic.com/media/chair.jpg");
  assert.equal(mapped[1]._id, "guid-bag-2");
  assert.equal(mapped[1].productName?.original, "Bag");
  assert.equal(mapped[1].slug, "tote-bag");
});

test("mergeRemoteAndLocalItems keeps local fallback items while avoiding duplicate Wix products", () => {
  const merged = mergeRemoteAndLocalItems(
    [{ _id: "guid-bag", productId: "prod-bag", productName: { original: "Bag" }, quantity: 1, price: { amount: "20" } }],
    [
      { _id: "prod-vistora-1__default", productId: "prod-vistora-1", productName: { original: "Coat" }, quantity: 1, price: { amount: "249" } },
      { _id: "prod-bag__default", productId: "prod-bag", productName: { original: "Bag" }, quantity: 1, price: { amount: "20" } },
    ]
  );

  assert.equal(merged.length, 2);
  assert.deepEqual(merged.map((i) => i.productId), ["prod-bag", "prod-vistora-1"]);
});

test("resolveDefaultProductSelection selects first in-stock variant or option map cleanly", () => {
  const variantSel = resolveDefaultProductSelection({
    variants: [
      { _id: "v-oos", stock: { inStock: false, quantity: 0 }, choices: { Size: "S" } },
      { _id: "v-live", stock: { inStock: true, trackQuantity: true, quantity: 10 }, choices: { Size: "M" } },
    ],
  });
  assert.equal(variantSel.variantId, "v-live");
  assert.deepEqual(buildCatalogReferenceOptions(variantSel.variantId, variantSel.options), { variantId: "v-live" });

  const optionSel = resolveDefaultProductSelection({
    variants: [{ _id: DEFAULT_VARIANT_ID }],
    productOptions: [{ name: "Color", choices: [{ value: "#000", description: "Onyx", inStock: true, visible: true }] }],
  });
  assert.equal(optionSel.variantId, DEFAULT_VARIANT_ID);
  assert.deepEqual(buildCatalogReferenceOptions(optionSel.variantId, optionSel.options), { options: { Color: "Onyx" } });
});
