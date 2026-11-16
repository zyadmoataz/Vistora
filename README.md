# Vistora Atelier

Headless e-commerce storefront built with **Next.js 14 (App Router)**, **Strict TypeScript**, **Wix Headless SDK (`@wix/stores`, `@wix/ecom`, `@wix/sdk`)**, **Zustand**, and **Tailwind CSS**.

Designed around **SOLID / DRY** modularity, predictable state boundaries, client security controls, and fast Core Web Vitals. Every source module under `src/` adheres to single-responsibility separation (`<= 150` lines per file).

---

## Core Capabilities

- **Catalog Discovery & URL-Synchronized Filtering**
  - Server-rendered product and collection pages (`/`, `/list`, `/deals`, `/[slug]`) backed by an in-memory TTL cache and timeout-guarded Wix Headless queries with local catalog fallback (`src/services/catalogService.ts`).
  - Debounced price range inputs, accessible custom dropdown selectors (`CustomSelect`), live autocomplete search (`SearchBar`), multi-criteria sorting, and pagination.
- **Product Detail Experience (`/[slug]`)**
  - Interactive image gallery, variant stock matrix (`CustomizeProducts`), guarded bag actions (`useGuardedCartAction`), Web Share / link copy, related products shelf, JSON-LD `Product` structured data, and persistent client reviews (`ProductReviews`).
- **Authentication, Session Isolation & Checkout**
  - Genuine Wix OAuth Member login, registration, email verification, and password reset (`authService.ts`), plus an optional Login-only Demo VIP reviewer shortcut controlled by `NEXT_PUBLIC_DEMO_MODE`.
  - Cart items (`vistora_cart_v2_<email>`), order history (`vistora_orders_v2_<email>`), and saved wishlist persist in scoped browser storage and reset cleanly on sign-out (`useSessionSync`, `useAuthStore`).
  - Express Cart dropdown (`CartModal`) and full Checkout view (`/cart`) supporting promo code `VISTORA20` via a unified frontend checkout helper (`checkoutHelper.ts`).
- **Resilience, Security & Accessibility**
  - Global error boundary with telemetry adapter (`logger.ts`), custom 404 page, Suspense skeletons, offline network banner (`NetworkStatusBanner`), WCAG AA contrast palette, skip-to-content navigation, and SVG vector iconography (`BrandLogo`, `Icons`, `BrandSVGs`).

---

## Architecture & Security Overview

### Directory Layout

```text
src/
├── app/            # Next.js 14 App Router pages, metadata layouts, icon.svg, manifest, sitemap, robots
├── components/     # Feature UI & shared primitives under components/ui/ (Button, Badge, Input, CustomSelect, Icons)
├── context/        # Wix SDK client provider (client OAuth token hydration)
├── hooks/          # Zustand stores (useAuthStore, useCartStore, useWishlistStore, useToastStore) & shared hooks
├── lib/            # Pure domain & security helpers (securityHelpers, sanitizeHtml, checkoutHelper, cartHelpers, env, logger)
├── services/       # Wix & catalog filtering services (catalogService, catalogFilterHelper, authService)
└── middleware.ts   # Visitor OAuth token provisioning excluding static assets and SEO metadata routes
tests/              # TypeScript unit & store integration tests using Node's built-in test runner (node:test)
```

### Security Controls
- **HTML / XSS Defense**: All external HTML descriptions pass through strict `DOMPurify` tag/attribute allowlists (`src/lib/sanitizeHtml.ts`); inputs are sanitized via `sanitizePlainText` and structured data JSON-LD escapes `<`, `>`, and `&` (`serializeJsonLd`).
- **Redirect & Cookie Hygiene**: Auth redirects validate internal relative paths only (`isSafeRedirectPath`); OAuth tokens apply `SameSite=Lax` and conditional `Secure` flags on HTTPS.
- **HTTP Response Headers (`next.config.mjs`)**: Configures `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.
- **Zero Committed Secrets**: Live Wix storefront identifiers stay strictly in local/deployment environment variables (`.env` is gitignored); repository defaults contain safe non-functional placeholders.

### Architecture Scope & Enterprise Upgrade Path
Because this repository targets a self-contained frontend storefront without custom backend API routes:
- Order totals and promo evaluation execute client-side (`checkoutHelper.ts`) and persist in user-scoped `localStorage`. In a real-money deployment, wire checkout confirmation to **Wix Hosted Checkout redirects** (`@wix/ecom`) or server payment intents/webhooks (e.g., Stripe) to enforce authoritative server pricing and inventory locking.
- Offline credential fallback is governed by `NEXT_PUBLIC_DEMO_MODE`. Set `NEXT_PUBLIC_DEMO_MODE=false` in production deployments so only verified OAuth sessions authenticate.

---

## Application Routes

| Route | Access | Purpose |
| :--- | :--- | :--- |
| `/` | Public | Editorial hero slider, value strip, featured edit, categories, and new arrivals |
| `/list` | Public | Filterable, searchable, paginated catalog explorer |
| `/[slug]` | Public | Product gallery, variant selector, stock status, client reviews, and related items |
| `/deals` | Public | Discounted seasonal archive showcase (`VISTORA20`) |
| `/wishlist` | Public | Saved items list with Move-to-Bag action |
| `/about` | Public | Brand story, material provenance, and atelier craftsmanship (`#craftsmanship`) |
| `/faq` | Public | Shipping, 30-day returns, and privacy/security policy (`#legal`) |
| `/contact` | Public | Validated concierge inquiry form |
| `/login` | Public | Sign In, Sign Up (`?mode=register`), password reset, and verification |
| `/cart` | Authenticated | Full shopping bag, promo calculator, and checkout (`noindex`) |
| `/success` | Authenticated | Order confirmation receipt with copyable reference ID (`noindex`) |
| `/profile` | Authenticated | Scoped order history, wishlist access, and account preferences (`noindex`) |

---

## Environment Variables

Copy the template file and populate values from your Wix Headless project settings:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_WIX_CLIENT_ID` | Yes (Live Wix) | OAuth Client ID from Wix Headless settings |
| `NEXT_PUBLIC_WIX_APP_ID` | Yes (Live Wix) | Wix Stores App ID (`@wix/ecom` catalog reference) |
| `FEATURED_PRODUCTS_CATEGORY_ID` | Optional | Collection ID rendered in the Homepage Featured grid |
| `NEXT_PUBLIC_DEMO_MODE` | Optional | Defaults to `true`; set to `"false"` in production to disable offline demo login fallback |

---

## Getting Started & Quality Gates

Requires **Node.js 20+** (tested on **Node.js 22 LTS**).

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Verification checks (also enforced via .github/workflows/ci.yml)
npm run lint        # ESLint (next/core-web-vitals)
npm run typecheck   # Strict TypeScript compiler check (tsc --noEmit)
npm test            # Unit & store isolation test suite (node:test)
npm run build       # Production Next.js optimization build
npm run start       # Serve production build locally
```
