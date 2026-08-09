import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import SaveStatusBadge from "../../components/SaveStatusBadge";

const API_BASE_URL = "http://localhost:5000";

const initialDaughterForm = {
  fullName: "",
  nationalId: "",
  husbandName: "",
  phone: "",
  husbandPhone: "",
};

function MarriedDaughtersPage() {
  const navigate = useNavigate();

  const [marriedDaughters, setMarriedDaughters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDaughterId, setEditingDaughterId] = useState(null);

  const [daughterForm, setDaughterForm] = useState(initialDaughterForm);

  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingDaughter, setSavingDaughter] = useState(false);
  const [deletingDaughterId, setDeletingDaughterId] = useState(null);

  const [isSaved, setIsSaved] = useState(false);

  const [modalError, setModalError] = useState("");

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

  const mapDaughterFromApi = (daughter) => ({
    id: daughter.id,
    fullName: daughter.full_name || "",
    nationalId: String(daughter.national_id || ""),
    husbandName: daughter.husband_full_name || "",
    phone: daughter.phone || "",
    husbandPhone: daughter.husband_phone || "",
  });

  const loadMarriedDaughters = async () => {
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/family/married-daughters`,
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
        throw new Error(data.message || "تعذر تحميل بيانات البنات المتزوجات.");
      }

      const apiDaughters =
        data.data?.married_daughters || data.married_daughters || [];

      setMarriedDaughters(apiDaughters.map(mapDaughterFromApi));

      if (apiDaughters.length > 0) {
        setIsSaved(true);
      }
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setPageError("تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل.");
      } else {
        setPageError(
          requestError.message ||
            "حدث خطأ أثناء تحميل بيانات البنات المتزوجات.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarriedDaughters();
  }, []);

  const handleAddMarriedDaughter = () => {
    setEditingDaughterId(null);
    setDaughterForm(initialDaughterForm);
    setErrors({});
    setPageError("");
    setModalError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (savingDaughter) {
      return;
    }

    setIsModalOpen(false);
    setEditingDaughterId(null);
    setDaughterForm(initialDaughterForm);
    setErrors({});
    setModalError("");
  };

  const handleDaughterFormChange = (event) => {
    const { name, value } = event.target;

    let finalValue = value;

    if (name === "nationalId") {
      finalValue = value.replace(/\D/g, "").slice(0, 9);
    }

    if (name === "phone" || name === "husbandPhone") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setDaughterForm((currentForm) => ({
      ...currentForm,
      [name]: finalValue,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setPageError("");
    setSuccessMessage("");
    setIsSaved(false);
  };

  const validateDaughterForm = () => {
    const newErrors = {};

    const daughterName = daughterForm.fullName.trim();

    const husbandName = daughterForm.husbandName.trim();

    if (!daughterName) {
      newErrors.fullName = "يرجى إدخال اسم الابنة.";
    } else {
      const daughterNameParts = daughterName.split(/\s+/).filter(Boolean);

      if (daughterNameParts.length > 2) {
        newErrors.fullName = "ادخل فقط اسم الابنة";
      }
    }

    if (!/^\d{9}$/.test(daughterForm.nationalId)) {
      newErrors.nationalId = "يرجى إدخال رقم هوية مكون من 9 أرقام.";
    }

    if (!husbandName) {
      newErrors.husbandName = "يرجى إدخال اسم الزوج الرباعي.";
    } else {
      const husbandNameParts = husbandName.split(/\s+/).filter(Boolean);

      if (husbandNameParts.length < 4) {
        newErrors.husbandName = "اسم الزوج يجب أن يكون رباعيًا على الأقل.";
      }
    }

    if (!daughterForm.phone) {
      newErrors.phone = "يرجى إدخال رقم جوال البنت.";
    } else if (!/^05\d{8}$/.test(daughterForm.phone)) {
      newErrors.phone = "يرجى إدخال رقم جوال صحيح يبدأ بـ 05.";
    }

    if (!daughterForm.husbandPhone) {
      newErrors.husbandPhone = "يرجى إدخال رقم جوال الزوج.";
    } else if (!/^05\d{8}$/.test(daughterForm.husbandPhone)) {
      newErrors.husbandPhone = "يرجى إدخال رقم جوال الزوج بشكل صحيح.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDaughter = async (event) => {
    event.preventDefault();
    setModalError("");
    setSuccessMessage("");

    if (!validateDaughterForm() || savingDaughter) {
      return;
    }

    setSavingDaughter(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const isEditing = Boolean(editingDaughterId);

      const url = isEditing
        ? `${API_BASE_URL}/api/family/married-daughters/${editingDaughterId}`
        : `${API_BASE_URL}/api/family/married-daughters`;

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",

        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          full_name: daughterForm.fullName.trim(),

          national_id: daughterForm.nationalId,

          phone: daughterForm.phone.trim(),

          husband_full_name: daughterForm.husbandName.trim(),

          husband_phone: daughterForm.husbandPhone.trim(),
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
              ? "تعذر تعديل بيانات البنت المتزوجة."
              : "تعذر إضافة البنت المتزوجة."),
        );
      }

      await loadMarriedDaughters();

      setIsModalOpen(false);
      setEditingDaughterId(null);
      setDaughterForm(initialDaughterForm);
      setErrors({});
      setIsSaved(true);

      setSuccessMessage(
        isEditing
          ? "تم تعديل بيانات البنت المتزوجة بنجاح."
          : "تمت إضافة البنت المتزوجة بنجاح.",
      );
    } catch (requestError) {
      setModalError(
        requestError.message || "حدث خطأ أثناء حفظ بيانات البنت المتزوجة.",
      );
    } finally {
      setSavingDaughter(false);
    }
  };

  const handleEditDaughter = (daughter) => {
    setEditingDaughterId(daughter.id);

    setDaughterForm({
      fullName: daughter.fullName || "",
      nationalId: daughter.nationalId || "",
      husbandName: daughter.husbandName || "",
      phone: daughter.phone || "",
      husbandPhone: daughter.husbandPhone || "",
    });

    setErrors({});
    setPageError("");
    setModalError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleDeleteDaughter = async (daughterId) => {
    if (deletingDaughterId) {
      return;
    }

    const confirmed = window.confirm(
      "هل أنت متأكد من حذف بيانات البنت المتزوجة؟",
    );

    if (!confirmed) {
      return;
    }

    setDeletingDaughterId(daughterId);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/family/married-daughters/${daughterId}`,
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
        throw new Error(data.message || "تعذر حذف بيانات البنت المتزوجة.");
      }

      setMarriedDaughters((currentDaughters) =>
        currentDaughters.filter((daughter) => daughter.id !== daughterId),
      );

      setIsSaved(true);

      setSuccessMessage("تم حذف بيانات البنت المتزوجة بنجاح.");
    } catch (requestError) {
      setPageError(
        requestError.message || "حدث خطأ أثناء حذف بيانات البنت المتزوجة.",
      );
    } finally {
      setDeletingDaughterId(null);
    }
  };

  const handleDraftSave = () => {
    setIsSaved(true);

    setSuccessMessage("تم حفظ بيانات البنات المتزوجات.");
  };

  const handleSaveAndContinue = () => {
    navigate("/family/review");
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
              جاري تحميل بيانات البنات المتزوجات...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#031632] md:text-2xl">
                بيانات البنات المتزوجات
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                أضف البنات المتزوجات فقط، ولا تضفهن ضمن قسم الأبناء.
              </p>
            </div>

            <SaveStatusBadge isSaved={isSaved} saving={savingDaughter} />
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

          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-[#031632]">
              البنات المتزوجات المضافات
            </h2>

            <span className="w-fit rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#031632]">
              العدد: {marriedDaughters.length}
            </span>
          </div>

          {marriedDaughters.length === 0 ? (
            <div className="flex min-h-[390px] flex-col items-center justify-center px-4 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eef3ff] text-[#031632]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
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
                    d="M18.75 7.5v6m3-3h-6"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-base font-bold text-[#031632]">
                لم تتم إضافة أي بنت متزوجة حتى الآن.
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-7 text-slate-500">
                اضغط على الزر لإضافة بيانات بنت متزوجة لضمان اكتمال السجل
                العائلي بدقة.
              </p>

              <button
                type="button"
                onClick={handleAddMarriedDaughter}
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
                إضافة بنت متزوجة
              </button>
            </div>
          ) : (
            <div className="py-6">
              <div className="grid gap-4 md:grid-cols-2">
                {marriedDaughters.map((daughter, index) => (
                  <div
                    key={daughter.id}
                    className="rounded-2xl border border-slate-200 bg-[#fafafe] p-5"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-semibold text-[#d8ad55]">
                          البنت المتزوجة {index + 1}
                        </span>

                        <h3 className="mt-1 text-base font-bold text-[#031632]">
                          {daughter.fullName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditDaughter(daughter)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#031632] transition hover:border-[#d8ad55] hover:bg-[#f5f3ed]"
                          aria-label="تعديل بيانات البنت المتزوجة"
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
                          disabled={deletingDaughterId === daughter.id}
                          onClick={() => handleDeleteDaughter(daughter.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="حذف بيانات البنت المتزوجة"
                        >
                          {deletingDaughterId === daughter.id ? (
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
                        <p className="text-xs text-slate-500">رقم الهوية</p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {daughter.nationalId}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">اسم الزوج</p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {daughter.husbandName}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">رقم جوال البنت</p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {daughter.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">رقم جوال الزوج</p>

                        <p className="mt-1 text-sm font-semibold text-[#031632]">
                          {daughter.husbandPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddMarriedDaughter}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
              >
                إضافة بنت متزوجة أخرى
              </button>
            </div>
          )}

          <div className="mt-7 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/family/special-cases"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] sm:w-auto"
            >
              <span aria-hidden="true">→</span>
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
                <span aria-hidden="true">←</span>
              </button>
            </div>
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
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#031632]">
                  {editingDaughterId
                    ? "تعديل بيانات البنت المتزوجة"
                    : "إضافة بنت متزوجة"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  أدخل بيانات البنت المتزوجة بدقة.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={savingDaughter}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f8] text-[#031632] transition hover:bg-[#e7ebf1] disabled:opacity-50"
                aria-label="إغلاق"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveDaughter} className="p-5 sm:p-6">
              <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#031632]">
                    اسم الابنة <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="fullName"
                    type="text"
                    value={daughterForm.fullName}
                    onChange={handleDaughterFormChange}
                    disabled={savingDaughter}
                    placeholder="أدخل اسم الابنة فقط"
                    className={inputClassName("fullName")}
                  />

                  {errors.fullName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#031632]">
                    رقم الهوية <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="nationalId"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    value={daughterForm.nationalId}
                    onChange={handleDaughterFormChange}
                    disabled={savingDaughter}
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
                  <label className="mb-2 block text-sm font-semibold text-[#031632]">
                    اسم الزوج الرباعي <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="husbandName"
                    type="text"
                    value={daughterForm.husbandName}
                    onChange={handleDaughterFormChange}
                    disabled={savingDaughter}
                    placeholder="أدخل اسم الزوج الرباعي"
                    className={inputClassName("husbandName")}
                  />

                  {errors.husbandName && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.husbandName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#031632]">
                    رقم جوال البنت <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={daughterForm.phone}
                    onChange={handleDaughterFormChange}
                    disabled={savingDaughter}
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
                  <label className="mb-2 block text-sm font-semibold text-[#031632]">
                    رقم جوال الزوج <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="husbandPhone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={daughterForm.husbandPhone}
                    onChange={handleDaughterFormChange}
                    disabled={savingDaughter}
                    placeholder="05XXXXXXXX"
                    className={`${inputClassName(
                      "husbandPhone",
                    )} text-left placeholder:text-right`}
                  />

                  {errors.husbandPhone && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.husbandPhone}
                    </p>
                  )}
                </div>
              </div>

              {modalError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {modalError}
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={savingDaughter}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={savingDaughter}
                  className="h-11 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingDaughter
                    ? "جاري الحفظ..."
                    : editingDaughterId
                      ? "حفظ التعديلات"
                      : "حفظ البنت المتزوجة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MarriedDaughtersPage;
