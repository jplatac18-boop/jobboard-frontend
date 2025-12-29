import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

const Select = ({
  label,
  error,
  id,
  className = "",
  children,
  ...props
}: SelectProps) => {
  const selectId = id ?? props.name;

  return (
    <div className="w-full text-sm">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1 block text-xs font-medium text-neutral-300"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-md border bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none
          focus:border-brand-500 focus:ring-1 focus:ring-brand-500
          disabled:cursor-not-allowed disabled:opacity-60
          ${
            error ? "border-danger-500" : "border-neutral-700"
          } ${className}`}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-danger-500">{error}</p>
      )}
    </div>
  );
};

export default Select;
