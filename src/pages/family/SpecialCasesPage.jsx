import { useState } from "react";
import { Link, useNavigate } from "react-router";

const initialSpecialCaseForm = {
  fullName: "",
  caseType: "",
  details: "",
};

function SpecialCasesPage() {
  const navigate = useNavigate();

  const [specialCases, setSpecialCases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [specialCaseForm, setSpecialCaseForm] = useState(
    initialSpecialCaseForm,
  );
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const handleAddSpecialCase = () => {
    setEditingCaseId(null);
    setSpecialCaseForm(initialSpecialCaseForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCaseId(null);
    setSpecialCaseForm(initialSpecialCaseForm);
    setErrors({});
  };

  const handleSpecialCaseFormChange = (event) => {
    const { name, value } = event.target;

    setSpecialCaseForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validateSpecialCaseForm = () => {
    const newErrors = {};

    if (!specialCaseForm.fullName.trim()) {
      newErrors.fullName = "يرجى إدخال اسم صاحب الحالة الرباعي.";
    }

    if (!specialCaseForm.caseType) {
      newErrors.caseType = "يرجى اختيار نوع الحالة.";
    }

    if (!specialCaseForm.details.trim()) {
      newErrors.details = "يرجى إدخال تفاصيل الحالة.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSpecialCase = (event) => {
    event.preventDefault();

    if (!validateSpecialCaseForm()) {
      return;
    }

    if (editingCaseId) {
      setSpecialCases((currentCases) =>
        currentCases.map((specialCase) =>
          specialCase.id === editingCaseId
            ? {
                ...specialCase,
                ...specialCaseForm,
              }
            : specialCase,
        ),
      );
    } else {
      setSpecialCases((currentCases) => [
        ...currentCases,
        {
          id: Date.now(),
          ...specialCaseForm,
        },
      ]);
    }

    setIsSaved(false);
    handleCloseModal();
  };

  const handleEditSpecialCase = (specialCase) => {
    setEditingCaseId(specialCase.id);

    setSpecialCaseForm({
      fullName: specialCase.fullName,
      caseType: specialCase.caseType,
      details: specialCase.details,
    });

    setErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteSpecialCase = (caseId) => {
    setSpecialCases((currentCases) =>
      currentCases.filter((specialCase) => specialCase.id !== caseId),
    );

    setIsSaved(false);
  };

  const handleDraftSave = () => {
    setIsSaved(true);
  };

  const handleSaveAndContinue = () => {
    setIsSaved(true);
    navigate("/family/married-daughters");
  };

  const getCaseTypeLabel = (caseType) => {
    const labels = {
      patient: "مريض",
      injured: "جريح",
      disability: "ذوي إعاقة",
      martyr: "شهيد",
    };

    return labels[caseType] || "";
  };

  const inputClassName = (fieldName) =>
    `w-full rounded-xl border bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
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
              الحالات الخاصة
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              أضف بيانات الحالات الخاصة الموجودة داخل الأسرة.
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
              الحالات الخاصة المضافة
            </h2>

            <span className="w-fit rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#031632]">
              عدد الحالات: {specialCases.length}
            </span>
          </div>

          {specialCases.length === 0 ? (
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
                    d="M9 3.75h6a1.5 1.5 0 0 1 1.5 1.5v2.25H18a2.25 2.25 0 0 1 2.25 2.25v9A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 6 7.5h1.5V5.25A1.5 1.5 0 0 1 9 3.75Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 7.5h6M12 11.25v6m-3-3h6"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-base font-bold text-[#031632]">
                لم تتم إضافة أي حالة خاصة حتى الآن.
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-7 text-slate-500">
                اضغط على الزر أدناه لإضافة بيانات حالة خاصة داخل الأسرة.
              </p>

              <button
                type="button"
                onClick={handleAddSpecialCase}
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

                إضافة حالة خاصة
              </button>
            </div>
          ) : (
            <div className="py-6">
              <div className="grid gap-4 md:grid-cols-2">
                {specialCases.map((specialCase, index) => (
                  <div
                    key={specialCase.id}
                    className="rounded-2xl border border-slate-200 bg-[#fafafe] p-5"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-semibold text-[#d8ad55]">
                          الحالة الخاصة {index + 1}
                        </span>

                        <h3 className="mt-1 text-base font-bold text-[#031632]">
                          {specialCase.fullName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditSpecialCase(specialCase)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#031632] transition hover:border-[#d8ad55] hover:bg-[#f5f3ed]"
                          aria-label="تعديل الحالة الخاصة"
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
                          onClick={() =>
                            handleDeleteSpecialCase(specialCase.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50"
                          aria-label="حذف الحالة الخاصة"
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

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs text-slate-500">نوع الحالة</p>

                        <span className="mt-2 inline-flex rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                          {getCaseTypeLabel(specialCase.caseType)}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          تفاصيل الحالة
                        </p>

                        <p className="mt-1 text-sm leading-7 text-[#031632]">
                          {specialCase.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddSpecialCase}
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

                إضافة حالة خاصة أخرى
              </button>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/family/children"
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
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#031632]">
                  {editingCaseId
                    ? "تعديل الحالة الخاصة"
                    : "إضافة حالة خاصة"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  أدخل بيانات الحالة الخاصة بدقة.
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

            <form onSubmit={handleSaveSpecialCase} className="p-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="specialCaseFullName"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    اسم صاحب الحالة الرباعي{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="specialCaseFullName"
                    name="fullName"
                    type="text"
                    value={specialCaseForm.fullName}
                    onChange={handleSpecialCaseFormChange}
                    placeholder="أدخل الاسم الرباعي"
                    className={`${inputClassName("fullName")} h-12`}
                  />

                  {errors.fullName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="caseType"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    نوع الحالة <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="caseType"
                    name="caseType"
                    value={specialCaseForm.caseType}
                    onChange={handleSpecialCaseFormChange}
                    className={`${inputClassName("caseType")} h-12`}
                  >
                    <option value="">اختر...</option>
                    <option value="patient">مريض</option>
                    <option value="injured">جريح</option>
                    <option value="disability">ذوي إعاقة</option>
                    <option value="martyr">شهيد</option>
                  </select>

                  {errors.caseType && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.caseType}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="caseDetails"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    تفاصيل الحالة <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="caseDetails"
                    name="details"
                    value={specialCaseForm.details}
                    onChange={handleSpecialCaseFormChange}
                    rows={5}
                    placeholder="اكتب تفاصيل الحالة بشكل واضح."
                    className={`${inputClassName("details")} resize-none py-3 leading-7`}
                  />

                  {errors.details && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.details}
                    </p>
                  )}
                </div>
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
                  {editingCaseId
                    ? "حفظ التعديلات"
                    : "حفظ الحالة الخاصة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default SpecialCasesPage;