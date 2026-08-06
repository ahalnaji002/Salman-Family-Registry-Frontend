import { useState } from "react";

function SettingsPage() {
  const [registrationStatus, setRegistrationStatus] = useState("open");
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationEnd, setRegistrationEnd] = useState("");
  const [editingEnabled, setEditingEnabled] = useState(true);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const handleSaveRegistrationPeriod = (event) => {
    event.preventDefault();

    // لاحقًا نربطه مع Backend:
    // PATCH /api/admin/settings/registration-period
    console.log({
      registrationStart,
      registrationEnd,
    });
  };

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);

    // لاحقًا:
    // POST /api/admin/backups

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
              {registrationStatus === "open"
                ? "التسجيل مفتوح"
                : "التسجيل مغلق"}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRegistrationStatus("open")}
              disabled={registrationStatus === "open"}
              className="rounded-xl border-2 border-green-600 px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              إعادة فتح التسجيل
            </button>

            <button
              type="button"
              onClick={() => setRegistrationStatus("closed")}
              disabled={registrationStatus === "closed"}
              className="rounded-xl border-2 border-red-600 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              إغلاق التسجيل
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
                {editingEnabled
                  ? "التعديل مسموح حاليًا"
                  : "التعديل متوقف حاليًا"}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={editingEnabled}
              onClick={() => setEditingEnabled((current) => !current)}
              className={`relative h-8 w-14 rounded-full transition ${
                editingEnabled ? "bg-green-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                  editingEnabled ? "right-1" : "right-7"
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
                  setRegistrationStart(event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
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
                  setRegistrationEnd(event.target.value)
                }
                min={registrationStart || undefined}
                required
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 rounded-xl bg-[#031632] px-7 py-3 font-semibold text-white transition hover:bg-[#1a2b48]"
          >
            حفظ فترة التسجيل
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
              <span className="text-slate-500">اسم النظام</span>
              <span className="font-bold text-[#111c2c]">
                سجل عائلة سلمان
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 py-3">
              <span className="text-slate-500">الإصدار</span>
              <span className="font-bold text-[#111c2c]">
                1.0.0
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 py-3">
              <span className="text-slate-500">عدد الأسر</span>
              <span className="font-bold text-[#111c2c]">
                142
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