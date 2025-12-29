// src/pages/Help.tsx
import Navbar from "../components/Navbar";

const Help = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 text-sm">
        <h1 className="text-2xl font-bold">Cómo usar JobBoard</h1>
        <p className="mt-2 text-neutral-400">
          Una guía rápida para buscar ofertas, postularte y gestionar vacantes.
        </p>

        <section className="mt-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-neutral-100">
              Buscar ofertas
            </h2>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-neutral-300">
              <li>Usa el buscador del encabezado para encontrar ofertas por título o palabra clave.</li>
              <li>Filtra por ubicación y modalidad (remoto, presencial, híbrido) en la página principal.</li>
              <li>Explora los resultados y entra al detalle de cada oferta para ver requisitos y salario.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-100">
              Postularte como candidato
            </h2>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-neutral-300">
              <li>Crea una cuenta como candidato desde “Crear cuenta”.</li>
              <li>En el detalle de la oferta, haz clic en “Postularme” y añade una carta de presentación si lo deseas.</li>
              <li>Revisa el estado de tus postulaciones en “Mis postulaciones”.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-100">
              Publicar ofertas como empresa
            </h2>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-neutral-300">
              <li>Regístrate como empresa y entra al “Panel empresa”.</li>
              <li>Crea, edita y elimina ofertas desde tu panel.</li>
              <li>Gestiona postulaciones marcándolas como aceptadas o rechazadas.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Help;
