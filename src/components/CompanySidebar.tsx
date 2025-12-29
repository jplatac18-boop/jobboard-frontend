// src/components/CompanySidebar.tsx
import { Link, useLocation } from "react-router-dom";

const CompanySidebar = () => {
  const location = useLocation();

  const items = [
    { to: "/company", label: "Mis ofertas" },
    { to: "/company?view=applications", label: "Postulaciones" },
    { to: "/company/profile", label: "Perfil" }, // futura página
  ];

  return (
    <nav className="flex flex-1 flex-col gap-1">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        Empresa
      </p>
      {items.map((item) => {
        const active = location.pathname + location.search === item.to
          || location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`rounded-lg px-2 py-1.5 text-xs transition-colors ${
              active
                ? "bg-brand-500/10 text-brand-300"
                : "text-neutral-300 hover:bg-neutral-800 hover:text-neutral-50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default CompanySidebar;
