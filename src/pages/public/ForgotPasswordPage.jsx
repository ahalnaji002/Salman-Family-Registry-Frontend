import { Link } from "react-router";

const SUPPORT_PHONE = "972594762842";
const SUPPORT_MESSAGE =
  "مرحبًا أحمد مسعود، نسيت كلمة المرور وأحتاج مساعدة لاستعادة حسابي في سجل عائلة سلمان.";

function ForgotPasswordPage() {
  const whatsappUrl = `https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(
    SUPPORT_MESSAGE,
  )}`;

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
        <article className="w-full max-w-md rounded-[28px] border border-[#eadfc8] bg-white/95 p-6 text-center shadow-[0_22px_55px_rgba(80,58,25,0.12)] md:p-8">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f7ed] text-[#16833b]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" />
              <path d="M8.5 8.5c.5 3 2 4.5 5 5" strokeLinecap="round" />
            </svg>
          </span>

          <h1 className="mt-5 text-2xl font-bold text-[#031632]">
            نسيت كلمة المرور؟
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            لاستعادة حسابك، تواصل مع الدعم الفني عبر واتساب وسيتم التحقق من
            بياناتك ومساعدتك في تعيين كلمة مرور جديدة.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#16833b] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#126f32]"
          >
            مراسلة الدعم الفني عبر واتساب
          </a>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            حفاظًا على أمان حسابك، لا ترسل كلمة المرور الحالية لأي شخص.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-block text-sm font-semibold text-slate-500 transition hover:text-[#031632]"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </article>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
