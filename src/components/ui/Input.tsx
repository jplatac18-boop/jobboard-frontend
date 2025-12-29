// src/components/ui/Input.tsx
import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: ReactNode;
};

const Input = ({
  label,
  error,
  helperText,
  iconLeft,
  id,
  className = "",
  ...props
}: InputProps) => {
  const inputId = id ?? props.name;

  return (
    <div className="w-full text-sm">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-xs font-medium text-neutral-300"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <span className="pointer-events-none absolute left-2 text-neutral-500">
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full rounded-md border bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none
            placeholder:text-neutral-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500
            disabled:cursor-not-allowed disabled:opacity-60
            ${iconLeft ? "pl-8" : ""} ${
            error ? "border-danger-500" : "border-neutral-700"
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {helperText && !error && (
        <p className="mt-1 text-xs text-neutral-400">{helperText}</p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-danger-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
