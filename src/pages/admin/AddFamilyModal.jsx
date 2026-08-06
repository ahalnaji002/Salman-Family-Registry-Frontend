import { useState } from "react";

const initialForm = {
  headName: "",
  nationalId: "",
  phone: "",
  region: "غزة",
  membersCount: "1",
  status: "غير مكتملة",
};

function AddFamilyModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(initialForm);

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

    const newFamily = {
      id: Date.now(),
      headName: form.headName,
      nationalId: form.nationalId,
      phone: form.phone,
      region: form.region,
      membersCount: Number(form.membersCount),
      status: form.status,
      registeredAt: new Date().toISOString().slice(0, 10),
      editStatus: "open",

      birthDate: "",
      bloodType: "",
      maritalStatus: "",
      incomeLevel: "",
      workStatus: "",
      jobType: "",
      previousResidence: "",
      housingType: "",
      displacementType: "",
      currentAddress: "",
      wives: [],
      children: [],
      marriedDaughters: [],
      specialCases: [],
    };

    onAdd(newFamily);
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

      <section className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#031632]">
              إضافة أسرة جديدة
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              أدخل البيانات الأساسية لرب الأسرة
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
              htmlFor="addFamilyHeadName"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              اسم رب الأسرة
            </label>

            <input
              id="addFamilyHeadName"
              name="headName"
              type="text"
              value={form.headName}
              onChange={handleChange}
              required
              placeholder="أدخل الاسم الرباعي"
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="addFamilyNationalId"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                رقم الهوية
              </label>

              <input
                id="addFamilyNationalId"
                name="nationalId"
                type="text"
                inputMode="numeric"
                value={form.nationalId}
                onChange={handleChange}
                required
                placeholder="رقم الهوية"
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>

            <div>
              <label
                htmlFor="addFamilyPhone"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                رقم الجوال
              </label>

              <input
                id="addFamilyPhone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="05xxxxxxxx"
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="addFamilyRegion"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                المنطقة
              </label>

              <select
                id="addFamilyRegion"
                name="region"
                value={form.region}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
              >
                <option value="غزة">غزة</option>
                <option value="شمال غزة">شمال غزة</option>
                <option value="المنطقة الوسطى">المنطقة الوسطى</option>
                <option value="جنوب غزة">جنوب غزة</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="addFamilyMembersCount"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                عدد الأفراد
              </label>

              <input
                id="addFamilyMembersCount"
                name="membersCount"
                type="number"
                min="1"
                value={form.membersCount}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>

            <div>
              <label
                htmlFor="addFamilyStatus"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                حالة الاستمارة
              </label>

              <select
                id="addFamilyStatus"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
              >
                <option value="غير مكتملة">غير مكتملة</option>
                <option value="مكتملة">مكتملة</option>
              </select>
            </div>
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
              إضافة الأسرة
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddFamilyModal;