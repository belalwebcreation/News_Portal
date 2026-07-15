const PaginationDots = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={`h-3 w-3 rounded-full transition-all duration-300 cursor-pointer ${
            currentPage === index
              ? "bg-sky-500 scale-125"
              : "bg-gray-300 hover:bg-gray-500"
          }`}
        />
      ))}
    </div>
  );
};

export default PaginationDots;