import { memo } from "react";

const PaginationDots = memo(({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {Array.from({ length: totalPages }).map((_, index) => {
        const isActive = currentPage === index;
        return (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            /* ৭. মডার্ন ডায়নামিক অ্যাক্টিভ ক্যাপসুল অ্যানিমেশন */
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              isActive
                ? "bg-sky-500 w-8 shadow-md shadow-sky-500/20"
                : "bg-gray-300 dark:bg-gray-700 w-2.5 hover:bg-gray-400 dark:hover:bg-gray-600"
            }`}
            aria-label={`Slide to page ${index + 1}`}
          />
        );
      })}
    </div>
  );
});

PaginationDots.displayName = "PaginationDots";
export default PaginationDots;