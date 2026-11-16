import React from "react";

export function SocialMediaLinks() {
  const socials = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.5 9H16l-.5 3h-2v9h-3.5v-9H8V9h2V7.2C10 4.6 11.4 3 14.3 3c1.1 0 2 .1 2.2.1v2.6h-1.4c-1.2 0-1.6.6-1.6 1.6V9Z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
        </svg>
      ),
    },
    {
      name: "X",
      href: "https://x.com",
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex gap-3 pt-1">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit Vistora on ${s.name}`}
          className="w-10 h-10 rounded-full bg-white text-navy-900 ring-1 ring-slate-200/90 shadow-sm flex items-center justify-center hover:ring-brand-600 hover:bg-brand-50 hover:text-brand-600 transition-all"
        >
          {s.svg}
        </a>
      ))}
    </div>
  );
}

export function PaymentBadges() {
  return (
    <div
      aria-label="Accepted payment methods: Visa, Mastercard, PayPal, Discover, Apple Pay"
      className="flex flex-wrap items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl ring-1 ring-slate-200/90 shadow-sm w-max max-w-full"
    >
      {/* VISA */}
      <svg className="h-5 w-9" viewBox="0 0 48 28" aria-label="Visa" role="img">
        <rect width="48" height="28" rx="5" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="24" y="18.5" textAnchor="middle" fill="#1E3A8A" fontSize="11" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">VISA</text>
      </svg>
      {/* MASTERCARD */}
      <svg className="h-5 w-9" viewBox="0 0 48 28" aria-label="Mastercard" role="img">
        <rect width="48" height="28" rx="5" fill="#F8FAFC" stroke="#E2E8F0" />
        <circle cx="19.5" cy="14" r="6.5" fill="#EB001B" />
        <circle cx="28.5" cy="14" r="6.5" fill="#F79E1B" fillOpacity="0.88" />
      </svg>
      {/* PAYPAL */}
      <svg className="h-5 w-11" viewBox="0 0 56 28" aria-label="PayPal" role="img">
        <rect width="56" height="28" rx="5" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="28" y="18" textAnchor="middle" fill="#003087" fontSize="10" fontWeight="800" fontFamily="sans-serif">Pay<tspan fill="#0079C1">Pal</tspan></text>
      </svg>
      {/* AMEX */}
      <svg className="h-5 w-10" viewBox="0 0 50 28" aria-label="American Express" role="img">
        <rect width="50" height="28" rx="5" fill="#016FD0" />
        <text x="25" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.4">AMEX</text>
      </svg>
      {/* APPLE PAY */}
      <svg className="h-5 w-10" viewBox="0 0 50 28" aria-label="Apple Pay" role="img">
        <rect width="50" height="28" rx="5" fill="#0F172A" />
        <text x="25" y="17.5" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="sans-serif">Pay</text>
      </svg>
    </div>
  );
}
