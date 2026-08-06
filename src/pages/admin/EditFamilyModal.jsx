import { useEffect, useState } from "react";

const emptyForm = {
  headName: "",
  nationalId: "",
  phone: "",
  region: "غزة",
  membersCount: 1,
  status: "غير مكتملة",
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
};

function EditFamilyModal({
  isOpen,
  family,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!family) return;

    setForm({
      headName: family.headName ?? "",
      nationalId: family.nationalId ?? "",
      phone: family.phone ?? "",
      region: family.region ?? "غزة",
      membersCount: family.membersCount ?? 1,
      status: family.status ?? "غير مكتملة",
      birthDate: family.birthDate ?? "",
      bloodType: family.bloodType ?? "",
      maritalStatus: family.maritalStatus ?? "",
      incomeLevel: family.incomeLevel ?? "",
      workStatus: family.workStatus ?? "",
      jobType: family.jobType ?? "",
      previousResidence: family.previousResidence ?? "",
      housingType: family.housingType ?? "",
      displacementType: family.displacementType ?? "",
      currentAddress: family.currentAddress ?? "",
    });
  }, [family]);

  if (!isOpen || !family) {
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
      ...family,
      ...form,
      membersCount: Number(form.membersCount),
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
        aria-label="إغلاق نافذة تعديل الأسرة"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-[#031632]">
              تعديل بيانات الأسرة
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              أسرة {family.headName}
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

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            <section>
              <h3 className="border-b border-slate-200 pb-3 text-xl font-bold text-[#031632]">
                المعلومات الأساسية
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <label
                    htmlFor="editFamilyHeadName"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    اسم رب الأسرة
                  </label>

                  <input
                    id="editFamilyHeadName"
                    name="headName"
                    type="text"
                    value={form.headName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editFamilyNationalId"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    رقم الهوية
                  </label>

                  <input
                    id="editFamilyNationalId"
                    name="nationalId"
                    type="text"
                    inputMode="numeric"
                    value={form.nationalId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editFamilyPhone"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    رقم الجوال
                  </label>

                  <input
                    id="editFamilyPhone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editFamilyBirthDate"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    تاريخ الميلاد
                  </label>

                  <input
                    id="editFamilyBirthDate"
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editFamilyBloodType"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    فصيلة الدم
                  </label>

                  <select
                    id="editFamilyBloodType"
                    name="bloodType"
                    value={form.bloodType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                  >
                    <option value="">غير محدد</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editFamilyMaritalStatus"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    الحالة الاجتماعية
                  </label>

                  <select
                    id="editFamilyMaritalStatus"
                    name="maritalStatus"
                    value={form.maritalStatus}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                  >
                    <option value="">غير محدد</option>
                    <option value="أعزب">أعزب</option>
                    <option value="متزوج">متزوج</option>
                    <option value="مطلق">مطلق</option>
                    <option value="أرمل">أرمل</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editFamilyIncomeLevel"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    فئة الدخل
                  </label>

                  <select
                    id="editFamilyIncomeLevel"
                    name="incomeLevel"
                    value={form.incomeLevel}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                  >
                    <option value="">غير محدد</option>
                    <option value="0-1000">0 - 1000</option>
                    <option value="1000-3000">1000 - 3000</option>
                    <option value="3000+">أكثر من 3000</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editFamilyWorkStatus"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    حالة العمل
                  </label>

                  <select
                    id="editFamilyWorkStatus"
                    name="workStatus"
                    value={form.workStatus}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                  >
                    <option value="">غير محدد</option>
                    <option value="موظف">موظف</option>
                    <option value="عامل">عامل</option>
                    <option value="لا يعمل">لا يعمل</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editFamilyJobType"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    نوع الوظيفة
                  </label>

                  <input
                    id="editFamilyJobType"
                    name="jobType"
                    type="text"
                    value={form.jobType}
                    onChange={handleChange}
                    disabled={form.workStatus !== "موظف"}
                    placeholder={
                      form.workStatus === "موظف"
                        ? "قطاع حكومي أو خاص أو أخرى"
                        : "يتاح عند اختيار موظف"
                    }
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editFamilyRegion"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    المنطقة
                  </label>

                  <select
                    id="editFamilyRegion"
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                  >
                    <option value="شمال غزة">شمال غزة</option>
                    <option value="غزة">غزة</option>
                    <option value="المنطقة الوسطى">
                      المنطقة الوسطى
                    </option>
                    <option value="جنوب غزة">جنوب غزة</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editFamilyMembersCount"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    عدد الأفراد
                  </label>

                  <input
                    id="editFamilyMembersCount"
                    name="membersCount"
                    type="number"
                    min="1"
                    value={form.membersCount}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editFamilyStatus"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    حالة الاستمارة
                  </label>

                  <select
                    id="editFamilyStatus"
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
            </section>

            <section>
              <h3 className="border-b border-slate-200 pb-3 text-xl font-bold text-[#031632]">
                بيانات السكن
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="editPreviousResidence"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    مكان السكن السابق
                  </label>

                  <select
                    id="editPreviousResidence"
                    name="previousResidence"
                    value={form.previousResidence}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                  >
                    <option value="">غير محدد</option>
                    <option value="شمال غزة">شمال غزة</option>
                    <option value="غزة">غزة</option>
                    <option value="المنطقة الوسطى">
                      المنطقة الوسطى
                    </option>
                    <option value="جنوب غزة">جنوب غزة</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editHousingType"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    طبيعة السكن الحالي
                  </label>

                  <select
                    id="editHousingType"
                    name="housingType"
                    value={form.housingType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                  >
                    <option value="">غير محدد</option>
                    <option value="ملك">ملك</option>
                    <option value="إيجار">إيجار</option>
                    <option value="نازح">نازح</option>
                  </select>
                </div>

                {form.housingType === "نازح" && (
                  <div>
                    <label
                      htmlFor="editDisplacementType"
                      className="mb-2 block font-semibold text-[#111c2c]"
                    >
                      نوع مكان النزوح
                    </label>

                    <select
                      id="editDisplacementType"
                      name="displacementType"
                      value={form.displacementType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
                    >
                      <option value="">غير محدد</option>
                      <option value="خيمة">خيمة</option>
                      <option value="مركز إيواء">مركز إيواء</option>
                      <option value="بيت أقارب">بيت أقارب</option>
                    </select>
                  </div>
                )}

                <div
                  className={
                    form.housingType === "نازح"
                      ? ""
                      : "md:col-span-2"
                  }
                >
                  <label
                    htmlFor="editCurrentAddress"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    عنوان السكن الحالي
                  </label>

                  <input
                    id="editCurrentAddress"
                    name="currentAddress"
                    type="text"
                    value={form.currentAddress}
                    onChange={handleChange}
                    placeholder="أدخل العنوان بالتفصيل"
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
                  />
                </div>
              </div>
            </section>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
              هذه النسخة تعدّل بيانات رب الأسرة والسكن فقط. بيانات الزوجات
              والأبناء والحالات الخاصة تبقى محفوظة كما هي.
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row">
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
              حفظ تعديلات الأسرة
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditFamilyModal;