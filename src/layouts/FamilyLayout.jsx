import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

import logo from "../assets/images/salman-family-logo.png";

const formSteps = [
  {
    number: 1,
    key: "basic-info",
    title: "البيانات الأساسية",
    path: "/family/basic-info",
  },
  {
    number: 2,
    key: "wives",
    title: "الزوجات",
    path: "/family/wives",
  },
  {
    number: 3,
    key: "housing",
    title: "السكن",
    path: "/family/housing",
  },
  {
    number: 4,
    key: "children",
    title: "الأبناء",
    path: "/family/children",
  },
  {
    number: 5,
    key: "special-cases",
    title: "الحالات الخاصة",
    path: "/family/special-cases",
  },
  {
    number: 6,
    key: "married-daughters",
    title: "البنات المتزوجات",
    path: "/family/married-daughters",
  },
  {
    number: 7,
    key: "review",
    title: "المراجعة",
    path: "/family/review",
  },
];

function FamilyLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [familyData, setFamilyData] = useState(null);
  const [completionData, setCompletionData] = useState(null);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const loadLayoutData = useCallback(async () => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      const [familyResponse, completionResponse] = await Promise.all([
        fetch("http://localhost:5000/api/family", {
          headers,
        }),
        fetch("http://localhost:5000/api/family/completion", {
          headers,
        }),
      ]);

      if (familyResponse.status === 401 || completionResponse.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("family");

        navigate("/login", { replace: true });
        return;
      }

      const familyResult = await familyResponse.json().catch(() => ({}));

      const completionResult = await completionResponse
        .json()
        .catch(() => ({}));

      if (familyResponse.ok) {
        setFamilyData(familyResult.data || null);
      }

      if (completionResponse.ok) {
        setCompletionData(completionResult.data || null);
      }
    } catch (error) {
      console.error("Family layout loading error:", error);
    }
  }, [navigate, token]);

  useEffect(() => {
    loadLayoutData();
  }, [loadLayoutData, location.pathname]);

  useEffect(() => {
    const handleFamilyDataUpdated = () => {
      loadLayoutData();
    };

    window.addEventListener("family-data-updated", handleFamilyDataUpdated);

    return () => {
      window.removeEventListener(
        "family-data-updated",
        handleFamilyDataUpdated,
      );
    };
  }, [loadLayoutData]);

  const family = familyData?.family || null;

  const completionSections = completionData?.sections || [];

  const getCompletionSection = (key) =>
    completionSections.find((section) => section.key === key);

  const familyHeadCompleted = Boolean(
    getCompletionSection("family_head")?.completed,
  );

  const personalPhotoCompleted = Boolean(
    getCompletionSection("personal_photo")?.completed,
  );

  const basicInfoCompleted = familyHeadCompleted && personalPhotoCompleted;

  const wivesSection = getCompletionSection("wives");

  const wivesCompleted = Boolean(wivesSection?.completed);

  const housingCompleted = Boolean(getCompletionSection("housing")?.completed);

  const childrenCompleted = Boolean(
    getCompletionSection("children")?.completed,
  );

  const specialCasesCompleted = (familyData?.special_cases?.length || 0) > 0;

  const marriedDaughtersCompleted =
    (familyData?.married_daughters?.length || 0) > 0;

  // المراجعة لا تعتبر مكتملة لمجرد وصول النسبة إلى 100%
  // تعتبر مكتملة فقط بعد إرسال النموذج أو اعتماده
  const reviewCompleted = ["submitted", "approved"].includes(
    family?.form_status,
  );

  const stepCompletion = {
    "basic-info": basicInfoCompleted,
    wives: wivesCompleted,
    housing: housingCompleted,
    children: childrenCompleted,
    "special-cases": specialCasesCompleted,
    "married-daughters": marriedDaughtersCompleted,
    review: reviewCompleted,
  };

  const isStepActive = (step) => {
    return location.pathname.startsWith(step.path);
  };

  const isStepCompleted = (step) => {
    return Boolean(stepCompletion[step.key]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    localStorage.removeItem("user");
    localStorage.removeItem("family");

    navigate("/", { replace: true });
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col bg-[#f8f8fe] text-[#031632]"
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
                {family?.full_name || "رب الأسرة"}
              </p>

              <p className="text-xs text-slate-500">رب الأسرة</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-[#f1f4f8] px-4 py-2.5 text-sm font-semibold text-[#031632] transition hover:bg-[#e7ebf1]"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200/70 bg-[#f8f8fe]/95">
        <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-8 md:py-8">
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-[980px] items-start">
              {formSteps.map((step, index) => {
                const active = isStepActive(step);
                const completed = isStepCompleted(step);

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
                            : completed
                              ? "bg-[#f6dca3] text-[#031632]"
                              : "bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:text-[#031632]"
                        }`}
                      >
                        {step.number}
                      </div>

                      <p
                        className={`mt-3 whitespace-nowrap text-sm font-bold transition ${
                          active
                            ? "text-[#031632]"
                            : completed
                              ? "text-[#031632]"
                              : "text-slate-500 group-hover:text-[#031632]"
                        }`}
                      >
                        {step.title}
                      </p>
                    </Link>

                    {index < formSteps.length - 1 && (
                      <div
                        className={`mt-6 h-[2px] flex-1 ${
                          completed ? "bg-[#ead39e]" : "bg-slate-200"
                        }`}
                      />
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
