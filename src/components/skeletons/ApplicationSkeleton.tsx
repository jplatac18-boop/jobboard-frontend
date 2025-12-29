// src/components/skeletons/ApplicationSkeleton.tsx
const ApplicationSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-3 text-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded bg-neutral-800" />
          <div className="h-2 w-1/3 rounded bg-neutral-800" />
        </div>
        <div className="h-5 w-20 rounded-full bg-neutral-800" />
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-2 w-full rounded bg-neutral-800" />
        <div className="h-2 w-3/4 rounded bg-neutral-800" />
        <div className="h-2 w-1/2 rounded bg-neutral-800" />
      </div>
    </div>
  );
};

export default ApplicationSkeleton;
