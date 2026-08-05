import { FolderTree, ChevronDown } from "lucide-react";

const CategorySelect = ({
  label = "Category",
  value = "",
  onChange,
  categories = [],
  required = false,
  disabled = false,
  error = "",
  helperText = "",
}) => {
  return (
    <div className="space-y-2">
      {/* Label */}

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <FolderTree className="h-4 w-4 text-slate-500" />

        {label}

        {required && (
          <span className="text-red-500">*</span>
        )}
      </label>

      {/* Select */}

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={`
            h-11
            w-full
            appearance-none
            rounded-xl
            border
            bg-white
            px-4
            pr-11
            text-sm
            font-medium
            outline-none
            transition

            ${
              error
                ? "border-red-400 focus:border-red-500"
                : "border-slate-300 focus:border-blue-500"
            }

            ${
              disabled
                ? "cursor-not-allowed bg-slate-100"
                : ""
            }
          `}
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category.slug}
              value={category.slug}
            >
              {category.name}
            </option>
          ))}
        </select>

        <ChevronDown
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            h-5
            w-5
            -translate-y-1/2
            text-slate-400
          "
        />
      </div>

      {/* Helper */}

      {!error && helperText && (
        <p className="text-xs text-slate-500">
          {helperText}
        </p>
      )}

      {/* Error */}

      {error && (
        <p className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default CategorySelect;