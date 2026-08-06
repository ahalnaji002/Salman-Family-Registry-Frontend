import { useState } from "react";
import { Link, useNavigate } from "react-router";

function ReviewPage() {
  const navigate = useNavigate();

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const basicInfo = {
    fullName: "أحمد محمد سلمان",
    nationalId: "1234567890",
    dateOfBirth: "15 / 05 / 1990",
    phone: "0597253626",
    bloodType: "O+",
    maritalStatus: "متزوج",
    workStatus: "موظف",
    incomeCategory: "من 1000 إلى 3000",
  };

  const wives = [
    {
      id: 1,
      fullName: "سارة أحمد سلمان",
      nationalId: "987654321",
      phone: "0591234567",
      previousFamily: "عائلة أحمد",
      employmentStatus: "ربة أسرة",
    },
  ];

  const housing = {
    previousLocation: "غزة",
    housingType: "ملك",
    displacementType: "غير محدد",
    currentAddress: "غزة، حي الرمال، شارع الوحدة",
  };

  const children = [
    {
      id: 1,
      fullName: "خالد أحمد سلمان",
      nationalId: "123456781",
      gender: "ذكر",
      dateOfBirth: "10 / 04 / 2010",
      educationStatus: "مدرسة",
    },
    {
      id: 2,
      fullName: "سارة أحمد سلمان",
      nationalId: "123456782",
      gender: "أنثى",
      dateOfBirth: "20 / 08 / 2013",
      educationStatus: "مدرسة",
    },
  ];

  const specialCases = [
    {
      id: 1,
      fullName: "محمد أحمد سلمان",
      caseType: "مريض",
      details: "يعاني من مرض مزمن ويحتاج إلى متابعة دورية.",
    },
  ];

  const marriedDaughters = [
    {
      id: 1,
      fullName: "هدى أحمد سلمان",
      nationalId: "123456783",
      husbandName: "محمود علي",
      phone: "0599876543",
    },
  ];

  const handleSubmit = () => {
    if (!isConfirmed) {
      return;
    }

    setIsSubmitModalOpen(true);
  };

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    navigate("/family");
  };

  return (
    <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#031632] md:text-3xl">
            مراجعة الاستمارة
          </h1>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            راجع جميع البيانات بعناية قبل إرسال الاستمارة.
          </p>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#031632]">
                البيانات الأساسية
              </h2>

              <Link
                to="/family/basic-info"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
              >
                تعديل
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
              </Link>
            </div>

            <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">الاسم الكامل</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {basicInfo.fullName}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">رقم الهوية</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {basicInfo.nationalId}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">تاريخ الميلاد</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {basicInfo.dateOfBirth}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">رقم الجوال</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {basicInfo.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">فصيلة الدم</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {basicInfo.bloodType}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">الحالة الاجتماعية</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {basicInfo.maritalStatus}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">حالة العمل</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {basicInfo.workStatus}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">فئة الدخل</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {basicInfo.incomeCategory}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#031632]">الزوجات</h2>

                <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                  العدد: {wives.length}
                </span>
              </div>

              <Link
                to="/family/wives"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
              >
                تعديل
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
              </Link>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              {wives.length > 0 ? (
                wives.map((wife) => (
                  <div
                    key={wife.id}
                    className="grid gap-4 rounded-xl bg-[#f8f8fe] p-4 sm:grid-cols-2 lg:grid-cols-5"
                  >
                    <div>
                      <p className="text-xs text-slate-500">الاسم</p>
                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {wife.fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">رقم الهوية</p>
                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {wife.nationalId}
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
                        {wife.previousFamily}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        الحالة الوظيفية
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {wife.employmentStatus}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  لا توجد زوجات مضافة.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#031632]">السكن</h2>

              <Link
                to="/family/housing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
              >
                تعديل
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
              </Link>
            </div>

            <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">السكن سابقًا</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {housing.previousLocation}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">طبيعة السكن الحالي</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {housing.housingType}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">نوع سكن النزوح</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {housing.displacementType}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">العنوان الحالي</p>
                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {housing.currentAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#031632]">الأبناء</h2>

                <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                  العدد: {children.length}
                </span>
              </div>

              <Link
                to="/family/children"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
              >
                تعديل
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
              </Link>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="grid gap-4 rounded-xl bg-[#f8f8fe] p-4 sm:grid-cols-2 lg:grid-cols-5"
                >
                  <div>
                    <p className="text-xs text-slate-500">الاسم</p>
                    <p className="mt-1 text-sm font-semibold text-[#031632]">
                      {child.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">رقم الهوية</p>
                    <p className="mt-1 text-sm font-semibold text-[#031632]">
                      {child.nationalId}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">الجنس</p>
                    <p className="mt-1 text-sm font-semibold text-[#031632]">
                      {child.gender}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">تاريخ الميلاد</p>
                    <p className="mt-1 text-sm font-semibold text-[#031632]">
                      {child.dateOfBirth}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">الحالة التعليمية</p>
                    <p className="mt-1 text-sm font-semibold text-[#031632]">
                      {child.educationStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#031632]">
                  الحالات الخاصة
                </h2>

                <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                  العدد: {specialCases.length}
                </span>
              </div>

              <Link
                to="/family/special-cases"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
              >
                تعديل
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
              </Link>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              {specialCases.length > 0 ? (
                specialCases.map((specialCase) => (
                  <div
                    key={specialCase.id}
                    className="grid gap-4 rounded-xl bg-[#f8f8fe] p-4 md:grid-cols-3"
                  >
                    <div>
                      <p className="text-xs text-slate-500">اسم الحالة</p>
                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {specialCase.fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">نوع الحالة</p>
                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {specialCase.caseType}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">تفاصيل الحالة</p>
                      <p className="mt-1 text-sm leading-6 text-[#031632]">
                        {specialCase.details}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  لا توجد حالات خاصة مضافة.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#031632]">
                  البنات المتزوجات
                </h2>

                <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                  العدد: {marriedDaughters.length}
                </span>
              </div>

              <Link
                to="/family/married-daughters"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
              >
                تعديل
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
              </Link>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              {marriedDaughters.length > 0 ? (
                marriedDaughters.map((daughter) => (
                  <div
                    key={daughter.id}
                    className="grid gap-4 rounded-xl bg-[#f8f8fe] p-4 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    <div>
                      <p className="text-xs text-slate-500">الاسم</p>
                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {daughter.fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">رقم الهوية</p>
                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {daughter.nationalId}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">اسم الزوج</p>
                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {daughter.husbandName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">رقم الجوال</p>
                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {daughter.phone}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  لا توجد بنات متزوجات مضافات.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-7">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(event) => setIsConfirmed(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-slate-300 accent-[#031632]"
            />

            <span className="text-sm leading-7 text-[#031632]">
              أقر بأن جميع البيانات المدخلة صحيحة حسب علمي، وأتحمل مسؤولية صحة
              المعلومات الواردة في الاستمارة.
            </span>
          </label>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/family/married-daughters"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] sm:w-auto"
            >
              <span aria-hidden="true">→</span>
              السابق
            </Link>

            <button
              type="button"
              disabled={!isConfirmed}
              onClick={handleSubmit}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#031632] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
              إرسال الاستمارة
              <span aria-hidden="true">←</span>
            </button>
          </div>
        </div>
      </div>

      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#031632]/55 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-confirmation-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf4df] text-[#031632]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75"
                />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>

            <h2
              id="submit-confirmation-title"
              className="mt-5 text-xl font-bold text-[#031632]"
            >
              تأكيد إرسال الاستمارة
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              هل أنت متأكد من إرسال الاستمارة؟ بعد التأكيد سيتم اعتماد
              البيانات والعودة إلى الصفحة الرئيسية للأسرة.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseSubmitModal}
                className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="h-11 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
              >
                تأكيد الإرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ReviewPage;