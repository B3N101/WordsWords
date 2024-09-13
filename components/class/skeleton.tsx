import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ClassSkeleton({ numberOfCards }: { numberOfCards: number }) {
  // You can adjust the number of rows here
  const numberOfRows = 5;

  return (
    <div className="flex-1 p-6 gap-y-5">
      {[...Array(numberOfCards)].map((_, cardIndex) => (
        <Card
          className="bg-white rounded-lg shadow-md my-10 p-6"
          key={cardIndex}
        >
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const ShimmerEffect = () => (
  <div className="animate-pulse bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent h-full w-full absolute" />
);

const PersonSkeleton = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  </div>
);

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
  );
}
