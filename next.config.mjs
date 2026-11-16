const isProd = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

const CSP_DIRECTIVES = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}${isVercel ? " https://vercel.live" : ""}`,
  `style-src 'self' 'unsafe-inline'${isVercel ? " https://vercel.live" : ""}`,
  `img-src 'self' data: https://images.pexels.com https://pexels.com https://images.unsplash.com https://static.wixstatic.com${isVercel ? " https://vercel.live https://vercel.com" : ""}`,
  `font-src 'self' data:${isVercel ? " https://vercel.live https://assets.vercel.com" : ""}`,
  `connect-src 'self' https://www.wixapis.com https://*.wix.com https://*.wixapis.com https://*.wixstudio.com${isVercel ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src 'self' https://*.wix.com https://*.wixsite.com https://*.wixstudio.com${isVercel ? " https://vercel.live" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
