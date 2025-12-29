type BadgeVariant = "neutral" | "primary" | "success" | "danger" | "warning";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "border border-neutral-700 bg-neutral-900/80 text-neutral-200",
  primary:
    "border border-brand-500/40 bg-brand-500/10 text-brand-300",
  success:
    "border border-success-500/40 bg-success-500/10 text-success-500",
  danger:
    "border border-danger-500/40 bg-danger-500/10 text-danger-500",
  warning:
    "border border-amber-500/40 bg-amber-500/10 text-amber-300",
};

const Badge = ({ variant = "neutral", className = "", ...props }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

export default Badge;
