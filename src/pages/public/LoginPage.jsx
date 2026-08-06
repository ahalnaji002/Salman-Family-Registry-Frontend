import { useState } from "react";
import { Link, useNavigate } from "react-router";

function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nationalId: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // لاحقًا سيتم ربطه مع:
    // POST /api/auth/login

    navigate("/");
  };

  return (
    <section className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[#fffaf2]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 18% 22%, rgba(255,250,239,0.98), transparent 34%), radial-gradient(circle at 82% 28%, rgba(239,221,184,0.52), transparent 32%), radial-gradient(circle at 50% 85%, rgba(248,238,217,0.72), transparent 38%), linear-gradient(135deg, #fffdf8 0%, #f8f0e2 48%, #fff9ef 100%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-12 md:px-8 lg:min-h-[720px] lg:py-16">
        <article className="w-full max-w-md rounded-[28px] border border-[#eadfc8] bg-white/92 p-6 shadow-[0_22px_55px_rgba(80,58,25,0.12)] backdrop-blur-sm md:p-8">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5ead4] text-[#031632] shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3" />

                <path
                  d="M5 20a7 7 0 0 1 14 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <rect
                  x="15"
                  y="13"
                  width="6"
                  height="6"
                  rx="1.5"
                />

                <path
                  d="M16.5 13v-1a1.5 1.5 0 0 1 3 0v1"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <h1 className="mt-5 text-3xl font-bold text-[#031632]">
              تسجيل الدخول
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              أدخل بيانات حسابك للوصول إلى استمارتك
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="loginNationalId"
                className="mb-2 block text-sm font-semibold text-[#111c2c]"
              >
                رقم الهوية
                <span className="mr-1 text-red-600">*</span>
              </label>

              <div className="relative">
                <input
                  id="loginNationalId"
                  name="nationalId"
                  type="text"
                  inputMode="numeric"
                  value={form.nationalId}
                  onChange={handleChange}
                  required
                  placeholder="أدخل رقم الهوية"
                  className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pr-11 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8]"
                />

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                >
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <path d="M9 8h6M9 12h6M9 16h4" />
                </svg>
              </div>
            </div>

            <div>
              <label
                htmlFor="loginPassword"
                className="mb-2 block text-sm font-semibold text-[#111c2c]"
              >
                كلمة المرور
                <span className="mr-1 text-red-600">*</span>
              </label>

              <div className="relative">
                <input
                  id="loginPassword"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="أدخل كلمة المرور"
                  className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pl-12 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8]"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 left-3 flex items-center text-slate-500 transition hover:text-[#031632]"
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="m3 3 18 18" />
                      <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                      <path d="M9.8 4.3A10.8 10.8 0 0 1 12 4c6 0 9.5 6 9.5 6a16.5 16.5 0 0 1-3 3.8M6.2 6.2C3.8 7.8 2.5 10 2.5 10S6 16 12 16a10 10 0 0 0 3.4-.6" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300"
                />
                تذكرني
              </label>

              <button
                type="button"
                className="font-semibold text-[#031632] hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#031632] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#142947]"
            >
              تسجيل الدخول

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M10 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H10" />
                <path d="M14 8l4 4-4 4M18 12H9" />
              </svg>
            </button>
          </form>

          <div className="mt-6 border-t border-[#eadfc8] pt-5 text-center">
            <p className="text-sm leading-6 text-slate-500">
              نسيت كلمة المرور؟ تواصل مع مسؤول النظام لإعادة تعيينها.
            </p>

            <button
              type="button"
              className="mt-2 text-sm font-bold text-[#031632] hover:underline"
            >
              تواصل مع المسؤول
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-slate-500">
            ليس لديك حساب؟

            <Link
              to="/register"
              className="mr-2 font-bold text-[#031632] hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </div>

          <div className="mt-5 rounded-full bg-[#f5ead4] px-4 py-2 text-center text-xs text-[#6c5b3d]">
            قم بالحفاظ على خصوصية بياناتك وعدم مشاركتها مع أفراد آخرين.
          </div>
        </article>
      </div>
    </section>
  );
}

export default LoginPage;