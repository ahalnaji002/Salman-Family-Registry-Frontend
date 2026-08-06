import { useEffect, useState } from "react";

function EditSupervisorModal({
  isOpen,
  supervisor,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    name: "",
    nationalId: "",
    phone: "",
    permissions: "عرض وتصدير",
  });

  useEffect(() => {
    if (supervisor) {
      setForm({
        name: supervisor.name,
        nationalId: supervisor.nationalId,
        phone: supervisor.phone,
        permissions: supervisor.permissions,
      });
    }
  }, [supervisor]);

  if (!isOpen || !supervisor) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      ...supervisor,
      ...form,
    });

    onClose();
  };

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

      <section className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#031632]">
              تعديل بيانات المشرف
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              عدّل البيانات أو الصلاحيات ثم احفظ التغييرات
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="editSupervisorName"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              الاسم الكامل
            </label>

            <input
              id="editSupervisorName"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
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
                value={form.nationalId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
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
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="editSupervisorPermissions"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              الصلاحيات
            </label>

            <select
              id="editSupervisorPermissions"
              name="permissions"
              value={form.permissions}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
            >
              <option value="عرض وتصدير">عرض وتصدير</option>
              <option value="كامل الصلاحيات">كامل الصلاحيات</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#031632] px-5 py-3 font-semibold text-white hover:bg-[#1a2b48]"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditSupervisorModal;