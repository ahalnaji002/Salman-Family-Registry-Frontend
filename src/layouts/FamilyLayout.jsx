import { Link, Outlet, useLocation } from "react-router";
import logo from "../assets/images/salman-family-logo.png";

const formSteps = [
  {
    number: 1,
    title: "البيانات الأساسية",
    path: "/family/basic-info",
  },
  {
    number: 2,
    title: "الزوجات",
    path: "/family/wives",
  },
  {
    number: 3,
    title: "السكن",
    path: "/family/housing",
  },
  {
    number: 4,
    title: "الأبناء",
    path: "/family/children",
  },
  {
    number: 5,
    title: "الحالات الخاصة",
    path: "/family/special-cases",
  },
  {
    number: 6,
    title: "البنات المتزوجات",
    path: "/family/married-daughters",
  },
  {
    number: 7,
    title: "المراجعة",
    path: "/family/review",
  },
];

function FamilyLayout() {
  const location = useLocation();

  const isStepActive = (step) => {
    return location.pathname.startsWith(step.path);
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#fdfaf5_0%,#ffffff_48%,#f8f8fe_100%)] text-[#031632]"
    >
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <Link to="/family" className="flex items-center gap-3">
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

          <div className="flex items-center gap-3">
            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-[#031632]">
                محمد أحمد سلمان
              </p>

              <p className="text-xs text-slate-500">رب الأسرة</p>
            </div>

            <Link
              to="/"
              className="rounded-xl bg-[#f1f4f8] px-4 py-2.5 text-sm font-semibold text-[#031632] transition hover:bg-[#e7ebf1]"
            >
              تسجيل الخروج
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200/70 bg-[#f8f8fe]/95">
        <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-8 md:py-8">
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-[980px] items-start">
              {formSteps.map((step, index) => {
                const active = isStepActive(step);

                return (
                  <div
                    key={step.number}
                    className="flex flex-1 items-start last:flex-none"
                  >
                    <Link
                      to={step.path}
                      className="group flex min-w-[118px] flex-col items-center text-center"
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold shadow-sm transition ${
                          active
                            ? "bg-[#031632] text-white"
                            : "bg-[#f6dca3] text-[#031632] group-hover:bg-[#031632] group-hover:text-white"
                        }`}
                      >
                        {step.number}
                      </div>

                      <p
                        className={`mt-3 whitespace-nowrap text-sm font-bold transition ${
                          active
                            ? "text-[#031632]"
                            : "text-slate-700 group-hover:text-[#031632]"
                        }`}
                      >
                        {step.title}
                      </p>
                    </Link>

                    {index < formSteps.length - 1 && (
                      <div className="mt-6 h-[2px] flex-1 bg-[#ead39e]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">
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

export default FamilyLayout;