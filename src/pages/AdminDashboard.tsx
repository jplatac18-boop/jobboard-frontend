// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import {
  getAdminCompanies,
  getAdminJobs,
  toggleJobActive,
  toggleCompanyActive,
  type AdminCompany,
} from "../services/admin";
import type { Job } from "../services/jobs";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";

const pageSize = 5;

const AdminDashboard = () => {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // filtros / orden / paginación empresas
  const [companySearch, setCompanySearch] = useState("");
  const [companyStatus, setCompanyStatus] = useState<
    "ALL" | "ACTIVE" | "BLOCKED"
  >("ALL");
  const [companyOrder, setCompanyOrder] = useState<
    "NAME_ASC" | "NAME_DESC"
  >("NAME_ASC");
  const [companyPage, setCompanyPage] = useState(1);

  // paginación ofertas
  const [jobPage, setJobPage] = useState(1);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [companiesRes, jobsRes] = await Promise.all([
        getAdminCompanies(),
        getAdminJobs(),
      ]);

      const companiesArray = Array.isArray(companiesRes)
        ? companiesRes
        : (companiesRes as any).results ?? [];

      const jobsArray = Array.isArray(jobsRes)
        ? jobsRes
        : (jobsRes as any).results ?? [];

      setCompanies(companiesArray);
      setJobs(jobsArray);
      setLastUpdated(new Date());
      toast.success("Datos de administración actualizados.");
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar la información de admin.");
      setCompanies([]);
      setJobs([]);
      toast.error("No se pudo cargar la información de admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleJob = async (job: Job) => {
    try {
      const updated = await toggleJobActive(job.id);
      setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));

      toast.success(
        updated.is_active
          ? "Oferta activada/publicada."
          : "Oferta desactivada."
      );
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar el estado de la oferta.");
    }
  };

  const handleToggleCompany = async (company: AdminCompany) => {
    try {
      const updated = await toggleCompanyActive(company.id);
      setCompanies((prev) =>
        prev.map((c) => (c.id === company.id ? updated : c))
      );

      toast.success(
        updated.is_active ? "Empresa desbloqueada." : "Empresa bloqueada."
      );
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar el estado de la empresa.");
    }
  };

  // --- filtros y paginación empresas ---
  const filteredCompanies = companies.filter((c) => {
    const matchesName = c.name
      .toLowerCase()
      .includes(companySearch.toLowerCase());

    const matchesStatus =
      companyStatus === "ALL"
        ? true
        : companyStatus === "ACTIVE"
        ? c.is_active
        : !c.is_active;

    return matchesName && matchesStatus;
  });

  const orderedCompanies = [...filteredCompanies].sort((a, b) => {
    if (companyOrder === "NAME_ASC") {
      return a.name.localeCompare(b.name);
    }
    return b.name.localeCompare(a.name);
  });

  const totalCompanyPages = Math.max(
    1,
    Math.ceil(orderedCompanies.length / pageSize)
  );

  const paginatedCompanies = orderedCompanies.slice(
    (companyPage - 1) * pageSize,
    companyPage * pageSize
  );

  useEffect(() => {
    setCompanyPage(1);
  }, [companySearch, companyStatus, companyOrder]);

  // --- paginación ofertas ---
  const totalJobPages = Math.max(1, Math.ceil(jobs.length / pageSize));

  const paginatedJobs = jobs.slice(
    (jobPage - 1) * pageSize,
    jobPage * pageSize
  );

  const getLastUpdatedLabel = () => {
    if (!lastUpdated) return "Nunca";
    const diffMs = Date.now() - lastUpdated.getTime();
    const diffSec = Math.round(diffMs / 1000);
    if (diffSec < 60) return `hace ${diffSec} s`;
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return `hace ${diffMin} min`;
    const diffHours = Math.round(diffMin / 60);
    return `hace ${diffHours} h`;
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">
              Panel de administración
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Modera empresas y ofertas publicadas en la plataforma.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Última actualización: {getLastUpdatedLabel()}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 text-xs"
          >
            {loading ? "Actualizando..." : "Refrescar datos"}
          </Button>
        </div>

        {loading && (
          <p className="mt-4 text-xs text-neutral-400">
            Cargando información...
          </p>
        )}

        {error && (
          <p className="mt-4 text-xs text-danger-500">{error}</p>
        )}

        {!loading && !error && (
          <section className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Empresas */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-neutral-100">
                  Empresas
                </h2>
              </div>

              <div className="mb-3 flex gap-2 text-xs">
                <Input
                  name="companySearch"
                  label="Buscar por nombre"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="flex-1"
                />
                <Select
                  name="companyStatus"
                  label="Estado"
                  value={companyStatus}
                  onChange={(e) =>
                    setCompanyStatus(
                      e.target.value as "ALL" | "ACTIVE" | "BLOCKED"
                    )
                  }
                >
                  <option value="ALL">Todas</option>
                  <option value="ACTIVE">Activas</option>
                  <option value="BLOCKED">Bloqueadas</option>
                </Select>
                <Select
                  name="companyOrder"
                  label="Orden"
                  value={companyOrder}
                  onChange={(e) =>
                    setCompanyOrder(
                      e.target.value as "NAME_ASC" | "NAME_DESC"
                    )
                  }
                >
                  <option value="NAME_ASC">Nombre A-Z</option>
                  <option value="NAME_DESC">Nombre Z-A</option>
                </Select>
              </div>

              <ul className="space-y-2 text-xs">
                {paginatedCompanies.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start justify-between rounded-md border border-neutral-700
                               bg-neutral-950 px-3 py-2 transition-colors transition-transform
                               hover:-translate-y-0.5 hover:border-brand-500 hover:bg-neutral-900"
                  >
                    <div>
                      <p className="font-semibold text-neutral-100">{c.name}</p>
                      <p className="text-neutral-300">
                        {c.user.username} ({c.user.email})
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-neutral-400">
                        Estado:
                        <Badge
                          variant={c.is_active ? "success" : "danger"}
                        >
                          {c.is_active ? "Activa" : "Bloqueada"}
                        </Badge>
                      </p>
                    </div>
                    <Button
                      onClick={() => handleToggleCompany(c)}
                      variant="secondary"
                      className={`ml-3 px-3 py-1 text-xs font-semibold ${
                        c.is_active
                          ? "bg-danger-500 hover:bg-red-700"
                          : "bg-success-500 hover:bg-emerald-700"
                      }`}
                    >
                      {c.is_active ? "Bloquear" : "Desbloquear"}
                    </Button>
                  </li>
                ))}
                {orderedCompanies.length === 0 && (
                  <p className="text-neutral-400">
                    No hay empresas que coincidan con el filtro.
                  </p>
                )}
              </ul>

              {orderedCompanies.length > pageSize && (
                <div className="mt-3 flex items-center justify-end gap-2 text-xs text-neutral-300">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={companyPage === 1}
                    onClick={() =>
                      setCompanyPage((p) => Math.max(1, p - 1))
                    }
                    className="border border-neutral-700 px-2 py-1"
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {companyPage} de {totalCompanyPages}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={companyPage >= totalCompanyPages}
                    onClick={() =>
                      setCompanyPage((p) =>
                        p < totalCompanyPages ? p + 1 : p
                      )
                    }
                    className="border border-neutral-700 px-2 py-1"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>

            {/* Ofertas */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
              <h2 className="mb-3 text-sm font-semibold text-neutral-100">
                Ofertas
              </h2>
              <ul className="space-y-2 text-xs">
                {paginatedJobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex items-center justify-between rounded-md border border-neutral-700
                               bg-neutral-950 px-3 py-2 transition-colors transition-transform
                               hover:-translate-y-0.5 hover:border-brand-500 hover:bg-neutral-900"
                  >
                    <div>
                      <p className="font-semibold text-neutral-100">
                        {job.title}
                      </p>
                      <p className="text-neutral-300">{job.location}</p>
                      <p className="flex items-center gap-1 text-neutral-400">
                        Estado:
                        <Badge
                          variant={job.is_active ? "success" : "danger"}
                        >
                          {job.is_active ? "Publicada" : "Desactivada"}
                        </Badge>
                      </p>
                    </div>
                    <Button
                      onClick={() => handleToggleJob(job)}
                      variant="secondary"
                      className={`px-3 py-1 text-xs font-semibold ${
                        job.is_active
                          ? "bg-danger-500 hover:bg-red-700"
                          : "bg-success-500 hover:bg-emerald-700"
                      }`}
                    >
                      {job.is_active ? "Desactivar" : "Aprobar"}
                    </Button>
                  </li>
                ))}
                {jobs.length === 0 && (
                  <p className="text-neutral-400">
                    No hay ofertas registradas.
                  </p>
                )}
              </ul>

              {jobs.length > pageSize && (
                <div className="mt-3 flex items-center justify-end gap-2 text-xs text-neutral-300">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={jobPage === 1}
                    onClick={() => setJobPage((p) => Math.max(1, p - 1))}
                    className="border border-neutral-700 px-2 py-1"
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {jobPage} de {totalJobPages}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={jobPage >= totalJobPages}
                    onClick={() =>
                      setJobPage((p) =>
                        p < totalJobPages ? p + 1 : p
                      )
                    }
                    className="border border-neutral-700 px-2 py-1"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
