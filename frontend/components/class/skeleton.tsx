import { Skeleton } from "@/components/ui/skeleton"

export default function ClassSkeleton() {
  // You can adjust the number of rows here
  const numberOfRows = 5

  return (
    <div className="container mx-auto p-4 space-y-4">
      {[...Array(numberOfRows)].map((_, rowIndex) => (
        <div key={rowIndex} className="bg-card rounded-lg shadow-sm p-4">
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  )
}
