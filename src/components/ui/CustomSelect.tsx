"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "./Icons";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string, name?: string) => void;
  ariaLabel?: string;
  variant?: "pill" | "field";
  className?: string;
}

export default function CustomSelect({
  id,
  name,
  value,
  options,
  onChange,
  ariaLabel,
  variant = "pill",
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === value))
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const chosen = options[activeIndex];
      if (chosen) onChange(chosen.value, name);
      setOpen(false);
    }
  };

  const triggerStyles =
    variant === "pill"
      ? "py-2.5 px-4 rounded-full text-xs font-semibold bg-white text-navy-950 ring-1 ring-slate-200 hover:ring-slate-300"
      : "py-3 px-4 rounded-xl text-sm font-medium bg-white text-navy-950 ring-1 ring-slate-300 hover:ring-slate-400 w-full";

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} className={`relative inline-block ${variant === "field" ? "w-full" : ""} ${className}`}>
      <button
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-3 transition-all outline-none ${triggerStyles} ${
          open ? "ring-2 ring-brand-600 bg-white" : ""
        }`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-600 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-brand-600" : ""}`} />
      </button>

      {open && (
        <ul role="listbox" aria-label={ariaLabel} className="absolute left-0 mt-2 min-w-[210px] w-full rounded-2xl bg-white border border-slate-200/90 shadow-elevated p-1.5 z-50 flex flex-col gap-0.5 animate-fade-in-up">
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isFocused = idx === activeIndex;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    onChange(opt.value, name);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-brand-50 text-brand-700 font-semibold"
                      : isFocused
                      ? "bg-slate-100 text-navy-950 font-medium"
                      : "text-slate-700 hover:bg-slate-100 hover:text-navy-950 font-medium"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <CheckIcon className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
