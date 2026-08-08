import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

function SettingsPage() {
  const [registrationStatus, setRegistrationStatus] =
    useState("open");

  const [registrationStart, setRegistrationStart] =
    useState("");

  const [registrationEnd, setRegistrationEnd] =
    useState("");

  const [editingEnabled, setEditingEnabled] =
    useState(true);

  const [systemName, setSystemName] =
    useState("Salman Family Registry");

  const [familiesCount, setFamiliesCount] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSavingPeriod, setIsSavingPeriod] =
    useState(false);

  const [isChangingRegistration, setIsChangingRegistration] =
    useState(false);

  const [isChangingEditing, setIsChangingEditing] =
    useState(false);

  const [isCreatingBackup, setIsCreatingBackup] =
    useState(false);

  const getAdminToken = () =>
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken");

  const clearAdminSession = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
  };

  const handleUnauthorized = () => {
    clearAdminSession();
    window.location.href = "/admin/login";
  };

  const toDateInputValue = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      date.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchSettingsPageData = async () => {
      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      setIsLoading(true);

      try {
        const [
          settingsResponse,
          dashboardResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/admin/settings`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              signal: controller.signal,
            },
          ),

          fetch(
            `${API_BASE_URL}/api/admin/dashboard/stats`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              signal: controller.signal,
            },
          ),
        ]);

        if (
          settingsResponse.status === 401 ||
          dashboardResponse.status === 401
        ) {
          handleUnauthorized();
          return;
        }

        const settingsData =
          await settingsResponse
            .json()
            .catch(() => ({}));

        const dashboardData =
          await dashboardResponse
            .json()
            .catch(() => ({}));

        if (!settingsResponse.ok) {
          throw new Error(
            settingsData.message ||
              "حدث خطأ أثناء جلب إعدادات النظام.",
          );
        }

        if (!dashboardResponse.ok) {
          throw new Error(
            dashboardData.message ||
              "حدث خطأ أثناء جلب إحصائيات النظام.",
          );
        }

        const settings =
          settingsData.data?.settings;

        if (settings) {
          setRegistrationStatus(
            settings.registration_enabled
              ? "open"
              : "closed",
          );

          setEditingEnabled(
            Boolean(
              settings.global_editing_enabled,
            ),
          );

          setRegistrationStart(
            toDateInputValue(
              settings.registration_opens_at,
            ),
          );

          setRegistrationEnd(
            toDateInputValue(
              settings.registration_closes_at,
            ),
          );

          setSystemName(
            settings.system_name ||
              "Salman Family Registry",
          );
        }

        setFamiliesCount(
          Number(
            dashboardData.data?.total_families,
          ) || 0,
        );
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(
          "Settings page load error:",
          error,
        );

        window.alert(
          error.message ||
            "حدث خطأ أثناء تحميل إعدادات النظام.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchSettingsPageData();

    return () => {
      controller.abort();
    };
  }, []);

  const handleOpenRegistration = async () => {
    if (
      registrationStatus === "open" ||
      isChangingRegistration
    ) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setIsChangingRegistration(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/settings/registration/open`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "حدث خطأ أثناء فتح التسجيل.",
        );
      }

      setRegistrationStatus("open");
    } catch (error) {
      window.alert(
        error.message ||
          "حدث خطأ أثناء فتح التسجيل.",
      );
    } finally {
      setIsChangingRegistration(false);
    }
  };

  const handleCloseRegistration = async () => {
    if (
      registrationStatus === "closed" ||
      isChangingRegistration
    ) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setIsChangingRegistration(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/settings/registration/close`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "حدث خطأ أثناء إغلاق التسجيل.",
        );
      }

      setRegistrationStatus("closed");
    } catch (error) {
      window.alert(
        error.message ||
          "حدث خطأ أثناء إغلاق التسجيل.",
      );
    } finally {
      setIsChangingRegistration(false);
    }
  };

 const handleToggleEditing = async () => {
  if (isChangingEditing) {
    return;
  }

  const token = getAdminToken();

  if (!token) {
    handleUnauthorized();
    return;
  }

  const nextValue = !editingEnabled;

  setIsChangingEditing(true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/settings`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          global_editing_enabled: nextValue,
        }),
      },
    );

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          "حدث خطأ أثناء تحديث صلاحية التعديل.",
      );
    }

    const settings = data.data?.settings;

    if (settings) {
      setEditingEnabled(
        Boolean(
          settings.global_editing_enabled,
        ),
      );
    } else {
      setEditingEnabled(nextValue);
    }
  } catch (error) {
    console.error(
      "Toggle editing error:",
      error,
    );

    window.alert(
      error.message ||
        "حدث خطأ أثناء تحديث صلاحية التعديل.",
    );
  } finally {
    setIsChangingEditing(false);
  }
};

  const handleSaveRegistrationPeriod = async (
    event,
  ) => {
    event.preventDefault();

    if (isSavingPeriod) {
      return;
    }

    if (
      registrationStart &&
      registrationEnd &&
      registrationStart > registrationEnd
    ) {
      window.alert(
        "تاريخ بداية التسجيل يجب أن يكون قبل تاريخ نهاية التسجيل.",
      );

      return;
    }

    const token = getAdminToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setIsSavingPeriod(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/settings`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            registration_opens_at:
              registrationStart || null,

            registration_closes_at:
              registrationEnd || null,
          }),
        },
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "حدث خطأ أثناء حفظ فترة التسجيل.",
        );
      }

      const settings =
        data.data?.settings;

      if (settings) {
        setRegistrationStart(
          toDateInputValue(
            settings.registration_opens_at,
          ),
        );

        setRegistrationEnd(
          toDateInputValue(
            settings.registration_closes_at,
          ),
        );
      }

      window.alert(
        data.message ||
          "تم حفظ فترة التسجيل بنجاح.",
      );
    } catch (error) {
      window.alert(
        error.message ||
          "حدث خطأ أثناء حفظ فترة التسجيل.",
      );
    } finally {
      setIsSavingPeriod(false);
    }
  };

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);

    // مؤقت لحين إنشاء Backup API
    window.setTimeout(() => {
      setIsCreatingBackup(false);
    }, 1000);
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#031632]">
          إعدادات النظام
        </h1>

        <p className="mt-2 text-slate-500">
          إدارة فترة التسجيل وصلاحية التعديل والنسخ الاحتياطي
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 border-t-4 border-t-[#031632] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#031632]">
                حالة التسجيل
              </h2>

              <p className="mt-2 text-slate-500">
                التحكم في فتح وإغلاق تسجيل الأسر
              </p>
            </div>

            <span
              className={`rounded-full border px-4 py-2 font-semibold ${
                registrationStatus === "open"
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
            >
              {isLoading
                ? "جارٍ التحميل..."
                : registrationStatus === "open"
                  ? "التسجيل مفتوح"
                  : "التسجيل مغلق"}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleOpenRegistration}
              disabled={
                isLoading ||
                isChangingRegistration ||
                registrationStatus === "open"
              }
              className="rounded-xl border-2 border-green-600 px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isChangingRegistration &&
              registrationStatus === "closed"
                ? "جارٍ فتح التسجيل..."
                : "إعادة فتح التسجيل"}
            </button>

            <button
              type="button"
              onClick={handleCloseRegistration}
              disabled={
                isLoading ||
                isChangingRegistration ||
                registrationStatus === "closed"
              }
              className="rounded-xl border-2 border-red-600 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isChangingRegistration &&
              registrationStatus === "open"
                ? "جارٍ إغلاق التسجيل..."
                : "إغلاق التسجيل"}
            </button>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-[#031632]">
            السماح بتعديل البيانات
          </h2>

          <p className="mt-2 leading-7 text-slate-500">
            عند تفعيل هذا الخيار تستطيع الأسر تعديل استماراتها خلال فترة
            التسجيل.
          </p>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-[#f8f9fd] p-4">
            <div>
              <p className="font-bold text-[#111c2c]">
                تعديل بيانات الأسر
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {isLoading
                  ? "جارٍ تحميل الحالة..."
                  : editingEnabled
                    ? "التعديل مسموح حاليًا"
                    : "التعديل متوقف حاليًا"}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={editingEnabled}
              onClick={handleToggleEditing}
              disabled={
                isLoading ||
                isChangingEditing
              }
              className={`relative h-8 w-14 rounded-full transition ${
                editingEnabled
                  ? "bg-green-600"
                  : "bg-slate-300"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                  editingEnabled
                    ? "right-1"
                    : "right-7"
                }`}
              />
            </button>
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#031632]">
            فترة التسجيل
          </h2>

          <p className="mt-2 text-slate-500">
            تحديد تاريخ بداية ونهاية استقبال الاستمارات
          </p>
        </div>

        <form
          className="mt-6"
          onSubmit={handleSaveRegistrationPeriod}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="settingsRegistrationStart"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                تاريخ بداية التسجيل
              </label>

              <input
                id="settingsRegistrationStart"
                type="date"
                value={registrationStart}
                onChange={(event) =>
                  setRegistrationStart(
                    event.target.value,
                  )
                }
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="settingsRegistrationEnd"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                تاريخ نهاية التسجيل
              </label>

              <input
                id="settingsRegistrationEnd"
                type="date"
                value={registrationEnd}
                onChange={(event) =>
                  setRegistrationEnd(
                    event.target.value,
                  )
                }
                min={
                  registrationStart ||
                  undefined
                }
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              isSavingPeriod
            }
            className="mt-5 rounded-xl bg-[#031632] px-7 py-3 font-semibold text-white transition hover:bg-[#1a2b48] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingPeriod
              ? "جارٍ حفظ الفترة..."
              : "حفظ فترة التسجيل"}
          </button>
        </form>
      </article>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-[#031632]">
            النسخ الاحتياطي
          </h2>

          <p className="mt-2 leading-7 text-slate-500">
            إنشاء نسخة احتياطية من بيانات النظام لحمايتها من الفقدان.
          </p>

          <div className="mt-5 rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4">
            <p className="text-sm text-slate-500">
              آخر نسخة احتياطية
            </p>

            <p className="mt-2 font-bold text-[#031632]">
              لم يتم إنشاء نسخة احتياطية بعد
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            className="mt-5 w-full rounded-xl bg-[#031632] px-5 py-3 font-semibold text-white transition hover:bg-[#1a2b48] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingBackup
              ? "جارٍ إنشاء النسخة..."
              : "إنشاء نسخة احتياطية الآن"}
          </button>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-[#031632]">
            معلومات النظام
          </h2>

          <div className="mt-5">
            <div className="flex justify-between gap-4 border-b border-slate-100 py-3">
              <span className="text-slate-500">
                اسم النظام
              </span>

              <span className="font-bold text-[#111c2c]">
                {isLoading
                  ? "..."
                  : systemName}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 py-3">
              <span className="text-slate-500">
                الإصدار
              </span>

              <span className="font-bold text-[#111c2c]">
                1.0.0
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 py-3">
              <span className="text-slate-500">
                عدد الأسر
              </span>

              <span className="font-bold text-[#111c2c]">
                {isLoading
                  ? "..."
                  : familiesCount.toLocaleString(
                      "en-US",
                    )}
              </span>
            </div>

            <div className="flex justify-between gap-4 py-3">
              <span className="text-slate-500">
                حالة النظام
              </span>

              <span className="font-bold text-green-700">
                يعمل بشكل طبيعي
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default SettingsPage;