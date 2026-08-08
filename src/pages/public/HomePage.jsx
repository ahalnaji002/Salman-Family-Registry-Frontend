import { useState } from "react";
import { useNavigate } from "react-router";

function HomePage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (error) {
      setError("");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            national_id: form.nationalId.trim(),
            password: form.password,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "رقم الهوية أو كلمة المرور غير صحيحة",
        );
      }

      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user || {};

      if (!token) {
        throw new Error("لم يتم استلام رمز تسجيل الدخول من الخادم");
      }

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      if (form.rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/family");
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setError(
          "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل على المنفذ 5000.",
        );
      } else {
        setError(
          requestError.message || "حدث خطأ أثناء تسجيل الدخول",
        );
      }
    } finally {
      setLoading(false);
    }
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

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-12 md:px-8 lg:min-h-[720px] lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e7d9bd] bg-white/70 px-4 py-2 text-sm font-semibold text-[#5f513d] shadow-sm backdrop-blur-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m9.5 12 1.7 1.7 3.5-3.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            بوابة إلكترونية آمنة
          </span>

          <h2 className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.35] text-[#031632] md:text-5xl">
            مرحبًا بكم في نظام
            <span className="block text-[#c99b45]">
              حصر وتحديث بيانات
            </span>
            <span className="block">عائلة سلمان</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            منصة رقمية مخصصة لحفظ ترابط العائلة وتسهيل التواصل بين أفرادها.
            بادر بتحديث بياناتك لتكون جزءًا من السجل العائلي الموثوق، في بيئة
            آمنة تضمن خصوصية معلوماتك.
          </p>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#031632] px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#142947]"
          >
            بدء التسجيل

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M19 12H5M10 7l-5 5 5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="order-1 lg:order-2">
          <article className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-[#eadfc8] bg-white/92 shadow-[0_22px_55px_rgba(80,58,25,0.12)] backdrop-blur-sm">
            <div className="p-6 md:p-8">
              <div className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5ead4] text-[#031632]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M3 11.5 12 4l9 7.5" />
                    <path d="M5.5 10.5V20h13v-9.5" />
                    <path d="M9 20v-6h6v6" />
                  </svg>
                </span>

                <h3 className="mt-5 text-2xl font-bold text-[#031632]">
                  تسجيل دخول العائلة
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  مرحبًا بعودتك، يرجى إدخال بياناتك للمتابعة
                </p>
              </div>

              <form className="mt-7 space-y-5" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="homeNationalId"
                    className="mb-2 block text-sm font-semibold text-[#111c2c]"
                  >
                    رقم الهوية
                  </label>

                  <input
                    id="homeNationalId"
                    name="nationalId"
                    type="text"
                    inputMode="numeric"
                    value={form.nationalId}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="username"
                    placeholder="أدخل رقم الهوية"
                    className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="homePassword"
                    className="mb-2 block text-sm font-semibold text-[#111c2c]"
                  >
                    كلمة المرور
                  </label>

                  <div className="relative">
                    <input
                      id="homePassword"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                      placeholder="أدخل كلمة المرور"
                      className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pl-12 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8] disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "إخفاء كلمة المرور"
                          : "إظهار كلمة المرور"
                      }
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute inset-y-0 left-3 flex items-center text-slate-500 transition hover:text-[#031632] disabled:cursor-not-allowed disabled:opacity-60"
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
                      disabled={loading}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    تذكرني
                  </label>

                  <button
  type="button"
  onClick={() => navigate("/forgot-password")}
  className="font-semibold text-[#031632] hover:underline"
>
  نسيت كلمة المرور؟
</button>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#031632] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#142947] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "جاري تسجيل الدخول..." : "دخول"}

                  {loading && (
                    <span
                      aria-hidden="true"
                      className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                  )}
                </button>
              </form>

              <div className="mt-6 border-t border-[#eadfc8] pt-5 text-center text-sm text-slate-500">
                ليس لديك حساب؟

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="mr-2 font-bold text-[#031632] hover:underline"
                >
                  إنشاء حساب جديد
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HomePage;