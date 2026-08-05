import {
  Eye,
  EyeOff,
  CheckCircle2,
  Clock3,
  Archive,
  AlertCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  published: {
    label: "Published",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },

  draft: {
    label: "Draft",
    icon: Clock3,
    className:
      "bg-amber-50 text-amber-700 border border-amber-200",
  },

  archived: {
    label: "Archived",
    icon: Archive,
    className:
      "bg-slate-100 text-slate-700 border border-slate-200",
  },

  pending: {
    label: "Pending",
    icon: AlertCircle,
    className:
      "bg-sky-50 text-sky-700 border border-sky-200",
  },
};

const StatusBadge = ({
  status = "published",
  hidden = false,
  size = "md",
}) => {
  const config =
    STATUS_CONFIG[status] || STATUS_CONFIG.published;

  const Icon = config.icon;

  const sizeClass =
    size === "sm"
      ? "text-xs px-2 py-1"
      : "text-sm px-3 py-1.5";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Publish Status */}
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          rounded-full
          font-medium
          ${config.className}
          ${sizeClass}
        `}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />

        {config.label}
      </span>

      {/* Visibility */}
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          rounded-full
          border
          font-medium
          ${
            hidden
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-blue-200 bg-blue-50 text-blue-700"
          }
          ${sizeClass}
        `}
      >
        {hidden ? (
          <>
            <EyeOff className="h-4 w-4" />
            Hidden
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            Visible
          </>
        )}
      </span>
    </div>
  );
};

export default StatusBadge;