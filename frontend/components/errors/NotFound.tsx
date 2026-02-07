import { Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface NotFoundProps {
  resource?: string;
}

/**
 * WHY: Present a friendly 404 message with navigation back home.
 */
export const NotFound = ({ resource = "Page" }: NotFoundProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="mb-2 text-3xl font-bold text-gray-900">
          {resource} Not Found
        </h2>
        <p className="mb-6 text-gray-600">
          The {resource.toLowerCase()} you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button size="lg">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
