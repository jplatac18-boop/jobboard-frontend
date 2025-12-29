// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import { getJobs, type Job } from "../services/jobs";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import JobCardSkeleton from "../components/skeletons/JobCardSkeleton";

type JobsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
};

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [location, setLocation] = useState(
    searchParams.get("location") ?? ""
  );
  const [modality, setModality] = useState(
    searchParams.get("modality") ?? ""
  );

  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  const buildSearchParamsObject = (modalityOverride?: string) => {
    const nextParams: Record<string, string> = {};
    if (search.trim()) nextParams.search = search.trim();
    if (location.trim()) nextParams.location = location.trim();
    const effectiveModality =
      modalityOverride !== undefined ? modalityOverride : modality;
    if (effectiveModality) nextParams.modality = effectiveModality;
    return nextParams;
  };

  const loadJobs = async (pageUrl?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params: {
        search?: string;
        location?: string;
        modality?: string;
      } = {};

      if (search.trim()) params.search = search.trim();
      if (location.trim()) params.location = location.trim();
      if (modality) params.modality = modality;

      const data: JobsResponse = await getJobs(params, pageUrl);
      setJobs(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setCount(data.count);

      if (data.results.length === 0) {
        toast("No se encontraron ofertas para estos filtros.", {
          icon: "ℹ️",
        });
      }
    } catch {
      setError("No se pudieron cargar las ofertas.");
      toast.error("No se pudieron cargar las ofertas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextParams = buildSearchParamsObject();
    setSearchParams(nextParams);
    loadJobs();
  };

  const handleClearFilters = () => {
    setSearch("");
    setLocation("");
    setModality("");
    setSearchParams({});
    loadJobs();
  };

  const handleNext = () => {
    if (nextPage) loadJobs(nextPage);
  };

  const handlePrev = () => {
    if (prevPage) loadJobs(prevPage);
  };

  const handleModalityChipClick = (value: string) => {
    const next = modality === value ? "" : value;
    setModality(next);
    const nextParams = buildSearchParamsObject(next);
    setSearchParams(nextParams);
    loadJobs();
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <section>
          <h1 className="text-2xl font-bold">Ofertas de trabajo</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Busca y explora las ofertas disponibles en la plataforma.
          </p>

          {/* Filtros */}
          <form
            onSubmit={handleFilterSubmit}
            className="mt-6 flex flex-col gap-3 text-sm md:flex-row md:items-end"
          >
            <div className="flex-1">
              <Input
                label="Búsqueda"
                name="search"
                placeholder="Título, empresa..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
            </div>

            <div className="flex-1">
              <Input
                label="Ubicación"
                name="location"
                placeholder="Ciudad, remoto..."
                value={location}
                onChange={(e) => setLocation(e.currentTarget.value)}
              />
            </div>

            <div className="w-full md:w-40">
              <Select
                label="Modalidad"
                name="modality"
                value={modality}
                onChange={(e) => setModality(e.currentTarget.value)}
              >
                <option value="">Todas</option>
                <option value="REMOTE">Remoto</option>
                <option value="ONSITE">Presencial</option>
                <option value="HYBRID">Híbrido</option>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="primary" className="text-sm">
                Buscar
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleClearFilters}
                className="border border-neutral-600 px-3 py-2 text-xs"
              >
                Limpiar
              </Button>
            </div>
          </form>

          {/* Chips de modalidad siempre visibles */}
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {[
              { value: "", label: "Todas" },
              { value: "REMOTE", label: "Remoto" },
              { value: "ONSITE", label: "Presencial" },
              { value: "HYBRID", label: "Híbrido" },
            ].map((chip) => (
              <button
                key={chip.value || "ALL"}
                type="button"
                onClick={() => handleModalityChipClick(chip.value)}
                className={`rounded-full border px-3 py-1 transition-colors ${
                  modality === chip.value
                    ? "border-brand-500 bg-brand-500/10 text-brand-300"
                    : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-brand-500"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-4 text-xs text-danger-500">
              {error}
            </p>
          )}

          {/* Skeletons mientras carga */}
          {loading && !error && (
            <ul className="mt-6 space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <li key={idx}>
                  <JobCardSkeleton />
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && (
            <>
              <ul className="mt-6 space-y-3">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <JobCard job={job} />
                  </li>
                ))}

                {jobs.length === 0 && (
                  <p className="text-xs text-neutral-400">
                    No se encontraron ofertas para estos filtros.
                  </p>
                )}
              </ul>

              {(nextPage || prevPage) && (
                <div className="mt-6 flex items-center justify-between text-xs text-neutral-400">
                  <span>
                    {typeof count === "number"
                      ? `Total ofertas: ${count}`
                      : null}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handlePrev}
                      disabled={!prevPage}
                      className="border border-neutral-700 px-3 py-1 text-xs"
                    >
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleNext}
                      disabled={!nextPage}
                      className="border border-neutral-700 px-3 py-1 text-xs"
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
