import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../../assets/images/salman-family-logo.png";

const API_BASE_URL = "http://localhost:5000";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const adminToken =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");

    const storedAdmin =
      localStorage.getItem("adminUser") ||
      sessionStorage.getItem("adminUser");

    if (!adminToken || !storedAdmin) {
      return;
    }

    try {
      const admin = JSON.parse(storedAdmin);

      if (admin?.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      }
    } catch {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminUser");
    }
  }, [navigate]);

  const handleNationalIdChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 9);

    setNationalId(value);
    setErrorMessage("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!/^\d{9}$/.test(nationalId)) {
      setErrorMessage(
        "يرجى إدخال رقم هوية صحيح مكون من 9 أرقام.",
      );
      return;
    }

    if (!password) {
      setErrorMessage("كلمة المرور مطلوبة.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            national_id: nationalId,
            password,
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "تعذر تسجيل الدخول إلى لوحة الإدارة.",
        );
      }

      const token = data.data?.token;
      const user = data.data?.user;

      if (!token || !user) {
        throw new Error(
          "استجابة تسجيل الدخول غير مكتملة.",
        );
      }

      if (user.role !== "admin") {
        throw new Error(
          "هذا الحساب لا يملك صلاحية الدخول إلى لوحة الإدارة.",
        );
      }

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminUser");

      if (rememberMe) {
        localStorage.setItem(
          "adminToken",
          token,
        );

        localStorage.setItem(
          "adminUser",
          JSON.stringify(user),
        );
      } else {
        sessionStorage.setItem(
          "adminToken",
          token,
        );

        sessionStorage.setItem(
          "adminUser",
          JSON.stringify(user),
        );
      }

      navigate("/admin", {
        replace: true,
      });
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setErrorMessage(
          "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل على المنفذ 5000.",
        );
      } else {
        setErrorMessage(
          requestError.message ||
            "حدث خطأ أثناء تسجيل الدخول.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col bg-[#f8f9ff]"
    >
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="شعار عائلة سلمان"
              className="h-12 w-12 rounded-full bg-white object-contain"
            />

            <div>
              <h2 className="font-bold text-[#031632]">
                سجل عائلة سلمان
              </h2>

              <span className="mt-1 inline-flex rounded-full bg-[#e7eeff] px-3 py-1 text-sm font-medium text-[#44474d]">
                لوحة الإدارة
              </span>
            </div>
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
              أدخل رقم الهوية وكلمة المرور للوصول إلى لوحة التحكم
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="adminNationalId"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                رقم الهوية
                <span className="mr-1 text-red-700">
                  *
                </span>
              </label>

              <input
                id="adminNationalId"
                name="nationalId"
                type="text"
                inputMode="numeric"
                maxLength={9}
                required
                disabled={loading}
                autoComplete="username"
                value={nationalId}
                onChange={
                  handleNationalIdChange
                }
                placeholder="أدخل رقم الهوية"
                className="block w-full rounded-lg border border-[#c5c6ce] bg-[#f9f9ff] px-4 py-3 text-left text-[#111c2c] outline-none transition placeholder:text-right focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-slate-500">
                يجب أن يتكون رقم الهوية من 9 أرقام.
              </p>
            </div>

            <div>
              <label
                htmlFor="adminPassword"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                كلمة المرور
                <span className="mr-1 text-red-700">
                  *
                </span>
              </label>

              <div className="relative">
                <input
                  id="adminPassword"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  value={password}
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="أدخل كلمة المرور"
                  className="block w-full rounded-lg border border-[#c5c6ce] bg-[#f9f9ff] px-4 py-3 pl-14 text-[#111c2c] outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff] disabled:cursor-not-allowed disabled:opacity-60"
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
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  className="absolute inset-y-0 left-3 my-auto h-9 rounded-md px-2 text-sm text-[#44474d] transition hover:bg-[#e7eeff] hover:text-[#031632] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {showPassword
                    ? "إخفاء"
                    : "إظهار"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-[#44474d]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  disabled={loading}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-[#c5c6ce]"
                />

                تذكرني
              </label>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700"
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#031632] px-4 font-semibold text-white transition hover:bg-[#1a2b48] focus:outline-none focus:ring-2 focus:ring-[#8293b5] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول إلى لوحة الإدارة"}

              {loading && (
                <span
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}
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

          <div className="text-sm text-[#5c5f61]">
            تصميم ومعالجة / أحمد مسعود
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminLoginPage;