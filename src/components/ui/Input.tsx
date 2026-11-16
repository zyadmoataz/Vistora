import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightAdornment?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export default function Input({
  id,
  label,
  error,
  rightAdornment,
  rightAction,
  className = "",
  ...rest
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {(label || rightAction) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label htmlFor={id} className="text-xs font-semibold text-slate-700">
              {label}
            </label>
          )}
          {rightAction}
        </div>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          aria-invalid={error ? "true" : undefined}
          className={`w-full ring-1 ring-slate-300 focus:ring-2 focus:ring-brand-600 rounded-xl px-4 py-3 text-sm text-navy-950 placeholder:text-slate-500 bg-white outline-none transition-shadow ${
            rightAdornment ? "pr-11" : ""
          } ${className}`}
          {...rest}
        />
        {rightAdornment && (
          <div className="absolute right-3 flex items-center">{rightAdornment}</div>
        )}
      </div>
      {error && <span className="text-xs font-medium text-red-700">{error}</span>}
    </div>
  );
}
