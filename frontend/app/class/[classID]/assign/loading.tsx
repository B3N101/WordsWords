import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="w-full">
        {/* Table header */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>

        {/* Table rows */}
        {[...Array(10)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-6 mb-4">
            {[...Array(3)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-8 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
