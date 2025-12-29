type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "soft";
};

const Card = ({ variant = "default", className = "", ...props }: CardProps) => {
  const base =
    "rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 shadow-md shadow-neutral-950/40 " +
    "transition-colors transition-transform hover:-translate-y-0.5 hover:border-brand-500/80";

  const soft =
    "rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 shadow-sm shadow-neutral-950/30 " +
    "transition-colors";

  const styles = variant === "default" ? base : soft;

  return <div className={`${styles} ${className}`} {...props} />;
};

export default Card;
