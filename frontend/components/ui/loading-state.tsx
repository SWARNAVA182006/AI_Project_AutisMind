import { Loader2 } from "lucide-react";

/**
 * Props interface for LoadingState component
 */
interface LoadingStateProps {
  message?: string;
}

/**
 * LoadingState Component
 * Displays a loading spinner with optional message.
 * Used during API calls or data fetching operations.
 */
export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
