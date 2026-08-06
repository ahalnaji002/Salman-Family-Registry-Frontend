import { useState } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../../assets/images/salman-family-logo.png";

function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // دخول تجريبي مؤقت إلى لوحة الإدارة.
    // لاحقًا سنستبدله بطلب حقيقي إلى:
    // POST /api/admin/auth/login
    localStorage.setItem("adminToken", "temporary-admin-token");

    navigate("/admin", { replace: true });
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col bg-[#f9f9ff] text-[#111c2c]"
    >
      <header className="w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-[#031632]">
              سجل عائلة سلمان
            </span>

            <span className="rounded-full bg-[#e7eeff] px-3 py-1 text-sm font-medium text-[#44474d]">
              لوحة الإدارة
            </span>
          </div>

          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7eeff] text-xl text-[#031632]"
            aria-hidden="true"
          >
            🔒
          </span>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <div
          className="pointer-events-none absolute h-[700px] w-[700px] rounded-full bg-[#d7e2ff] opacity-40 blur-3xl"
          aria-hidden="true"
        />

        <section className="relative z-10 w-full max-w-md rounded-xl border border-[#c5c6ce] bg-white p-8 shadow-[0_4px_20px_rgba(26,43,72,0.08)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
              <img
                src={logo}
                alt="شعار عائلة سلمان"
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-semibold text-[#031632] md:text-3xl">
              تسجيل دخول مدير النظام
            </h1>

            <p className="mt-2 leading-7 text-[#44474d]">
              أدخل بيانات المدير للوصول إلى لوحة التحكم
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                اسم المستخدم أو رقم الجوال
                <span className="mr-1 text-red-700">*</span>
              </label>

              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="أدخل اسم المستخدم"
                className="block w-full rounded-lg border border-[#c5c6ce] bg-[#f9f9ff] px-4 py-3 text-[#111c2c] outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                كلمة المرور
                <span className="mr-1 text-red-700">*</span>
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="أدخل كلمة المرور"
                  className="block w-full rounded-lg border border-[#c5c6ce] bg-[#f9f9ff] px-4 py-3 pl-14 text-[#111c2c] outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 left-3 my-auto h-9 rounded-md px-2 text-sm text-[#44474d] transition hover:bg-[#e7eeff] hover:text-[#031632]"
                >
                  {showPassword ? "إخفاء" : "إظهار"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-[#44474d]">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="h-4 w-4 rounded border-[#c5c6ce]"
                />
                تذكرني
              </label>

              <button
                type="button"
                className="text-sm font-medium text-[#031632] hover:underline"
              >
                هل نسيت كلمة المرور؟
              </button>
            </div>

            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center rounded-lg bg-[#031632] px-4 font-semibold text-white transition hover:bg-[#1a2b48] focus:outline-none focus:ring-2 focus:ring-[#8293b5] focus:ring-offset-2"
            >
              تسجيل الدخول إلى لوحة الإدارة
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-red-700">
              ⚠ هذه الصفحة مخصصة لمدير النظام فقط.
            </p>

            <div className="mt-4 border-t border-[#c5c6ce] pt-4">
              <Link
                to="/"
                className="text-[#5c5f61] transition hover:text-[#031632]"
              >
                العودة إلى الموقع
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#f0f3ff]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-center md:flex-row-reverse">
          <p className="font-medium text-[#031632]">
            © 2026 سجل عائلة سلمان - لوحة التحكم الإدارية
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-[#5c5f61]">
            <button
              type="button"
              className="hover:text-[#031632] hover:underline"
            >
              شروط الاستخدام
            </button>

            <button
              type="button"
              className="hover:text-[#031632] hover:underline"
            >
              سياسة الخصوصية
            </button>

            <button
              type="button"
              className="hover:text-[#031632] hover:underline"
            >
              الدعم الفني
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminLoginPage;