import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] shadow-sm",
  secondary: "bg-navy-950 text-white hover:bg-brand-600 active:scale-[0.98] shadow-sm",
  outline: "bg-white text-navy-950 ring-1 ring-slate-300 hover:ring-navy-950 hover:bg-slate-50 active:scale-[0.98]",
  ghost: "bg-transparent text-slate-700 hover:text-navy-950 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs font-semibold rounded-full",
  md: "px-6 py-3 text-xs sm:text-sm font-semibold rounded-full",
  lg: "px-7 py-3.5 text-sm font-semibold rounded-full",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 ease-spring disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
