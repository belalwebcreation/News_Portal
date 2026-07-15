import { ChevronRight } from "lucide-react";

const SectionTitle = ({ title }) => {
  return (
    <div className="mb-8">
      {/* Top Blue Border */}
      <div className="w-full h-1 bg-sky-500 mb-4"></div>

      {/* Title */}
      <div className="flex items-center gap-2">
        <h2 className="text-4xl font-bold text-gray-900">
          {title}
        </h2>

        <ChevronRight
          size={32}
          className="text-red-600 mt-1"
        />
      </div>
    </div>
  );
};

export default SectionTitle;