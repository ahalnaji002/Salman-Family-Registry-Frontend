import { useState } from "react";

function AddSupervisorModal({
  isOpen,
  onClose,
  onAdd,
}) {
  const [nationalId, setNationalId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleNationalIdChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 9);

    setNationalId(value);
    setErrorMessage("");
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setNationalId("");
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!/^\d{9}$/.test(nationalId)) {
      setErrorMessage(
        "يرجى إدخال رقم هوية صحيح مكون من 9 أرقام.",
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await onAdd?.({
        nationalId,
      });

      setNationalId("");
      onClose();
    } catch (error) {
      setErrorMessage(
        error.message ||
          "حدث خطأ أثناء إضافة المشرف.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-8"
    >
      <button
        type="button"
        aria-label="إغلاق النافذة"
        onClick={handleClose}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#031632]">
              إضافة مشرف
            </h2>

            <p className="mt-1 text-sm leading-7 text-slate-500">
              أدخل رقم هوية رب الأسرة المسجل مسبقًا
              في النظام لتعيينه كمشرف.
            </p>
          </div>

          <button
            type="button"
            aria-label="إغلاق"
            disabled={loading}
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-[#031632] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="supervisorNationalId"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              رقم هوية رب الأسرة
              <span className="mr-1 text-red-600">
                *
              </span>
            </label>

            <input
              id="supervisorNationalId"
              name="nationalId"
              type="text"
              inputMode="numeric"
              maxLength={9}
              value={nationalId}
              onChange={handleNationalIdChange}
              required
              disabled={loading}
              placeholder="أدخل رقم الهوية المكون من 9 أرقام"
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 text-left outline-none transition placeholder:text-right focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs leading-6 text-slate-500">
              يجب أن يكون المستخدم مسجلًا مسبقًا
              كرب أسرة ونشطًا في النظام.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-7 text-[#34446b]">
            لن يتم إنشاء حساب جديد. سيتم إضافة
            صلاحية المشرف إلى حساب رب الأسرة
            الموجود بالفعل.
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#031632] px-5 py-3 font-semibold text-white transition hover:bg-[#1a2b48] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "جاري تعيين المشرف..."
                : "تعيين كمشرف"}

              {loading && (
                <span
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddSupervisorModal;