import { ChevronRight } from "lucide-react";

const SectionTitle = ({ title }) => {
  return (
    <div className="mb-8 select-none">
      <div className="w-full h-1 bg-sky-500 mb-4 rounded-full"></div>
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-gray-100 tracking-tight">
          {title}
        </h2>
        <ChevronRight
          size={28}
          className="text-red-600 dark:text-red-500 mt-0.5 animate-pulse"
        />
      </div>
    </div>
  );
};

export default SectionTitle;