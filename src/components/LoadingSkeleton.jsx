import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden border border-pink-100/80 p-0 flex flex-col shadow-2xs animate-pulse"
        >
          {/* صورة وهمية aspect-[4/5] */}
          <div className="aspect-[4/5] bg-pink-50/70 w-full relative">
            <div className="absolute top-2.5 right-2.5 w-14 h-5 bg-pink-100 rounded-full" />
            <div className="absolute top-2.5 left-2.5 w-16 h-5 bg-pink-100 rounded-lg" />
          </div>

          {/* نصوص وهمية p-3 */}
          <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-14 h-3.5 bg-pink-100 rounded" />
              <div className="w-full h-4 bg-gray-200 rounded" />
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <div className="w-20 h-5 bg-pink-100 rounded" />
              <div className="w-full h-8 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
