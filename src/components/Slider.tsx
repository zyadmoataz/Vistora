"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Badge from "./ui/Badge";
import { ChevronLeftIcon, ChevronRightIcon } from "./ui/Icons";

const SLIDES = [
  {
    id: 1,
    eyebrow: "AUTUMN / WINTER ATELIER",
    title: "Architectural Silhouettes",
    description:
      "Tailored double-faced cashmere coats and Italian leather essentials — up to 35% off seasonal archive pieces.",
    img: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/list?cat=apparel",
    secondaryUrl: "/deals",
    bg: "from-brand-50/90 via-white to-navy-50/70",
  },
  {
    id: 2,
    eyebrow: "ITALIAN LEATHER GOODS",
    title: "Crafted for the Journey",
    description:
      "Full-grain vegetable-tanned weekenders, minimalist eyewear, and precision mechanical chronographs.",
    img: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/list?cat=accessories",
    secondaryUrl: "/list",
    bg: "from-navy-50/80 via-white to-brand-50/60",
  },
  {
    id: 3,
    eyebrow: "ENGINEERED COMFORT",
    title: "Modern Urban Movement",
    description:
      "Breathable Merino-knit footwear and transitional overshirts designed for effortless daily wear.",
    img: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/list?cat=footwear",
    secondaryUrl: "/deals",
    bg: "from-slate-100 via-white to-navy-50/70",
  },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prevSlide = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  const nextSlide = () => setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((curr) => (curr === SLIDES.length - 1 ? 0 : curr + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      aria-label="Featured Collections Carousel"
      className="relative w-full overflow-hidden h-[calc(100vh-112px)] min-h-[540px] max-h-[780px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      }}
    >
      <div
        className="w-full h-full flex transition-transform duration-700 ease-spring will-change-transform"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide, idx) => {
          const HeadingTag = idx === 0 ? "h1" : "h2";
          return (
            <div className={`bg-gradient-to-br ${slide.bg} min-w-full w-full shrink-0 h-full flex flex-col lg:flex-row`} key={slide.id}>
              <div className="h-1/2 lg:h-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
                <div className="max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6">
                  <Badge variant="brandSoft" className="uppercase tracking-widest py-1.5 px-3.5">{slide.eyebrow}</Badge>
                  <HeadingTag className="text-3xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-navy-950 leading-[1.1]">{slide.title}</HeadingTag>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-lg">{slide.description}</p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
                    <Link href={slide.url} className="rounded-full bg-brand-600 text-white px-7 py-3.5 text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm">Shop Collection</Link>
                    <Link href={slide.secondaryUrl} className="rounded-full bg-white text-navy-950 ring-1 ring-slate-300 px-6 py-3.5 text-sm font-semibold hover:ring-navy-950 transition-all">View Archive Deals</Link>
                  </div>
                </div>
              </div>
              <div className="h-1/2 lg:h-full lg:w-1/2 relative overflow-hidden">
                <Image src={slide.img} alt={slide.title} className="object-cover object-center" fill sizes="(max-width: 1024px) 100vw, 50vw" priority={idx === 0} loading={idx === 0 ? "eager" : "lazy"} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-5 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-soft border border-slate-200/90">
        <button type="button" onClick={prevSlide} aria-label="Previous slide" className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full text-navy-900 hover:bg-slate-100 transition-colors">
          <ChevronLeftIcon className="w-3.5 h-3.5" />
        </button>
        {SLIDES.map((slide, index) => (
          <button
            type="button"
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            aria-current={current === index ? "true" : undefined}
            className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full"
            key={slide.id}
            onClick={() => setCurrent(index)}
          >
            <span className={`h-2.5 rounded-full transition-all duration-300 block ${current === index ? "w-7 bg-brand-600" : "w-2.5 bg-slate-400 hover:bg-slate-600"}`} />
          </button>
        ))}
        <button type="button" onClick={nextSlide} aria-label="Next slide" className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full text-navy-900 hover:bg-slate-100 transition-colors">
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
