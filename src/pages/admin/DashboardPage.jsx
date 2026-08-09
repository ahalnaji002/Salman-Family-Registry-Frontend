import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import AddSupervisorModal from "./AddSupervisorModal";
import EditSupervisorModal from "./EditSupervisorModal";

const API_BASE_URL = "http://localhost:5000";

const initialSupervisors = [
  {
    name: "أحمد محمد سلمان",
    nationalId: "1023456789",
    phone: "0501234567",
    status: "نشط",
    permissions: "كامل الصلاحيات",
  },
  {
    name: "خالد عبدالله سلمان",
    nationalId: "1098765432",
    phone: "0559876543",
    status: "نشط",
    permissions: "عرض وتصدير",
  },
];

function DashboardPage() {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    totalFamilies: 0,
    submittedFamilies: 0,
    draftFamilies: 0,
    editingEnabledFamilies: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [supervisors, setSupervisors] = useState(initialSupervisors);

  const [isAddSupervisorOpen, setIsAddSupervisorOpen] = useState(false);

  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  const [isEditSupervisorOpen, setIsEditSupervisorOpen] = useState(false);

  const getAdminToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const clearAdminSession = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const loadDashboardStats = async () => {
      const token = getAdminToken();

      if (!token) {
        clearAdminSession();

        navigate("/login", { replace: true });

        return;
      }

      setStatsLoading(true);
      setStatsError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          clearAdminSession();
          navigate("/login", { replace: true });
          return;
        }

        if (response.status === 403) {
          setStatsError(
            data.message || "ليس لديك صلاحية للوصول إلى هذه البيانات.",
          );
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "تعذر تحميل إحصائيات لوحة التحكم.");
        }

        const apiStats =
          data.data?.stats ||
          data.data?.totals ||
          data.data ||
          data.stats ||
          data;

        setDashboardStats({
          totalFamilies: Number(
            apiStats.total_families ??
              apiStats.totalFamilies ??
              apiStats.total ??
              0,
          ),

          submittedFamilies: Number(
            apiStats.submitted_families ??
              apiStats.submittedFamilies ??
              apiStats.submitted ??
              0,
          ),

          draftFamilies: Number(
            apiStats.draft_families ??
              apiStats.draftFamilies ??
              apiStats.draft ??
              0,
          ),

          editingEnabledFamilies: Number(
            apiStats.editing_enabled_families ??
              apiStats.editingEnabledFamilies ??
              apiStats.editing_enabled ??
              0,
          ),
        });
      } catch (requestError) {
        if (requestError instanceof TypeError) {
          setStatsError(
            "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل على المنفذ 5000.",
          );
        } else {
          setStatsError(
            requestError.message || "حدث خطأ أثناء تحميل إحصائيات لوحة التحكم.",
          );
        }
      } finally {
        setStatsLoading(false);
      }
    };

    loadDashboardStats();
  }, [navigate]);

  const completionPercentage =
    dashboardStats.totalFamilies > 0
      ? Math.round(
          (dashboardStats.submittedFamilies / dashboardStats.totalFamilies) *
            100,
        )
      : 0;

  const stats = useMemo(
    () => [
      {
        title: "إجمالي الأسر المسجلة",
        value: dashboardStats.totalFamilies,
        note: "جميع الأسر المسجلة",
      },
      {
        title: "الاستمارات المكتملة",
        value: dashboardStats.submittedFamilies,
        note: `${completionPercentage}% نسبة الإنجاز`,
      },
      {
        title: "الاستمارات غير المكتملة",
        value: dashboardStats.draftFamilies,
        note: "ما زالت قيد الاستكمال",
      },
      {
        title: "الأسر المتاح لها التعديل",
        value: dashboardStats.editingEnabledFamilies,
        note: "التعديل مفتوح حاليًا",
      },
    ],
    [dashboardStats, completionPercentage],
  );

  const handleAddSupervisor = (newSupervisor) => {
    setSupervisors((currentSupervisors) => [
      ...currentSupervisors,
      newSupervisor,
    ]);
  };

  const handleOpenEditSupervisor = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsEditSupervisorOpen(true);
  };

  const handleCloseEditSupervisor = () => {
    setIsEditSupervisorOpen(false);
    setSelectedSupervisor(null);
  };

  const handleSaveSupervisor = (updatedSupervisor) => {
    setSupervisors((currentSupervisors) =>
      currentSupervisors.map((supervisor) =>
        supervisor.nationalId === selectedSupervisor?.nationalId
          ? updatedSupervisor
          : supervisor,
      ),
    );
  };

  return (
    <section className="space-y-8">
      {statsError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700"
        >
          {statsError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-lg font-bold text-[#111c2c]">{stat.title}</p>

            <div className="mt-5 flex items-end justify-between gap-3">
              <p className="text-3xl font-bold text-[#031632]">
                {statsLoading ? "..." : stat.value}
              </p>

              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#34446b]">
                {stat.note}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-[#031632]">
              عرض الأسر المسجلة
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              البحث عن الأسرة وعرض بياناتها وتعديلها، مراجعة تفاصيل الاستمارات
              المرفوعة وتحديث الحالات.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/families")}
              className="mt-6 w-full rounded-xl border-2 border-[#031632] px-4 py-3 font-semibold text-[#031632] transition hover:bg-[#031632] hover:text-white"
            >
              الانتقال للقائمة
            </button>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-[#031632]">تصدير البيانات</h2>

            <p className="mt-4 leading-8 text-slate-600">
              تصدير بيانات جميع الأسر المسجلة إلى ملف Excel للاستفادة منها في
              نسخة احتياطية أو للتحليل الخارجي.
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/export")}
              className="mt-6 w-full rounded-xl bg-[#dbe6ff] px-4 py-3 font-semibold text-[#031632] transition hover:bg-[#cbd9fb]"
            >
              الانتقال إلى التصدير
            </button>
          </article>
        </div>

        <article className="self-start rounded-2xl border border-slate-200 border-t-4 border-t-[#031632] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-[#031632]">إعدادات التسجيل</h2>

          <p className="mt-4 leading-8 text-slate-600">
            يتم التحكم في فتح وإغلاق التسجيل وتحديد تاريخ بداية ونهاية فترة
            التسجيل من صفحة الإعدادات.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/settings")}
            className="mt-6 w-full rounded-xl bg-[#031632] px-5 py-3 font-semibold text-white transition hover:bg-[#1a2b48]"
          >
            الانتقال إلى الإعدادات
          </button>
        </article>
      </div>

      {/* كود إدارة المشرفين الحالي كامل كما هو */}
      {false && (
        <article className="rounded-2xl border border-slate-200 border-t-4 border-t-[#031632] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-[#031632]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
                />

                <circle cx="9.5" cy="7" r="4" />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 8v6M22 11h-6"
                />
              </svg>

              <span>إدارة المشرفين</span>
            </h2>

            <button
              type="button"
              onClick={() => setIsAddSupervisorOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#1a2b48] px-5 py-3 font-semibold text-white transition hover:bg-[#031632]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
                />

                <circle cx="9.5" cy="7" r="4" />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 8v6M22 11h-6"
                />
              </svg>

              <span>إضافة مشرف</span>
            </button>
          </div>

          <p className="mt-6 text-slate-600">
            عدد المشرفين الحاليين:
            <span className="mr-2 rounded-full bg-[#dbe6ff] px-3 py-1 font-bold text-[#031632]">
              {supervisors.length}
            </span>
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[850px] text-right">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-600">
                  <th className="px-4 py-4">الاسم</th>

                  <th className="px-4 py-4">رقم الهوية</th>

                  <th className="px-4 py-4">رقم الجوال</th>

                  <th className="px-4 py-4">الحالة</th>

                  <th className="px-4 py-4">الصلاحيات</th>

                  <th className="px-4 py-4">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {supervisors.map((supervisor) => (
                  <tr
                    key={supervisor.nationalId}
                    className="border-b border-slate-100"
                  >
                    <td className="px-4 py-5 font-medium text-[#111c2c]">
                      {supervisor.name}
                    </td>

                    <td className="px-4 py-5 text-slate-600">
                      {supervisor.nationalId}
                    </td>

                    <td className="px-4 py-5 text-slate-600">
                      {supervisor.phone}
                    </td>

                    <td className="px-4 py-5">
                      <span className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                        {supervisor.status}
                      </span>
                    </td>

                    <td className="px-4 py-5 text-slate-600">
                      {supervisor.permissions}
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSupervisor(supervisor)}
                          aria-label="تعديل المشرف"
                          title="تعديل"
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-[#34446b] transition hover:bg-slate-50"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 20h9"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          aria-label="تعطيل المشرف"
                          title="تعطيل"
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-300 text-red-600 transition hover:bg-red-50"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="9" />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m7.5 7.5 9 9"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}

      <AddSupervisorModal
        isOpen={isAddSupervisorOpen}
        onClose={() => setIsAddSupervisorOpen(false)}
        onAdd={handleAddSupervisor}
      />

      <EditSupervisorModal
        isOpen={isEditSupervisorOpen}
        supervisor={selectedSupervisor}
        onClose={handleCloseEditSupervisor}
        onSave={handleSaveSupervisor}
      />
    </section>
  );
}

export default DashboardPage;
