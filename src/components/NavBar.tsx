import Link from "next/link";
import React, { Suspense } from "react";
import BrandLogo from "./ui/BrandLogo";
import DesktopNavLinks from "./DesktopNavLinks";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import NavIcons from "./NavIcons";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 glass-panel transition-all">
      <div className="bg-navy-950 text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
        <span>Complimentary Express Global Shipping on Orders Over $150</span>
        <span className="hidden sm:inline text-brand-300 mx-2">•</span>
        <Link
          href="/deals"
          className="hidden sm:inline text-brand-200 underline hover:text-white ml-1 font-semibold"
        >
          Explore Seasonal Archive Up to 35% Off
        </Link>
      </div>

      <div className="h-20 container-shell relative">
        {/* MOBILE */}
        <div className="flex justify-between items-center h-full md:hidden">
          <Link href="/" aria-label="Vistora Atelier Home" className="shrink-0">
            <BrandLogo />
          </Link>
          <Suspense fallback={<div className="w-24 h-9" />}>
            <Menu />
          </Suspense>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex justify-between items-center h-full gap-6 lg:gap-8">
          <div className="flex items-center gap-7 xl:gap-10">
            <Link href="/" aria-label="Vistora Atelier Home" className="shrink-0">
              <BrandLogo />
            </Link>
            <DesktopNavLinks />
          </div>

          <div className="flex items-center justify-end gap-4 xl:gap-5 flex-1 max-w-2xl">
            <Suspense fallback={<div className="flex-1 h-10 bg-slate-100 rounded-full max-w-md" />}>
              <SearchBar />
            </Suspense>
            <NavIcons />
          </div>
        </div>
      </div>
    </header>
  );
}
