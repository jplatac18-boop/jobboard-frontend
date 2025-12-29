import api from "./api";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type Application = {
  id: number;
  job: {
    id: number;
    title: string;
    location: string;
  };
  candidate: {
    id: number;
    username: string;
    email: string;
  };
  cover_letter?: string;
  status: ApplicationStatus;
  created_at: string;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export const applyToJob = async (
  jobId: number,
  coverLetter?: string
): Promise<Application> => {
  const res = await api.post<Application>("/applications/", {
    job_id: jobId,
    cover_letter: coverLetter,
  });
  return res.data;
};

export const getApplicationsByJob = async (
  jobId: number
): Promise<PaginatedResponse<Application>> => {
  const res = await api.get<PaginatedResponse<Application>>(
    "/applications/list/",
    { params: { job: jobId } }
  );
  return res.data;
};

export const getMyApplications = async (
  status?: ApplicationStatus
): Promise<PaginatedResponse<Application>> => {
  const res = await api.get<PaginatedResponse<Application>>(
    "/applications/me/",
    { params: status ? { status } : undefined }
  );
  return res.data;
};

export const updateApplicationStatus = async (
  applicationId: number,
  status: Exclude<ApplicationStatus, "PENDING">
): Promise<Application> => {
  const res = await api.patch<Application>(
    `/applications/${applicationId}/`,
    { status }
  );
  return res.data;
};
