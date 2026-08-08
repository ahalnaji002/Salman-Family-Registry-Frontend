import { useState } from "react";
import { useNavigate } from "react-router";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [nationalId, setNationalId] = useState("");
  const [code, setCode] = useState("");

  const [requestId, setRequestId] = useState(null);
  const [resetToken, setResetToken] = useState("");

  const [phone, setPhone] = useState("");
  const [developmentCode, setDevelopmentCode] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            national_id: nationalId.trim(),
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "تعذر إرسال طلب استعادة كلمة المرور.",
        );
      }

      const responseData = data.data || {};

      setRequestId(responseData.request_id);
      setPhone(responseData.phone || "");
      setDevelopmentCode(responseData.development_code || "");

      setStep(2);
      setSuccess("تم إنشاء رمز التحقق بنجاح.");
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setError(
          "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل على المنفذ 5000.",
        );
      } else {
        setError(
          requestError.message ||
            "حدث خطأ أثناء طلب استعادة كلمة المرور.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-reset-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request_id: requestId,
            code: code.trim(),
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "رمز التحقق غير صحيح.",
        );
      }

      const responseData = data.data || {};

      if (!responseData.reset_token) {
        throw new Error("لم يتم استلام رمز إعادة التعيين.");
      }

      setResetToken(responseData.reset_token);
      setStep(3);
      setSuccess("تم التحقق من الرمز بنجاح.");
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setError(
          "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل على المنفذ 5000.",
        );
      } else {
        setError(
          requestError.message ||
            "حدث خطأ أثناء التحقق من الرمز.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("تأكيد كلمة المرور غير مطابق.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reset_token: resetToken,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "تعذر إعادة تعيين كلمة المرور.",
        );
      }

      setStep(4);
      setSuccess(
        data.message || "تمت إعادة تعيين كلمة المرور بنجاح.",
      );
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setError(
          "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل على المنفذ 5000.",
        );
      } else {
        setError(
          requestError.message ||
            "حدث خطأ أثناء إعادة تعيين كلمة المرور.",
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

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-12 md:px-8 lg:min-h-[720px] lg:py-16">
        <article className="w-full max-w-md rounded-[28px] border border-[#eadfc8] bg-white/95 p-6 shadow-[0_22px_55px_rgba(80,58,25,0.12)] md:p-8">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5ead4] text-[#031632]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <path d="M12 14v2" />
              </svg>
            </span>

            <h1 className="mt-5 text-2xl font-bold text-[#031632]">
              استعادة كلمة المرور
            </h1>

            {step < 4 && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                الخطوة {step} من 3
              </p>
            )}
          </div>

          {step < 4 && (
            <div className="mt-6 flex items-center gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-2 flex-1 rounded-full ${
                    item <= step
                      ? "bg-[#c99b45]"
                      : "bg-[#eee5d5]"
                  }`}
                />
              ))}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          {success && step !== 4 && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
              {success}
            </div>
          )}

          {step === 1 && (
            <form
              onSubmit={handleForgotPassword}
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="forgotNationalId"
                  className="mb-2 block text-sm font-semibold text-[#111c2c]"
                >
                  رقم الهوية
                </label>

                <input
                  id="forgotNationalId"
                  type="text"
                  inputMode="numeric"
                  value={nationalId}
                  onChange={(event) => {
                    setNationalId(event.target.value);
                    setError("");
                  }}
                  required
                  maxLength={9}
                  disabled={loading}
                  placeholder="أدخل رقم الهوية"
                  className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#031632] px-5 py-3.5 font-semibold text-white transition hover:bg-[#142947] disabled:opacity-60"
              >
                {loading
                  ? "جاري إرسال الطلب..."
                  : "متابعة"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handleVerifyCode}
              className="mt-7 space-y-5"
            >
              {phone && (
                <p className="text-center text-sm leading-7 text-slate-600">
                  تم إنشاء رمز التحقق للحساب المرتبط بالرقم
                  <span className="mr-1 font-bold text-[#031632]">
                    {phone}
                  </span>
                </p>
              )}

              {developmentCode && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                  <p className="text-xs font-semibold text-amber-700">
                    للتطوير فقط — رمز التحقق
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-[0.3em] text-[#031632]">
                    {developmentCode}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="verificationCode"
                  className="mb-2 block text-sm font-semibold text-[#111c2c]"
                >
                  رمز التحقق
                </label>

                <input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(event) => {
                    setCode(
                      event.target.value.replace(/\D/g, ""),
                    );
                    setError("");
                  }}
                  required
                  maxLength={6}
                  disabled={loading}
                  placeholder="أدخل الرمز المكون من 6 أرقام"
                  className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 text-center text-xl tracking-[0.3em] outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#031632] px-5 py-3.5 font-semibold text-white transition hover:bg-[#142947] disabled:opacity-60"
              >
                {loading
                  ? "جاري التحقق..."
                  : "تحقق من الرمز"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setStep(1);
                  setCode("");
                  setError("");
                  setSuccess("");
                }}
                className="w-full text-sm font-semibold text-slate-500 hover:text-[#031632]"
              >
                تغيير رقم الهوية
              </button>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={handleResetPassword}
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-semibold text-[#111c2c]"
                >
                  كلمة المرور الجديدة
                </label>

                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      setError("");
                    }}
                    required
                    minLength={8}
                    disabled={loading}
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pl-16 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute inset-y-0 left-3 text-sm font-semibold text-slate-500"
                  >
                    {showPassword ? "إخفاء" : "إظهار"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="mb-2 block text-sm font-semibold text-[#111c2c]"
                >
                  تأكيد كلمة المرور
                </label>

                <div className="relative">
                  <input
                    id="confirmNewPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setError("");
                    }}
                    required
                    minLength={8}
                    disabled={loading}
                    placeholder="أعد إدخال كلمة المرور"
                    className="w-full rounded-xl border border-[#dfd1b7] bg-[#fffaf2] px-4 py-3 pl-16 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#eadfc8]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current,
                      )
                    }
                    className="absolute inset-y-0 left-3 text-sm font-semibold text-slate-500"
                  >
                    {showConfirmPassword
                      ? "إخفاء"
                      : "إظهار"}
                  </button>
                </div>
              </div>

              <p className="text-xs leading-6 text-slate-500">
                كلمة المرور يجب ألا تقل عن 8 أحرف.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#031632] px-5 py-3.5 font-semibold text-white transition hover:bg-[#142947] disabled:opacity-60"
              >
                {loading
                  ? "جاري تغيير كلمة المرور..."
                  : "تغيير كلمة المرور"}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="mt-8 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <h2 className="mt-5 text-xl font-bold text-[#031632]">
                تم تغيير كلمة المرور
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                يمكنك الآن تسجيل الدخول باستخدام كلمة المرور
                الجديدة.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 w-full rounded-xl bg-[#031632] px-5 py-3.5 font-semibold text-white transition hover:bg-[#142947]"
              >
                العودة إلى تسجيل الدخول
              </button>
            </div>
          )}

          {step !== 4 && (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 w-full text-center text-sm font-semibold text-slate-500 transition hover:text-[#031632]"
            >
              العودة إلى تسجيل الدخول
            </button>
          )}
        </article>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;