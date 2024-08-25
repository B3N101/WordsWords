import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ClassSkeleton() {
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


const ShimmerEffect = () => (
  <div className="animate-pulse bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent h-full w-full absolute" />
)

const PersonSkeleton = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  </div>
)

export function PeopleSkeleton() {
  return (
    <div className="container mx-auto p-4 bg-background">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="relative overflow-hidden">
                  <PersonSkeleton />
                  <ShimmerEffect />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] pr-4 space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="relative overflow-hidden">
                  <PersonSkeleton />
                  <ShimmerEffect />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}