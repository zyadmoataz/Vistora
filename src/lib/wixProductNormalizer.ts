import { products } from "@wix/stores";

const LUXURY_TITLES = [
  "Vistora Sculpted Accent Piece",
  "Atelier Artisanal Everyday Tote",
  "Nordic Minimalist Studio Object",
  "Milanese Tailored Capsule Edition",
  "Heritage Structured Essential",
  "Chronos Architectural Edition",
];

const LUXURY_DESCRIPTIONS = [
  "Crafted in limited quantities with architectural proportions, premium natural materials, and hand-finished detailing.",
  "Designed in our Cairo & Milan design studio for enduring everyday utility and refined visual balance.",
  "Precision-engineered silhouette combining sustainable craftsmanship with timeless minimalist character.",
];

export const sanitizeProductTitle = (rawName?: string | null, seed = 0): string => {
  if (!rawName) return LUXURY_TITLES[seed % LUXURY_TITLES.length];
  const trimmed = rawName.trim();
  if (/^i['’]?m a product$/i.test(trimmed)) {
    return LUXURY_TITLES[seed % LUXURY_TITLES.length];
  }
  return trimmed;
};

export const sanitizeProductDescription = (rawDesc?: string | null, seed = 0): string => {
  if (!rawDesc) return LUXURY_DESCRIPTIONS[seed % LUXURY_DESCRIPTIONS.length];
  if (/i['’]?m a product description/i.test(rawDesc)) {
    return LUXURY_DESCRIPTIONS[seed % LUXURY_DESCRIPTIONS.length];
  }
  return rawDesc;
};

export const normalizeWixProduct = (p: products.Product, idx = 0): products.Product => {
  const hash = (p._id || "").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), idx);
  return {
    ...p,
    name: sanitizeProductTitle(p.name, hash),
    description: sanitizeProductDescription(p.description, hash),
  };
};
