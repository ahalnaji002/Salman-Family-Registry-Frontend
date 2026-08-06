import { useState } from "react";
import { Link, useNavigate } from "react-router";

const initialWifeForm = {
  fullName: "",
  nationalId: "",
  dateOfBirth: "",
  phone: "",
  previousFamilyName: "",
  employmentStatus: "",
  otherEmploymentStatus: "",
};

function WivesPage() {
  const navigate = useNavigate();

  const [wives, setWives] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWifeId, setEditingWifeId] = useState(null);
  const [wifeForm, setWifeForm] = useState(initialWifeForm);
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const handleAddWife = () => {
    setEditingWifeId(null);
    setWifeForm(initialWifeForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWifeId(null);
    setWifeForm(initialWifeForm);
    setErrors({});
  };

  const handleWifeFormChange = (event) => {
    const { name, value } = event.target;

    setWifeForm((currentForm) => ({
      ...currentForm,
      [name]: value,
      ...(name === "employmentStatus" && value !== "other"
        ? { otherEmploymentStatus: "" }
        : {}),
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      ...(name === "employmentStatus"
        ? { otherEmploymentStatus: "" }
        : {}),
    }));
  };

  const validateWifeForm = () => {
    const newErrors = {};

    if (!wifeForm.fullName.trim()) {
      newErrors.fullName = "يرجى إدخال اسم الزوجة الرباعي.";
    }

    if (!/^\d{9}$/.test(wifeForm.nationalId)) {
      newErrors.nationalId = "يرجى إدخال رقم هوية مكون من 9 أرقام.";
    }

    if (!wifeForm.dateOfBirth) {
      newErrors.dateOfBirth = "يرجى اختيار تاريخ الميلاد.";
    }

    if (!/^05\d{8}$/.test(wifeForm.phone)) {
      newErrors.phone = "يرجى إدخال رقم جوال صحيح.";
    }

    if (!wifeForm.previousFamilyName.trim()) {
      newErrors.previousFamilyName = "يرجى إدخال اسم العائلة السابقة.";
    }

    if (!wifeForm.employmentStatus) {
      newErrors.employmentStatus = "يرجى اختيار الحالة الوظيفية.";
    }

    if (
      wifeForm.employmentStatus === "other" &&
      !wifeForm.otherEmploymentStatus.trim()
    ) {
      newErrors.otherEmploymentStatus =
        "يرجى كتابة الحالة الوظيفية للزوجة.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveWife = (event) => {
    event.preventDefault();

    if (!validateWifeForm()) {
      return;
    }

    if (editingWifeId) {
      setWives((currentWives) =>
        currentWives.map((wife) =>
          wife.id === editingWifeId
            ? {
                ...wife,
                ...wifeForm,
              }
            : wife,
        ),
      );
    } else {
      setWives((currentWives) => [
        ...currentWives,
        {
          id: Date.now(),
          ...wifeForm,
        },
      ]);
    }

    setIsSaved(false);
    handleCloseModal();
  };

  const handleEditWife = (wife) => {
    setEditingWifeId(wife.id);

    setWifeForm({
      fullName: wife.fullName,
      nationalId: wife.nationalId,
      dateOfBirth: wife.dateOfBirth,
      phone: wife.phone,
      previousFamilyName: wife.previousFamilyName,
      employmentStatus: wife.employmentStatus,
      otherEmploymentStatus: wife.otherEmploymentStatus,
    });

    setErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteWife = (wifeId) => {
    setWives((currentWives) =>
      currentWives.filter((wife) => wife.id !== wifeId),
    );

    setIsSaved(false);
  };

  const handleDraftSave = () => {
    setIsSaved(true);
  };

  const handleSaveAndContinue = () => {
    setIsSaved(true);
    navigate("/family/housing");
  };

  const getEmploymentStatusLabel = (wife) => {
    if (wife.employmentStatus === "housewife") {
      return "ربة أسرة";
    }

    if (wife.employmentStatus === "employee") {
      return "موظفة";
    }

    if (wife.employmentStatus === "other") {
      return wife.otherEmploymentStatus;
    }

    return "";
  };

  const inputClassName = (fieldName) =>
    `h-12 w-full rounded-xl border bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
      errors[fieldName]
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-slate-200 focus:border-[#d8ad55] focus:ring-[#d8ad55]/10"
    }`;

  return (
    <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#031632] md:text-2xl">
              بيانات الزوجات
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              يمكنك إضافة أكثر من زوجة.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#031632]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
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

            {isSaved ? "تم حفظ التغييرات" : "لم تحفظ التغييرات"}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-[#031632]">
              الزوجات المضافة
            </h2>

            <span className="w-fit rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#031632]">
              عدد الزوجات المضافات: {wives.length}
            </span>
          </div>

          {wives.length === 0 ? (
            <div className="flex min-h-[390px] flex-col items-center justify-center px-4 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f1f3ff] text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-9 w-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 7.5v6m3-3h-6"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-base font-bold text-[#031632]">
                لم تتم إضافة أي زوجة حتى الآن.
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-7 text-slate-500">
                اضغط على الزر أدناه لإضافة بيانات الزوجة. يمكنك إضافة أكثر من
                زوجة واحدة.
              </p>

              <button
                type="button"
                onClick={handleAddWife}
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m7-7H5"
                  />
                </svg>

                إضافة زوجة
              </button>
            </div>
          ) : (
            <div className="py-6">
              <div className="grid gap-4 md:grid-cols-2">
                {wives.map((wife, index) => (
                  <div
                    key={wife.id}
                    className="rounded-2xl border border-slate-200 bg-[#fafafe] p-5"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-semibold text-[#d8ad55]">
                          الزوجة {index + 1}
                        </span>

                        <h3 className="mt-1 text-base font-bold text-[#031632]">
                          {wife.fullName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditWife(wife)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#031632] transition hover:border-[#d8ad55] hover:bg-[#f5f3ed]"
                          aria-label="تعديل الزوجة"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 3.487 3.651 3.651M5.25 18.75l4.229-.94L19.572 7.717a1.5 1.5 0 0 0 0-2.121l-1.168-1.168a1.5 1.5 0 0 0-2.121 0L6.19 14.521l-.94 4.229Z"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteWife(wife.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50"
                          aria-label="حذف الزوجة"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 7.5h15M9.75 10.5v6m4.5-6v6M6.75 7.5l.75 12h9l.75-12M9 7.5V4.875A1.125 1.125 0 0 1 10.125 3.75h3.75A1.125 1.125 0 0 1 15 4.875V7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500">رقم الهوية</p>
                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {wife.nationalId}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">تاريخ الميلاد</p>
                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {wife.dateOfBirth}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">رقم الجوال</p>
                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {wife.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          العائلة السابقة
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {wife.previousFamilyName}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-xs text-slate-500">
                          الحالة الوظيفية
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {getEmploymentStatusLabel(wife)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddWife}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m7-7H5"
                  />
                </svg>

                إضافة زوجة أخرى
              </button>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/family/basic-info"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] sm:w-auto"
          >
            <span aria-hidden="true">→</span>
            السابق
          </Link>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={handleDraftSave}
              className="h-11 whitespace-nowrap rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
            >
              حفظ كمسودة
            </button>

            <button
              type="button"
              onClick={handleSaveAndContinue}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
            >
              حفظ والمتابعة
              <span aria-hidden="true">←</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#031632]/60 px-4 py-6 backdrop-blur-sm"
          onMouseDown={handleCloseModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#031632]">
                  {editingWifeId ? "تعديل بيانات الزوجة" : "إضافة زوجة"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  أدخل بيانات الزوجة بدقة.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f8] text-[#031632] transition hover:bg-[#e7ebf1]"
                aria-label="إغلاق"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveWife} className="p-5 sm:p-6">
              <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="wifeFullName"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    اسم الزوجة الرباعي{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="wifeFullName"
                    name="fullName"
                    type="text"
                    value={wifeForm.fullName}
                    onChange={handleWifeFormChange}
                    placeholder="أدخل اسم الزوجة الرباعي"
                    className={inputClassName("fullName")}
                  />

                  {errors.fullName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="wifeNationalId"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    رقم الهوية <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="wifeNationalId"
                    name="nationalId"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    value={wifeForm.nationalId}
                    onChange={handleWifeFormChange}
                    placeholder="أدخل رقم الهوية"
                    className={`${inputClassName("nationalId")} text-left placeholder:text-right`}
                  />

                  {errors.nationalId && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.nationalId}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="wifeDateOfBirth"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    تاريخ الميلاد <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="wifeDateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={wifeForm.dateOfBirth}
                    onChange={handleWifeFormChange}
                    className={inputClassName("dateOfBirth")}
                  />

                  {errors.dateOfBirth && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="wifePhone"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="wifePhone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={wifeForm.phone}
                    onChange={handleWifeFormChange}
                    placeholder="05XXXXXXXX"
                    className={`${inputClassName("phone")} text-left placeholder:text-right`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="previousFamilyName"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    عائلة الزوجة السابقة{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="previousFamilyName"
                    name="previousFamilyName"
                    type="text"
                    value={wifeForm.previousFamilyName}
                    onChange={handleWifeFormChange}
                    placeholder="أدخل اسم العائلة السابقة"
                    className={inputClassName("previousFamilyName")}
                  />

                  {errors.previousFamilyName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.previousFamilyName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="employmentStatus"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    الحالة الوظيفية للزوجة{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={wifeForm.employmentStatus}
                    onChange={handleWifeFormChange}
                    className={inputClassName("employmentStatus")}
                  >
                    <option value="">اختر...</option>
                    <option value="housewife">ربة أسرة</option>
                    <option value="employee">موظفة</option>
                    <option value="other">أخرى</option>
                  </select>

                  {errors.employmentStatus && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.employmentStatus}
                    </p>
                  )}
                </div>

                {wifeForm.employmentStatus === "other" && (
                  <div className="md:col-span-2">
                    <label
                      htmlFor="otherEmploymentStatus"
                      className="mb-2 block text-sm font-semibold text-[#031632]"
                    >
                      اكتب الحالة الوظيفية{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="otherEmploymentStatus"
                      name="otherEmploymentStatus"
                      type="text"
                      value={wifeForm.otherEmploymentStatus}
                      onChange={handleWifeFormChange}
                      placeholder="اكتب الحالة الوظيفية للزوجة"
                      className={inputClassName("otherEmploymentStatus")}
                    />

                    {errors.otherEmploymentStatus && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {errors.otherEmploymentStatus}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="h-11 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
                >
                  {editingWifeId ? "حفظ التعديلات" : "حفظ الزوجة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default WivesPage;