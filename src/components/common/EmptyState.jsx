import { SearchX } from "lucide-react";

function EmptyState({
  icon: Icon = SearchX,
  title = "Nothing here",
  description = "There's nothing to display.",
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-white/5 p-4 mb-4">
        <Icon size={40} className="text-gray-400" />
      </div>

      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-gray-400">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;