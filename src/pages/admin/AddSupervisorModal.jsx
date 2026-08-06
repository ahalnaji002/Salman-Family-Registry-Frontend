import { useState } from "react";

const initialForm = {
  fullName: "",
  nationalId: "",
  phone: "",
  password: "",
  permissions: "view_export",
};

function AddSupervisorModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) {
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

    onAdd?.({
      id: Date.now(),
      name: form.fullName,
      nationalId: form.nationalId,
      phone: form.phone,
      status: "نشط",
      permissions:
        form.permissions === "full"
          ? "كامل الصلاحيات"
          : "عرض وتصدير",
    });

    setForm(initialForm);
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
              إضافة مشرف جديد
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              أدخل بيانات المشرف وحدد الصلاحيات المناسبة
            </p>
          </div>

          <button
            type="button"
            aria-label="إغلاق"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-[#031632]"
          >
            ×
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="supervisorFullName"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              الاسم الكامل
            </label>

            <input
              id="supervisorFullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="أدخل الاسم الكامل"
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="supervisorNationalId"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                رقم الهوية
              </label>

              <input
                id="supervisorNationalId"
                name="nationalId"
                type="text"
                inputMode="numeric"
                value={form.nationalId}
                onChange={handleChange}
                required
                placeholder="رقم الهوية"
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>

            <div>
              <label
                htmlFor="supervisorPhone"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                رقم الجوال
              </label>

              <input
                id="supervisorPhone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="05xxxxxxxx"
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="supervisorPassword"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              كلمة المرور المؤقتة
            </label>

            <div className="relative">
              <input
                id="supervisorPassword"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="8 أحرف على الأقل"
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 pl-16 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 left-3 my-auto rounded-lg px-2 text-sm text-slate-500 hover:bg-slate-100"
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="supervisorPermissions"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              الصلاحيات
            </label>

            <select
              id="supervisorPermissions"
              name="permissions"
              value={form.permissions}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
            >
              <option value="view_export">
                عرض الأسر وتصدير البيانات
              </option>

              <option value="full">
                كامل الصلاحيات
              </option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#031632] px-5 py-3 font-semibold text-white transition hover:bg-[#1a2b48]"
            >
              إضافة المشرف
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddSupervisorModal;