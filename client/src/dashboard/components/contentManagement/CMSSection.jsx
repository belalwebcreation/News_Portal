import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";

import cmsSections from "../../data/cmsSections";

const CMSSection = ({ onManage }) => {
  const [openSection, setOpenSection] = useState("header");

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="space-y-6">

      {cmsSections.map((section) => {
        const Icon = section.icon;

        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
          >
            {/* Section Header */}

            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-4">

                {openSection === section.id ? (
                  <ChevronDown size={22} className="text-slate-400 dark:text-slate-500" />
                ) : (
                  <ChevronRight size={22} className="text-slate-400 dark:text-slate-500" />
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">

                  <Icon
                    size={24}
                    className="text-amber-700 dark:text-amber-400"
                  />

                </div>

                <div className="text-left">

                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {section.title}
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {section.items.length} Items
                  </p>

                </div>

              </div>

            </button>

            {/* Items */}

            {openSection === section.id && (
              <div className="border-t border-slate-200 dark:border-slate-800">

                {section.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 px-7 py-5 ${
                      index !== section.items.length - 1
                        ? "border-b border-slate-100 dark:border-slate-800"
                        : ""
                    }`}
                  >
                    {/* Left */}

                    <div>

                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>

                    </div>

                    {/* Right */}

                    <div className="flex flex-wrap items-center gap-3">

                      {/* Type */}

                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">

                        {item.type}

                      </span>

                      {/* Multiple */}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.multiple
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        }`}
                      >
                        {item.multiple
                          ? "Multiple"
                          : "Single"}
                      </span>

                      {/* Visibility */}

                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          item.visible
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {item.visible ? (
                          <Eye size={14} />
                        ) : (
                          <EyeOff size={14} />
                        )}

                        {item.visible
                          ? "Visible"
                          : "Hidden"}
                      </span>

                      {/* Manage */}

                      <button
                        onClick={() => onManage(item)}
                        className="flex items-center gap-2 rounded-xl bg-amber-700 dark:hover:bg-amber-600 px-5 py-2.5 text-white transition hover:bg-amber-800"
                      >
                        <Settings size={18} />

                        Manage
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}
          </div>
        );
      })}

    </div>
  );
};

export default CMSSection;