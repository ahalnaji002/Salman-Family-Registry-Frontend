import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const API_BASE_URL = "http://localhost:5000";

const initialChildForm = {
  fullName: "",
  nationalId: "",
  dateOfBirth: "",
  gender: "",
  educationStatus: "",
  institutionName: "",
};

function ChildrenPage() {
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChildId, setEditingChildId] = useState(null);
  const [childForm, setChildForm] = useState(initialChildForm);

  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingChild, setSavingChild] = useState(false);
  const [deletingChildId, setDeletingChildId] = useState(null);

  const [isSaved, setIsSaved] = useState(false);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

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
      return "";
    }

    return String(dateValue).split("T")[0];
  };

  const mapChildFromApi = (child) => ({
    id: child.id,
    fullName: child.full_name || "",
    nationalId: String(child.national_id || ""),
    dateOfBirth: normalizeDate(child.date_of_birth),
    gender: child.gender || "",
    educationStatus: child.education_status || "",
    institutionName: child.institution_name || "",
  });

  const loadChildren = async () => {
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/family/children`,
        {
          headers: getAuthHeaders(),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "تعذر تحميل بيانات الأبناء.",
        );
      }

      const apiChildren =
        data.data?.children ||
        data.children ||
        [];

      setChildren(
        apiChildren.map(mapChildFromApi),
      );

      if (apiChildren.length > 0) {
        setIsSaved(true);
      }
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setPageError(
          "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل.",
        );
      } else {
        setPageError(
          requestError.message ||
            "حدث خطأ أثناء تحميل بيانات الأبناء.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const handleAddChild = () => {
    setEditingChildId(null);
    setChildForm(initialChildForm);
    setErrors({});
    setPageError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (savingChild) {
      return;
    }

    setIsModalOpen(false);
    setEditingChildId(null);
    setChildForm(initialChildForm);
    setErrors({});
  };

  const handleChildFormChange = (event) => {
    const { name, value } = event.target;

    let finalValue = value;

    if (name === "nationalId") {
      finalValue = value
        .replace(/\D/g, "")
        .slice(0, 9);
    }

    setChildForm((currentForm) => ({
      ...currentForm,
      [name]: finalValue,

      ...(name === "educationStatus" &&
      !["school", "university"].includes(finalValue)
        ? {
            institutionName: "",
          }
        : {}),
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",

      ...(name === "educationStatus"
        ? {
            institutionName: "",
          }
        : {}),
    }));

    setPageError("");
    setSuccessMessage("");
    setIsSaved(false);
  };

  const validateChildForm = () => {
    const newErrors = {};

 const childName = childForm.fullName.trim();

if (!childName) {
  newErrors.fullName =
    "يرجى إدخال اسم الابن أو الابنة.";
} else {
  const nameParts = childName
    .split(/\s+/)
    .filter(Boolean);

  if (nameParts.length > 2) {
    newErrors.fullName =
      "ادخل فقط اسم الابن /الابنة";
  }
}

    if (!/^\d{9}$/.test(childForm.nationalId)) {
      newErrors.nationalId =
        "يرجى إدخال رقم هوية مكون من 9 أرقام.";
    }

    if (!childForm.dateOfBirth) {
      newErrors.dateOfBirth =
        "يرجى اختيار تاريخ الميلاد.";
    }

    if (!childForm.gender) {
      newErrors.gender =
        "يرجى اختيار الجنس.";
    }

    if (!childForm.educationStatus) {
      newErrors.educationStatus =
        "يرجى اختيار الحالة التعليمية.";
    }

    if (
      ["school", "university"].includes(
        childForm.educationStatus,
      ) &&
      !childForm.institutionName.trim()
    ) {
      newErrors.institutionName =
        childForm.educationStatus === "school"
          ? "يرجى إدخال اسم المدرسة."
          : "يرجى إدخال اسم الجامعة.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChild = async (event) => {
    event.preventDefault();

    if (!validateChildForm() || savingChild) {
      return;
    }

    setSavingChild(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const isEditing = Boolean(editingChildId);

      const url = isEditing
        ? `${API_BASE_URL}/api/family/children/${editingChildId}`
        : `${API_BASE_URL}/api/family/children`;

      const response = await fetch(url, {
        method: isEditing
          ? "PATCH"
          : "POST",

        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          full_name: childForm.fullName.trim(),
          national_id: childForm.nationalId,
          date_of_birth: childForm.dateOfBirth,
          gender: childForm.gender,
          education_status:
            childForm.educationStatus,

          institution_name:
            ["school", "university"].includes(
              childForm.educationStatus,
            )
              ? childForm.institutionName.trim()
              : null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "تعذر تعديل بيانات الابن أو الابنة."
              : "تعذر إضافة الابن أو الابنة."),
        );
      }

      await loadChildren();

      setIsModalOpen(false);
      setEditingChildId(null);
      setChildForm(initialChildForm);
      setErrors({});

      setIsSaved(true);

      setSuccessMessage(
        isEditing
          ? "تم تعديل بيانات الابن أو الابنة بنجاح."
          : "تمت إضافة الابن أو الابنة بنجاح.",
      );
    } catch (requestError) {
      setPageError(
        requestError.message ||
          "حدث خطأ أثناء حفظ بيانات الابن أو الابنة.",
      );
    } finally {
      setSavingChild(false);
    }
  };

  const handleEditChild = (child) => {
    setEditingChildId(child.id);

    setChildForm({
      fullName: child.fullName || "",
      nationalId: child.nationalId || "",
      dateOfBirth: child.dateOfBirth || "",
      gender: child.gender || "",
      educationStatus:
        child.educationStatus || "",
      institutionName:
        child.institutionName || "",
    });

    setErrors({});
    setPageError("");
    setSuccessMessage("");

    setIsModalOpen(true);
  };

  const handleDeleteChild = async (childId) => {
    if (deletingChildId) {
      return;
    }

    const confirmed = window.confirm(
      "هل أنت متأكد من حذف بيانات الابن أو الابنة؟",
    );

    if (!confirmed) {
      return;
    }

    setDeletingChildId(childId);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/family/children/${childId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "تعذر حذف بيانات الابن أو الابنة.",
        );
      }

      setChildren((currentChildren) =>
        currentChildren.filter(
          (child) => child.id !== childId,
        ),
      );

      setIsSaved(true);

      setSuccessMessage(
        "تم حذف بيانات الابن أو الابنة بنجاح.",
      );
    } catch (requestError) {
      setPageError(
        requestError.message ||
          "حدث خطأ أثناء حذف بيانات الابن أو الابنة.",
      );
    } finally {
      setDeletingChildId(null);
    }
  };

  const handleDraftSave = () => {
    setIsSaved(true);

    setSuccessMessage(
      "تم حفظ بيانات الأبناء.",
    );
  };

  const handleSaveAndContinue = () => {
    navigate("/family/special-cases");
  };

  const getGenderLabel = (gender) => {
    if (gender === "male") {
      return "ذكر";
    }

    if (gender === "female") {
      return "أنثى";
    }

    return "";
  };

  const getEducationStatusLabel = (
    educationStatus,
  ) => {
    const labels = {
      under_6: "طفل أقل من 6 سنوات",
      school: "مدرسة",
      university: "جامعة",
      not_studying: "لا يدرس",
    };

    return labels[educationStatus] || "";
  };

  const inputClassName = (fieldName) =>
    `h-12 w-full rounded-xl border bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
      errors[fieldName]
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-slate-200 focus:border-[#d8ad55] focus:ring-[#d8ad55]/10"
    }`;

  if (loading) {
    return (
      <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto flex min-h-[420px] w-full max-w-6xl items-center justify-center">
          <div className="text-center">
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#031632]" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              جاري تحميل بيانات الأبناء...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#031632] md:text-2xl">
              بيانات الأبناء
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              أضف بيانات الأبناء والبنات غير المتزوجات.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              isSaved
                ? "bg-green-50 text-green-700"
                : "bg-[#eef3ff] text-[#031632]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              {isSaved ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5.25 12.75 4.5 4.5 9-10.5"
                />
              ) : (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />
                </>
              )}
            </svg>

            {isSaved
              ? "تم حفظ التغييرات"
              : "لم تحفظ التغييرات"}
          </span>
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

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-[#031632]">
              الأبناء المضافون
            </h2>

            <span className="w-fit rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#031632]">
              عدد الأبناء: {children.length}
            </span>
          </div>

          {children.length === 0 ? (
            <div className="flex min-h-[390px] flex-col items-center justify-center px-4 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f1f3ff] text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-9 w-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 7.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM20.25 7.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM14.25 6a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 20.25v-3a3.75 3.75 0 0 1 7.5 0v3M14.25 20.25v-3a3.75 3.75 0 0 1 7.5 0v3M8.25 20.25v-4.5a3.75 3.75 0 0 1 7.5 0v4.5"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-base font-bold text-[#031632]">
                لم تتم إضافة أي ابن أو ابنة حتى الآن.
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-7 text-slate-500">
                اضغط على الزر أدناه لإضافة بيانات ابن أو ابنة غير متزوجة.
                يمكنك إضافة عدد غير محدود من الأبناء.
              </p>

              <button
                type="button"
                onClick={handleAddChild}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-[#031632] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m7-7H5"
                  />
                </svg>

                <span>
                  إضافة ابن أو ابنة
                </span>
              </button>
            </div>
          ) : (
            <div className="py-6">
              <div className="grid gap-4 md:grid-cols-2">
                {children.map((child, index) => (
                  <div
                    key={child.id}
                    className="rounded-2xl border border-slate-200 bg-[#fafafe] p-5"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-semibold text-[#d8ad55]">
                          الابن أو الابنة {index + 1}
                        </span>

                        <h3 className="mt-1 text-base font-bold text-[#031632]">
                          {child.fullName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditChild(child)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#031632] transition hover:border-[#d8ad55] hover:bg-[#f5f3ed]"
                          aria-label="تعديل بيانات الابن أو الابنة"
                        >
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
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingChildId ===
                            child.id
                          }
                          onClick={() =>
                            handleDeleteChild(
                              child.id,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="حذف الابن أو الابنة"
                        >
                          {deletingChildId ===
                          child.id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                          ) : (
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
                                d="M4.5 7.5h15M9.75 10.5v6m4.5-6v6M6.75 7.5l.75 12h9l.75-12M9 7.5V4.875A1.125 1.125 0 0 1 10.125 3.75h3.75A1.125 1.125 0 0 1 15 4.875V7.5"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500">
                          رقم الهوية
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {child.nationalId}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          تاريخ الميلاد
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {child.dateOfBirth}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          الجنس
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {getGenderLabel(
                            child.gender,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          الحالة التعليمية
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {getEducationStatusLabel(
                            child.educationStatus,
                          )}
                        </p>
                      </div>

                      {child.institutionName && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-slate-500">
                            {child.educationStatus ===
                            "school"
                              ? "اسم المدرسة"
                              : "اسم الجامعة"}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {
                              child.institutionName
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddChild}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m7-7H5"
                  />
                </svg>

                إضافة ابن أو ابنة أخرى
              </button>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/family/housing"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] sm:w-auto"
          >
            <span aria-hidden="true">
              →
            </span>

            السابق
          </Link>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={handleDraftSave}
              className="h-11 whitespace-nowrap rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
            >
              حفظ كمسودة
            </button>

            <button
              type="button"
              onClick={handleSaveAndContinue}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
            >
              حفظ والمتابعة

              <span aria-hidden="true">
                ←
              </span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#031632]/60 px-4 py-6 backdrop-blur-sm"
          onMouseDown={handleCloseModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#031632]">
                  {editingChildId
                    ? "تعديل بيانات الابن أو الابنة"
                    : "إضافة ابن أو ابنة"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  أدخل بيانات الابن أو الابنة غير المتزوجة بدقة.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={savingChild}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f8] text-[#031632] transition hover:bg-[#e7ebf1] disabled:opacity-50"
                aria-label="إغلاق"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleSaveChild}
              className="p-5 sm:p-6"
            >
              <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="childFullName"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    الاسم{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="childFullName"
                    name="fullName"
                    type="text"
                    value={
                      childForm.fullName
                    }
                    onChange={
                      handleChildFormChange
                    }
                    disabled={savingChild}
                    placeholder="أدخل الاسم "
                    className={inputClassName(
                      "fullName",
                    )}
                  />

                  {errors.fullName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="childNationalId"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    رقم الهوية{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="childNationalId"
                    name="nationalId"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    value={
                      childForm.nationalId
                    }
                    onChange={
                      handleChildFormChange
                    }
                    disabled={savingChild}
                    placeholder="أدخل رقم الهوية"
                    className={`${inputClassName(
                      "nationalId",
                    )} text-left placeholder:text-right`}
                  />

                  {errors.nationalId && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.nationalId}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="childDateOfBirth"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    تاريخ الميلاد{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="childDateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={
                      childForm.dateOfBirth
                    }
                    onChange={
                      handleChildFormChange
                    }
                    disabled={savingChild}
                    className={inputClassName(
                      "dateOfBirth",
                    )}
                  />

                  {errors.dateOfBirth && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="childGender"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    الجنس{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="childGender"
                    name="gender"
                    value={
                      childForm.gender
                    }
                    onChange={
                      handleChildFormChange
                    }
                    disabled={savingChild}
                    className={inputClassName(
                      "gender",
                    )}
                  >
                    <option value="">
                      اختر...
                    </option>

                    <option value="male">
                      ذكر
                    </option>

                    <option value="female">
                      أنثى
                    </option>
                  </select>

                  {errors.gender && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.gender}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="educationStatus"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    الحالة التعليمية{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="educationStatus"
                    name="educationStatus"
                    value={
                      childForm.educationStatus
                    }
                    onChange={
                      handleChildFormChange
                    }
                    disabled={savingChild}
                    className={inputClassName(
                      "educationStatus",
                    )}
                  >
                    <option value="">
                      اختر...
                    </option>

                    <option value="under_6">
                      طفل أقل من 6 سنوات
                    </option>

                    <option value="school">
                      مدرسة
                    </option>

                    <option value="university">
                      جامعة
                    </option>

                    <option value="not_studying">
                      لا يدرس
                    </option>
                  </select>

                  {errors.educationStatus && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {
                        errors.educationStatus
                      }
                    </p>
                  )}
                </div>

                {["school", "university"].includes(
                  childForm.educationStatus,
                ) && (
                  <div className="md:col-span-2">
                    <label
                      htmlFor="institutionName"
                      className="mb-2 block text-sm font-semibold text-[#031632]"
                    >
                      {childForm.educationStatus ===
                      "school"
                        ? "اسم المدرسة"
                        : "اسم الجامعة"}{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="institutionName"
                      name="institutionName"
                      type="text"
                      value={
                        childForm.institutionName
                      }
                      onChange={
                        handleChildFormChange
                      }
                      disabled={savingChild}
                      placeholder={
                        childForm.educationStatus ===
                        "school"
                          ? "أدخل اسم المدرسة"
                          : "أدخل اسم الجامعة"
                      }
                      className={inputClassName(
                        "institutionName",
                      )}
                    />

                    {errors.institutionName && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {
                          errors.institutionName
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={savingChild}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={savingChild}
                  className="h-11 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingChild
                    ? "جاري الحفظ..."
                    : editingChildId
                      ? "حفظ التعديلات"
                      : "حفظ الابن أو الابنة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default ChildrenPage;