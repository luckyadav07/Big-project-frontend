import { AlertTriangle } from "lucide-react";
import Button from "./Button.jsx";

function ErrorState({
  title = "Something went wrong",
  description = "Please try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-danger/10 p-5 mb-5">
        <AlertTriangle className="w-10 h-10 text-danger" />
      </div>

      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-gray-400 max-w-md">
        {description}
      </p>

      {onRetry && (
        <Button
          className="mt-6"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;