"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
export default function ErrorPage() {
  const router = useRouter();
  const handleReturn = () => {
    router.push("/");
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-12">
        <h1 className="text-2xl font-bold text-[#ff6b6b] mb-6">Error 404</h1>
        <p className="text-[#7f8c8d] mb-6">
          The page you are looking for does not exist.
        </p>
        <Button onClick={handleReturn}>
          <i>Return Home</i>
        </Button>
      </Card>
    </div>
  );
}
