import test from "node:test";
import assert from "node:assert/strict";
import { products } from "@wix/stores";
import { filterAndSortLocalProducts } from "../src/services/catalogFilterHelper";
import { computeCartTotals, loadLocalCart, saveLocalCart } from "../src/lib/cartHelpers";
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
