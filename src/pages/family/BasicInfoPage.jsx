import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import SaveStatusBadge from "../../components/SaveStatusBadge";
import { API_BASE_URL } from "../../config/api";

const initialFormData = {
  fullName: "",
  nationalId: "",
  dateOfBirth: "",
  phone: "",
  bloodType: "",
  gender: "",
  maritalStatus: "",
  deceasedSpouseFromSalman: null,
  deceasedSpouseCaseType: "",
  workStatus: "",
  jobSector: "",
  otherJobSector: "",
  incomeCategory: "",
};

function BasicInfoPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(initialFormData);

  const [familyPhoto, setFamilyPhoto] = useState(null);
  const [existingPhotoPath, setExistingPhotoPath] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  });

  useEffect(() => {
    const loadFamilyData = async () => {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/family`, {
          headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("family");

          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "تعذر جلب بيانات الأسرة.");
        }

        const family = data.data?.family;

        if (!family) {
          throw new Error("لم يتم العثور على بيانات الأسرة.");
        }

        setFormData({
          fullName: family.full_name || "",
          nationalId: family.national_id || "",
          dateOfBirth: family.date_of_birth || "",
          phone: family.phone || "",
          bloodType: family.blood_type || "",
          gender: family.gender || "",
          maritalStatus: family.marital_status || "",
          deceasedSpouseFromSalman:
            family.deceased_spouse_from_salman === null ||
            family.deceased_spouse_from_salman === undefined
              ? null
              : Boolean(family.deceased_spouse_from_salman),

          deceasedSpouseCaseType: family.deceased_spouse_case_type || "",
          workStatus: family.work_status || "",
          jobSector: family.job_type || "",
          otherJobSector: family.other_job_type || "",
          incomeCategory: family.income_category || "",
        });

        setExistingPhotoPath(family.personal_photo_path || "");

        setIsSaved(true);
      } catch (requestError) {
        if (requestError instanceof TypeError) {
          setError(
            "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل على المنفذ 5000.",
          );
        } else {
          setError(requestError.message || "حدث خطأ أثناء تحميل البيانات.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadFamilyData();
  }, [navigate, token]);

  useEffect(() => {
    return () => {
      if (familyPhoto?.preview) {
        URL.revokeObjectURL(familyPhoto.preview);
      }
    };
  }, [familyPhoto]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let finalValue = value;

    if (name === "nationalId") {
      finalValue = value.replace(/\D/g, "").slice(0, 9);
    }

    if (name === "phone") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: finalValue,

      ...(name === "gender"
        ? {
            maritalStatus: "",
          }
        : {}),

      ...(name === "maritalStatus" && finalValue !== "widowed"
        ? {
            deceasedSpouseFromSalman: null,
            deceasedSpouseCaseType: "",
          }
        : {}),

      ...(name === "workStatus" && finalValue !== "employee"
        ? {
            jobSector: "",
            otherJobSector: "",
          }
        : {}),

      ...(name === "jobSector" && finalValue !== "other"
        ? {
            otherJobSector: "",
          }
        : {}),
    }));

    setError("");
    setSuccessMessage("");
    setIsSaved(false);
  };

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("يرجى اختيار صورة بصيغة JPG أو PNG أو WebP.");

      event.target.value = "";
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("حجم الصورة يجب ألا يتجاوز 2 ميجابايت.");

      event.target.value = "";
      return;
    }

    if (familyPhoto?.preview) {
      URL.revokeObjectURL(familyPhoto.preview);
    }

    setFamilyPhoto({
      file: selectedFile,
      preview: URL.createObjectURL(selectedFile),
    });

    setError("");
    setSuccessMessage("");
    setIsSaved(false);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "الاسم الرباعي مطلوب.";
    }

    if (!/^\d{9}$/.test(formData.nationalId)) {
      return "رقم الهوية يجب أن يتكون من 9 أرقام.";
    }

    if (!formData.dateOfBirth) {
      return "تاريخ الميلاد مطلوب.";
    }

    if (!/^05[69]\d{7}$/.test(formData.phone)) {
      return "رقم الجوال  يجب أن يبدأ بـ 059 أو 056 ويتكون من 10 أرقام.";
    }

    if (!formData.gender) {
      return "الجنس مطلوب.";
    }

    if (!formData.maritalStatus) {
      return "الحالة الاجتماعية مطلوبة.";
    }

    if (
      formData.gender === "female" &&
      !["divorced", "widowed"].includes(formData.maritalStatus)
    ) {
      return "المرأة يمكن أن يكون لها سجل مستقل فقط إذا كانت مطلقة أو أرملة.";
    }

    if (
      formData.maritalStatus === "widowed" &&
      formData.deceasedSpouseFromSalman === null
    ) {
      return "يرجى تحديد ما إذا كان الزوج أو الزوجة المتوفى/ة من عائلة سلمان.";
    }

    if (
      formData.maritalStatus === "widowed" &&
      formData.deceasedSpouseFromSalman === true &&
      !formData.deceasedSpouseCaseType
    ) {
      return "يرجى تحديد هل الوفاة استشهاد أم وفاة أخرى.";
    }

    if (!formData.workStatus) {
      return "حالة العمل مطلوبة.";
    }

    if (formData.workStatus === "employee" && !formData.jobSector) {
      return "جهة العمل مطلوبة عند اختيار موظف.";
    }

    if (
      formData.workStatus === "employee" &&
      formData.jobSector === "other" &&
      !formData.otherJobSector.trim()
    ) {
      return "يرجى تحديد جهة العمل.";
    }

    if (!formData.incomeCategory) {
      return "فئة الدخل مطلوبة.";
    }

    return "";
  };

  const saveFamilyData = async () => {
    const validationError = validateForm();

    if (validationError) {
      throw new Error(validationError);
    }

    const response = await fetch(`${API_BASE_URL}/api/family`, {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        full_name: formData.fullName.trim(),
        national_id: formData.nationalId,
        date_of_birth: formData.dateOfBirth,
        phone: formData.phone,
        blood_type: formData.bloodType || null,
        gender: formData.gender,
        marital_status: formData.maritalStatus,
        deceased_spouse_from_salman: formData.deceasedSpouseFromSalman,
        deceased_spouse_case_type:
          formData.deceasedSpouseFromSalman === true
            ? formData.deceasedSpouseCaseType || null
            : null,
        work_status: formData.workStatus,

        job_type:
          formData.workStatus === "employee"
            ? formData.jobSector || null
            : null,

        other_job_type:
          formData.workStatus === "employee" && formData.jobSector === "other"
            ? formData.otherJobSector.trim()
            : null,

        income_category: formData.incomeCategory,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("family");

      navigate("/login", { replace: true });

      throw new Error("انتهت جلسة تسجيل الدخول.");
    }

    if (!response.ok) {
      throw new Error(data.message || "تعذر حفظ البيانات الأساسية.");
    }

    const updatedFamily = data.data?.family;

    if (updatedFamily) {
      setFormData((current) => ({
        ...current,
        fullName: updatedFamily.full_name ?? current.fullName,
        nationalId: updatedFamily.national_id ?? current.nationalId,
        phone: updatedFamily.phone ?? current.phone,
      }));

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          full_name: updatedFamily.full_name ?? storedUser.full_name,
          national_id: updatedFamily.national_id ?? storedUser.national_id,
          phone: updatedFamily.phone ?? storedUser.phone,
        }),
      );
    }
  };

  const uploadPhoto = async () => {
    if (!familyPhoto?.file) {
      return;
    }

    const photoFormData = new FormData();

    photoFormData.append("photo", familyPhoto.file);

    const response = await fetch(`${API_BASE_URL}/api/family/photo`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: photoFormData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "تم حفظ البيانات، لكن تعذر رفع الصورة.");
    }

    const photoPath = data.data?.personal_photo_path || "";

    if (photoPath) {
      setExistingPhotoPath(photoPath);
    }

    if (familyPhoto.preview) {
      URL.revokeObjectURL(familyPhoto.preview);
    }

    setFamilyPhoto(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async () => {
    const confirmed = window.confirm("هل أنت متأكد من حذف صورة رب الأسرة؟");

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/family/photo`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "تعذر حذف الصورة الشخصية.");
      }

      if (familyPhoto?.preview) {
        URL.revokeObjectURL(familyPhoto.preview);
      }

      setFamilyPhoto(null);
      setExistingPhotoPath("");
      setIsSaved(true);
      setSuccessMessage("تم حذف الصورة الشخصية بنجاح.");

      window.dispatchEvent(new Event("family-data-updated"));
    } catch (requestError) {
      setError(requestError.message || "حدث خطأ أثناء حذف الصورة الشخصية.");
    }
  };

  const saveAllData = async () => {
    await saveFamilyData();
    await uploadPhoto();
    setIsSaved(true);
  };

  const handleDraftSave = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await saveAllData();

      setSuccessMessage("تم حفظ البيانات الأساسية بنجاح.");
    } catch (requestError) {
      setError(requestError.message || "حدث خطأ أثناء حفظ البيانات.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await saveAllData();

      if (formData.gender === "male" && formData.maritalStatus === "married") {
        navigate("/family/wives");
      } else {
        navigate("/family/housing");
      }
    } catch (requestError) {
      setError(requestError.message || "حدث خطأ أثناء حفظ البيانات.");
    } finally {
      setSaving(false);
    }
  };

  const displayedPhoto =
    familyPhoto?.preview ||
    (existingPhotoPath ? `${API_BASE_URL}${existingPhotoPath}` : "");

  if (loading) {
    return (
      <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto flex min-h-[420px] w-full max-w-6xl items-center justify-center">
          <div className="text-center">
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#031632]" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              جاري تحميل البيانات الأساسية...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <form
          onSubmit={handleSaveAndContinue}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 md:p-8"
        >
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#031632]">
                البيانات الأساسية
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                أدخل بيانات رب الأسرة بدقة.
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
                    <circle cx="12" cy="12" r="9" />
                  </>
                )}
              </svg>

              {saving
                ? "جاري الحفظ..."
                : isSaved
                  ? "تم حفظ التغييرات"
                  : "لم تحفظ التغييرات"}
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700"
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-7 text-green-700">
              {successMessage}
            </div>
          )}

          <div className="mt-6 rounded-xl bg-[#f1f3ff] p-4 sm:p-5">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dfe9ff] text-slate-500">
                {displayedPhoto ? (
                  <img
                    src={displayedPhoto}
                    alt="صورة رب الأسرة"
                    className="h-full w-full object-cover"
                  />
                ) : (
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
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                    />
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-bold text-[#031632]">
                  صورة رب الأسرة
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-[#031632] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {displayedPhoto ? "تغيير الصورة" : "رفع صورة شخصية"}
                  </button>

                  {familyPhoto && (
                    <span className="max-w-full truncate text-xs text-slate-500">
                      {familyPhoto.file.name}
                    </span>
                  )}

                  {existingPhotoPath && !familyPhoto && (
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      حذف الصورة
                    </button>
                  )}
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  الصورة اختيارية، بصيغة JPG أو PNG أو WebP، وبحد أقصى 2
                  ميجابايت.{" "}
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handlePhotoChange}
                  disabled={saving}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-x-5 gap-y-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-semibold text-[#031632]"
              >
                الاسم الرباعي <span className="text-red-500">*</span>
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                disabled={saving}
                required
                placeholder=""
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition placeholder:text-slate-400 focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="nationalId"
                className="mb-2 block text-sm font-semibold text-[#031632]"
              >
                رقم الهوية <span className="text-red-500">*</span>
              </label>

              <input
                id="nationalId"
                name="nationalId"
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={formData.nationalId}
                onChange={handleChange}
                disabled={saving}
                required
                placeholder="أدخل رقم الهوية"
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-left text-sm text-[#031632] outline-none transition placeholder:text-right placeholder:text-slate-400 focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-slate-500">
                يرجى إدخال رقم هوية مكون من 9 أرقام.
              </p>
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="mb-2 block text-sm font-semibold text-[#031632]"
              >
                تاريخ الميلاد <span className="text-red-500">*</span>
              </label>

              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={saving}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-[#031632]"
              >
                رقم الجوال <span className="text-red-500">*</span>
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="off"
                value={formData.phone}
                onChange={handleChange}
                disabled={saving}
                required
                placeholder="05XXXXXXXX"
                className={`h-12 w-full rounded-xl border px-4 text-left text-sm text-[#031632] outline-none transition placeholder:text-right placeholder:text-slate-400 disabled:opacity-60 ${
                  formData.phone && !/^05[69]\d{7}$/.test(formData.phone)
                    ? "border-red-300 bg-[#fffafa] focus:border-red-400 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 bg-[#fafafe] focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
                }`}
              />

              {formData.phone && !/^05[69]\d{7}$/.test(formData.phone) && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  رقم الجوال يجب أن يبدأ بـ 059 أو 056 ويتكون من 10 أرقام.{" "}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="bloodType"
                className="mb-2 block text-sm font-semibold text-[#031632]"
              >
                فصيلة الدم
              </label>

              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                disabled={saving}
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
              >
                <option value="">اختر...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-sm font-semibold text-[#031632]"
              >
                الجنس <span className="text-red-500">*</span>
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={saving}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
              >
                <option value="">اختر...</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="maritalStatus"
                className="mb-2 block text-sm font-semibold text-[#031632]"
              >
                الحالة الاجتماعية <span className="text-red-500">*</span>
              </label>

              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                disabled={saving}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
              >
                <option value="">اختر...</option>

                {formData.gender === "male" && (
                  <>
                    <option value="single">أعزب</option>
                    <option value="married">متزوج</option>
                    <option value="divorced">مطلق</option>
                    <option value="widowed">أرمل</option>
                  </>
                )}

                {formData.gender === "female" && (
                  <>
                    <option value="divorced">مطلقة</option>
                    <option value="widowed">أرملة</option>
                  </>
                )}
              </select>

              {formData.maritalStatus === "widowed" && (
                <>
                  <div>
                    <label
                      htmlFor="deceasedSpouseFromSalman"
                      className="mb-2 block text-sm font-semibold text-[#031632]"
                    >
                      هل الزوج/الزوجة المتوفى/ة من عائلة سلمان؟{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="deceasedSpouseFromSalman"
                      name="deceasedSpouseFromSalman"
                      value={
                        formData.deceasedSpouseFromSalman === null
                          ? ""
                          : formData.deceasedSpouseFromSalman
                            ? "true"
                            : "false"
                      }
                      onChange={(event) => {
                        const value =
                          event.target.value === ""
                            ? null
                            : event.target.value === "true";

                        setFormData((current) => ({
                          ...current,
                          deceasedSpouseFromSalman: value,
                          deceasedSpouseCaseType:
                            value === true
                              ? current.deceasedSpouseCaseType
                              : "",
                        }));

                        setError("");
                        setSuccessMessage("");
                        setIsSaved(false);
                      }}
                      disabled={saving}
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
                    >
                      <option value="">اختر...</option>
                      <option value="true">نعم</option>
                      <option value="false">لا</option>
                    </select>
                  </div>

                  {formData.deceasedSpouseFromSalman === true && (
                    <div>
                      <label
                        htmlFor="deceasedSpouseCaseType"
                        className="mb-2 block text-sm font-semibold text-[#031632]"
                      >
                        نوع الوفاة <span className="text-red-500">*</span>
                      </label>

                      <select
                        id="deceasedSpouseCaseType"
                        name="deceasedSpouseCaseType"
                        value={formData.deceasedSpouseCaseType}
                        onChange={handleChange}
                        disabled={saving}
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
                      >
                        <option value="">اختر...</option>
                        <option value="martyr">استشهاد</option>
                        <option value="deceased">وفاة أخرى</option>
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>

            <div>
              <label
                htmlFor="workStatus"
                className="mb-2 block text-sm font-semibold text-[#031632]"
              >
                حالة العمل <span className="text-red-500">*</span>
              </label>

              <select
                id="workStatus"
                name="workStatus"
                value={formData.workStatus}
                onChange={handleChange}
                disabled={saving}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
              >
                <option value="">اختر...</option>
                <option value="employee">موظف</option>
                <option value="worker">عامل</option>
                <option value="not_working">لا يعمل</option>
              </select>
            </div>

            {formData.workStatus === "employee" && (
              <div>
                <label
                  htmlFor="jobSector"
                  className="mb-2 block text-sm font-semibold text-[#031632]"
                >
                  جهة العمل <span className="text-red-500">*</span>
                </label>

                <select
                  id="jobSector"
                  name="jobSector"
                  value={formData.jobSector}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
                >
                  <option value="">اختر جهة العمل</option>

                  <option value="government">حكومي</option>

                  <option value="private">قطاع خاص</option>

                  <option value="other">أخرى</option>
                </select>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  اختر القطاع الذي تعمل فيه حاليًا.
                </p>
              </div>
            )}

            {formData.workStatus === "employee" &&
              formData.jobSector === "other" && (
                <div>
                  <label
                    htmlFor="otherJobSector"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    تحديد جهة العمل <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="otherJobSector"
                    name="otherJobSector"
                    type="text"
                    value={formData.otherJobSector}
                    onChange={handleChange}
                    disabled={saving}
                    required
                    placeholder="اكتب جهة العمل أو القطاع"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition placeholder:text-slate-400 focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    اكتب جهة العمل بالتفصيل لأنها غير موجودة ضمن الخيارات.
                  </p>
                </div>
              )}

            <div>
              <label
                htmlFor="incomeCategory"
                className="mb-2 block text-sm font-semibold text-[#031632]"
              >
                فئة الدخل <span className="text-red-500">*</span>
              </label>

              <select
                id="incomeCategory"
                name="incomeCategory"
                value={formData.incomeCategory}
                onChange={handleChange}
                disabled={saving}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:opacity-60"
              >
                <option value="">اختر...</option>

                <option value="0-1000">من 0 إلى 1000</option>

                <option value="1000-3000">من 1000 إلى 3000</option>

                <option value="3000+">أكثر من 3000</option>
              </select>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDraftSave}
                disabled={saving}
                className="h-11 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ كمسودة"}
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ والمتابعة"}

                {!saving && <span aria-hidden="true">←</span>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default BasicInfoPage;
