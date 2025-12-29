import api from "./api";
import type { Job } from "./jobs";

export type AdminCompany = {
  id: number;
  name: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  is_active: boolean;
};

type PaginatedJobsResponse = {
  results: Job[];
  count?: number;
  next?: string | null;
  previous?: string | null;
};

export const getAdminCompanies = async (): Promise<AdminCompany[]> => {
  const res = await api.get<AdminCompany[]>("/admin/companies/");
  return res.data;
};

export const getAdminJobs = async (): Promise<PaginatedJobsResponse> => {
  const res = await api.get<PaginatedJobsResponse>("/admin/jobs/");
  return res.data;
};

export const toggleJobActive = async (id: number): Promise<Job> => {
  const res = await api.patch<Job>(`/admin/jobs/${id}/toggle/`);
  return res.data;
};

export const toggleCompanyActive = async (
  id: number
): Promise<AdminCompany> => {
  const res = await api.patch<AdminCompany>(
    `/admin/companies/${id}/toggle/`
  );
  return res.data;
};
