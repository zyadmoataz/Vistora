import { products } from "@wix/stores";
import { ALL_PRODUCTS_CATEGORY_ID, ENV } from "./env";

const createVariants = (
  basePrice: number,
  colors: string[],
  sizes: string[]
): products.Variant[] => {
  const list: products.Variant[] = [];
  colors.forEach((color, cIdx) => {
    sizes.forEach((size, sIdx) => {
      list.push({
        _id: `var-${cIdx}-${sIdx}-${basePrice}`,
        choices: { Color: color, Size: size },
        stock: { trackQuantity: true, quantity: 8 + cIdx * 2, inStock: true },
      });
    });
  });
  return list;
};

export const FALLBACK_PRODUCTS: products.Product[] = [
  {
    _id: "prod-vistora-001",
    name: "Atelier Cashmere Trench Coat",
    slug: "atelier-cashmere-trench-coat",
    productType: products.ProductType.physical,
    description:
      "Tailored from a sumptuous double-faced wool and cashmere blend, the Atelier Trench offers structured warmth and a relaxed modern drape.",
    price: { price: 320, discountedPrice: 249, formatted: { price: "$320.00", discountedPrice: "$249.00" } },
    priceData: { price: 320, discountedPrice: 249 },
    stock: { trackInventory: true, quantity: 14, inStock: true },
    collectionIds: [ALL_PRODUCTS_CATEGORY_ID, ENV.FEATURED_CATEGORY_ID, "cat-apparel-001"],
    media: {
      mainMedia: { image: { url: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      items: [
        { _id: "m1", image: { url: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800" } },
        { _id: "m2", image: { url: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      ],
    },
    productOptions: [
      { name: "Color", choices: [{ value: "#1E293B", description: "Obsidian" }, { value: "#D6C7B2", description: "Sandstone" }] },
      { name: "Size", choices: [{ value: "S", description: "Small" }, { value: "M", description: "Medium" }, { value: "L", description: "Large" }] },
    ],
    variants: createVariants(249, ["Obsidian", "Sandstone"], ["Small", "Medium", "Large"]),
    additionalInfoSections: [
      { title: "shortDesc", description: "Double-faced wool & cashmere tailored trench." },
      { title: "Material & Care", description: "85% Virgin Wool, 15% Cashmere. Dry clean only." },
      { title: "Shipping & Returns", description: "Complimentary express shipping. 30-day effortless returns." },
    ],
  },
  {
    _id: "prod-vistora-002",
    name: "Milano Full-Grain Leather Weekender",
    slug: "milano-leather-weekender",
    productType: products.ProductType.physical,
    description:
      "Handcrafted from vegetable-tanned full-grain calfskin with brushed brass hardware and a padded laptop compartment.",
    price: { price: 280, discountedPrice: 220, formatted: { price: "$280.00", discountedPrice: "$220.00" } },
    priceData: { price: 280, discountedPrice: 220 },
    stock: { trackInventory: true, quantity: 9, inStock: true },
    collectionIds: [ALL_PRODUCTS_CATEGORY_ID, ENV.FEATURED_CATEGORY_ID, "cat-accessories-002"],
    media: {
      mainMedia: { image: { url: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      items: [
        { _id: "m3", image: { url: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800" } },
        { _id: "m4", image: { url: "https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      ],
    },
    productOptions: [
      { name: "Color", choices: [{ value: "#78350F", description: "Cognac" }, { value: "#111827", description: "Onyx" }] },
      { name: "Size", choices: [{ value: "OS", description: "One Size" }] },
    ],
    variants: createVariants(220, ["Cognac", "Onyx"], ["One Size"]),
    additionalInfoSections: [
      { title: "shortDesc", description: "Vegetable-tanned Italian calfskin travel bag." },
      { title: "Dimensions", description: "52cm x 28cm x 24cm. Cabin-approved on all major airlines." },
    ],
  },
  {
    _id: "prod-vistora-003",
    name: "AeroKnit Minimalist Runner",
    slug: "aeroknit-minimalist-runner",
    productType: products.ProductType.physical,
    description:
      "Featherlight engineered Merino-blend upper paired with a responsive dual-density cushioned sole for all-day urban exploration.",
    price: { price: 185, discountedPrice: 185, formatted: { price: "$185.00", discountedPrice: "$185.00" } },
    priceData: { price: 185, discountedPrice: 185 },
    stock: { trackInventory: true, quantity: 22, inStock: true },
    collectionIds: [ALL_PRODUCTS_CATEGORY_ID, ENV.FEATURED_CATEGORY_ID, "cat-footwear-003"],
    media: {
      mainMedia: { image: { url: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      items: [
        { _id: "m5", image: { url: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800" } },
        { _id: "m6", image: { url: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      ],
    },
    productOptions: [
      { name: "Color", choices: [{ value: "#F8FAFC", description: "Cloud White" }, { value: "#E11D48", description: "Crimson" }] },
      { name: "Size", choices: [{ value: "M", description: "Medium" }, { value: "L", description: "Large" }] },
    ],
    variants: createVariants(185, ["Cloud White", "Crimson"], ["Medium", "Large"]),
    additionalInfoSections: [
      { title: "shortDesc", description: "Breathable Merino-knit sneaker with cloud cushioning." },
      { title: "Sustainability", description: "Carbon-neutral production with recycled ocean-bound plastics." },
    ],
  },
  {
    _id: "prod-vistora-004",
    name: "Chronos Sapphire Automatic 40mm",
    slug: "chronos-sapphire-automatic",
    productType: products.ProductType.physical,
    description:
      "Surgical-grade 316L stainless steel case with scratch-resistant domed sapphire crystal and a sweeping mechanical movement.",
    price: { price: 450, discountedPrice: 375, formatted: { price: "$450.00", discountedPrice: "$375.00" } },
    priceData: { price: 450, discountedPrice: 375 },
    stock: { trackInventory: true, quantity: 6, inStock: true },
    collectionIds: [ALL_PRODUCTS_CATEGORY_ID, ENV.FEATURED_CATEGORY_ID, "cat-timepieces-004", "cat-accessories-002"],
    media: {
      mainMedia: { image: { url: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      items: [
        { _id: "m7", image: { url: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800" } },
        { _id: "m8", image: { url: "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      ],
    },
    productOptions: [
      { name: "Color", choices: [{ value: "#334155", description: "Slate Silver" }, { value: "#0F172A", description: "Midnight" }] },
      { name: "Size", choices: [{ value: "40mm", description: "40mm" }] },
    ],
    variants: createVariants(375, ["Slate Silver", "Midnight"], ["40mm"]),
    additionalInfoSections: [
      { title: "shortDesc", description: "Automatic mechanical chronograph with sapphire glass." },
      { title: "Warranty", description: "5-Year International Vistora Horology Warranty included." },
    ],
  },
];
