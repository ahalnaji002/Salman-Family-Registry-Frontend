import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const API_BASE_URL = "http://localhost:5000";

const initialWifeForm = {
  fullName: "",
  nationalId: "",
  dateOfBirth: "",
  phone: "",
  previousFamilyName: "",
  employmentStatus: "",
  otherEmploymentStatus: "",
};

function WivesPage() {
  const navigate = useNavigate();

  const [wives, setWives] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWifeId, setEditingWifeId] = useState(null);

  const [wifeForm, setWifeForm] = useState(initialWifeForm);

  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingWife, setSavingWife] = useState(false);
  const [deletingWifeId, setDeletingWifeId] = useState(null);

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

  const normalizeDate = (date) => {
    if (!date) {
      return "";
    }

    return String(date).split("T")[0];
  };

  const mapWifeFromApi = (wife) => {
    const employmentStatus = wife.employment_status || "";

    const knownEmploymentStatuses = [
      "housewife",
      "employee",
    ];

    return {
      id: wife.id,

      fullName: wife.full_name || "",

      nationalId:
        wife.national_id || "",

      dateOfBirth: normalizeDate(
        wife.date_of_birth,
      ),

      phone: wife.phone || "",

      previousFamilyName:
        wife.previous_family_name || "",

      employmentStatus:
        knownEmploymentStatuses.includes(
          employmentStatus,
        )
          ? employmentStatus
          : employmentStatus
            ? "other"
            : "",

      otherEmploymentStatus:
        knownEmploymentStatuses.includes(
          employmentStatus,
        )
          ? ""
          : employmentStatus,

      originalEmploymentStatus:
        employmentStatus,
    };
  };

  const loadWives = async () => {
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/family/wives`,
        {
          headers: getAuthHeaders(),
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "تعذر تحميل بيانات الزوجات.",
        );
      }

      const apiWives =
        data.data?.wives ||
        data.wives ||
        [];

      setWives(
        apiWives.map(mapWifeFromApi),
      );

      setIsSaved(true);
    } catch (requestError) {
      if (
        requestError instanceof TypeError
      ) {
        setPageError(
          "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل.",
        );
      } else {
        setPageError(
          requestError.message ||
            "حدث خطأ أثناء تحميل بيانات الزوجات.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWives();
  }, []);

  const handleAddWife = () => {
    setEditingWifeId(null);

    setWifeForm(
      initialWifeForm,
    );

    setErrors({});
    setPageError("");
    setSuccessMessage("");

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (savingWife) {
      return;
    }

    setIsModalOpen(false);

    setEditingWifeId(null);

    setWifeForm(
      initialWifeForm,
    );

    setErrors({});
    setIsSaved(true);
  };

  const handleWifeFormChange = (
    event,
  ) => {
    const { name, value } =
      event.target;

    let finalValue = value;

    if (name === "nationalId") {
      finalValue = value
        .replace(/\D/g, "")
        .slice(0, 9);
    }

    if (name === "phone") {
      finalValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    setWifeForm(
      (currentForm) => ({
        ...currentForm,

        [name]: finalValue,

        ...(name ===
          "employmentStatus" &&
        finalValue !== "other"
          ? {
              otherEmploymentStatus:
                "",
            }
          : {}),
      }),
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,

        [name]: "",

        ...(name ===
        "employmentStatus"
          ? {
              otherEmploymentStatus:
                "",
            }
          : {}),
      }),
    );

    setPageError("");
    setSuccessMessage("");
    setIsSaved(false);
  };

  const validateWifeForm = () => {
    const newErrors = {};

    const wifeName = wifeForm.fullName.trim();

    if (!wifeName) {
      newErrors.fullName =
        "يرجى إدخال اسم الزوجة الرباعي.";
    } else {
      const wifeNameParts = wifeName
        .split(/\s+/)
        .filter(Boolean);

      if (wifeNameParts.length < 4) {
        newErrors.fullName =
          "اسم الزوجة يجب أن يكون رباعيًا.";
      }
    }

    if (
      !/^\d{9}$/.test(
        wifeForm.nationalId,
      )
    ) {
      newErrors.nationalId =
        "يرجى إدخال رقم هوية مكون من 9 أرقام.";
    }

    if (
      !wifeForm.dateOfBirth
    ) {
      newErrors.dateOfBirth =
        "يرجى اختيار تاريخ الميلاد.";
    }

    if (
      !/^05\d{8}$/.test(
        wifeForm.phone,
      )
    ) {
      newErrors.phone =
        "يرجى إدخال رقم جوال صحيح.";
    }

    if (
      !wifeForm.previousFamilyName.trim()
    ) {
      newErrors.previousFamilyName =
        "يرجى إدخال اسم العائلة السابقة.";
    }

    if (
      !wifeForm.employmentStatus
    ) {
      newErrors.employmentStatus =
        "يرجى اختيار الحالة الوظيفية.";
    }

    if (
      wifeForm.employmentStatus ===
        "other" &&
      !wifeForm.otherEmploymentStatus.trim()
    ) {
      newErrors.otherEmploymentStatus =
        "يرجى كتابة الحالة الوظيفية للزوجة.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const getEmploymentValueForApi =
    () => {
      if (
        wifeForm.employmentStatus ===
        "other"
      ) {
        return wifeForm.otherEmploymentStatus.trim();
      }

      return wifeForm.employmentStatus;
    };

  const handleSaveWife = async (
    event,
  ) => {
    event.preventDefault();

    if (
      !validateWifeForm() ||
      savingWife
    ) {
      return;
    }

    setSavingWife(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const isEditing =
        Boolean(editingWifeId);

      const url = isEditing
        ? `${API_BASE_URL}/api/family/wives/${editingWifeId}`
        : `${API_BASE_URL}/api/family/wives`;

      const response = await fetch(
        url,
        {
          method: isEditing
            ? "PATCH"
            : "POST",

          headers: {
            ...getAuthHeaders(),

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            full_name:
              wifeForm.fullName.trim(),

            national_id:
              wifeForm.nationalId,

            date_of_birth:
              wifeForm.dateOfBirth,

            phone:
              wifeForm.phone,

            previous_family_name:
              wifeForm.previousFamilyName.trim(),

            employment_status:
              getEmploymentValueForApi(),
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "تعذر تعديل بيانات الزوجة."
              : "تعذر إضافة الزوجة."),
        );
      }

      await loadWives();

      setIsModalOpen(false);
      setEditingWifeId(null);
      setWifeForm(initialWifeForm);
      setErrors({});
      setIsSaved(true);

      setSuccessMessage(
        isEditing
          ? "تم تعديل بيانات الزوجة بنجاح."
          : "تمت إضافة الزوجة بنجاح.",
      );

      window.dispatchEvent(
        new Event("family-data-updated"),
      );
    } catch (requestError) {
      setPageError(
        requestError.message ||
          "حدث خطأ أثناء حفظ بيانات الزوجة.",
      );
    } finally {
      setSavingWife(false);
    }
  };

  const handleEditWife = (
    wife,
  ) => {
    setEditingWifeId(wife.id);

    setWifeForm({
      fullName:
        wife.fullName || "",

      nationalId:
        wife.nationalId || "",

      dateOfBirth:
        wife.dateOfBirth || "",

      phone:
        wife.phone || "",

      previousFamilyName:
        wife.previousFamilyName ||
        "",

      employmentStatus:
        wife.employmentStatus ||
        "",

      otherEmploymentStatus:
        wife.otherEmploymentStatus ||
        "",
    });

    setErrors({});
    setPageError("");
    setSuccessMessage("");

    setIsModalOpen(true);
  };

  const handleDeleteWife = async (
    wifeId,
  ) => {
    if (deletingWifeId) {
      return;
    }

    const confirmed =
      window.confirm(
        "هل أنت متأكد من حذف بيانات الزوجة؟",
      );

    if (!confirmed) {
      return;
    }

    setDeletingWifeId(wifeId);

    setPageError("");
    setSuccessMessage("");

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/family/wives/${wifeId}`,
          {
            method: "DELETE",

            headers:
              getAuthHeaders(),
          },
        );

      const data = await response
        .json()
        .catch(() => ({}));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "تعذر حذف الزوجة.",
        );
      }

      setWives(
        (currentWives) =>
          currentWives.filter(
            (wife) =>
              wife.id !== wifeId,
          ),
      );

      setIsSaved(true);

      setSuccessMessage(
        "تم حذف بيانات الزوجة بنجاح.",
      );

      window.dispatchEvent(
        new Event("family-data-updated"),
      );
    } catch (requestError) {
      setPageError(
        requestError.message ||
          "حدث خطأ أثناء حذف الزوجة.",
      );
    } finally {
      setDeletingWifeId(null);
    }
  };

  const handleDraftSave = () => {
    setIsSaved(true);

    setSuccessMessage(
      "تم حفظ بيانات الزوجات.",
    );
  };

  const handleSaveAndContinue =
    () => {
      navigate(
        "/family/housing",
      );
    };

  const getEmploymentStatusLabel =
    (wife) => {
      if (
        wife.employmentStatus ===
        "housewife"
      ) {
        return "ربة أسرة";
      }

      if (
        wife.employmentStatus ===
        "employee"
      ) {
        return "موظفة";
      }

      if (
        wife.employmentStatus ===
        "other"
      ) {
        return (
          wife.otherEmploymentStatus ||
          "أخرى"
        );
      }

      return "";
    };

  const inputClassName = (
    fieldName,
  ) =>
    `h-12 w-full rounded-xl border bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
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
              جاري تحميل بيانات
              الزوجات...
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
              بيانات الزوجات
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              يمكنك إضافة أكثر من
              زوجة.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#031632]">
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
              الزوجات المضافة
            </h2>

            <span className="w-fit rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#031632]">
              عدد الزوجات المضافات:{" "}
              {wives.length}
            </span>
          </div>

          {wives.length === 0 ? (
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
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 7.5v6m3-3h-6"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-base font-bold text-[#031632]">
                لم تتم إضافة أي
                زوجة حتى الآن.
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-7 text-slate-500">
                اضغط على الزر أدناه
                لإضافة بيانات الزوجة.
                يمكنك إضافة أكثر من
                زوجة واحدة.
              </p>

              <button
                type="button"
                onClick={
                  handleAddWife
                }
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
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

                إضافة زوجة
              </button>
            </div>
          ) : (
            <div className="py-6">
              <div className="grid gap-4 md:grid-cols-2">
                {wives.map(
                  (
                    wife,
                    index,
                  ) => (
                    <div
                      key={
                        wife.id
                      }
                      className="rounded-2xl border border-slate-200 bg-[#fafafe] p-5"
                    >
                      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                        <div>
                          <span className="text-xs font-semibold text-[#d8ad55]">
                            الزوجة{" "}
                            {index +
                              1}
                          </span>

                          <h3 className="mt-1 text-base font-bold text-[#031632]">
                            {
                              wife.fullName
                            }
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditWife(
                                wife,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#031632] transition hover:border-[#d8ad55] hover:bg-[#f5f3ed]"
                            aria-label="تعديل الزوجة"
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
                              deletingWifeId ===
                              wife.id
                            }
                            onClick={() =>
                              handleDeleteWife(
                                wife.id,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="حذف الزوجة"
                          >
                            {deletingWifeId ===
                            wife.id ? (
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
                            رقم
                            الهوية
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {
                              wife.nationalId
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            تاريخ
                            الميلاد
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {
                              wife.dateOfBirth
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            رقم
                            الجوال
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {
                              wife.phone
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            العائلة
                            السابقة
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {
                              wife.previousFamilyName
                            }
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-xs text-slate-500">
                            الحالة
                            الوظيفية
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {getEmploymentStatusLabel(
                              wife,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={
                  handleAddWife
                }
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

                إضافة زوجة أخرى
              </button>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/family/basic-info"
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
              onClick={
                handleDraftSave
              }
              className="h-11 whitespace-nowrap rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
            >
              حفظ كمسودة
            </button>

            <button
              type="button"
              onClick={
                handleSaveAndContinue
              }
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
          onMouseDown={
            handleCloseModal
          }
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onMouseDown={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#031632]">
                  {editingWifeId
                    ? "تعديل بيانات الزوجة"
                    : "إضافة زوجة"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  أدخل بيانات الزوجة
                  بدقة.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                disabled={
                  savingWife
                }
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
              onSubmit={
                handleSaveWife
              }
              className="p-5 sm:p-6"
            >
              <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="wifeFullName"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    اسم الزوجة
                    الرباعي{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="wifeFullName"
                    name="fullName"
                    type="text"
                    value={
                      wifeForm.fullName
                    }
                    onChange={
                      handleWifeFormChange
                    }
                    disabled={
                      savingWife
                    }
                    placeholder="أدخل اسم الزوجة الرباعي"
                    className={inputClassName(
                      "fullName",
                    )}
                  />

                  {errors.fullName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {
                        errors.fullName
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="wifeNationalId"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    رقم الهوية{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="wifeNationalId"
                    name="nationalId"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    value={
                      wifeForm.nationalId
                    }
                    onChange={
                      handleWifeFormChange
                    }
                    disabled={
                      savingWife
                    }
                    placeholder="أدخل رقم الهوية"
                    className={`${inputClassName(
                      "nationalId",
                    )} text-left placeholder:text-right`}
                  />

                  {errors.nationalId && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {
                        errors.nationalId
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="wifeDateOfBirth"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    تاريخ الميلاد{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="wifeDateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={
                      wifeForm.dateOfBirth
                    }
                    onChange={
                      handleWifeFormChange
                    }
                    disabled={
                      savingWife
                    }
                    className={inputClassName(
                      "dateOfBirth",
                    )}
                  />

                  {errors.dateOfBirth && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {
                        errors.dateOfBirth
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="wifePhone"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    رقم الجوال{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="wifePhone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={
                      wifeForm.phone
                    }
                    onChange={
                      handleWifeFormChange
                    }
                    disabled={
                      savingWife
                    }
                    placeholder="05XXXXXXXX"
                    className={`${inputClassName(
                      "phone",
                    )} text-left placeholder:text-right`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="previousFamilyName"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    عائلة الزوجة
                    السابقة{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="previousFamilyName"
                    name="previousFamilyName"
                    type="text"
                    value={
                      wifeForm.previousFamilyName
                    }
                    onChange={
                      handleWifeFormChange
                    }
                    disabled={
                      savingWife
                    }
                    placeholder="أدخل اسم العائلة السابقة"
                    className={inputClassName(
                      "previousFamilyName",
                    )}
                  />

                  {errors.previousFamilyName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {
                        errors.previousFamilyName
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="employmentStatus"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    الحالة الوظيفية
                    للزوجة{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={
                      wifeForm.employmentStatus
                    }
                    onChange={
                      handleWifeFormChange
                    }
                    disabled={
                      savingWife
                    }
                    className={inputClassName(
                      "employmentStatus",
                    )}
                  >
                    <option value="">
                      اختر...
                    </option>

                    <option value="housewife">
                      ربة أسرة
                    </option>

                    <option value="employee">
                      موظفة
                    </option>

                    <option value="other">
                      أخرى
                    </option>
                  </select>

                  {errors.employmentStatus && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {
                        errors.employmentStatus
                      }
                    </p>
                  )}
                </div>

                {wifeForm.employmentStatus ===
                  "other" && (
                  <div className="md:col-span-2">
                    <label
                      htmlFor="otherEmploymentStatus"
                      className="mb-2 block text-sm font-semibold text-[#031632]"
                    >
                      اكتب الحالة
                      الوظيفية{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      id="otherEmploymentStatus"
                      name="otherEmploymentStatus"
                      type="text"
                      value={
                        wifeForm.otherEmploymentStatus
                      }
                      onChange={
                        handleWifeFormChange
                      }
                      disabled={
                        savingWife
                      }
                      placeholder="اكتب الحالة الوظيفية للزوجة"
                      className={inputClassName(
                        "otherEmploymentStatus",
                      )}
                    />

                    {errors.otherEmploymentStatus && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {
                          errors.otherEmploymentStatus
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  disabled={
                    savingWife
                  }
                  className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={
                    savingWife
                  }
                  className="h-11 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingWife
                    ? "جاري الحفظ..."
                    : editingWifeId
                      ? "حفظ التعديلات"
                      : "حفظ الزوجة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default WivesPage;