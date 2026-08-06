import { useState } from "react";
import { Link } from "react-router";

const RESPONSIBLE_NAME = "جهاد بكر الشناط";
const WHATSAPP_NUMBER = "972597930636";
const WHATSAPP_MESSAGE =
  "السلام عليكم، أواجه مشكلة في تعبئة استمارة عائلة سلمان. اسم رب الأسرة: محمد أحمد سلمان.";

const sections = [
  {
    title: "البيانات الأساسية",
    description: "المعلومات الشخصية وبيانات التواصل",
    status: "مكتمل",
    completed: true,
    path: "/family/basic-info",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
        />
      </svg>
    ),
  },
  {
    title: "الزوجات",
    description: "بيانات الزوجة أو الزوجات",
    status: "مكتمل",
    completed: true,
    path: "/family/wives",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.1 9.1 0 0 0 3.74-.48 3 3 0 0 0-4.68-2.72M18 18.72a9.1 9.1 0 0 1-5.25-1.64m5.25 1.64v.78m-5.25-2.42a9.1 9.1 0 0 1-5.25 1.64m5.25-1.64a5.25 5.25 0 1 0-10.5 0m10.5 0v.78m-5.25-1.64a9.1 9.1 0 0 0-3.74-.48 3 3 0 0 0-4.68 2.72 9.1 9.1 0 0 0 3.74.48"
        />
      </svg>
    ),
  },
  {
    title: "السكن",
    description: "بيانات السكن السابق والحالي",
    status: "مكتمل",
    completed: true,
    path: "/family/housing",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 12 8.95-8.95a1.13 1.13 0 0 1 1.6 0L21.75 12M4.5 9.75v10.5h15V9.75M9 20.25v-6h6v6"
        />
      </svg>
    ),
  },
  {
    title: "الأبناء",
    description: "إضافة بيانات الأبناء",
    status: "غير مكتمل",
    completed: false,
    path: "/family/children",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
        />
      </svg>
    ),
  },
  {
    title: "الحالات الخاصة",
    description: "بيانات المرضى والجرحى وذوي الإعاقة والشهداء",
    status: "غير مكتمل",
    completed: false,
    path: "/family/special-cases",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s-7.5-4.35-7.5-10.5A4.5 4.5 0 0 1 12 7.15a4.5 4.5 0 0 1 7.5 3.35C19.5 16.65 12 21 12 21Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-3-3v6"
        />
      </svg>
    ),
  },
  {
    title: "البنات المتزوجات",
    description: "بيانات البنات المتزوجات وأزواجهن",
    status: "لم يبدأ",
    completed: false,
    path: "/family/married-daughters",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3.75a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM5.25 20.25a6.75 6.75 0 0 1 13.5 0"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.75 8.25h3m-1.5-1.5v3"
        />
      </svg>
    ),
  },
];

function FamilyDashboardPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}`;

  return (
    <section className="px-5 py-10 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#031632] md:text-3xl">
            أهلاً وسهلاً محمد أحمد سلمان
          </h1>

          <p className="mt-2 text-sm leading-7 text-slate-500 md:text-base">
            يمكنك من هنا متابعة تعبئة بيانات أسرتك وتحديثها بكل سهولة
          </p>
        </div>

        <div className="mt-9 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-bold text-[#031632]">
                  حالة الاستمارة العائلية
                </h2>

                <span className="rounded-full bg-[#eef3fb] px-3 py-1 text-xs font-semibold text-[#031632]">
                  مسودة
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-500">نسبة الإنجاز الإجمالية</span>
                <span className="font-bold text-[#031632]">65%</span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[65%] rounded-full bg-[#d8ad55]" />
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                <span>آخر تعديل: 6 أغسطس 2026</span>
                <span>الموعد النهائي: 15 أغسطس 2026</span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
              <Link
                to="/family/basic-info"
                className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-[#031632] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
              >
                متابعة تعبئة الاستمارة
                <span aria-hidden="true">←</span>
              </Link>

              <div className="grid grid-cols-2 gap-3">
  <Link
    to="/family/review"
    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
  >
    عرض
  </Link>

  <Link
    to="/family/basic-info"
    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
  >
    تعديل
  </Link>
</div>
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-xl border border-[#d8ad55]/35 bg-[#eef3ff] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#d8ad55]">
              !
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#031632]">
                تنبيه مهم حول الموعد النهائي
              </h3>

              <p className="mt-1 text-sm leading-7 text-slate-600">
                يرجى استكمال وتأكيد جميع بيانات الاستمارة قبل تاريخ 15 أغسطس
                2026. لن تتمكن من إجراء أي تعديلات بعد هذا التاريخ.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#031632]">أقسام الاستمارة</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.title}
                to={section.path}
                className={`group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  section.completed
                    ? "border-slate-200"
                    : "border-[#d8ad55]/45"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      section.completed
                        ? "bg-[#031632] text-white"
                        : "bg-[#f5f3ed] text-[#031632]"
                    }`}
                  >
                    {section.icon}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      section.completed
                        ? "bg-[#eef3fb] text-[#031632]"
                        : "bg-[#fff1cf] text-[#8a6518]"
                    }`}
                  >
                    {section.status}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold text-[#031632]">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#031632] px-6 py-5 text-white sm:flex-row">
          <div>
            <h2 className="text-base font-bold">هل واجهتك مشكلة؟</h2>

            <p className="mt-1 text-sm text-slate-300">
              نحن هنا لمساعدتك في أي خطوة خلال تعبئة الاستمارة.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#031632] transition hover:bg-[#f5f3ed]"
          >
            تواصل مع المسؤول
          </button>
        </div>
      </div>

      {isContactModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#031632]/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsContactModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#031632]">
                  التواصل مع المسؤول
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  يمكنك التواصل مباشرة عبر واتساب.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                aria-label="إغلاق"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#031632]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
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

            <div className="p-5 sm:p-6">
              <div className="rounded-xl bg-[#f8f8fe] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#031632] text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="font-bold text-[#031632]">
                      {RESPONSIBLE_NAME}
                    </p>

                    <p dir="ltr" className="mt-1 text-left text-sm text-slate-500">
                      +{WHATSAPP_NUMBER}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                يرجى توضيح المشكلة وذكر اسم رب الأسرة عند التواصل، حتى تتم
                مساعدتك بشكل أسرع.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  إلغاء
                </button>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1fa855] px-5 text-sm font-semibold text-white transition hover:bg-[#198b47]"
                >
                  فتح واتساب
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 11.25A8.25 8.25 0 1 1 5.34 6.36a8.25 8.25 0 0 1 14.91 4.89Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5.75-3.3M8.25 8.25c.75 3 2.25 4.5 5.25 5.25"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FamilyDashboardPage;