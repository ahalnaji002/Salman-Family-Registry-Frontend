import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { API_BASE_URL } from "../../config/api";

const initialForm = {
  fullName: "",
  nationalId: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let finalValue = value;

    if (name === "phone") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "nationalId") {
      finalValue = value.replace(/\D/g, "").slice(0, 9);
    }

    setForm((current) => ({
      ...current,
      [name]: finalValue,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const nameParts = fullName.split(/\s+/).filter(Boolean);

    if (!fullName) {
      setErrorMessage("الاسم الرباعي مطلوب.");
      return;
    }

    if (nameParts.length < 4) {
      setErrorMessage("اسم رب الأسرة يجب أن يتكون من 4 مقاطع على الأقل.");
      return;
    }

    if (!/^\d{9}$/.test(form.nationalId)) {
      setErrorMessage("رقم الهوية يجب أن يتكون من 9 أرقام.");
      return;
    }

    if (!/^05[69]\d{7}$/.test(form.phone)) {
      setErrorMessage(
        "رقم الجوال يجب أن يبدأ بـ 059 أو 056 ويتكون من 10 أرقام.",
      );
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("كلمة المرور يجب أن تتكون من 8 خانات على الأقل.");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("كلمة المرور يجب أن تتكون من 8 خانات على الأقل.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          national_id: form.nationalId.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "تعذر إنشاء الحساب، حاول مرة أخرى.",
        );
      }

      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user || {};
      const family = data.family || data.data?.family || {};

      if (token) {
        localStorage.setItem("token", token);
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("family", JSON.stringify(family));

      navigate("/family/basic-info");
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setErrorMessage(
          "تعذر الاتصال بالخادم. تأكد أن الـBackend يعمل على المنفذ 5000.",
        );
      } else {
        setErrorMessage(requestError.message || "حدث خطأ أثناء إنشاء الحساب.");
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

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-12 md:px-8 lg:min-h-[720px] lg:py-16">
        <article className="w-full max-w-xl rounded-[28px] border border-[#eadfc8] bg-white/92 p-6 shadow-[0_22px_55px_rgba(80,58,25,0.12)] backdrop-blur-sm md:p-8">
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
                <circle cx="12" cy="8" r="3" />
                <path d="M5 20a7 7 0 0 1 14 0" />
                <path d="M19 7v6M22 10h-6" />
              </svg>
            </span>

            <h1 className="mt-5 text-3xl font-bold text-[#031632]">
              إنشاء حساب جديد
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              أنشئ حسابك للبدء في تعبئة بيانات الأسرة
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="registerFullName"
                className="mb-2 block text-sm font-semibold text-[#111c2c]"
              >
                الاسم الرباعي
                <span className="mr-1 text-red-600">*</span>
              </label>

              <div className="relative">
                <input
                  id="registerFullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="name"
                  placeholder="الاسم الأول والثاني والثالث والعائلة"
                  className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pr-11 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="3" />
                  <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
              </div>
            </div>

            <div>
              <label
                htmlFor="registerNationalId"
                className="mb-2 block text-sm font-semibold text-[#111c2c]"
              >
                رقم الهوية
                <span className="mr-1 text-red-600">*</span>
              </label>

              <div className="relative">
                <input
                  id="registerNationalId"
                  name="nationalId"
                  type="text"
                  inputMode="numeric"
                  value={form.nationalId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="username"
                  placeholder="123456789"
                  className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pr-11 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8] disabled:cursor-not-allowed disabled:opacity-60"
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
                htmlFor="registerPhone"
                className="mb-2 block text-sm font-semibold text-[#111c2c]"
              >
                رقم الجوال
                <span className="mr-1 text-red-600">*</span>
              </label>

              <div className="relative">
                <input
                  id="registerPhone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="tel"
                  placeholder="05XXXXXXXX"
                  className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pr-11 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                >
                  <rect x="7" y="2.5" width="10" height="19" rx="2" />
                  <path d="M10 5h4M11 18.5h2" />
                </svg>
              </div>
            </div>

            <div>
              <label
                htmlFor="registerPassword"
                className="mb-2 block text-sm font-semibold text-[#111c2c]"
              >
                كلمة المرور
                <span className="mr-1 text-red-600">*</span>
              </label>

              <div className="relative">
                <input
                  id="registerPassword"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="أدخل كلمة المرور"
                  className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pl-12 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  disabled={loading}
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 left-3 flex items-center text-slate-500 transition hover:text-[#031632] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {showPassword ? "إخفاء" : "إظهار"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="registerConfirmPassword"
                className="mb-2 block text-sm font-semibold text-[#111c2c]"
              >
                تأكيد كلمة المرور
                <span className="mr-1 text-red-600">*</span>
              </label>

              <div className="relative">
                <input
                  id="registerConfirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pl-12 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? "إخفاء تأكيد كلمة المرور"
                      : "إظهار تأكيد كلمة المرور"
                  }
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute inset-y-0 left-3 flex items-center text-slate-500 transition hover:text-[#031632] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {showConfirmPassword ? "إخفاء" : "إظهار"}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[#eadfc8] bg-[#fffaf2] p-3 text-sm leading-6 text-slate-600">
              كلمة المرور يجب أن تتكون من 8 خانات على الأقل وتحتوي على أرقام
              وحروف.
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#031632] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#142947] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}

              {loading ? (
                <span
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              ) : (
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
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-[#eadfc8] pt-5 text-center text-sm text-slate-500">
            لديك حساب بالفعل؟
            <Link
              to="/login"
              className="mr-2 font-bold text-[#031632] hover:underline"
            >
              تسجيل الدخول
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export default RegisterPage;
