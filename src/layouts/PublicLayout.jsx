import { Outlet } from "react-router";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-blue-950">سجل عائلة سلمان</h1>

            <p className="text-sm text-slate-500">نظام تسجيل بيانات الأسرة</p>
          </div>

          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
            التسجيل متاح
          </span>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-sm text-slate-500">
          جميع الحقوق محفوظة لعائلة سلمان
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
