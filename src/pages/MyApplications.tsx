// src/pages/MyApplications.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import {
  getMyApplications,
  type Application,
  type ApplicationStatus,
} from "../services/applications";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import ApplicationSkeleton from "../components/skeletons/ApplicationSkeleton";

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(""); // "", "PENDING", "ACCEPTED", "REJECTED"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = async (status?: ApplicationStatus) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyApplications(status);
      setApplications(data.results);
      if (data.results.length === 0) {
        toast("No tienes postulaciones para este estado.", { icon: "ℹ️" });
      }
    } catch {
      const msg = "No se pudieron cargar tus postulaciones.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    loadApplications(
      value === "" ? undefined : (value as ApplicationStatus)
    );
  };

  const renderStatus = (status: Application["status"]) => {
    if (status === "PENDING") return "Pendiente";
    if (status === "ACCEPTED") return "Aceptada";
    return "Rechazada";
  };

  const getBadgeVariant = (status: Application["status"]) => {
    if (status === "PENDING") return "primary" as const;
    if (status === "ACCEPTED") return "success" as const;
    return "danger" as const;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold">Mis postulaciones</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Aquí puedes ver el estado de las ofertas a las que te has postulado.
        </p>

        <div className="mt-4 flex items-center gap-3 text-xs">
          <span className="text-neutral-300">Filtrar por estado:</span>
          <div className="w-40">
            <Select
              name="statusFilter"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="ACCEPTED">Aceptada</option>
              <option value="REJECTED">Rechazada</option>
            </Select>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-xs text-danger-500">
            {error}
          </p>
        )}

        {/* Skeletons mientras carga */}
        {loading && !error && (
          <ul className="mt-4 space-y-3 text-xs">
            {Array.from({ length: 3 }).map((_, idx) => (
              <li key={idx}>
                <ApplicationSkeleton />
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && (
          <ul className="mt-4 space-y-3 text-xs">
            {applications.map((app) => (
              <li
                key={app.id}
                className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-100">
                      {app.job.title} ({app.job.location})
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-neutral-300">
                      Estado:
                      <Badge variant={getBadgeVariant(app.status)}>
                        {renderStatus(app.status)}
                      </Badge>
                    </p>
                  </div>
                </div>

                {app.cover_letter && (
                  <p className="mt-2 whitespace-pre-line text-neutral-200">
                    {app.cover_letter}
                  </p>
                )}

                <p className="mt-2 text-neutral-400">
                  Fecha: {new Date(app.created_at).toLocaleString()}
                </p>
              </li>
            ))}

            {applications.length === 0 && (
              <p className="text-xs text-neutral-400">
                No tienes postulaciones para este estado.
              </p>
            )}
          </ul>
        )}
      </main>
    </div>
  );
};

export default MyApplications;
