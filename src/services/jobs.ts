import api from "./api";

export type Job = {
  id: number;
  title: string;
  description: string;
  location: string;
  salary?: number | null;
  created_at: string;
  is_active: boolean;
  modality?: "REMOTE" | "ONSITE" | "HYBRID";
};

export type JobPayload = {
  title: string;
  description: string;
  location: string;
  salary?: number | null;
  modality?: "REMOTE" | "ONSITE" | "HYBRID";
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type JobsResponse = PaginatedResponse<Job>;

// Lista pública de jobs, con filtros y paginación
export const getJobs = async (
  params?: {
    search?: string;
    location?: string;
    modality?: string;
    level?: string;
  },
  pageUrl?: string
): Promise<JobsResponse> => {
  if (pageUrl) {
    // pageUrl viene de next/previous de DRF (URL absoluta)
    const res = await api.get<PaginatedResponse<Job>>(pageUrl);
    return res.data;
  }

  const res = await api.get<PaginatedResponse<Job>>("/jobs/", { params });
  // => GET https://jobboard-backend-g8kv.onrender.com/api/jobs/
  return res.data;
};

// Jobs de la empresa autenticada (para el panel)
export const getCompanyJobs = async (): Promise<JobsResponse> => {
  const res = await api.get<PaginatedResponse<Job>>("/jobs/", {
    params: { mine: "true" },
  });
  return res.data;
};

// Crear job (empresa)
export const createJob = (data: JobPayload) =>
  api.post("/jobs/", data);

// Detalle de un job
export const getJobById = async (id: number): Promise<Job> => {
  const res = await api.get<Job>(`/jobs/${id}/`);
  return res.data;
};

export const updateJob = async (
  id: number,
  data: JobPayload
): Promise<Job> => {
  const res = await api.put<Job>(`/jobs/${id}/`, data);
  return res.data;
};

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/jobs/${id}/`);
};
