import { Skeleton } from "@/components/ui/skeleton";

export default function WordAnalyticSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row flex-wrap -mx-2">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="w-full sm:w-1/2 xl:w-1/4 p-2">
            <div className="bg-card rounded-lg shadow-md p-4 h-full">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Skeleton className="h-6 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
