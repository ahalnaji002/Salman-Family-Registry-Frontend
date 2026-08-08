import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

const exportContents = [
  {
    label: "بيانات الأسرة",
    description: "بيانات رب الأسرة والمعلومات الأساسية",
  },
  {
    label: "بيانات السكن",
    description: "السكن السابق والحالي ومعلومات النزوح",
  },
  {
    label: "بيانات الزوجات",
    description: "معلومات الزوجات المسجلات",
  },
  {
    label: "بيانات الأبناء",
    description: "معلومات الأبناء والحالة التعليمية",
  },
  {
    label: "الحالات الخاصة",
    description: "المرضى والإصابات والإعاقة والشهداء",
  },
  {
    label: "البنات المتزوجات",
    description: "بيانات البنات المتزوجات",
  },
];


function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M4 6h16M7 12h10M10 18h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExcelIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M5 3h10l4 4v14H5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 3v5h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="m8 12 4 5M12 12l-4 5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M4 4v6h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5.5 15a8 8 0 1 0 1.2-8.4L4 10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContentIcon({ index }) {
  const icons = [
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>,
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
    </>,
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3 20a6 6 0 0 1 12 0M13 20a5 5 0 0 1 8 0" />
    </>,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 10h.01M16 10h.01M8.5 15a5 5 0 0 0 7 0" />
    </>,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>,
    <>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </>,
  ];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {icons[index]}
    </svg>
  );
}

function ExportPage() {
  const [region, setRegion] = useState("الكل");
  const [status, setStatus] = useState("الكل");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [familiesCount, setFamiliesCount] = useState(0);
  const [membersCount, setMembersCount] = useState(0);
  const [fileSize, setFileSize] = useState("يظهر بعد التصدير");
  const [lastExport, setLastExport] = useState(() => {
    try {
      const saved = localStorage.getItem("adminLastExport");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const resetFilters = () => {
    setRegion("الكل");
    setStatus("الكل");
    setStartDate("");
    setEndDate("");
  };

  const getAdminToken = () =>
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken");

  const clearAdminSession = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
  };

  const buildFiltersQuery = () => {
    const query = new URLSearchParams();

    if (status === "مكتملة") {
      query.set("status", "submitted");
    } else if (status === "غير مكتملة") {
      query.set("status", "draft");
    }

    const regionValues = {
      "شمال غزة": "north_gaza",
      غزة: "gaza",
      "المنطقة الوسطى": "middle_area",
      "جنوب غزة": "south_gaza",
    };

    if (region !== "الكل" && regionValues[region]) {
      query.set("region", regionValues[region]);
    }

    if (startDate) {
      query.set("start_date", startDate);
    }

    if (endDate) {
      query.set("end_date", endDate);
    }

    return query;
  };

  const formatFileSize = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "—";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const kilobytes = bytes / 1024;

    if (kilobytes < 1024) {
      return `${kilobytes.toFixed(1)} KB`;
    }

    return `${(kilobytes / 1024).toFixed(2)} MB`;
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchExportStats = async () => {
      const token = getAdminToken();

      if (!token) {
        clearAdminSession();
        window.location.href = "/admin/login";
        return;
      }

      if (startDate && endDate && startDate > endDate) {
        setFamiliesCount(0);
        setMembersCount(0);
        setIsLoadingStats(false);
        setFileSize("يظهر بعد التصدير");
        return;
      }

      setIsLoadingStats(true);
      setFileSize("يظهر بعد التصدير");

      try {
        const queryString = buildFiltersQuery().toString();

        const response = await fetch(
          `${API_BASE_URL}/api/admin/export/families/stats${
            queryString ? `?${queryString}` : ""
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            signal: controller.signal,
          },
        );

        if (response.status === 401) {
          clearAdminSession();
          window.location.href = "/admin/login";
          return;
        }

        const data = await response.json().catch(() => ({}));

        if (response.status === 403) {
          throw new Error(
            data.message || "ليس لديك صلاحية لعرض إحصائيات التصدير.",
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message || "حدث خطأ أثناء جلب إحصائيات التصدير.",
          );
        }

        setFamiliesCount(Number(data.data?.families_count) || 0);
        setMembersCount(Number(data.data?.members_count) || 0);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setFamiliesCount(0);
        setMembersCount(0);
        console.error("Export stats error:", error);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingStats(false);
        }
      }
    };

    fetchExportStats();

    return () => {
      controller.abort();
    };
  }, [region, status, startDate, endDate]);

  const handleExport = async () => {
    if (isExporting) {
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      window.alert("تاريخ البداية يجب أن يكون قبل تاريخ النهاية.");
      return;
    }

    const token = getAdminToken();

    if (!token) {
      clearAdminSession();
      window.location.href = "/admin/login";
      return;
    }

    setIsExporting(true);

    try {
      const queryString = buildFiltersQuery().toString();

      const response = await fetch(
        `${API_BASE_URL}/api/admin/export/families${
          queryString ? `?${queryString}` : ""
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        },
      );

      if (response.status === 401) {
        clearAdminSession();
        window.location.href = "/admin/login";
        return;
      }

      if (response.status === 403) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.message || "ليس لديك صلاحية لتصدير البيانات.",
        );
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.message || "حدث خطأ أثناء تصدير البيانات.",
        );
      }

      const blob = await response.blob();

      setFileSize(formatFileSize(blob.size));

      const contentDisposition =
        response.headers.get("Content-Disposition");

      const fileNameMatch = contentDisposition?.match(
        /filename="?([^";]+)"?/i,
      );

      const fileName =
        fileNameMatch?.[1] ||
        `salman-families-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;

      const exportInfo = {
        fileName,
        exportedAt: new Date().toISOString(),
        familiesCount,
        membersCount,
        fileSize: formatFileSize(blob.size),
      };

      setLastExport(exportInfo);
      localStorage.setItem("adminLastExport", JSON.stringify(exportInfo));

      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = downloadUrl;
      anchor.download = fileName;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      window.alert(
        error.message || "حدث خطأ أثناء تصدير البيانات.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#031632]">
          تصدير البيانات
        </h1>

        <p className="mt-2 max-w-3xl leading-7 text-slate-500">
          حدّد معايير تصدير بيانات الأسر، وسيتم إنشاء ملف Excel منظم يحتوي
          على المعلومات المطلوبة.
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_2.2fr]">
        <div className="space-y-5">
          <article className="rounded-2xl border border-[#d7e2ff] bg-[#eef2ff] p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#031632]">
                محتويات ملف Excel
              </h2>

              <p className="mt-2 leading-7 text-slate-600">
                سيحتوي كل قسم على رقم الأسرة لتسهيل ربط البيانات بين أوراق
                الملف.
              </p>
            </div>

            <div className="space-y-3">
              {exportContents.map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      index === 4
                        ? "bg-amber-100 text-amber-700"
                        : "bg-[#dbe6ff] text-[#031632]"
                    }`}
                  >
                    <ContentIcon index={index} />
                  </span>

                  <div>
                    <p className="font-bold text-[#111c2c]">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#031632]">
              آخر عملية تصدير
            </h2>

            <div className="mt-4 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e7eeff] text-[#031632]">
                <ResetIcon />
              </span>

              <div>
                {lastExport ? (
                  <>
                    <p
                      dir="ltr"
                      className="font-bold text-[#111c2c]"
                    >
                      {lastExport.fileName}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {new Intl.DateTimeFormat("ar-EG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(lastExport.exportedAt))}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full bg-[#dbe6ff] px-3 py-1 text-xs font-medium text-[#031632]">
                        تم تصدير {Number(lastExport.familiesCount || 0).toLocaleString("en-US")} أسرة
                      </span>

                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {lastExport.fileSize}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    لا توجد عملية تصدير بعد.
                  </p>
                )}
              </div>
            </div>
          </article>
        </div>

        <article className="rounded-2xl border border-slate-200 border-r-4 border-r-[#031632] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-[#031632]">
              <FilterIcon />
            </span>

            <h2 className="text-2xl font-bold text-[#031632]">
              معايير التصدير
            </h2>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="exportRegion"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                المنطقة
              </label>

              <select
                id="exportRegion"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              >
                <option value="الكل">جميع المناطق</option>
                <option value="شمال غزة">شمال غزة</option>
                <option value="غزة">غزة</option>
                <option value="المنطقة الوسطى">المنطقة الوسطى</option>
                <option value="جنوب غزة">جنوب غزة</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="exportStatus"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                حالة الاستمارة
              </label>

              <select
                id="exportStatus"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              >
                <option value="الكل">جميع الحالات</option>
                <option value="مكتملة">مكتملة</option>
                <option value="غير مكتملة">غير مكتملة</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="exportStartDate"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                من تاريخ
              </label>

              <input
                id="exportStartDate"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>

            <div>
              <label
                htmlFor="exportEndDate"
                className="mb-2 block font-semibold text-[#111c2c]"
              >
                إلى تاريخ
              </label>

              <input
                id="exportEndDate"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />
            </div>
          </div>

          <div className="mt-7 grid overflow-hidden rounded-2xl border border-[#d7e2ff] bg-[#f8f9ff] sm:grid-cols-3">
            {[
  {
    label: "عدد الأسر المطابقة",
    value: isLoadingStats
      ? "..."
      : familiesCount.toLocaleString("en-US"),
  },
  {
    label: "عدد الأفراد",
    value: isLoadingStats
      ? "..."
      : membersCount.toLocaleString("en-US"),
  },
  {
    label: "حجم الملف",
    value: fileSize,
  },
].map((stat, index, stats) => (
  <div
    key={stat.label}
    className={`p-5 text-center ${
      index !== stats.length - 1
        ? "border-b border-[#d7e2ff] sm:border-b-0 sm:border-l"
        : ""
    }`}
  >
    <p className="text-3xl font-bold text-[#031632]">
  {stat.value}
</p>

    <p className="mt-2 text-sm text-slate-600">
      {stat.label}
    </p>
  </div>
))}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_2fr]">
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#031632] px-5 py-3 font-semibold text-[#031632] transition hover:bg-slate-50"
            >
              <ResetIcon />
              إعادة تعيين الفلاتر
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center justify-center gap-3 rounded-xl bg-[#031632] px-5 py-3 font-semibold text-white transition hover:bg-[#1a2b48] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ExcelIcon />

              {isExporting
                ? "جارٍ تجهيز الملف..."
                : "تصدير ملف Excel"}
            </button>
          </div>

          <p className="mt-4 text-center text-sm leading-6 text-slate-500">
            سيتم إنشاء ملف Excel واحد يحتوي على عدة أوراق لتنظيم بيانات
            الأسر.
          </p>
        </article>
      </div>
    </section>
  );
}

export default ExportPage;