// src/pages/CompanyPublic.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

type Company = {
  id: number;
  name: string;
  description: string;
  website: string;
  location: string;
};

type Job = {
  id: number;
  title: string;
  location: string;
  salary?: string;
};

type JobsResponse = Job[] | { results: Job[] };

const CompanyPublic = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        // ✅ sin /api, baseURL ya incluye /api
        const res = await api.get<Company>(`/companies/${id}/`);
        setCompany(res.data);
      } catch {
        setError("No se pudo cargar la información de la empresa.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!id) return;
      try {
        setJobsLoading(true);
        // ✅ también sin /api
        const res = await api.get<JobsResponse>(`/companies/${id}/jobs/`);

        const data = res.data;
        const items = Array.isArray(data) ? data : data.results ?? [];
        setJobs(items);
      } catch {
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [id]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        {loading && (
          <p className="mb-4 text-xs text-neutral-400">
            Cargando información de la empresa...
          </p>
        )}

        {error && <p className="mb-4 text-sm text-danger-500">{error}</p>}

        {company && (
          <>
            <h1 className="text-2xl font-bold">{company.name}</h1>

            {company.location && (
              <p className="mt-1 text-sm text-neutral-300">
                Ubicación:{" "}
                <span className="font-medium text-neutral-100">
                  {company.location}
                </span>
              </p>
            )}

            {company.website && (
              <p className="mt-1 text-sm text-neutral-300">
                Sitio web:{" "}
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-300 underline underline-offset-2 hover:text-brand-200"
                >
                  {company.website}
                </a>
              </p>
            )}

            {company.description && (
              <p className="mt-4 whitespace-pre-line text-sm text-neutral-200">
                {company.description}
              </p>
            )}

            <section className="mt-8">
              <h2 className="text-sm font-semibold text-neutral-100">
                Ofertas activas de esta empresa
              </h2>

              {jobsLoading && (
                <p className="mt-2 text-xs text-neutral-400">
                  Cargando ofertas...
                </p>
              )}

              {!jobsLoading && jobs.length === 0 && (
                <p className="mt-2 text-sm text-neutral-400">
                  Esta empresa no tiene ofertas activas en este momento.
                </p>
              )}

              <div className="mt-4 space-y-3">
                {Array.isArray(jobs) &&
                  jobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="block rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm hover:border-brand-500 hover:bg-neutral-900"
                    >
                      <p className="font-medium text-neutral-50">
                        {job.title}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        {job.location}
                        {job.salary && ` · Salario: ${job.salary}`}
                      </p>
                    </Link>
                  ))}
              </div>
            </section>
          </>
        )}

        {!loading && !error && !company && (
          <p className="text-sm text-neutral-400">
            No se encontró la empresa solicitada.
          </p>
        )}
      </main>
    </div>
  );
};

export default CompanyPublic;
