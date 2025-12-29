// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { login as loginService } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

type JwtPayload = {
  user_id?: number;
  username?: string;
  email?: string;
  role?: string;
  exp: number;
  iat: number;
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // login(accessToken, user)

  const validateUsername = (value: string) => {
    if (!value.trim()) return "El usuario es obligatorio.";
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return "La contraseña es obligatoria.";
    return null;
  };

  const validateAll = () => {
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);

    setUsernameError(uErr);
    setPasswordError(pErr);

    return !uErr && !pErr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setUsernameError(null);
    setPasswordError(null);

    if (!validateAll()) {
      setFormError("Revisa los campos marcados en rojo.");
      toast.error("Revisa los campos marcados en rojo.");
      setLoading(false);
      return;
    }

    try {
      const data = await loginService(username, password);
      const payload = data as { access: string; refresh: string };

      if (!payload || typeof payload !== "object" || !payload.access) {
        throw new Error("Respuesta de login inválida");
      }

      const accessToken = payload.access;
      const decoded = jwtDecode<JwtPayload>(accessToken);

      const normalizedRole =
        typeof decoded.role === "string"
          ? decoded.role.toUpperCase()
          : "CANDIDATE";

      const userId = decoded.user_id ?? 0;

      const user = {
        id: userId,
        username: decoded.username ?? username,
        email: decoded.email,
        role: normalizedRole as any,
      };

      // aquí usamos el login del contexto: (token, user)
      login(accessToken, user);
      toast.success("Bienvenido de nuevo.");

      if (normalizedRole === "ADMIN") {
        navigate("/admin");
      } else if (normalizedRole === "COMPANY") {
        navigate("/company");
      } else {
        navigate("/applications");
      }
    } catch (e: any) {
      console.error(
        "LOGIN ERROR =>",
        e?.response?.status,
        e?.response?.data || e
      );

      let message = "Credenciales inválidas o error en el servidor.";

      if (e?.response?.status === 403) {
        message = "Tu empresa está bloqueada por el administrador.";
      } else if (e?.response?.data?.detail) {
        message = String(e.response.data.detail);
      } else if (typeof e?.message === "string") {
        message = e.message;
      }

      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="flex w-full justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-lg shadow-neutral-950/40">
          <h1 className="font-display text-xl font-bold">Iniciar sesión</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Usa tu usuario y contraseña registrados en la plataforma.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Input
              label="Usuario"
              name="username"
              value={username}
              onChange={(e) => {
                const value = e.target.value;
                setUsername(value);
                setUsernameError(validateUsername(value));
              }}
              error={usernameError || undefined}
              required
              autoComplete="username"
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setPasswordError(validatePassword(value));
              }}
              error={passwordError || undefined}
              required
              autoComplete="current-password"
            />

            {formError && (
              <p className="mt-2 text-xs text-danger-500">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="mt-2 w-full py-2.5 text-sm"
            >
              {loading && (
                <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <div className="mt-4 space-y-1 text-xs text-neutral-400">
            <p>
              ¿Eres candidato?{" "}
              <Link
                to="/register"
                className="text-brand-400 hover:text-brand-300 hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
            <p>
              ¿Eres empresa?{" "}
              <Link
                to="/register-company"
                className="text-brand-400 hover:text-brand-300 hover:underline"
              >
                Crea una cuenta de empresa
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
