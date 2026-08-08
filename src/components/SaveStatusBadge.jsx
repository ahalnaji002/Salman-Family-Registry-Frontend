function SaveStatusBadge({ isSaved, saving }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        isSaved ? "bg-green-50 text-green-700" : "bg-[#eef3ff] text-[#031632]"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
        aria-hidden="true"
      >
        {isSaved ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5.25 12.75 4.5 4.5 9-10.5"
          />
        ) : (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2"
            />
            <circle cx="12" cy="12" r="9" />
          </>
        )}
      </svg>

      {saving
        ? "جاري الحفظ..."
        : isSaved
          ? "تم حفظ التغييرات"
          : "لم تحفظ التغييرات"}
    </span>
  );
}

export default SaveStatusBadge;
