import { useEffect, useState } from "react";

const initialForm = {
  fullName: "",
  nationalId: "",
  phone: "",
  password: "",
  dateOfBirth: "",
  bloodType: "",
  maritalStatus: "",
  incomeCategory: "",
  workStatus: "",
  jobType: "",
  otherJobType: "",
};

function AddFamilyModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setShowPassword(false);
      setIsSubmitting(false);
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen) {
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

      if (name === "workStatus" && nextValue !== "employee") {
        nextForm.jobType = "";
        nextForm.otherJobType = "";
      }

      if (name === "jobType" && nextValue !== "other") {
        nextForm.otherJobType = "";
      }

      return nextForm;
    });

    setErrorMessage("");
  };

  const validateForm = () => {
    const normalizedName = form.fullName
      .trim()
      .replace(/\s+/g, " ");

    const nameParts = normalizedName
      .split(" ")
      .filter(Boolean);

    if (nameParts.length < 4) {
      return "اسم رب الأسرة يجب أن يكون رباعيًا على الأقل.";
    }

    if (!/^\d{9}$/.test(form.nationalId)) {
      return "رقم الهوية يجب أن يتكون من 9 أرقام.";
    }

    if (!form.phone.trim()) {
      return "رقم الجوال مطلوب.";
    }

    if (form.password.length < 8) {
      return "كلمة المرور يجب ألا تقل عن 8 أحرف.";
    }

    if (!form.dateOfBirth) {
      return "تاريخ الميلاد مطلوب.";
    }

    if (!form.maritalStatus) {
      return "الحالة الاجتماعية مطلوبة.";
    }

    if (!form.incomeCategory) {
      return "فئة الدخل مطلوبة.";
    }

    if (!form.workStatus) {
      return "حالة العمل مطلوبة.";
    }

    if (
      form.workStatus === "employee" &&
      !form.jobType
    ) {
      return "نوع الوظيفة مطلوب عند اختيار موظف.";
    }

    if (
      form.workStatus === "employee" &&
      form.jobType === "other" &&
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

    const payload = {
      full_name: form.fullName
        .trim()
        .replace(/\s+/g, " "),
      national_id: form.nationalId,
      phone: form.phone.trim(),
      password: form.password,
      date_of_birth: form.dateOfBirth,
      blood_type: form.bloodType || null,
      marital_status: form.maritalStatus,
      income_category: form.incomeCategory,
      work_status: form.workStatus,
      job_type:
        form.workStatus === "employee"
          ? form.jobType || null
          : null,
      other_job_type:
        form.workStatus === "employee" &&
        form.jobType === "other"
          ? form.otherJobType.trim()
          : null,
    };

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onAdd(payload);

      setForm(initialForm);
      setShowPassword(false);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "حدث خطأ أثناء إضافة الأسرة.",
      );
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
        aria-label="إغلاق نافذة إضافة الأسرة"
        onClick={onClose}
        disabled={isSubmitting}
        className="absolute inset-0"
      />

      <section className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-[#031632]">
              إضافة أسرة جديدة
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              إنشاء حساب جديد لرب الأسرة وإضافة بياناته الأساسية
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
        >
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
                بيانات الحساب
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="addFamilyFullName"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    اسم رب الأسرة الرباعي
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <input
                    id="addFamilyFullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="أدخل الاسم الرباعي"
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="addFamilyNationalId"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    رقم الهوية
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <input
                    id="addFamilyNationalId"
                    name="nationalId"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    value={form.nationalId}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="9 أرقام"
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 text-left outline-none transition placeholder:text-right focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="addFamilyPhone"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    رقم الجوال
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <input
                    id="addFamilyPhone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="059xxxxxxx"
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 text-left outline-none transition placeholder:text-right focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="addFamilyPassword"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    كلمة المرور
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <div className="relative">
                    <input
                      id="addFamilyPassword"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      placeholder="8 أحرف على الأقل"
                      className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 pl-20 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current,
                        )
                      }
                      disabled={isSubmitting}
                      className="absolute inset-y-0 left-3 my-auto h-9 rounded-lg px-3 text-sm font-medium text-slate-500 transition hover:bg-[#e7eeff] hover:text-[#031632] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showPassword ? "إخفاء" : "إظهار"}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    سيستخدم رب الأسرة هذه البيانات لتسجيل الدخول إلى حسابه.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="border-b border-slate-200 pb-3 text-xl font-bold text-[#031632]">
                البيانات الأساسية
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="addFamilyDateOfBirth"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    تاريخ الميلاد
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <input
                    id="addFamilyDateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="addFamilyBloodType"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    فصيلة الدم
                  </label>

                  <select
                    id="addFamilyBloodType"
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
                    htmlFor="addFamilyMaritalStatus"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    الحالة الاجتماعية
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <select
                    id="addFamilyMaritalStatus"
                    name="maritalStatus"
                    value={form.maritalStatus}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">اختر الحالة الاجتماعية</option>
                    <option value="single">أعزب</option>
                    <option value="married">متزوج</option>
                    <option value="divorced">مطلق</option>
                    <option value="widowed">أرمل</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="addFamilyIncomeCategory"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    فئة الدخل
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <select
                    id="addFamilyIncomeCategory"
                    name="incomeCategory"
                    value={form.incomeCategory}
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
                    htmlFor="addFamilyWorkStatus"
                    className="mb-2 block font-semibold text-[#111c2c]"
                  >
                    حالة العمل
                    <span className="mr-1 text-red-600">*</span>
                  </label>

                  <select
                    id="addFamilyWorkStatus"
                    name="workStatus"
                    value={form.workStatus}
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

                {form.workStatus === "employee" && (
                  <div>
                    <label
                      htmlFor="addFamilyJobType"
                      className="mb-2 block font-semibold text-[#111c2c]"
                    >
                      نوع الوظيفة
                      <span className="mr-1 text-red-600">*</span>
                    </label>

                    <select
                      id="addFamilyJobType"
                      name="jobType"
                      value={form.jobType}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">اختر نوع الوظيفة</option>
                      <option value="government">
                        قطاع حكومي
                      </option>
                      <option value="private">
                        قطاع خاص
                      </option>
                      <option value="other">
                        أخرى
                      </option>
                    </select>
                  </div>
                )}

                {form.workStatus === "employee" &&
                  form.jobType === "other" && (
                    <div className="md:col-span-2">
                      <label
                        htmlFor="addFamilyOtherJobType"
                        className="mb-2 block font-semibold text-[#111c2c]"
                      >
                        توضيح نوع الوظيفة
                        <span className="mr-1 text-red-600">*</span>
                      </label>

                      <input
                        id="addFamilyOtherJobType"
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

            <div className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] px-4 py-3 text-sm leading-7 text-slate-600">
              ستُنشأ الأسرة بحالة <strong>غير مكتملة</strong>،
              وسيكون التعديل مفتوحًا لها حتى تكمل بيانات الاستمارة.
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:flex-row">
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
              {isSubmitting
                ? "جارٍ إضافة الأسرة..."
                : "إضافة الأسرة"}

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

export default AddFamilyModal;