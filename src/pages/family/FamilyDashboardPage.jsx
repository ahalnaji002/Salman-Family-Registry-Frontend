import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

const RESPONSIBLE_NAME = "أحمد مسعود";
const WHATSAPP_NUMBER = "972594762842";

const formStatusLabels = {
  draft: "مسودة",
  submitted: "تم الإرسال",
  approved: "معتمد",
  rejected: "مرفوض",
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "غير متوفر";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "غير متوفر";
  }

  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

function FamilyDashboardPage() {
  const navigate = useNavigate();

  const [isContactModalOpen, setIsContactModalOpen] =
    useState(false);

  const [familyData, setFamilyData] = useState(null);
  const [completionData, setCompletionData] =
    useState(null);
  const [editingStatus, setEditingStatus] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      setLoading(true);
      setError("");

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const [
          familyResponse,
          completionResponse,
          editingResponse,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/family", {
            headers,
          }),
          fetch(
            "http://localhost:5000/api/family/completion",
            {
              headers,
            },
          ),
          fetch(
            "http://localhost:5000/api/family/editing-status",
            {
              headers,
            },
          ),
        ]);

        if (
          familyResponse.status === 401 ||
          completionResponse.status === 401 ||
          editingResponse.status === 401
        ) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("family");

          navigate("/login", { replace: true });
          return;
        }

        const familyResult = await familyResponse
          .json()
          .catch(() => ({}));

        const completionResult =
          await completionResponse
            .json()
            .catch(() => ({}));

        const editingResult = await editingResponse
          .json()
          .catch(() => ({}));

        if (!familyResponse.ok) {
          throw new Error(
            familyResult.message ||
              "تعذر جلب بيانات الأسرة.",
          );
        }

        if (!completionResponse.ok) {
          throw new Error(
            completionResult.message ||
              "تعذر جلب نسبة اكتمال الاستمارة.",
          );
        }

        if (!editingResponse.ok) {
          throw new Error(
            editingResult.message ||
              "تعذر جلب حالة التعديل.",
          );
        }

        setFamilyData(familyResult.data || null);
        setCompletionData(
          completionResult.data || null,
        );
        setEditingStatus(editingResult.data || null);
      } catch (requestError) {
        if (requestError instanceof TypeError) {
          setError(
            "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل على المنفذ 5000.",
          );
        } else {
          setError(
            requestError.message ||
              "حدث خطأ أثناء تحميل لوحة الأسرة.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate, token]);

  const family = familyData?.family || null;

  const completionSections =
    completionData?.sections || [];

  const getCompletionSection = (key) =>
    completionSections.find(
      (section) => section.key === key,
    );

  const familyHeadCompleted = Boolean(
    getCompletionSection("family_head")?.completed,
  );

  const photoCompleted = Boolean(
    getCompletionSection("personal_photo")?.completed,
  );

  const housingCompleted = Boolean(
    getCompletionSection("housing")?.completed,
  );

  const wivesSection =
    getCompletionSection("wives");

  const childrenCompleted = Boolean(
    getCompletionSection("children")?.completed,
  );

  const basicInfoCompleted =
    familyHeadCompleted && photoCompleted;

  const wivesRequired =
    wivesSection?.required ??
    family?.marital_status === "married";

  const wivesCompleted =
    wivesRequired &&
    Boolean(wivesSection?.completed);

  const specialCasesCount =
    familyData?.special_cases?.length || 0;

  const marriedDaughtersCount =
    familyData?.married_daughters?.length || 0;

  const percentage =
    Number(completionData?.percentage) || 0;

  const formStatus =
    editingStatus?.form_status ||
    completionData?.form_status ||
    family?.form_status ||
    "draft";

  const canEdit =
    editingStatus?.can_edit ??
    Boolean(family?.editing_enabled);

  const statusLabel =
    formStatusLabels[formStatus] || formStatus;

  const sections = useMemo(
    () => [
      {
        title: "البيانات الأساسية",
        description:
          "المعلومات الشخصية وبيانات التواصل",
        status: basicInfoCompleted
          ? "مكتمل"
          : "غير مكتمل",
        state: basicInfoCompleted
          ? "completed"
          : "incomplete",
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
  status: wivesCompleted
    ? "مكتمل"
    : "غير مكتمل",
  state: wivesCompleted
    ? "completed"
    : "incomplete",
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
        status: housingCompleted
          ? "مكتمل"
          : "غير مكتمل",
        state: housingCompleted
          ? "completed"
          : "incomplete",
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
        status: childrenCompleted
          ? "مكتمل"
          : "لم يبدأ",
        state: childrenCompleted
          ? "completed"
          : "incomplete",
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
        description:
          "بيانات المرضى والجرحى وذوي الإعاقة والشهداء",
        status:
          specialCasesCount > 0
            ? "مكتمل"
            : "لم يبدأ",
        state:
          specialCasesCount > 0
            ? "completed"
            : "incomplete",
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
        description:
          "بيانات البنات المتزوجات وأزواجهن",
        status:
          marriedDaughtersCount > 0
            ? "مكتمل"
            : "لم يبدأ",
        state:
          marriedDaughtersCount > 0
            ? "completed"
            : "incomplete",
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
    ],
    [
      basicInfoCompleted,
      wivesRequired,
      wivesCompleted,
      housingCompleted,
      childrenCompleted,
      specialCasesCount,
      marriedDaughtersCount,
    ],
  );

  const whatsappMessage =
    `السلام عليكم، أواجه مشكلة في تعبئة استمارة عائلة سلمان. اسم رب الأسرة: ${
      family?.full_name || ""
    }.`;

  const whatsappLink =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage,
    )}`;

  if (loading) {
    return (
      <section className="px-5 py-10 md:px-8 md:py-12">
        <div className="mx-auto flex min-h-[420px] w-full max-w-5xl items-center justify-center">
          <div className="text-center">
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#031632]" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              جاري تحميل بيانات الأسرة...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-5 py-10 md:px-8 md:py-12">
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <h2 className="text-lg font-bold text-red-700">
              تعذر تحميل لوحة الأسرة
            </h2>

            <p className="mt-2 text-sm leading-7 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 rounded-xl bg-[#031632] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#142947]"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-10 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#031632] md:text-3xl">
            أهلاً وسهلاً {family?.full_name || "بك"}
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
                  {statusLabel}
                </span>

                {!canEdit && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    التعديل مغلق
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-500">
                  نسبة الإنجاز الإجمالية
                </span>

                <span className="font-bold text-[#031632]">
                  {percentage}%
                </span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#d8ad55] transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Math.max(percentage, 0),
                      100,
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                <span>
                  آخر تعديل:{" "}
                  {formatDate(family?.updated_at)}
                </span>

                <span>
                  الموعد النهائي: 15 أغسطس 2026
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
              {canEdit ? (
                <Link
                  to="/family/basic-info"
                  className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-[#031632] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
                >
                  متابعة تعبئة الاستمارة
                  <span aria-hidden="true">←</span>
                </Link>
              ) : (
                <Link
                  to="/family/review"
                  className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-[#031632] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
                >
                  عرض الاستمارة
                  <span aria-hidden="true">←</span>
                </Link>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/family/review"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
                >
                  عرض
                </Link>

                {canEdit ? (
                  <Link
                    to="/family/basic-info"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
                  >
                    تعديل
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-slate-400"
                  >
                    تعديل
                  </button>
                )}
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

        {editingStatus?.reason && !canEdit && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium leading-7 text-red-700">
              {editingStatus.reason}
            </p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#031632]">
            أقسام الاستمارة
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => {
              const completed =
                section.state === "completed";

              const optional =
                section.state === "optional";

              return (
                <Link
                  key={section.title}
                  to={section.path}
                  className={`group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    completed
                      ? "border-slate-200"
                      : optional
                        ? "border-slate-200"
                        : "border-[#d8ad55]/45"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        completed
                          ? "bg-[#031632] text-white"
                          : optional
                            ? "bg-[#eef3fb] text-slate-500"
                            : "bg-[#f5f3ed] text-[#031632]"
                      }`}
                    >
                      {section.icon}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        completed
                          ? "bg-[#eef3fb] text-[#031632]"
                          : optional
                            ? "bg-slate-100 text-slate-500"
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
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#031632] px-6 py-5 text-white sm:flex-row">
          <div>
            <h2 className="text-base font-bold">
              هل واجهتك مشكلة؟
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              نحن هنا لمساعدتك في أي خطوة خلال تعبئة الاستمارة.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsContactModalOpen(true)
            }
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
            if (
              event.target === event.currentTarget
            ) {
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
                onClick={() =>
                  setIsContactModalOpen(false)
                }
                aria-label="إغلاق"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#031632]"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-xl bg-[#f8f8fe] p-4">
                <p className="font-bold text-[#031632]">
                  {RESPONSIBLE_NAME}
                </p>

                <p
                  dir="ltr"
                  className="mt-1 text-left text-sm text-slate-500"
                >
                  +{WHATSAPP_NUMBER}
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                يرجى توضيح المشكلة وذكر اسم رب الأسرة عند التواصل، حتى تتم
                مساعدتك بشكل أسرع.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    setIsContactModalOpen(false)
                  }
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600"
                >
                  إلغاء
                </button>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#1fa855] px-5 text-sm font-semibold text-white"
                >
                  فتح واتساب
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