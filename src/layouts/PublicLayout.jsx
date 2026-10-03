import { Link, NavLink, Outlet } from "react-router";
import logo from "../assets/images/salman-family-logo.png";

function PublicLayout() {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col bg-[#f8f8fe] text-[#031632]"
    >
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="شعار عائلة سلمان"
              className="h-12 w-12 rounded-full bg-white object-contain"
            />

            <div>
              <h1 className="text-lg font-bold text-[#031632] md:text-xl">
                عائلة سلمان
              </h1>

              <p className="text-xs text-slate-500 md:text-sm">
                سجل العائلة الإلكتروني
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 md:gap-3">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm font-semibold transition md:px-5 ${
                  isActive
                    ? "bg-[#031632] text-white shadow-sm"
                    : "bg-[#f1f4f8] text-[#031632] hover:bg-[#e7ebf1]"
                }`
              }
            >
              تسجيل الدخول
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm font-semibold transition md:px-5 ${
                  isActive
                    ? "bg-[#031632] text-white shadow-sm"
                    : "bg-[#f1f4f8] text-[#031632] hover:bg-[#e7ebf1]"
                }`
              }
            >
              تسجيل جديد
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center text-sm text-slate-500 md:flex-row md:px-8">
          <p>© 2026 جميع الحقوق محفوظة لعائلة سلمان</p>

          <p className="md:mr-auto">تصميم ومعالجة / أحمد مسعود</p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
