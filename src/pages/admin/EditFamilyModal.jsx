import { useEffect, useState } from "react";

const formatDateForInput = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const emptyForm = {
  headName: "",
  nationalId: "",
  phone: "",
  birthDate: "",
  bloodType: "",
  gender: "",
  deceasedSpouseFromSalman: null,
  deceasedSpouseCaseType: "",
  maritalStatusValue: "",
  incomeLevel: "",
  workStatusValue: "",
  jobTypeValue: "",
  otherJobType: "",
};

function EditFamilyModal({ isOpen, family, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!family) {
      return;
    }

    setForm({
      headName: family.headName ?? "",
      nationalId: family.nationalId ?? "",
      phone: family.phone ?? "",
      birthDate: formatDateForInput(family.birthDate),
      bloodType: family.bloodType ?? "",
      gender: family.gender ?? "",
      deceasedSpouseFromSalman: family.deceasedSpouseFromSalman ?? null,
      deceasedSpouseCaseType: family.deceasedSpouseCaseType ?? "",
      maritalStatusValue: family.maritalStatusValue ?? "",
      incomeLevel: family.incomeLevel ?? "",
      workStatusValue: family.workStatusValue ?? "",
      jobTypeValue: family.jobTypeValue ?? "",
      otherJobType: family.otherJobType ?? "",
    });

    setErrorMessage("");
    setIsSubmitting(false);
  }, [family, isOpen]);

  if (!isOpen || !family) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "nationalId") {
      nextValue = value.replace(/\D/g, "").slice(0, 9);
    }

    if (name === "phone") {
      nextValue = value.replace(/[^\d+]/g, "").slice(0, 15);
    }

    setForm((current) => {
      const nextForm = {
        ...current,
        [name]: nextValue,
      };

      if (name === "workStatusValue" && nextValue !== "employee") {
        nextForm.jobTypeValue = "";
        nextForm.otherJobType = "";
      }

      if (name === "jobTypeValue" && nextValue !== "other") {
        nextForm.otherJobType = "";
      }

      if (name === "gender") {
        nextForm.maritalStatusValue = "";
        nextForm.deceasedSpouseFromSalman = null;
        nextForm.deceasedSpouseCaseType = "";
      }

      if (name === "maritalStatusValue" && nextValue !== "widowed") {
        nextForm.deceasedSpouseFromSalman = null;
        nextForm.deceasedSpouseCaseType = "";
      }

      return nextForm;
    });

    setErrorMessage("");
  };

  const validateForm = () => {
    const normalizedName = form.headName.trim().replace(/\s+/g, " ");

    const nameParts = normalizedName.split(" ").filter(Boolean);

    if (nameParts.length < 4) {
      return "اسم رب الأسرة يجب أن يكون رباعيًا على الأقل.";
    }

    if (!/^\d{9}$/.test(form.nationalId)) {
      return "رقم الهوية يجب أن يتكون من 9 أرقام.";
    }

    if (!form.phone.trim()) {
      return "رقم الجوال مطلوب.";
    }

    if (!form.birthDate) {
      return "تاريخ الميلاد مطلوب.";
    }

    if (!form.gender) {
      return "الجنس مطلوب.";
    }

    if (!form.maritalStatusValue) {
      return "الحالة الاجتماعية مطلوبة.";
    }

    if (
      form.gender === "female" &&
      !["divorced", "widowed"].includes(form.maritalStatusValue)
    ) {
      return "المرأة يمكن أن يكون لها سجل مستقل فقط إذا كانت مطلقة أو أرملة.";
    }

    if (
      form.maritalStatusValue === "widowed" &&
      form.deceasedSpouseFromSalman === null
    ) {
      return "يرجى تحديد ما إذا كان الزوج أو الزوجة المتوفى/ة من عائلة سلمان.";
    }

    if (
      form.maritalStatusValue === "widowed" &&
      form.deceasedSpouseFromSalman === true &&
      !form.deceasedSpouseCaseType
    ) {
      return "يرجى تحديد هل الوفاة استشهاد أم وفاة أخرى.";
    }

    if (!form.incomeLevel) {
      return "فئة الدخل مطلوبة.";
    }

    if (!form.workStatusValue) {
      return "حالة العمل مطلوبة.";
    }

    if (form.workStatusValue === "employee" && !form.jobTypeValue) {
      return "نوع الوظيفة مطلوب عند اختيار موظف.";
    }

    if (
      form.workStatusValue === "employee" &&
      form.jobTypeValue === "other" &&
      !form.otherJobType.trim()
    ) {
      return "يرجى توضيح نوع الوظيفة الأخرى.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onSave({
        ...family,
        headName: form.headName.trim().replace(/\s+/g, " "),
        nationalId: form.nationalId,
        phone: form.phone.trim(),
        birthDate: form.birthDate,
        bloodType: form.bloodType || null,
        gender: form.gender,
        maritalStatusValue: form.maritalStatusValue,
        deceasedSpouseFromSalman:
          form.maritalStatusValue === "widowed"
            ? form.deceasedSpouseFromSalman
            : null,
        deceasedSpouseCaseType:
          form.maritalStatusValue === "widowed" &&
          form.deceasedSpouseFromSalman === true
            ? form.deceasedSpouseCaseType
            : null,
        incomeLevel: form.incomeLevel,
        workStatusValue: form.workStatusValue,
        jobTypeValue:
          form.workStatusValue === "employee"
            ? form.jobTypeValue || null
            : null,
        otherJobType:
          form.workStatusValue === "employee" && form.jobTypeValue === "other"
            ? form.otherJobType.trim()
            : null,
      });
    } catch (error) {
      setErrorMessage(error.message || "حدث خطأ أثناء تعديل بيانات الأسرة.");
    } finally {
      setIsSubmitting(false);
    }
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
        disabled={isSubmitting}
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
            disabled={isSubmitting}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-[#031632] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700"
              >
                {errorMessage}
              </div>
            )}

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
                    اسم رب الأسرة الرباعي
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <input
                    id="editFamilyHeadName"
                    name="headName"
                    type="text"
                    value={form.headName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editFamilyNationalId"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    رقم الهوية
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <input
                    id="editFamilyNationalId"
                    name="nationalId"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    value={form.nationalId}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 text-left outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editFamilyPhone"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    رقم الجوال
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <input
                    id="editFamilyPhone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 text-left outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editFamilyBirthDate"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    تاريخ الميلاد
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <input
                    id="editFamilyBirthDate"
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
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
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
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
                    htmlFor="editFamilyGender"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    الجنس
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <select
                    id="editFamilyGender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">اختر الجنس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editFamilyMaritalStatus"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    الحالة الاجتماعية
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <select
                    id="editFamilyMaritalStatus"
                    name="maritalStatusValue"
                    value={form.maritalStatusValue}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">اختر الحالة الاجتماعية</option>

                    {form.gender === "male" && (
                      <>
                        <option value="single">أعزب</option>
                        <option value="married">متزوج</option>
                        <option value="divorced">مطلق</option>
                        <option value="widowed">أرمل</option>
                      </>
                    )}

                    {form.gender === "female" && (
                      <>
                        <option value="divorced">مطلقة</option>
                        <option value="widowed">أرملة</option>
                      </>
                    )}
                  </select>
                </div>

                {form.maritalStatusValue === "widowed" && (
                  <>
                    <div>
                      <label
                        htmlFor="editFamilyDeceasedSpouseFromSalman"
                        className="mb-2 block font-semibold text-[#111c2c]"
                      >
                        هل الزوج/الزوجة المتوفى/ة من عائلة سلمان؟
                        <span className="mr-1 text-red-600">*</span>
                      </label>

                      <select
                        id="editFamilyDeceasedSpouseFromSalman"
                        value={
                          form.deceasedSpouseFromSalman === null
                            ? ""
                            : form.deceasedSpouseFromSalman
                              ? "true"
                              : "false"
                        }
                        onChange={(event) => {
                          const value =
                            event.target.value === ""
                              ? null
                              : event.target.value === "true";

                          setForm((current) => ({
                            ...current,
                            deceasedSpouseFromSalman: value,
                            deceasedSpouseCaseType:
                              value === true
                                ? current.deceasedSpouseCaseType
                                : "",
                          }));

                          setErrorMessage("");
                        }}
                        required
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">اختر...</option>
                        <option value="true">نعم</option>
                        <option value="false">لا</option>
                      </select>
                    </div>

                    {form.deceasedSpouseFromSalman === true && (
                      <div>
                        <label
                          htmlFor="editFamilyDeceasedSpouseCaseType"
                          className="mb-2 block font-semibold text-[#111c2c]"
                        >
                          نوع الوفاة
                          <span className="mr-1 text-red-600">*</span>
                        </label>

                        <select
                          id="editFamilyDeceasedSpouseCaseType"
                          name="deceasedSpouseCaseType"
                          value={form.deceasedSpouseCaseType}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">اختر نوع الوفاة</option>
                          <option value="martyr">استشهاد</option>
                          <option value="deceased">وفاة أخرى</option>
                        </select>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label
                    htmlFor="editFamilyIncomeLevel"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    فئة الدخل
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <select
                    id="editFamilyIncomeLevel"
                    name="incomeLevel"
                    value={form.incomeLevel}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">اختر فئة الدخل</option>
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
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <select
                    id="editFamilyWorkStatus"
                    name="workStatusValue"
                    value={form.workStatusValue}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">اختر حالة العمل</option>
                    <option value="employee">موظف</option>
                    <option value="worker">عامل</option>
                    <option value="not_working">لا يعمل</option>
                  </select>
                </div>

                {form.workStatusValue === "employee" && (
                  <div>
                    <label
                      htmlFor="editFamilyJobType"
                      className="mb-2 block font-semibold text-[#111c2c]"
                    >
                      نوع الوظيفة
                      <span className="mr-1 text-red-600">*</span>
                    </label>

                    <select
                      id="editFamilyJobType"
                      name="jobTypeValue"
                      value={form.jobTypeValue}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">اختر نوع الوظيفة</option>
                      <option value="government">قطاع حكومي</option>
                      <option value="private">قطاع خاص</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                )}

                {form.workStatusValue === "employee" &&
                  form.jobTypeValue === "other" && (
                    <div className="lg:col-span-2">
                      <label
                        htmlFor="editFamilyOtherJobType"
                        className="mb-2 block font-semibold text-[#111c2c]"
                      >
                        توضيح نوع الوظيفة
                        <span className="mr-1 text-red-600">*</span>
                      </label>

                      <input
                        id="editFamilyOtherJobType"
                        name="otherJobType"
                        type="text"
                        value={form.otherJobType}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="أدخل نوع الوظيفة"
                        className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  )}
              </div>
            </section>

            <div className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4 text-sm leading-7 text-slate-600">
              هذا التعديل يحدّث بيانات رب الأسرة الأساسية فقط. بيانات السكن
              والزوجات والأبناء والبنات المتزوجات والحالات الخاصة تبقى محفوظة
              كما هي.
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#031632] px-5 py-3 font-semibold text-white transition hover:bg-[#1a2b48] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "جارٍ حفظ التعديلات..." : "حفظ تعديلات الأسرة"}

              {isSubmitting && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditFamilyModal;
