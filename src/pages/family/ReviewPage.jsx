import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { API_BASE_URL } from "../../config/api";

function ReviewPage() {
  const navigate = useNavigate();

  const [family, setFamily] = useState(null);
  const [wives, setWives] = useState([]);
  const [housing, setHousing] = useState(null);
  const [children, setChildren] = useState([]);
  const [specialCases, setSpecialCases] = useState([]);
  const [marriedDaughters, setMarriedDaughters] = useState([]);

  const [completion, setCompletion] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  });

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("family");

    navigate("/login", {
      replace: true,
    });
  };

  const normalizeDate = (dateValue) => {
    if (!dateValue) {
      return "غير مضاف";
    }

    return String(dateValue).split("T")[0];
  };

  const getMaritalStatusLabel = (value, gender) => {
    if (gender === "female") {
      const femaleLabels = {
        single: "عزباء",
        married: "متزوجة",
        divorced: "مطلقة",
        widowed: "أرملة",
      };

      return femaleLabels[value] || value || "غير مضاف";
    }

    const maleLabels = {
      single: "أعزب",
      married: "متزوج",
      divorced: "مطلق",
      widowed: "أرمل",
    };

    return maleLabels[value] || value || "غير مضاف";
  };

  const getIncomeCategoryLabel = (value) => {
    const labels = {
      "0-1000": "من 0 إلى 1000",
      "1000-3000": "من 1000 إلى 3000",
      "3000+": "أكثر من 3000",
    };

    return labels[value] || value || "غير مضاف";
  };

  const getWorkStatusLabel = (value) => {
    const labels = {
      employee: "موظف",
      worker: "عامل",
      not_working: "لا يعمل",
    };

    return labels[value] || value || "غير مضاف";
  };

  const getJobTypeLabel = (value) => {
    const labels = {
      government: "حكومي",
      private: "قطاع خاص",
      other: "أخرى",
    };

    return labels[value] || value || "غير مضاف";
  };

  const getEmploymentStatusLabel = (value) => {
    const labels = {
      housewife: "ربة أسرة",
      employee: "موظفة",
    };

    return labels[value] || value || "غير مضاف";
  };

  const getPreviousAreaLabel = (value) => {
    const labels = {
      north_gaza: "شمال غزة",
      gaza: "غزة",
      middle_area: "الوسطى",
      south_gaza: "جنوب غزة",
    };

    return labels[value] || value || "غير مضاف";
  };

  const getHousingTypeLabel = (value) => {
    const labels = {
      owned: "ملك",
      rented: "إيجار",
      displaced: "نازح",
    };

    return labels[value] || value || "غير مضاف";
  };

  const getDisplacementTypeLabel = (value) => {
    const labels = {
      tent: "خيمة",
      shelter_center: "مركز إيواء",
      relatives_house: "بيت أقارب",
    };

    return labels[value] || "غير محدد";
  };

  const getGenderLabel = (value) => {
    if (value === "male") {
      return "ذكر";
    }

    if (value === "female") {
      return "أنثى";
    }

    return "غير مضاف";
  };

  const getEducationStatusLabel = (value) => {
    const labels = {
      under_6: "طفل أقل من 6 سنوات",
      school: "مدرسة",
      university: "جامعة",
      not_studying: "لا يدرس",
    };

    return labels[value] || value || "غير مضاف";
  };

  const getCaseTypeLabel = (value) => {
    const labels = {
      patient: "مريض",
      injured: "جريح",
      disability: "ذوي إعاقة",
      martyr: "شهيد",
      deceased: "متوفى",
      pregnant: "حامل",
    };

    return labels[value] || value || "غير مضاف";
  };

  const loadReviewData = async () => {
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const [familyResponse, completionResponse, editingResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/family`, {
            headers: getAuthHeaders(),
          }),

          fetch(`${API_BASE_URL}/api/family/completion`, {
            headers: getAuthHeaders(),
          }),

          fetch(`${API_BASE_URL}/api/family/editing-status`, {
            headers: getAuthHeaders(),
          }),
        ]);

      if (
        familyResponse.status === 401 ||
        completionResponse.status === 401 ||
        editingResponse.status === 401
      ) {
        handleUnauthorized();
        return;
      }

      const [familyData, completionData, editingData] = await Promise.all([
        familyResponse.json().catch(() => ({})),
        completionResponse.json().catch(() => ({})),
        editingResponse.json().catch(() => ({})),
      ]);

      if (!familyResponse.ok) {
        throw new Error(familyData.message || "تعذر تحميل بيانات الأسرة.");
      }

      if (!completionResponse.ok) {
        throw new Error(
          completionData.message || "تعذر تحميل حالة اكتمال النموذج.",
        );
      }

      if (!editingResponse.ok) {
        throw new Error(editingData.message || "تعذر تحميل حالة النموذج.");
      }

      const payload = familyData.data || familyData;

      setFamily(payload.family || null);
      setHousing(payload.housing || payload.family_housing || null);

      setWives(payload.wives || []);
      setChildren(payload.children || []);

      setSpecialCases(payload.special_cases || []);

      setMarriedDaughters(payload.married_daughters || []);

      setCompletion(completionData.data || completionData);

      setEditingStatus(editingData.data || editingData);
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setPageError("تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل.");
      } else {
        setPageError(
          requestError.message || "حدث خطأ أثناء تحميل صفحة المراجعة.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviewData();
  }, []);

  const handleSubmit = () => {
    if (!isConfirmed) {
      return;
    }

    setPageError("");
    setSuccessMessage("");
    setIsSubmitModalOpen(true);
  };

  const handleCloseSubmitModal = () => {
    if (submitting) {
      return;
    }

    setIsSubmitModalOpen(false);
  };

  const handleConfirmSubmit = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/family/submit`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let message = data.message || "تعذر إرسال الاستمارة.";

        const missingFields =
          data.data?.missing_fields || data.missing_fields || [];

        if (Array.isArray(missingFields) && missingFields.length > 0) {
          message = `${message} البيانات الناقصة: ${missingFields.join("، ")}`;
        }

        throw new Error(message);
      }

      setIsSubmitModalOpen(false);

      setSuccessMessage("تم إرسال الاستمارة واعتمادها بنجاح.");

      setIsConfirmed(false);

      setTimeout(() => {
        navigate("/family", {
          replace: true,
        });
      }, 700);
    } catch (requestError) {
      setIsSubmitModalOpen(false);

      setPageError(requestError.message || "حدث خطأ أثناء إرسال الاستمارة.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    isConfirmed &&
    family?.form_status === "draft" &&
    Boolean(family?.editing_enabled);

  if (loading) {
    return (
      <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto flex min-h-[500px] w-full max-w-5xl items-center justify-center">
          <div className="text-center">
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#031632]" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              جاري تحميل بيانات المراجعة...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!family) {
    return (
      <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
            تعذر العثور على بيانات الأسرة.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#031632] md:text-3xl">
            مراجعة الاستمارة
          </h1>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            راجع جميع البيانات بعناية قبل إرسال الاستمارة.
          </p>
        </div>

        {pageError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700">
            {pageError}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-7 text-green-700">
            {successMessage}
          </div>
        )}

        {completion &&
          Array.isArray(completion.missing_sections) &&
          completion.missing_sections.length > 0 && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
              <p className="font-bold">يوجد أقسام مطلوبة غير مكتملة:</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {completion.missing_sections.map((section) => (
                  <span
                    key={section.key || section.name}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold"
                  >
                    {section.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        {family.form_status === "submitted" && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-semibold text-green-700">
            تم إرسال هذه الاستمارة مسبقًا.
          </div>
        )}

        <div className="space-y-5">
          {/* البيانات الأساسية */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#031632]">
                البيانات الأساسية
              </h2>

              {family.form_status === "draft" && family.editing_enabled && (
                <Link
                  to="/family/basic-info"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
                >
                  تعديل
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 3.487 3.651 3.651M5.25 18.75l4.229-.94L19.572 7.717a1.5 1.5 0 0 0 0-2.121l-1.168-1.168a1.5 1.5 0 0 0-2.121 0L6.19 14.521l-.94 4.229Z"
                    />
                  </svg>
                </Link>
              )}
            </div>

            <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">الاسم الكامل</p>

                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {family.full_name || "غير مضاف"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">رقم الهوية</p>

                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {family.national_id || "غير مضاف"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">تاريخ الميلاد</p>

                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {normalizeDate(family.date_of_birth)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">رقم الجوال</p>

                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {family.phone || "غير مضاف"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">فصيلة الدم</p>

                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {family.blood_type || "غير مضاف"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">الحالة الاجتماعية</p>

                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {getMaritalStatusLabel(family.marital_status, family.gender)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">حالة العمل</p>

                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {getWorkStatusLabel(family.work_status)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">فئة الدخل</p>

                <p className="mt-1 text-sm font-semibold text-[#031632]">
                  {getIncomeCategoryLabel(family.income_category)}
                </p>
              </div>

              {family.work_status === "employee" && (
                <div>
                  <p className="text-xs text-slate-500">نوع الوظيفة</p>

                  <p className="mt-1 text-sm font-semibold text-[#031632]">
                    {family.job_type === "other"
                      ? family.other_job_type || "أخرى"
                      : getJobTypeLabel(family.job_type)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* الزوجات */}
          {family.gender === "male" && family.marital_status === "married" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-[#031632]">الزوجات</h2>

                  <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                    العدد: {wives.length}
                  </span>
                </div>

                {family.form_status === "draft" && family.editing_enabled && (
                  <Link
                    to="/family/wives"
                    className="text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
                  >
                    تعديل
                  </Link>
                )}
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                {wives.length > 0 ? (
                  wives.map((wife) => (
                    <div
                      key={wife.id}
                      className="grid gap-4 rounded-xl bg-[#f8f8fe] p-4 sm:grid-cols-2 lg:grid-cols-6"
                    >
                      <div>
                        <p className="text-xs text-slate-500">الاسم</p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {wife.full_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">رقم الهوية</p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {wife.national_id}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">تاريخ الميلاد</p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {normalizeDate(wife.date_of_birth)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">رقم الجوال</p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {wife.phone || "غير مضاف"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          العائلة السابقة
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {wife.previous_family_name || "غير مضاف"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          الحالة الوظيفية
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {getEmploymentStatusLabel(wife.employment_status)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">لا توجد زوجات مضافة.</p>
                )}
              </div>
            </div>
          )}

          {/* السكن */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#031632]">السكن</h2>

              {family.form_status === "draft" && family.editing_enabled && (
                <Link
                  to="/family/housing"
                  className="text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
                >
                  تعديل
                </Link>
              )}
            </div>

            {housing ? (
              <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">السكن سابقًا</p>

                  <p className="mt-1 text-sm font-semibold text-[#031632]">
                    {getPreviousAreaLabel(housing.previous_area)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">طبيعة السكن الحالي</p>

                  <p className="mt-1 text-sm font-semibold text-[#031632]">
                    {getHousingTypeLabel(
                      housing.current_housing || housing.current_housing_type,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">نوع سكن النزوح</p>

                  <p className="mt-1 text-sm font-semibold text-[#031632]">
                    {getDisplacementTypeLabel(housing.displacement_type)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">العنوان الحالي</p>

                  <p className="mt-1 text-sm font-semibold text-[#031632]">
                    {housing.current_address || "غير مضاف"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-5 border-t border-slate-100 pt-5 text-sm text-slate-500">
                لم تتم إضافة بيانات السكن.
              </p>
            )}
          </div>

          {/* الأبناء */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#031632]">الأبناء</h2>

                <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                  العدد: {children.length}
                </span>
              </div>

              {family.form_status === "draft" && family.editing_enabled && (
                <Link
                  to="/family/children"
                  className="text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
                >
                  تعديل
                </Link>
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              {children.length > 0 ? (
                children.map((child) => (
                  <div
                    key={child.id}
                    className="grid gap-4 rounded-xl bg-[#f8f8fe] p-4 sm:grid-cols-2 lg:grid-cols-6"
                  >
                    <div>
                      <p className="text-xs text-slate-500">الاسم</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {child.full_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">رقم الهوية</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {child.national_id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">الجنس</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {getGenderLabel(child.gender)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">تاريخ الميلاد</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {normalizeDate(child.date_of_birth)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">الحالة التعليمية</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {getEducationStatusLabel(child.education_status)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        المؤسسة التعليمية
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {child.institution_name || "غير مضاف"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">لا يوجد أبناء مضافون.</p>
              )}
            </div>
          </div>

          {/* الحالات الخاصة */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#031632]">
                  الحالات الخاصة
                </h2>

                <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                  العدد: {specialCases.length}
                </span>
              </div>

              {family.form_status === "draft" && family.editing_enabled && (
                <Link
                  to="/family/special-cases"
                  className="text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
                >
                  تعديل
                </Link>
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              {specialCases.length > 0 ? (
                specialCases.map((specialCase) => (
                  <div
                    key={specialCase.id}
                    className="grid gap-4 rounded-xl bg-[#f8f8fe] p-4 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    <div>
                      <p className="text-xs text-slate-500">الاسم</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {specialCase.full_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">صلة القرابة</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {specialCase.relationship || "غير مضاف"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">نوع الحالة</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {getCaseTypeLabel(specialCase.case_type)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">تفاصيل الحالة</p>

                      <p className="mt-1 text-sm leading-6 text-[#031632]">
                        {specialCase.case_details || "غير مضاف"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  لا توجد حالات خاصة مضافة.
                </p>
              )}
            </div>
          </div>

          {/* البنات المتزوجات */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#031632]">
                  البنات المتزوجات
                </h2>

                <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                  العدد: {marriedDaughters.length}
                </span>
              </div>

              {family.form_status === "draft" && family.editing_enabled && (
                <Link
                  to="/family/married-daughters"
                  className="text-sm font-semibold text-[#031632] transition hover:text-[#d8ad55]"
                >
                  تعديل
                </Link>
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              {marriedDaughters.length > 0 ? (
                marriedDaughters.map((daughter) => (
                  <div
                    key={daughter.id}
                    className="grid gap-4 rounded-xl bg-[#f8f8fe] p-4 sm:grid-cols-2 lg:grid-cols-5"
                  >
                    <div>
                      <p className="text-xs text-slate-500">الاسم</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {daughter.full_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">رقم الهوية</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {daughter.national_id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">اسم الزوج</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {daughter.husband_full_name || "غير مضاف"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">رقم جوال البنت</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {daughter.phone || "غير مضاف"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">رقم جوال الزوج</p>

                      <p className="mt-1 text-sm font-semibold text-[#031632]">
                        {daughter.husband_phone || "غير مضاف"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  لا توجد بنات متزوجات مضافات.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-7">
          {family.form_status === "draft" ? (
            <>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(event) => setIsConfirmed(event.target.checked)}
                  disabled={!family.editing_enabled}
                  className="mt-1 h-5 w-5 rounded border-slate-300 accent-[#031632] disabled:cursor-not-allowed"
                />

                <span className="text-sm leading-7 text-[#031632]">
                  أقر بأن جميع البيانات المدخلة صحيحة حسب علمي، وأتحمل مسؤولية
                  صحة المعلومات الواردة في الاستمارة.
                </span>
              </label>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/family/married-daughters"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] sm:w-auto"
                >
                  <span aria-hidden="true">→</span>
                  السابق
                </Link>

                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#031632] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                >
                  إرسال الاستمارة
                  <span aria-hidden="true">←</span>
                </button>
              </div>

              {!family.editing_enabled && (
                <p className="mt-4 text-sm font-medium text-red-600">
                  التعديل والإرسال مغلقان حاليًا لهذه الأسرة.
                </p>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
              <p className="font-bold text-green-700">
                تم إرسال الاستمارة بنجاح.
              </p>

              <button
                type="button"
                onClick={() => navigate("/family")}
                className="mt-4 h-11 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white"
              >
                العودة إلى الصفحة الرئيسية
              </button>
            </div>
          )}
        </div>
      </div>

      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#031632]/55 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-confirmation-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf4df] text-[#031632]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75"
                />

                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>

            <h2
              id="submit-confirmation-title"
              className="mt-5 text-xl font-bold text-[#031632]"
            >
              تأكيد إرسال الاستمارة
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              هل أنت متأكد من إرسال الاستمارة؟ بعد التأكيد سيتم اعتماد البيانات
              ولن تتمكن من تعديلها إلا إذا تم إعادة فتح التعديل لك.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseSubmitModal}
                disabled={submitting}
                className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] disabled:cursor-not-allowed disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="h-11 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "جاري الإرسال..." : "تأكيد الإرسال"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ReviewPage;
