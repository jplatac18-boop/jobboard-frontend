// src/pages/CompanyProfile.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import CompanySidebar from "../components/CompanySidebar";
import api from "../services/api";

type CompanyProfile = {
  id: number;
  name: string;
  description: string;
  website: string;
  location: string;
};

const CompanyProfile = () => {
  const [form, setForm] = useState<CompanyProfile>({
    id: 0,
    name: "",
    description: "",
    website: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // ✅ sin /api, porque baseURL ya es .../api
        const res = await api.get<CompanyProfile>("/companies/me/");
        setForm(res.data);
      } catch (err) {
        setError("No se pudo cargar el perfil de la empresa.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // ✅ también sin /api
      await api.patch("/companies/me/", {
        name: form.name,
        description: form.description,
        website: form.website,
        location: form.location,
      });
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      setError("Ocurrió un error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout sidebar={<CompanySidebar />}>
      <h1 className="text-2xl font-bold">Perfil de empresa</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Aquí podrás completar y actualizar la información de tu empresa.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-neutral-400">Cargando perfil...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
          {error && (
            <p className="rounded-md bg-red-900/40 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-md bg-emerald-900/30 px-3 py-2 text-sm text-emerald-200">
              {success}
            </p>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300">
              Nombre de la empresa
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-brand-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300">
              Sitio web
            </label>
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://tuempresa.com"
              className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300">
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Ciudad, País"
              className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};

export default CompanyProfile;
