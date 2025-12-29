// src/pages/JobDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { isAuthenticated, isCandidate } from "../services/auth";
import { applyToJob } from "../services/applications";
import Button from "../components/ui/Button";

type Company = {
  id: number;
  name: string;
  location: string;
  website: string;
};

type Job = {
  id: number;
  title: string;
  description: string;
  location: string;
  salary?: string;
  company?: Company | null;
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  const loggedIn = isAuthenticated();
  const candidate = isCandidate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ sin /api, baseURL ya es .../api
        const res = await api.get(`/jobs/${id}/`);
        setJob(res.data);
      } catch {
        setError("Oferta no encontrada.");
        toast.error("No se pudo cargar la oferta.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!loggedIn) {
      toast("Debes iniciar sesión para postularte.", { icon: "🔐" });
      navigate("/login");
      return;
    }
    if (!candidate) {
      const msg = "Solo los candidatos pueden postularse a ofertas.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!id) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await applyToJob(Number(id), coverLetter || "");
      const msg = "Te has postulado correctamente.";
      setMessage(msg);
      toast.success(msg);
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.non_field_errors?.[0] ??
        "No se pudo completar la postulación. Puede que ya te hayas postulado.";
      setError(apiMsg);
      toast.error(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  const company = job?.company ?? null;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        {loading && (
          <p className="mb-4 text-xs text-neutral-400">Cargando oferta...</p>
        )}

        {error && <p className="mb-4 text-sm text-danger-500">{error}</p>}
        {message && (
          <p className="mb-4 text-sm text-success-500">{message}</p>
        )}

        {job && (
          <>
            <h1 className="text-2xl font-bold">{job.title}</h1>

            {company && (
              <p className="mt-1 text-sm text-neutral-300">
                Empresa:{" "}
                <span className="font-medium text-neutral-100">
                  {company.name}
                </span>{" "}
                ·{" "}
                <Link
                  to={`/companies/${company.id}`}
                  className="text-xs text-brand-300 underline underline-offset-2 hover:text-brand-200"
                >
                  Ver más detalles de la empresa
                </Link>
              </p>
            )}

            <p className="mt-2 text-sm text-neutral-300">{job.location}</p>
            {job.salary && (
              <p className="mt-1 text-sm text-brand-300">
                Salario: {job.salary}
              </p>
            )}
            <p className="mt-4 whitespace-pre-line text-sm text-neutral-200">
              {job.description}
            </p>

            {candidate && (
              <section className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
                <h2 className="mb-2 text-sm font-semibold text-neutral-100">
                  Carta de presentación (opcional)
                </h2>
                <textarea
                  className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100
                             outline-none placeholder:text-neutral-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />

                <Button
                  onClick={handleApply}
                  disabled={loading}
                  variant="primary"
                  className="mt-3 px-4 py-2 text-sm"
                >
                  {loading ? "Enviando..." : "Postularme"}
                </Button>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default JobDetail;
