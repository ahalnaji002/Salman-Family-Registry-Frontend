function DeleteFamilyModal({
  isOpen,
  family,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !family) {
    return null;
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
    >
      <button
        type="button"
        aria-label="إغلاق النافذة"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
          </svg>
        </div>

        <div className="mt-5 text-center">
          <h2 className="text-2xl font-bold text-[#031632]">
            حذف الأسرة
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            هل أنت متأكد من حذف أسرة
            <span className="mx-1 font-bold text-[#111c2c]">
              {family.headName}
            </span>
            ؟
          </p>

          <p className="mt-2 text-sm font-medium text-red-600">
            لا يمكن التراجع عن هذه العملية لاحقًا.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={() => onConfirm(family.id)}
            className="flex-1 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            تأكيد الحذف
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteFamilyModal;