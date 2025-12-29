import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { registerCandidate } from "../services/auth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const RegisterCandidate = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (value: string) => {
    if (!value.trim()) return "El usuario es obligatorio.";
    if (value.length < 3) return "El usuario debe tener al menos 3 caracteres.";
    return null;
  };

  const validateFullName = (value: string) => {
    if (!value.trim()) return "El nombre completo es obligatorio.";
    if (value.length < 3) return "El nombre completo es demasiado corto.";
    return null;
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return "El correo es obligatorio.";
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(value)) return "El correo no tiene un formato válido.";
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return "La contraseña es obligatoria.";
    if (value.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }
    return null;
  };

  const validateAll = () => {
    const uErr = validateUsername(username);
    const fErr = validateFullName(fullName);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    setUsernameError(uErr);
    setFullNameError(fErr);
    setEmailError(eErr);
    setPasswordError(pErr);

    return !uErr && !fErr && !eErr && !pErr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      setFormError("Revisa los campos marcados en rojo.");
      toast.error("Revisa los campos marcados en rojo.");
      return;
    }

    try {
      setLoading(true);
      setFormError(null);

      await registerCandidate({
        username,
        full_name: fullName,
        email,
        password,
      });

      toast.success("Cuenta de candidato creada correctamente.");
      navigate("/login");
    } catch (err: any) {
      const data = err?.response?.data;
      const message =
        data?.username?.[0] ||
        data?.email?.[0] ||
        "No se pudo completar el registro.";

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
        <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-lg shadow-neutral-950/40">
          <h1 className="font-display text-xl font-bold">
            Registrarse como candidato
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Crea tu cuenta para poder postularte a ofertas.
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
            />

            <Input
              label="Nombre completo"
              name="fullName"
              value={fullName}
              onChange={(e) => {
                const value = e.target.value;
                setFullName(value);
                setFullNameError(validateFullName(value));
              }}
              error={fullNameError || undefined}
              required
            />

            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                setEmailError(validateEmail(value));
              }}
              error={emailError || undefined}
              required
              autoComplete="email"
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
              autoComplete="new-password"
            />

            {formError && (
              <p className="text-xs text-danger-500">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="mt-2 w-full py-2.5 text-sm"
            >
              {loading && (
                <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {loading ? "Creando cuenta..." : "Registrarme"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterCandidate;
