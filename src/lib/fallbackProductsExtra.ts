import { products } from "@wix/stores";
import { ALL_PRODUCTS_CATEGORY_ID, ENV } from "./env";

export const EXTRA_FALLBACK_PRODUCTS: products.Product[] = [
  {
    _id: "prod-vistora-005",
    name: "Nordic Structured Overshirt",
    slug: "nordic-structured-overshirt",
    productType: products.ProductType.physical,
    description:
      "Heavyweight organic cotton twill overshirt designed for transitional layering with horn buttons and concealed chest pockets.",
    price: { price: 145, discountedPrice: 115, formatted: { price: "$145.00", discountedPrice: "$115.00" } },
    priceData: { price: 145, discountedPrice: 115 },
    stock: { trackInventory: true, quantity: 18, inStock: true },
    collectionIds: [ALL_PRODUCTS_CATEGORY_ID, ENV.FEATURED_CATEGORY_ID, "cat-apparel-001"],
    media: {
      mainMedia: { image: { url: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      items: [
        { _id: "m9", image: { url: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800" } },
        { _id: "m10", image: { url: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      ],
    },
    productOptions: [
      { name: "Color", choices: [{ value: "#3F6212", description: "Olive" }, { value: "#1E293B", description: "Navy" }] },
      { name: "Size", choices: [{ value: "S", description: "Small" }, { value: "M", description: "Medium" }, { value: "L", description: "Large" }] },
    ],
    variants: [
      { _id: "var-5-1", choices: { Color: "Olive", Size: "Medium" }, stock: { trackQuantity: true, quantity: 10, inStock: true } },
      { _id: "var-5-2", choices: { Color: "Navy", Size: "Large" }, stock: { trackQuantity: true, quantity: 8, inStock: true } },
    ],
    additionalInfoSections: [
      { title: "shortDesc", description: "Heavyweight organic cotton architectural overshirt." },
      { title: "Fit & Sizing", description: "Relaxed boxy cut. Take your normal size." },
    ],
  },
  {
    _id: "prod-vistora-006",
    name: "Lumiere Acetate Sunglasses",
    slug: "lumiere-acetate-sunglasses",
    productType: products.ProductType.physical,
    description:
      "Hand-polished Mazzucchelli cellulose acetate frames fitted with polarized CR-39 UV400 lenses and five-barrel German hinges.",
    price: { price: 160, discountedPrice: 129, formatted: { price: "$160.00", discountedPrice: "$129.00" } },
    priceData: { price: 160, discountedPrice: 129 },
    stock: { trackInventory: true, quantity: 12, inStock: true },
    collectionIds: [ALL_PRODUCTS_CATEGORY_ID, "cat-accessories-002"],
    media: {
      mainMedia: { image: { url: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      items: [
        { _id: "m11", image: { url: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800" } },
        { _id: "m12", image: { url: "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      ],
    },
    productOptions: [
      { name: "Color", choices: [{ value: "#451A03", description: "Tortoise" }, { value: "#09090B", description: "Jet Black" }] },
      { name: "Size", choices: [{ value: "OS", description: "One Size" }] },
    ],
    variants: [
      { _id: "var-6-1", choices: { Color: "Tortoise", Size: "One Size" }, stock: { trackQuantity: true, quantity: 7, inStock: true } },
      { _id: "var-6-2", choices: { Color: "Jet Black", Size: "One Size" }, stock: { trackQuantity: true, quantity: 5, inStock: true } },
    ],
    additionalInfoSections: [
      { title: "shortDesc", description: "Italian acetate frames with polarized UV400 lenses." },
    ],
  },
  {
    _id: "prod-vistora-007",
    name: "Sienna Silk Pleated Midi Dress",
    slug: "sienna-silk-pleated-midi-dress",
    productType: products.ProductType.physical,
    description:
      "Fluid mulberry silk crepe de chine midi dress featuring architectural sunray pleats and a cinched waist.",
    price: { price: 295, discountedPrice: 235, formatted: { price: "$295.00", discountedPrice: "$235.00" } },
    priceData: { price: 295, discountedPrice: 235 },
    stock: { trackInventory: true, quantity: 7, inStock: true },
    collectionIds: [ALL_PRODUCTS_CATEGORY_ID, ENV.FEATURED_CATEGORY_ID, "cat-apparel-001"],
    media: {
      mainMedia: { image: { url: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      items: [
        { _id: "m13", image: { url: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800" } },
        { _id: "m14", image: { url: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      ],
    },
    productOptions: [
      { name: "Color", choices: [{ value: "#E11D48", description: "Rose" }, { value: "#0F172A", description: "Noir" }] },
      { name: "Size", choices: [{ value: "S", description: "Small" }, { value: "M", description: "Medium" }] },
    ],
    variants: [
      { _id: "var-7-1", choices: { Color: "Rose", Size: "Small" }, stock: { trackQuantity: true, quantity: 4, inStock: true } },
      { _id: "var-7-2", choices: { Color: "Noir", Size: "Medium" }, stock: { trackQuantity: true, quantity: 3, inStock: true } },
    ],
    additionalInfoSections: [
      { title: "shortDesc", description: "100% Mulberry silk pleated evening and day dress." },
    ],
  },
  {
    _id: "prod-vistora-008",
    name: "Vistora Digital Lookbook & Style Pass",
    slug: "vistora-digital-style-pass",
    productType: products.ProductType.digital,
    description:
      "Instant digital access to our seasonal capsule wardrobe blueprint, interactive sizing guide, and VIP member gift voucher.",
    price: { price: 49, discountedPrice: 35, formatted: { price: "$49.00", discountedPrice: "$35.00" } },
    priceData: { price: 49, discountedPrice: 35 },
    stock: { trackInventory: true, quantity: 50, inStock: true },
    collectionIds: [ALL_PRODUCTS_CATEGORY_ID, "cat-accessories-002"],
    media: {
      mainMedia: { image: { url: "https://images.pexels.com/photos/776656/pexels-photo-776656.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      items: [
        { _id: "m15", image: { url: "https://images.pexels.com/photos/776656/pexels-photo-776656.jpeg?auto=compress&cs=tinysrgb&w=800" } },
      ],
    },
    productOptions: [],
    variants: [],
    additionalInfoSections: [
      { title: "shortDesc", description: "Digital seasonal capsule edition & VIP member pass." },
    ],
  },
];
