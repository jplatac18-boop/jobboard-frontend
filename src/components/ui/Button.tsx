// src/components/ui/Button.tsx
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium " +
    "transition-colors transition-transform focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 " +
    "disabled:opacity-60 disabled:cursor-not-allowed active:scale-95";

  const styles =
    variant === "primary"
      ? // igual que tu botón “Crear cuenta”
        "bg-brand-500 text-white hover:bg-brand-400 hover:scale-[1.03]"
      : variant === "secondary"
      ? // similar a botón de acción secundaria en paneles
        "bg-accent-500 text-white hover:bg-accent-600 hover:scale-[1.03]"
      : // estilo parecido al botón “Salir”: borde neutro y hover oscuro
        "border border-neutral-600 bg-transparent text-neutral-100 " +
        "hover:bg-neutral-800 hover:border-brand-500 hover:scale-[1.02]";

  return (
    <button className={`${base} ${styles} ${className}`} {...props} />
  );
}

export default Button;
