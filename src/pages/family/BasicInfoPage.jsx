import { useRef, useState } from "react";
import { useNavigate } from "react-router";
function BasicInfoPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "محمد أحمد علي سلمان",
    nationalId: "102938475",
    dateOfBirth: "",
    phone: "",
    bloodType: "",
    maritalStatus: "",
    workStatus: "",
    jobSector: "",
    otherJobSector: "",
    incomeCategory: "",
  });

  const [familyPhoto, setFamilyPhoto] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
      ...(name === "workStatus" && value !== "employee"
        ? {
            jobSector: "",
            otherJobSector: "",
          }
        : {}),
      ...(name === "jobSector" && value !== "other"
        ? {
            otherJobSector: "",
          }
        : {}),
    }));
  };

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFamilyPhoto({
      file: selectedFile,
      preview: URL.createObjectURL(selectedFile),
    });
  };

  const handleDraftSave = (event) => {
    event.preventDefault();
  };

  const handleSaveAndContinue = (event) => {
    event.preventDefault();
    navigate("/family/wives");
  };
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

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#031632]">
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
                  d="M12 6v6l4 2"
                />
                <circle cx="12" cy="12" r="9" />
              </svg>

              لم تحفظ التغييرات
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-[#f1f3ff] p-4 sm:p-5">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dfe9ff] text-slate-500">
                {familyPhoto?.preview ? (
                  <img
                    src={familyPhoto.preview}
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
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-[#031632] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#020f23]"
                  >
                    رفع صورة شخصية
                  </button>

                  {familyPhoto && (
                    <span className="max-w-full truncate text-xs text-slate-500">
                      {familyPhoto.file.name}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  الصورة اختيارية، بصيغة JPG أو PNG أو WebP، وبحد أقصى 2
                  ميجابايت.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handlePhotoChange}
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
                placeholder="أدخل الاسم الرباعي"
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition placeholder:text-slate-400 focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
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
                placeholder="أدخل رقم الهوية"
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-left text-sm text-[#031632] outline-none transition placeholder:text-right placeholder:text-slate-400 focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
              />

              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11v5m0-8h.01"
                  />
                </svg>

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
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
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
                placeholder="05XXXXXXXX"
                className={`h-12 w-full rounded-xl border px-4 text-left text-sm text-[#031632] outline-none transition placeholder:text-right placeholder:text-slate-400 ${
                  formData.phone && !/^05\d{8}$/.test(formData.phone)
                    ? "border-red-300 bg-[#fffafa] focus:border-red-400 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 bg-[#fafafe] focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
                }`}
              />

              {formData.phone && !/^05\d{8}$/.test(formData.phone) && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v5m0 3h.01"
                    />
                  </svg>

                  يرجى إدخال رقم جوال صحيح.
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
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
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
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
              >
                <option value="">اختر...</option>
                <option value="single">أعزب</option>
                <option value="married">متزوج</option>
                <option value="divorced">مطلق</option>
                <option value="widowed">أرمل</option>
              </select>
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
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
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
                  className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
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
                    placeholder="اكتب جهة العمل أو القطاع"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition placeholder:text-slate-400 focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
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
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
              >
                <option value="">اختر...</option>
                <option value="0-1000">من 0 إلى 1000</option>
                <option value="1000-3000">من 1000 إلى 3000</option>
                <option value="3000+">أكثر من 3000</option>
              </select>
            </div>
          </div>
        </form>

        <div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDraftSave}
              className="h-11 rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe]"
            >
              حفظ كمسودة
            </button>

            <button
              type="button"
              onClick={handleSaveAndContinue}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23]"
            >
              حفظ والمتابعة
              <span aria-hidden="true">←</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BasicInfoPage;