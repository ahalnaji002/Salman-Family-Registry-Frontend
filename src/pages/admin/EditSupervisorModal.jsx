import { useEffect, useState } from "react";

function EditSupervisorModal({
  isOpen,
  supervisor,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (supervisor) {
      setForm({
        fullName:
          supervisor.full_name ||
          supervisor.name ||
          "",
        nationalId:
          supervisor.national_id ||
          supervisor.nationalId ||
          "",
        phone: supervisor.phone || "",
      });

      setErrorMessage("");
    }
  }, [supervisor]);

  if (!isOpen || !supervisor) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "nationalId") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 9);
    }

    setForm((current) => ({
      ...current,
      [name]: nextValue,
    }));

    setErrorMessage("");
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();

    if (!fullName) {
      setErrorMessage(
        "يرجى إدخال اسم المشرف.",
      );
      return;
    }

    if (!/^\d{9}$/.test(form.nationalId)) {
      setErrorMessage(
        "رقم الهوية يجب أن يتكون من 9 أرقام.",
      );
      return;
    }

    if (!phone) {
      setErrorMessage(
        "يرجى إدخال رقم الجوال.",
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await onSave?.({
        ...supervisor,
        full_name: fullName,
        national_id: form.nationalId,
        phone,
      });

      onClose();
    } catch (error) {
      setErrorMessage(
        error.message ||
          "حدث خطأ أثناء تعديل بيانات المشرف.",
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
              تعديل بيانات المشرف
            </h2>

            <p className="mt-1 text-sm leading-7 text-slate-500">
              عدّل البيانات الأساسية للمشرف ثم
              احفظ التغييرات.
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
          className="mt-5 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="editSupervisorName"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              الاسم الكامل
            </label>

            <input
              id="editSupervisorName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="editSupervisorNationalId"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                رقم الهوية
              </label>

              <input
                id="editSupervisorNationalId"
                name="nationalId"
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={form.nationalId}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 text-left outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="editSupervisorPhone"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                رقم الجوال
              </label>

              <input
                id="editSupervisorPhone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
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
            تعديل صلاحيات المشرف يتم بشكل مستقل
            عن تعديل بياناته الشخصية.
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
                ? "جاري الحفظ..."
                : "حفظ التعديلات"}

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

export default EditSupervisorModal;