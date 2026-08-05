import { useState } from "react";
import { ChevronDown } from "lucide-react";

const AccordionSection = ({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
  actions,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:px-6"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {title}
            </h2>

            {badge && (
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {actions && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:block"
            >
              {actions}
            </div>
          )}

          <ChevronDown
            className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Mobile Actions */}
      {actions && (
        <div
          className={`border-t border-slate-100 bg-slate-50 px-4 py-3 sm:hidden ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {actions}
        </div>
      )}

      {/* Body */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] border-t border-slate-200"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionSection;