import test from "node:test";
import assert from "node:assert/strict";
import {
  isSafeRedirectPath,
  isValidEmail,
  sanitizePlainText,
  serializeJsonLd,
} from "../src/lib/securityHelpers";
import { sanitizeProductTitle, sanitizeProductDescription } from "../src/lib/wixProductNormalizer";

test("sanitizePlainText strips HTML angle brackets and control characters", () => {
  assert.equal(sanitizePlainText("  <script>alert(1)</script>Hello  "), "scriptalert(1)/scriptHello");
  assert.equal(sanitizePlainText(12345 as unknown as string), "");
  assert.equal(sanitizePlainText("abcdef", 4), "abcd");
});

test("isSafeRedirectPath blocks open redirects and protocol handlers", () => {
  assert.equal(isSafeRedirectPath("/cart"), "/cart");
  assert.equal(isSafeRedirectPath("/profile?tab=wishlist"), "/profile?tab=wishlist");
  assert.equal(isSafeRedirectPath("https://evil.com"), "/profile");
  assert.equal(isSafeRedirectPath("//evil.com"), "/profile");
  assert.equal(isSafeRedirectPath("javascript:alert(1)"), "/profile");
  assert.equal(isSafeRedirectPath("/\\evil.com"), "/profile");
});

test("isValidEmail validates standard email addresses and rejects malformed inputs", () => {
  assert.equal(isValidEmail("zyaad@vistora.shop"), true);
  assert.equal(isValidEmail("invalid-email"), false);
  assert.equal(isValidEmail("user@.com"), false);
});

test("serializeJsonLd escapes script-breaking characters", () => {
  const payload = { name: "Coat </script><script>alert(1)</script>" };
  const serialized = serializeJsonLd(payload);
  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes(">"), false);
  assert.equal(serialized.includes("\\u003c"), true);
});

test("wixProductNormalizer replaces template placeholders with luxury copy", () => {
  assert.notEqual(sanitizeProductTitle("I'm a product", 0), "I'm a product");
  assert.equal(sanitizeProductTitle("Cashmere Trench Coat", 0), "Cashmere Trench Coat");
  assert.equal(
    sanitizeProductDescription("I'm a product description. I'm a great place to add more details.").includes("great place"),
    false
  );
});
