// src/layouts/DashboardLayout.tsx
import Navbar from "../components/Navbar";

type DashboardLayoutProps = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

const DashboardLayout = ({ sidebar, children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl gap-4 px-4 py-6">
        <aside className="sticky top-16 hidden h-[calc(100vh-5rem)] w-52 shrink-0 flex-col rounded-xl border border-neutral-800 bg-neutral-900/80 p-3 text-xs text-neutral-300 md:flex">
          {sidebar}
        </aside>
        <main className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 shadow-lg shadow-neutral-950/40">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
