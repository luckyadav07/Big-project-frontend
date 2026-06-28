function Pagination({
  page,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8 flex-wrap">
      {Array.from(
        { length: totalPages },
        (_, index) => (
          <button
            key={index}
            onClick={() =>
              onPageChange(index + 1)
            }
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              page === index + 1
                ? "bg-accent text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {index + 1}
          </button>
        )
      )}
    </div>
  );
}

export default Pagination;