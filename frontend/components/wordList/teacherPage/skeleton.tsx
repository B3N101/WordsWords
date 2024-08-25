import { Skeleton } from "@/components/ui/skeleton";

export function TeacherDataTableSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>

          {/* Table rows */}
          {[...Array(10)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-6 gap-4 mb-4">
              {[...Array(6)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-8 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
