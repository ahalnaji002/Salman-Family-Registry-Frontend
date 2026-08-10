import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import logo from "../assets/images/salman-family-logo.png";
import { API_BASE_URL } from "../config/api";

const navigationItems = [
  {
    label: "لوحة التحكم",
    path: "/admin",
    end: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "الأسر المسجلة",
    path: "/admin/families",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="9.5" cy="7.5" r="3.5" />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 20v-1.5a6.5 6.5 0 0 1 13 0V20"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 11a3 3 0 1 0-2.2-5M21 20v-1.5a4 4 0 0 0-3-3.9"
        />
      </svg>
    ),
  },
  {
    label: "تصدير البيانات",
    path: "/admin/export",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m7.5 10.5 4.5 4.5 4.5-4.5"
        />

        <path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14" />
      </svg>
    ),
  },
  {
    label: "الإعدادات",
    path: "/admin/settings",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"
        />
      </svg>
    ),
  },
];

function AdminLayout() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [adminUser, setAdminUser] = useState(null);

  const getAdminToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const clearAdminSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = getAdminToken();

      if (!token) {
        clearAdminSession();

        navigate("/login", {
          replace: true,
        });

        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/me?t=${Date.now()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        const data = await response.json().catch(() => ({}));
        const user = data.data?.user || data.user;
        if (!response.ok) {
          throw new Error(data.message || "انتهت جلسة تسجيل الدخول.");
        }

        const userRoles = Array.isArray(user?.roles)
          ? user.roles
          : user?.role
            ? [user.role]
            : [];

        if (!user || !userRoles.includes("admin")) {
          throw new Error("ليس لديك صلاحية الدخول إلى لوحة الإدارة.");
        }

        const normalizedAdminUser = {
          ...user,
          roles: userRoles,
        };

        setAdminUser(normalizedAdminUser);

        localStorage.setItem("user", JSON.stringify(normalizedAdminUser));
      } catch (error) {
        console.error("Admin auth error:", error);

        clearAdminSession();

        navigate("/login", {
          replace: true,
        });
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    clearAdminSession();
    closeSidebar();

    navigate("/login", {
      replace: true,
    });
  };

  const adminInitial = adminUser?.full_name?.trim()?.charAt(0) || "م";

  if (checkingAuth) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f8f9ff]"
      >
        <div className="text-center">
          <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#031632]" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            جاري التحقق من صلاحية الدخول...
          </p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f9ff]">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-64 flex-col border-l border-white/10 bg-[#031632] text-white shadow-xl transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <img
            src={logo}
            alt="شعار عائلة سلمان"
            className="h-14 w-14 shrink-0 rounded-full bg-white object-contain p-1"
          />

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">عائلة سلمان</h1>

            <p className="mt-1 text-sm text-slate-300">سجل العائلة</p>
          </div>

          <button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={closeSidebar}
            className="mr-auto flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-white/10 md:hidden"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold transition ${
                  isActive
                    ? "bg-[#fffdf7] text-[#c89200] shadow-sm"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center"
              >
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3.5 font-semibold text-red-300 transition hover:bg-red-600 hover:text-white"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H10"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 8l4 4-4 4M18 12H9"
                />
              </svg>
            </span>

            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col md:mr-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="فتح القائمة"
                onClick={() => setIsSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-xl text-[#031632] hover:bg-slate-100 md:hidden"
              >
                ☰
              </button>

              <div>
                <h2 className="text-lg font-bold text-[#031632]">
                  عائلة سلمان
                </h2>

                <p className="text-sm text-slate-500">لوحة التحكم الإدارية</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-[#031632]">
                  {adminUser.full_name}
                </p>

                <p className="text-xs text-slate-500">مدير النظام</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7eeff] font-bold text-[#031632]">
                {adminInitial}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-5">
          <div className="mx-auto w-full max-w-[1280px]">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-3 md:flex-row">
            <p>© 2026 جميع الحقوق محفوظة لعائلة سلمان</p>

            <p className="md:mr-auto">تصميم ومعالجة / أحمد مسعود</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
