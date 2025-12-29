// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { type FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = Boolean(token && user);
  const [globalSearch, setGlobalSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGlobalSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = globalSearch.trim();
    if (!query) {
      navigate("/");
      return;
    }
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm text-neutral-100">
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight transition-colors hover:text-brand-400"
        >
          JobBoard
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4">
          <Link
            to="/"
            className="hidden text-neutral-300 transition-colors hover:text-brand-300 sm:inline"
          >
            Ofertas
          </Link>

          <Link
            to="/help"
            className="hidden text-neutral-300 transition-colors hover:text-brand-300 sm:inline"
          >
            Ayuda
          </Link>

          {isAuthenticated && user?.role === "CANDIDATE" && (
            <Link
              to="/applications"
              className="hidden text-neutral-300 transition-colors hover:text-brand-300 sm:inline"
            >
              Mis postulaciones
            </Link>
          )}

          {isAuthenticated && user?.role === "COMPANY" && (
            <Link
              to="/company"
              className="hidden text-neutral-300 transition-colors hover:text-brand-300 sm:inline"
            >
              Panel empresa
            </Link>
          )}

          {isAuthenticated && user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="hidden text-neutral-300 transition-colors hover:text-brand-300 sm:inline"
            >
              Admin
            </Link>
          )}

          {/* Buscador global */}
          <form
            onSubmit={handleGlobalSearchSubmit}
            className="hidden items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-300 focus-within:border-brand-500 sm:flex"
          >
            <span className="text-neutral-500">🔍</span>
            <input
              type="text"
              placeholder="Buscar ofertas..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-40 bg-transparent text-xs text-neutral-100 outline-none placeholder:text-neutral-500"
            />
          </form>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-neutral-300 transition-colors hover:text-brand-300"
              >
                Ingresar
              </Link>

              <Link to="/register">
                <Button
                  variant="primary"
                  className="px-3 py-1 text-xs"
                >
                  Crear cuenta
                </Button>
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-xs text-neutral-400 sm:inline">
                {user?.username} ({user?.role})
              </span>

              <Button
                variant="ghost"
                className="px-3 py-1 text-xs"
                onClick={handleLogout}
              >
                Salir
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
