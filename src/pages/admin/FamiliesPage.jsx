import { useEffect, useMemo, useState } from "react";
import DeleteFamilyModal from "./DeleteFamilyModal";
import AddFamilyModal from "./AddFamilyModal";
import EditFamilyModal from "./EditFamilyModal";

const API_BASE_URL = "http://localhost:5000";

const maritalStatusLabels = {
  single: "أعزب",
  married: "متزوج",
  divorced: "مطلق",
  widowed: "أرمل",
};

const workStatusLabels = {
  employee: "موظف",
  worker: "عامل",
  not_working: "لا يعمل",
};

const jobTypeLabels = {
  government: "قطاع حكومي",
  private: "قطاع خاص",
  other: "أخرى",
};

const previousAreaLabels = {
  north_gaza: "شمال غزة",
  gaza: "غزة",
  middle_area: "المنطقة الوسطى",
  south_gaza: "جنوب غزة",
};

const housingTypeLabels = {
  owned: "ملك",
  rented: "إيجار",
  displaced: "نازح",
};

const displacementTypeLabels = {
  tent: "خيمة",
  shelter_center: "مركز إيواء",
  relatives_house: "بيت أقارب",
};

const educationLabels = {
  under_6: "طفل أقل من 6 سنوات",
  school: "مدرسة",
  university: "جامعة",
  not_studying: "لا يدرس",
};

const specialCaseLabels = {
  martyr: "شهيد",
  injured: "مصاب",
  disability: "إعاقة",
  patient: "مريض",
  pregnant: "حامل",
};

function IconButton({
  label,
  children,
  danger = false,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-slate-200 text-[#34446b] hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function DetailCard({ title, icon, children, className = "" }) {
  return (
    <article
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-[#031632]">{title}</h3>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#031632] text-sm text-white">
          {icon}
        </span>
      </div>

      {children}
    </article>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5 last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-left font-semibold text-[#111c2c]">
        {value || "—"}
      </span>
    </div>
  );
}

function FamiliesPage() {
  const [familyRecords, setFamilyRecords] = useState([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
    has_next_page: false,
    has_previous_page: false,
  });

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionFamilyId, setActionFamilyId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [familyToDelete, setFamilyToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);

  const [isEditFamilyOpen, setIsEditFamilyOpen] = useState(false);
  const [familyToEdit, setFamilyToEdit] = useState(null);

  const getAdminToken = () =>
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken");

  const clearAdminSession = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
  };

  const apiRequest = async (path, options = {}) => {
    const token = getAdminToken();

    if (!token) {
      clearAdminSession();
      window.location.href = "/admin/login";
      throw new Error("انتهت جلسة تسجيل الدخول.");
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      clearAdminSession();
      window.location.href = "/admin/login";
      throw new Error(
        data.message || "انتهت جلسة تسجيل الدخول.",
      );
    }

    if (response.status === 403) {
      throw new Error(
        data.message || "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
      );
    }

    if (!response.ok) {
      throw new Error(data.message || "حدث خطأ أثناء تنفيذ الطلب.");
    }

    return data;
  };

  const normalizeListFamily = (family) => ({
    id: family.id,
    headName: family.full_name || "",
    nationalId: String(family.national_id || ""),
    phone: family.phone || "",
    region: "—",
    membersCount: "—",
    status:
      family.form_status === "submitted" ? "مكتملة" : "غير مكتملة",
    formStatus: family.form_status || "draft",
    registeredAt: family.created_at
      ? String(family.created_at).slice(0, 10)
      : "—",
    editStatus: family.editing_enabled ? "open" : "closed",
    editingEnabled: Boolean(family.editing_enabled),
    userIsActive: Boolean(family.user_is_active),
  });

  const normalizeFamilyDetails = (data) => {
    const family = data?.family || {};
    const housing = data?.housing || null;
    const wives = data?.wives || [];
    const children = data?.children || [];
    const marriedDaughters = data?.married_daughters || [];
    const specialCases = data?.special_cases || [];
    const summary = data?.summary || {};

    return {
      id: family.id,
      userId: family.user_id,
      headName: family.full_name || "",
      nationalId: String(family.national_id || ""),
      phone: family.phone || "",
      region: previousAreaLabels[housing?.previous_area] || "—",
      membersCount:
        1 +
        wives.length +
        children.length +
        marriedDaughters.length,
      status:
        family.form_status === "submitted" ? "مكتملة" : "غير مكتملة",
      formStatus: family.form_status || "draft",
      registeredAt: family.created_at
        ? String(family.created_at).slice(0, 10)
        : "—",
      editStatus: family.editing_enabled ? "open" : "closed",
      editingEnabled: Boolean(family.editing_enabled),
      editingOverride:
        family.editing_override === null ||
        family.editing_override === undefined
          ? null
          : Boolean(family.editing_override),
      birthDate: family.date_of_birth
        ? String(family.date_of_birth).slice(0, 10)
        : "",
      bloodType: family.blood_type || "",
      maritalStatus:
        maritalStatusLabels[family.marital_status] ||
        family.marital_status ||
        "",
      maritalStatusValue: family.marital_status || "",
      incomeLevel: family.income_category || "",
      workStatus:
        workStatusLabels[family.work_status] ||
        family.work_status ||
        "",
      workStatusValue: family.work_status || "",
      jobType:
        jobTypeLabels[family.job_type] ||
        family.other_job_type ||
        family.job_type ||
        "",
      jobTypeValue: family.job_type || "",
      otherJobType: family.other_job_type || "",
      previousResidence:
        previousAreaLabels[housing?.previous_area] ||
        housing?.previous_area ||
        "",
      housingType:
        housingTypeLabels[housing?.current_housing_type] ||
        housing?.current_housing_type ||
        "",
      displacementType:
        displacementTypeLabels[housing?.displacement_type] ||
        housing?.displacement_type ||
        "",
      currentAddress: housing?.current_address || "",
      wives: wives.map((wife) => ({
        id: wife.id,
        name: wife.full_name || "",
        nationalId: String(wife.national_id || ""),
        birthDate: wife.date_of_birth
          ? String(wife.date_of_birth).slice(0, 10)
          : "",
        phone: wife.phone || "",
        previousFamily: wife.previous_family_name || "",
        employmentStatus: wife.employment_status || "",
      })),
      children: children.map((child) => ({
        id: child.id,
        name: child.full_name || "",
        nationalId: String(child.national_id || ""),
        birthDate: child.date_of_birth
          ? String(child.date_of_birth).slice(0, 10)
          : "",
        education:
          educationLabels[child.education_status] ||
          child.education_status ||
          "",
        institutionName: child.institution_name || "",
        gender: child.gender || "",
      })),
      marriedDaughters: marriedDaughters.map((daughter) => ({
        id: daughter.id,
        name: daughter.full_name || "",
        nationalId: String(daughter.national_id || ""),
        phone: daughter.phone || "",
        husbandName: daughter.husband_full_name || "",
        husbandPhone: daughter.husband_phone || "",
      })),
      specialCases: specialCases.map((specialCase) => ({
        id: specialCase.id,
        personName: specialCase.full_name || "",
        nationalId: String(specialCase.national_id || ""),
        birthDate: specialCase.date_of_birth
          ? String(specialCase.date_of_birth).slice(0, 10)
          : "",
        relation: specialCase.relationship || "",
        caseType:
          specialCaseLabels[specialCase.case_type] ||
          specialCase.case_type ||
          "",
        details: specialCase.case_details || "",
      })),
      summary: {
        wivesCount: Number(summary.wives_count ?? wives.length),
        childrenCount: Number(
          summary.children_count ?? children.length,
        ),
        marriedDaughtersCount: Number(
          summary.married_daughters_count ??
            marriedDaughters.length,
        ),
        specialCasesCount: Number(
          summary.special_cases_count ??
            specialCases.length,
        ),
      },
    };
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const loadFamilyDetails = async (familyId) => {
    if (!familyId) {
      setSelectedFamily(null);
      return;
    }

    setDetailsLoading(true);

    try {
      const data = await apiRequest(
        `/api/admin/families/${familyId}`,
      );

      const normalized = normalizeFamilyDetails(data.data);

      setSelectedFamily(normalized);
      setSelectedFamilyId(normalized.id);

      setFamilyRecords((current) =>
        current.map((family) =>
          family.id === normalized.id
            ? {
                ...family,
                region: normalized.region,
                membersCount: normalized.membersCount,
                status: normalized.status,
                formStatus: normalized.formStatus,
                editStatus: normalized.editStatus,
                editingEnabled: normalized.editingEnabled,
              }
            : family,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "حدث خطأ أثناء جلب تفاصيل الأسرة.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const loadFamilies = async ({
    requestedPage = page,
    preserveSelectedId = selectedFamilyId,
  } = {}) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const query = new URLSearchParams();

      query.set("page", String(requestedPage));
      query.set("limit", "10");

      if (searchTerm.trim()) {
        query.set("search", searchTerm.trim());
      }

      if (statusFilter === "مكتملة") {
        query.set("status", "submitted");
      } else if (statusFilter === "غير مكتملة") {
        query.set("status", "draft");
      }

      const data = await apiRequest(
        `/api/admin/families?${query.toString()}`,
      );

      const apiFamilies = data.data?.families || [];
      const normalizedFamilies = apiFamilies.map(
        normalizeListFamily,
      );

      setFamilyRecords(normalizedFamilies);

      setPagination(
        data.data?.pagination || {
          page: requestedPage,
          limit: 10,
          total: normalizedFamilies.length,
          total_pages: 1,
          has_next_page: false,
          has_previous_page: false,
        },
      );

      const selectedExists = normalizedFamilies.some(
        (family) => family.id === preserveSelectedId,
      );

      const nextSelectedId = selectedExists
        ? preserveSelectedId
        : normalizedFamilies[0]?.id ?? null;

      setSelectedFamilyId(nextSelectedId);

      if (nextSelectedId) {
        await loadFamilyDetails(nextSelectedId);
      } else {
        setSelectedFamily(null);
      }
    } catch (error) {
      setFamilyRecords([]);
      setSelectedFamily(null);

      setErrorMessage(
        error.message ||
          "حدث خطأ أثناء جلب الأسر المسجلة.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = window.setTimeout(() => {
      setPage(1);
      loadFamilies({
        requestedPage: 1,
        preserveSelectedId: null,
      });
    }, 350);

    return () => window.clearTimeout(delay);
  }, [searchTerm, statusFilter]);

  const filteredFamilies = useMemo(() => {
    if (regionFilter === "الكل") {
      return familyRecords;
    }

    return familyRecords.filter(
      (family) => family.region === regionFilter,
    );
  }, [familyRecords, regionFilter]);

  const handleSelectFamily = async (familyId) => {
    clearMessages();
    setSelectedFamilyId(familyId);
    await loadFamilyDetails(familyId);
  };

  const handleToggleEditStatus = async (family) => {
    clearMessages();
    setActionFamilyId(family.id);

    const nextOverride =
      family.editStatus === "open" ? false : true;

    try {
      const data = await apiRequest(
        `/api/admin/families/${family.id}/editing`,
        {
          method: "PATCH",
          body: JSON.stringify({
            editing_override: nextOverride,
          }),
        },
      );

      const returnedFamily = data.data?.family || {};
      const returnedStatus =
        returnedFamily.form_status || family.formStatus;

      const nextEditStatus = nextOverride
        ? "open"
        : "closed";

      setFamilyRecords((currentFamilies) =>
        currentFamilies.map((currentFamily) =>
          currentFamily.id === family.id
            ? {
                ...currentFamily,
                status:
                  returnedStatus === "submitted"
                    ? "مكتملة"
                    : "غير مكتملة",
                formStatus: returnedStatus,
                editStatus: nextEditStatus,
                editingEnabled: nextOverride,
              }
            : currentFamily,
        ),
      );

      if (selectedFamily?.id === family.id) {
        setSelectedFamily((current) => ({
          ...current,
          status:
            returnedStatus === "submitted"
              ? "مكتملة"
              : "غير مكتملة",
          formStatus: returnedStatus,
          editStatus: nextEditStatus,
          editingEnabled: nextOverride,
          editingOverride: nextOverride,
        }));
      }

      setSuccessMessage(
        data.message ||
          (nextOverride
            ? "تم فتح التعديل للأسرة بنجاح."
            : "تم إغلاق التعديل للأسرة بنجاح."),
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "حدث خطأ أثناء تحديث حالة التعديل.",
      );
    } finally {
      setActionFamilyId(null);
    }
  };

  const handleOpenDeleteFamily = (family) => {
    clearMessages();
    setFamilyToDelete(family);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteFamily = () => {
    setIsDeleteModalOpen(false);
    setFamilyToDelete(null);
  };

  const handleConfirmDeleteFamily = async (familyId) => {
    clearMessages();
    setActionFamilyId(familyId);

    try {
      const data = await apiRequest(
        `/api/admin/families/${familyId}`,
        {
          method: "DELETE",
        },
      );

      handleCloseDeleteFamily();

      setSuccessMessage(
        data.message || "تم حذف الأسرة بنجاح.",
      );

      await loadFamilies({
        requestedPage: page,
        preserveSelectedId:
          selectedFamilyId === familyId
            ? null
            : selectedFamilyId,
      });
    } catch (error) {
      setErrorMessage(
        error.message || "حدث خطأ أثناء حذف الأسرة.",
      );
    } finally {
      setActionFamilyId(null);
    }
  };

  const handleAddFamily = async (payload) => {
    clearMessages();

    try {
      const data = await apiRequest(
        "/api/admin/families",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      const newFamilyId = data.data?.family?.id;

      setSuccessMessage(
        data.message || "تمت إضافة الأسرة بنجاح.",
      );

      setIsAddFamilyOpen(false);

      await loadFamilies({
        requestedPage: 1,
        preserveSelectedId: newFamilyId || null,
      });
    } catch (error) {
      throw new Error(
        error.message || "حدث خطأ أثناء إضافة الأسرة.",
      );
    }
  };

  const handleOpenEditFamily = async (family) => {
    clearMessages();

    let fullFamily = family;

    if (!family?.birthDate) {
      try {
        const data = await apiRequest(
          `/api/admin/families/${family.id}`,
        );

        fullFamily = normalizeFamilyDetails(data.data);
      } catch (error) {
        setErrorMessage(
          error.message ||
            "تعذر تحميل بيانات الأسرة للتعديل.",
        );
        return;
      }
    }

    setFamilyToEdit(fullFamily);
    setIsEditFamilyOpen(true);
  };

  const handleSaveFamily = async (updatedFamily) => {
    clearMessages();

    const payload = {
      full_name:
        updatedFamily.full_name ??
        updatedFamily.headName,
      national_id:
        updatedFamily.national_id ??
        updatedFamily.nationalId,
      phone: updatedFamily.phone,
      date_of_birth:
        updatedFamily.date_of_birth ??
        updatedFamily.birthDate,
      blood_type:
        updatedFamily.blood_type ??
        updatedFamily.bloodType ??
        null,
      marital_status:
        updatedFamily.marital_status ??
        updatedFamily.maritalStatusValue,
      income_category:
        updatedFamily.income_category ??
        updatedFamily.incomeLevel,
      work_status:
        updatedFamily.work_status ??
        updatedFamily.workStatusValue,
      job_type:
        updatedFamily.job_type ??
        updatedFamily.jobTypeValue ??
        null,
      other_job_type:
        updatedFamily.other_job_type ??
        updatedFamily.otherJobType ??
        null,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    try {
      const data = await apiRequest(
        `/api/admin/families/${updatedFamily.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      );

      setSuccessMessage(
        data.message || "تم تعديل بيانات الأسرة بنجاح.",
      );

      setIsEditFamilyOpen(false);
      setFamilyToEdit(null);

      await loadFamilies({
        requestedPage: page,
        preserveSelectedId: updatedFamily.id,
      });
    } catch (error) {
      throw new Error(
        error.message ||
          "حدث خطأ أثناء تعديل بيانات الأسرة.",
      );
    }
  };

  const handlePreviousPage = async () => {
    if (!pagination.has_previous_page || loading) {
      return;
    }

    const nextPage = Math.max(page - 1, 1);
    setPage(nextPage);

    await loadFamilies({
      requestedPage: nextPage,
      preserveSelectedId: null,
    });
  };

  const handleNextPage = async () => {
    if (!pagination.has_next_page || loading) {
      return;
    }

    const nextPage = page + 1;
    setPage(nextPage);

    await loadFamilies({
      requestedPage: nextPage,
      preserveSelectedId: null,
    });
  };

  const rangeStart =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;

  const rangeEnd = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );

  return (
    <section className="space-y-7">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-7 text-green-700"
        >
          {successMessage}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#031632]">
            الأسر المسجلة
          </h1>

          <p className="mt-2 text-slate-500">
            إدارة والبحث في سجلات الأسر المسجلة في النظام
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            clearMessages();
            setIsAddFamilyOpen(true);
          }}
          className="flex w-fit items-center gap-2 rounded-xl bg-[#031632] px-5 py-3 font-semibold text-white transition hover:bg-[#1a2b48]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="M12 5v14M5 12h14"
              strokeLinecap="round"
            />
          </svg>

          إضافة أسرة
        </button>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <label
              htmlFor="familySearch"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              البحث بالاسم أو رقم الهوية
            </label>

            <div className="relative">
              <input
                id="familySearch"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="أدخل كلمة البحث..."
                className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 pr-11 outline-none transition focus:border-[#031632] focus:ring-2 focus:ring-[#d7e2ff]"
              />

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path
                  d="m20 20-4-4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div>
            <label
              htmlFor="regionFilter"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              المنطقة
            </label>

            <select
              id="regionFilter"
              value={regionFilter}
              onChange={(event) =>
                setRegionFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
            >
              <option value="الكل">الكل</option>
              <option value="غزة">غزة</option>
              <option value="المنطقة الوسطى">
                المنطقة الوسطى
              </option>
              <option value="شمال غزة">شمال غزة</option>
              <option value="جنوب غزة">جنوب غزة</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="statusFilter"
              className="mb-2 block font-semibold text-[#111c2c]"
            >
              حالة الاستمارة
            </label>

            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
            >
              <option value="الكل">الكل</option>
              <option value="مكتملة">مكتملة</option>
              <option value="غير مكتملة">
                غير مكتملة
              </option>
            </select>
          </div>
        </div>
      </article>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-right text-sm">
            <thead className="bg-[#f1f4ff]">
              <tr className="border-b border-slate-200 text-sm text-slate-600">
                <th className="px-3 py-3">رب الأسرة</th>
                <th className="px-3 py-3">رقم الهوية</th>
                <th className="px-3 py-3">رقم الجوال</th>
                <th className="px-3 py-3">المنطقة</th>
                <th className="px-3 py-3">عدد الأفراد</th>
                <th className="px-3 py-3">الحالة</th>
                <th className="px-3 py-3">تاريخ التسجيل</th>
                <th className="px-3 py-3">إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    جاري تحميل الأسر المسجلة...
                  </td>
                </tr>
              ) : filteredFamilies.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    لا توجد أسر مطابقة.
                  </td>
                </tr>
              ) : (
                filteredFamilies.map((family) => (
                  <tr
                    key={family.id}
                    className={`border-b border-slate-100 last:border-b-0 ${
                      selectedFamilyId === family.id
                        ? "bg-[#fbfcff]"
                        : ""
                    }`}
                  >
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectFamily(family.id)
                        }
                        className="flex items-center gap-3 text-right"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dbe6ff] text-sm font-bold text-[#031632]">
                          {family.headName
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((word) => word[0])
                            .join("") || "—"}
                        </span>

                        <span className="font-semibold text-[#111c2c]">
                          {family.headName}
                        </span>
                      </button>
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {family.nationalId}
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {family.phone}
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {family.region}
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {family.membersCount}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          family.status === "مكتملة"
                            ? "bg-[#031632] text-white"
                            : "bg-[#dbe6ff] text-[#34446b]"
                        }`}
                      >
                        {family.status}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-slate-600">
                      {family.registeredAt}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <IconButton
                          label="عرض التفاصيل"
                          onClick={() =>
                            handleSelectFamily(family.id)
                          }
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                            aria-hidden="true"
                          >
                            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                            <circle
                              cx="12"
                              cy="12"
                              r="2.5"
                            />
                          </svg>
                        </IconButton>

                        <IconButton
                          label="تعديل الأسرة"
                          onClick={() =>
                            handleOpenEditFamily(family)
                          }
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 20h9"
                              strokeLinecap="round"
                            />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                          </svg>
                        </IconButton>

                        <IconButton
                          label={
                            family.editStatus === "open"
                              ? "إغلاق التعديل"
                              : "إعادة فتح التعديل"
                          }
                          disabled={
                            actionFamilyId === family.id
                          }
                          onClick={() =>
                            handleToggleEditStatus(family)
                          }
                        >
                          {family.editStatus === "open" ? (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <rect
                                x="5"
                                y="10"
                                width="14"
                                height="10"
                                rx="2"
                              />
                              <path d="M9 10V7a4 4 0 0 1 7.5-2" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <rect
                                x="5"
                                y="10"
                                width="14"
                                height="10"
                                rx="2"
                              />
                              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>
                          )}
                        </IconButton>

                        <IconButton
                          label="حذف الأسرة"
                          danger
                          disabled={
                            actionFamilyId === family.id
                          }
                          onClick={() =>
                            handleOpenDeleteFamily(family)
                          }
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
                          </svg>
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row">
          <p>
            عرض {rangeStart}-{rangeEnd} من{" "}
            {pagination.total}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={
                !pagination.has_previous_page || loading
              }
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2ff] text-[#031632] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={
                !pagination.has_next_page || loading
              }
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2ff] text-[#031632] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </article>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <h2 className="text-lg font-semibold text-slate-500">
          تفاصيل العائلة المحددة
        </h2>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {detailsLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center text-slate-500 shadow-sm">
          جاري تحميل تفاصيل الأسرة...
        </div>
      ) : !selectedFamily ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center text-slate-500 shadow-sm">
          اختر أسرة لعرض تفاصيلها.
        </div>
      ) : (
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#031632] text-lg font-bold text-white">
                {selectedFamily.headName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("") || "—"}
              </span>

              <div>
                <p className="text-sm text-slate-500">
                  أسرة:
                </p>

                <h2 className="text-2xl font-bold text-[#031632]">
                  {selectedFamily.headName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  رقم هوية رب الأسرة:{" "}
                  {selectedFamily.nationalId}
                </p>

                <p className="mt-1 text-sm">
                  حالة التعديل:
                  <span
                    className={`mr-2 font-semibold ${
                      selectedFamily.editStatus ===
                      "open"
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {selectedFamily.editStatus === "open"
                      ? "مفتوح"
                      : "مغلق"}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleOpenEditFamily(selectedFamily)
              }
              className="flex w-fit items-center gap-2 rounded-xl border-2 border-[#031632] px-5 py-3 font-semibold text-[#031632] transition hover:bg-[#031632] hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M12 20h9"
                  strokeLinecap="round"
                />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
              </svg>

              تعديل بيانات الأسرة
            </button>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <DetailCard
              title="المعلومات الأساسية"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="8" r="3" />
                  <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
              }
            >
              <InfoRow
                label="الاسم الرباعي"
                value={selectedFamily.headName}
              />
              <InfoRow
                label="رقم الهوية"
                value={selectedFamily.nationalId}
              />
              <InfoRow
                label="تاريخ الميلاد"
                value={selectedFamily.birthDate}
              />
              <InfoRow
                label="رقم الجوال"
                value={selectedFamily.phone}
              />
              <InfoRow
                label="فصيلة الدم"
                value={selectedFamily.bloodType}
              />
              <InfoRow
                label="الحالة الاجتماعية"
                value={selectedFamily.maritalStatus}
              />
              <InfoRow
                label="فئة الدخل"
                value={selectedFamily.incomeLevel}
              />
              <InfoRow
                label="حالة العمل"
                value={selectedFamily.workStatus}
              />
              <InfoRow
                label="نوع الوظيفة"
                value={selectedFamily.jobType}
              />
            </DetailCard>

            <DetailCard
              title="بيانات السكن"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path d="M3 11.5 12 4l9 7.5" />
                  <path d="M5.5 10.5V20h13v-9.5" />
                </svg>
              }
            >
              <InfoRow
                label="السكن سابقًا"
                value={selectedFamily.previousResidence}
              />
              <InfoRow
                label="طبيعة السكن الحالي"
                value={selectedFamily.housingType}
              />
              <InfoRow
                label="نوع مكان النزوح"
                value={selectedFamily.displacementType}
              />
              <InfoRow
                label="عنوان السكن الحالي"
                value={selectedFamily.currentAddress}
              />
            </DetailCard>

            <DetailCard
              title="بيانات الزوجات"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="9" cy="8" r="3" />
                  <circle cx="16" cy="9" r="2.5" />
                  <path d="M3 20a6 6 0 0 1 12 0M13 20a5 5 0 0 1 8 0" />
                </svg>
              }
            >
              {selectedFamily.wives.length ? (
                <div className="space-y-3">
                  {selectedFamily.wives.map((wife) => (
                    <div
                      key={wife.id || wife.nationalId}
                      className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4"
                    >
                      <p className="font-bold text-[#031632]">
                        {wife.name}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        الهوية: {wife.nationalId || "—"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        تاريخ الميلاد:{" "}
                        {wife.birthDate || "—"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        الجوال: {wife.phone || "—"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        العائلة السابقة:{" "}
                        {wife.previousFamily || "—"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        الحالة الوظيفية:{" "}
                        {wife.employmentStatus || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">
                  لا توجد بيانات زوجات.
                </p>
              )}
            </DetailCard>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <DetailCard
              title={`الأبناء (غير المتزوجين) — العدد: ${selectedFamily.children.length}`}
              className="xl:col-span-2"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 10h.01M16 10h.01M8.5 15a5 5 0 0 0 7 0" />
                </svg>
              }
            >
              {selectedFamily.children.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedFamily.children.map((child) => (
                    <div
                      key={
                        child.id || child.nationalId
                      }
                      className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4"
                    >
                      <p className="font-bold text-[#031632]">
                        {child.name}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        الهوية:{" "}
                        {child.nationalId || "—"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        تاريخ الميلاد:{" "}
                        {child.birthDate || "—"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        الحالة التعليمية:{" "}
                        {child.education || "—"}
                      </p>
                      {child.institutionName && (
                        <p className="mt-1 text-sm text-slate-600">
                          المؤسسة التعليمية:{" "}
                          {child.institutionName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">
                  لا توجد بيانات أبناء.
                </p>
              )}
            </DetailCard>

            <div className="space-y-5">
              <DetailCard
                title="الحالات الخاصة"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                }
              >
                {selectedFamily.specialCases.length ? (
                  <div className="space-y-3">
                    {selectedFamily.specialCases.map(
                      (specialCase) => (
                        <div
                          key={
                            specialCase.id ||
                            `${specialCase.personName}-${specialCase.caseType}`
                          }
                          className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4"
                        >
                          <p className="font-bold text-[#031632]">
                            {specialCase.personName}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            صلة القرابة:{" "}
                            {specialCase.relation ||
                              "—"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            نوع الحالة:{" "}
                            {specialCase.caseType ||
                              "—"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            التفاصيل:{" "}
                            {specialCase.details ||
                              "—"}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500">
                    لا توجد حالات خاصة.
                  </p>
                )}
              </DetailCard>

              <DetailCard
                title="البنات المتزوجات"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                  </svg>
                }
              >
                {selectedFamily.marriedDaughters
                  .length ? (
                  <div className="space-y-3">
                    {selectedFamily.marriedDaughters.map(
                      (daughter) => (
                        <div
                          key={
                            daughter.id ||
                            daughter.nationalId
                          }
                          className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4"
                        >
                          <p className="font-bold text-[#031632]">
                            {daughter.name}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            الهوية:{" "}
                            {daughter.nationalId ||
                              "—"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            الجوال:{" "}
                            {daughter.phone || "—"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            اسم الزوج:{" "}
                            {daughter.husbandName ||
                              "—"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            جوال الزوج:{" "}
                            {daughter.husbandPhone ||
                              "—"}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500">
                    لا توجد بنات متزوجات.
                  </p>
                )}
              </DetailCard>
            </div>
          </div>
        </section>
      )}

      <EditFamilyModal
        isOpen={isEditFamilyOpen}
        family={familyToEdit}
        onClose={() => {
          setIsEditFamilyOpen(false);
          setFamilyToEdit(null);
        }}
        onSave={handleSaveFamily}
      />

      <AddFamilyModal
        isOpen={isAddFamilyOpen}
        onClose={() => setIsAddFamilyOpen(false)}
        onAdd={handleAddFamily}
      />

      <DeleteFamilyModal
        isOpen={isDeleteModalOpen}
        family={familyToDelete}
        onClose={handleCloseDeleteFamily}
        onConfirm={handleConfirmDeleteFamily}
      />
    </section>
  );
}

export default FamiliesPage;