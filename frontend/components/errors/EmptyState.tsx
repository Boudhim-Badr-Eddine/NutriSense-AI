import { Package, Search, Utensils } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: "search" | "package" | "food";
  title: string;
  description: string;
  action?: ReactNode;
}

/**
 * WHY: Provide a friendly empty state for catalog and table views.
 */
export const EmptyState = ({
  icon = "search",
  title,
  description,
  action,
}: EmptyStateProps) => {
  const Icon =
    icon === "search" ? Search : icon === "package" ? Package : Utensils;

  return (
    <div className="py-12 text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mx-auto mb-4 max-w-md text-gray-600">{description}</p>
      {action}
    </div>
  );
};
