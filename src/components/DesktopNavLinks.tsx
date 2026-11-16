"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DESKTOP_LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/list", label: "Shop" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function DesktopNavLinks() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-semibold text-navy-900"
      aria-label="Main Navigation"
    >
      {DESKTOP_LINKS.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            aria-current={isActive ? "page" : undefined}
            className={`py-1.5 relative group transition-colors ${
              isActive ? "text-brand-600" : "hover:text-brand-600"
            }`}
          >
            {item.label}
            <span
              className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-600 transition-transform origin-left duration-200 ${
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
