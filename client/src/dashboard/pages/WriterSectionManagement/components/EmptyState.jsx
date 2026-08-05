import { FileText, Plus } from "lucide-react";

const EmptyState = ({
  title = "No Content Found",
  description = "There are no items available in this section yet.",
  buttonText = "Add New",
  onAction,
  icon: Icon = FileText,
}) => {
  return (
    <div
      className="
        flex
        min-h-[320px]
        w-full
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-slate-50
        px-6
        py-12
        text-center
      "
    >
      {/* Icon */}

      <div
        className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-sm
        "
      >
        <Icon className="h-10 w-10 text-slate-400" />
      </div>

      {/* Title */}

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {title}
      </h3>

      {/* Description */}

      <p
        className="
          mt-3
          max-w-md
          text-sm
          leading-7
          text-slate-500
        "
      >
        {description}
      </p>

      {/* Action */}

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >
          <Plus className="h-4 w-4" />

          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;