import { collections } from "@wix/stores";
import { ALL_PRODUCTS_CATEGORY_ID, ENV } from "./env";

export const FALLBACK_COLLECTIONS: collections.Collection[] = [
  {
    _id: ALL_PRODUCTS_CATEGORY_ID,
    name: "All Products",
    slug: "all-products",
    description: "Explore our complete curated collection of modern essentials.",
    media: {
      mainMedia: {
        image: {
          url: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
      },
    },
  },
  {
    _id: ENV.FEATURED_CATEGORY_ID,
    name: "Featured Collection",
    slug: "featured",
    description: "Hand-picked seasonal pieces designed for effortless sophistication.",
    media: {
      mainMedia: {
        image: {
          url: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
      },
    },
  },
  {
    _id: "cat-apparel-001",
    name: "Outerwear & Apparel",
    slug: "apparel",
    description: "Tailored silhouettes crafted from breathable, premium fabrics.",
    media: {
      mainMedia: {
        image: {
          url: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
      },
    },
  },
  {
    _id: "cat-accessories-002",
    name: "Leather & Accessories",
    slug: "accessories",
    description: "Minimalist bags, eyewear, and everyday carry essentials.",
    media: {
      mainMedia: {
        image: {
          url: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
      },
    },
  },
  {
    _id: "cat-footwear-003",
    name: "Artisan Footwear",
    slug: "footwear",
    description: "Engineered comfort meets timeless Italian-inspired design.",
    media: {
      mainMedia: {
        image: {
          url: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
      },
    },
  },
  {
    _id: "cat-timepieces-004",
    name: "Modern Timepieces",
    slug: "watches",
    description: "Precision chronographs and minimalist dress watches.",
    media: {
      mainMedia: {
        image: {
          url: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
      },
    },
  },
];
