// src/components/skeletons/JobCardSkeleton.tsx
const JobCardSkeleton = () => {
  return (
    <div
      className="block animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-sm
                 shadow-sm shadow-neutral-950/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 rounded bg-neutral-800" />
          <div className="h-2 w-1/2 rounded bg-neutral-800" />
          <div className="h-2 w-1/3 rounded bg-neutral-800" />
        </div>
        <div className="h-5 w-16 rounded-full bg-neutral-800" />
      </div>
    </div>
  );
};

export default JobCardSkeleton;
