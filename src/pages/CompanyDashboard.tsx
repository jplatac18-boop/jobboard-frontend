// src/pages/CompanyDashboard.tsx
import { type FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createJob,
  getCompanyJobs,
  updateJob,
  deleteJob,
  type Job,
  type JobPayload,
} from "../services/jobs";
import {
  getApplicationsByJob,
  updateApplicationStatus,
  type Application,
} from "../services/applications";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import ApplicationSkeleton from "../components/skeletons/ApplicationSkeleton";
import DashboardLayout from "../layouts/DashboardLayout";
import CompanySidebar from "../components/CompanySidebar";

type ApplicationsTab = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED";

const CompanyDashboard = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState<string>("");
  const [description, setDescription] = useState("");

  const [titleError, setTitleError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [salaryError, setSalaryError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const [loadingForm, setLoadingForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsTab, setApplicationsTab] =
    useState<ApplicationsTab>("ALL");

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;
  const acceptedCount = applications.filter((a) => a.status === "ACCEPTED").length;
  const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;

  // --- validaciones simples ---
  const validateTitle = (value: string) => {
    if (!value.trim()) return "El título es obligatorio.";
    if (value.length < 4) return "El título es demasiado corto.";
    return null;
  };

  const validateLocation = (value: string) => {
    if (!value.trim()) return "La ubicación es obligatoria.";
    return null;
  };

  const validateSalary = (value: string) => {
    if (!value) return null; // opcional
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      return "El salario debe ser un número mayor o igual a 0.";
    }
    return null;
  };

  const validateDescription = (value: string) => {
    if (!value.trim()) return "La descripción es obligatoria.";
    if (value.trim().length < 20) {
      return "La descripción debe tener al menos 20 caracteres.";
    }
    return null;
  };

  const validateAll = () => {
    const tErr = validateTitle(title);
    const lErr = validateLocation(location);
    const sErr = validateSalary(salary);
    const dErr = validateDescription(description);

    setTitleError(tErr);
    setLocationError(lErr);
    setSalaryError(sErr);
    setDescriptionError(dErr);

    return !tErr && !lErr && !sErr && !dErr;
  };

  const loadCompanyJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await getCompanyJobs();
      setJobs(data.results);
      if (data.results.length > 0 && !selectedJobId) {
        const first = data.results[0];
        setSelectedJobId(first.id);
        fillFormFromJob(first);
      }
    } catch {
      setError("No se pudieron cargar las ofertas de la empresa.");
      toast.error("No se pudieron cargar las ofertas de la empresa.");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fillFormFromJob = (job: Job) => {
    setTitle(job.title);
    setLocation(job.location);
    setSalary(job.salary != null ? String(job.salary) : "");
    setDescription(job.description);
    setTitleError(null);
    setLocationError(null);
    setSalaryError(null);
    setDescriptionError(null);
    setMessage(null);
    setError(null);
  };

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setSalary("");
    setDescription("");
    setSelectedJobId(null);
    setTitleError(null);
    setLocationError(null);
    setSalaryError(null);
    setDescriptionError(null);
    setMessage(null);
    setError(null);
  };

  useEffect(() => {
    loadCompanyJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedJobId) {
        setApplications([]);
        return;
      }
      setLoadingApplications(true);
      try {
        const data = await getApplicationsByJob(selectedJobId);
        setApplications(data.results);
      } catch {
        setError("No se pudieron cargar las postulaciones.");
        toast.error("No se pudieron cargar las postulaciones.");
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchApplications();
  }, [selectedJobId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setMessage(null);
    setError(null);

    if (!validateAll()) {
      setError("Revisa los campos marcados en rojo.");
      toast.error("Revisa los campos marcados en rojo.");
      setLoadingForm(false);
      return;
    }

    try {
      const payload: JobPayload = {
        title,
        location,
        description,
        salary: salary ? Number(salary) : null,
      };

      if (selectedJobId) {
        await updateJob(selectedJobId, payload);
        setMessage("Oferta actualizada correctamente.");
        toast.success("Oferta actualizada correctamente.");
      } else {
        await createJob(payload);
        setMessage("Oferta creada correctamente.");
        toast.success("Oferta creada correctamente.");
        resetForm();
      }

      await loadCompanyJobs();
    } catch {
      const msg = selectedJobId
        ? "Error al actualizar la oferta."
        : "Error al crear la oferta.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoadingForm(false);
    }
  };

  const handleEditClick = (job: Job) => {
    setSelectedJobId(job.id);
    fillFormFromJob(job);
  };

  const handleDeleteClick = async (jobId: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta oferta?")) return;
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      if (selectedJobId === jobId) {
        resetForm();
        setApplications([]);
      }
      toast.success("Oferta eliminada correctamente.");
    } catch {
      toast.error("No se pudo eliminar la oferta.");
    }
  };

  const handleUpdateStatus = async (
    appId: number,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      const updated = await updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? updated : a))
      );
      toast.success(
        status === "ACCEPTED"
          ? "Postulación aceptada."
          : "Postulación rechazada."
      );
    } catch {
      toast.error("No se pudo actualizar la postulación.");
    }
  };

  const filteredApplications =
    applicationsTab === "ALL"
      ? applications
      : applications.filter((app) => app.status === applicationsTab);

  return (
    <DashboardLayout sidebar={<CompanySidebar />}>
      <h1 className="text-2xl font-bold">Panel de empresa</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Aquí podrás gestionar tus ofertas de trabajo y ver postulaciones.
      </p>

      {/* Formulario crear/editar oferta */}
      <section className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-lg shadow-neutral-950/40">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-lg font-semibold">
            {selectedJobId
              ? "Editar oferta de trabajo"
              : "Crear oferta de trabajo"}
          </h2>
          {selectedJobId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-brand-300 underline hover:text-brand-200"
            >
              Nueva oferta
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <Input
            label="Título del puesto"
            name="title"
            value={title}
            onChange={(e) => {
              const value = e.target.value;
              setTitle(value);
              setTitleError(validateTitle(value));
            }}
            error={titleError || undefined}
            required
          />

          <Input
            label="Ubicación"
            name="location"
            value={location}
            onChange={(e) => {
              const value = e.target.value;
              setLocation(value);
              setLocationError(validateLocation(value));
            }}
            error={locationError || undefined}
            required
          />

          <Input
            label="Salario (opcional)"
            name="salary"
            type="number"
            value={salary}
            onChange={(e) => {
              const value = e.target.value;
              setSalary(value);
              setSalaryError(validateSalary(value));
            }}
            error={salaryError || undefined}
            min={0}
            step="0.01"
          />

          <div>
            <label className="block text-xs font-semibold text-neutral-300">
              Descripción
            </label>
            <textarea
              className={`mt-1 w-full rounded-md border bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none
                placeholder:text-neutral-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                  descriptionError ? "border-danger-500" : "border-neutral-700"
                }`}
              rows={5}
              value={description}
              onChange={(e) => {
                const value = e.target.value;
                setDescription(value);
                setDescriptionError(validateDescription(value));
              }}
              required
              aria-invalid={!!descriptionError}
            />
            {descriptionError && (
              <p className="mt-1 text-xs text-danger-500">
                {descriptionError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loadingForm}
            className="w-full sm:w-auto"
          >
            {loadingForm
              ? selectedJobId
                ? "Actualizando..."
                : "Creando..."
              : selectedJobId
              ? "Actualizar oferta"
              : "Crear oferta"}
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-success-500">{message}</p>
        )}

        {error && <p className="mt-4 text-sm text-danger-500">{error}</p>}
      </section>

      {/* Listado de ofertas y postulaciones */}
      <section className="mt-6 grid gap-6 md:grid-cols-[1.2fr,2fr]">
        {/* Bloque de ofertas */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
          <h2 className="mb-3 text-sm font-semibold text-neutral-100">
            Mis ofertas
          </h2>

          {loadingJobs ? (
            <p className="text-xs text-neutral-400">Cargando ofertas...</p>
          ) : jobs.length === 0 ? (
            <p className="text-xs text-neutral-400">
              Aún no has creado ofertas.
            </p>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`rounded-md border px-3 py-2 transition-colors ${
                    selectedJobId === job.id
                      ? "border-brand-500 bg-neutral-800"
                      : "border-neutral-700 bg-neutral-950"
                  }`}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleEditClick(job)}
                  >
                    <p className="font-semibold text-neutral-100">
                      {job.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {job.location}
                    </p>
                  </div>

                  <div className="mt-2 flex gap-2 text-xs">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleEditClick(job)}
                      className="border border-neutral-600 px-2 py-1"
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleDeleteClick(job.id)}
                      className="bg-danger-500 px-2 py-1 hover:bg-red-700"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bloque de postulaciones */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
          <h2 className="mb-1 text-sm font-semibold text-neutral-100">
            Postulaciones{" "}
            {selectedJob
              ? `de "${selectedJob.title}"`
              : "(selecciona una oferta)"}
          </h2>

          <p className="mb-3 text-xs text-neutral-300">
            Pendientes:{" "}
            <span className="text-neutral-100">{pendingCount}</span> ·
            Aceptadas:{" "}
            <span className="text-success-500">{acceptedCount}</span> ·
            Rechazadas:{" "}
            <span className="text-danger-500">{rejectedCount}</span>
          </p>

          {/* Tabs de estado */}
          <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
            {(
              [
                { id: "ALL", label: "Todas" },
                { id: "PENDING", label: "Pendientes" },
                { id: "ACCEPTED", label: "Aceptadas" },
                { id: "REJECTED", label: "Rechazadas" },
              ] as { id: ApplicationsTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setApplicationsTab(tab.id)}
                className={`rounded-full border px-3 py-1 transition-colors ${
                  applicationsTab === tab.id
                    ? "border-brand-500 bg-brand-500/10 text-brand-300"
                    : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-brand-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loadingApplications ? (
            <ul className="space-y-3 text-xs">
              {Array.from({ length: 3 }).map((_, idx) => (
                <li key={idx}>
                  <ApplicationSkeleton />
                </li>
              ))}
            </ul>
          ) : filteredApplications.length === 0 ? (
            <p className="text-xs text-neutral-400">
              No hay postulaciones en este estado para esta oferta.
            </p>
          ) : (
            <ul className="space-y-3 text-xs">
              {filteredApplications.map((app) => (
                <li
                  key={app.id}
                  className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2"
                >
                  <p className="font-semibold text-neutral-100">
                    {app.candidate.username} ({app.candidate.email})
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-neutral-300">
                    Estado:
                    <Badge
                      variant={
                        app.status === "PENDING"
                          ? "primary"
                          : app.status === "ACCEPTED"
                          ? "success"
                          : "danger"
                      }
                    >
                      {app.status === "PENDING"
                        ? "Pendiente"
                        : app.status === "ACCEPTED"
                        ? "Aceptada"
                        : "Rechazada"}
                    </Badge>
                  </p>
                  {app.cover_letter && (
                    <p className="mt-2 whitespace-pre-line text-neutral-200">
                      {app.cover_letter}
                    </p>
                  )}
                  <p className="mt-1 text-neutral-400">
                    Fecha: {new Date(app.created_at).toLocaleString()}
                  </p>

                  <div className="mt-2 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        handleUpdateStatus(app.id, "ACCEPTED")
                      }
                      className="bg-success-500 px-3 py-1 text-xs hover:bg-emerald-700"
                    >
                      Aceptar
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        handleUpdateStatus(app.id, "REJECTED")
                      }
                      className="bg-danger-500 px-3 py-1 text-xs hover:bg-red-700"
                    >
                      Rechazar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
