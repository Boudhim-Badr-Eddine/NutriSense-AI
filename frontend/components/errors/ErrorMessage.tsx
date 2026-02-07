import { AlertCircle, RefreshCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/**
 * WHY: Provide a consistent error presentation with optional retry action.
 */
export const ErrorMessage = ({
  title = "Something went wrong",
  message = "Unable to load data. Please try again.",
  onRetry,
}: ErrorMessageProps) => {
  return (
    <Alert variant="destructive" className="my-8">
      <AlertTitle>
        <AlertCircle className="h-4 w-4" />
        {title}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
