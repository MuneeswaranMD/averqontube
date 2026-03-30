import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-dark-800 ${className}`} />
);

const SkeletonLoading = ({ type = "video", count = 4 }) => {
  if (type === "video") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: count * 2 }).map((_, i) => (
          <div key={i} className="glass p-4 rounded-3xl space-y-6 border border-white/20">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="space-y-4 px-4">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "shorts") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[9/16] w-full rounded-[2.5rem]" />
            <div className="px-4 space-y-2">
               <Skeleton className="h-3 w-3/4" />
               <Skeleton className="h-2 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "analytics") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass p-8 rounded-[2.5rem] space-y-6">
             <Skeleton className="h-3 w-24" />
             <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-12 rounded-full" />
             </div>
             <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoading;
