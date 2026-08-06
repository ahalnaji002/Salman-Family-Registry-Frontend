import { useState } from "react";
import { Link, useNavigate } from "react-router";

const housingTypes = [
  {
    value: "owned",
    label: "ملك",
    icon: (
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
          d="m3 11.25 9-7.5 9 7.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 9.75v10.5h13.5V9.75M9 20.25v-6h6v6"
        />
      </svg>
    ),
  },
  {
    value: "rent",
    label: "إيجار",
    icon: (
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
          d="M6.75 3.75h10.5a2.25 2.25 0 0 1 2.25 2.25v12a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18V6a2.25 2.25 0 0 1 2.25-2.25Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 8.25h7.5M8.25 12h7.5M8.25 15.75h4.5"
        />
      </svg>
    ),
  },
  {
    value: "displaced",
    label: "نازح",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-7 w-7"
      >
        <circle cx="12" cy="5.25" r="2.25" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m10.5 8.25-1.5 4.5 3 1.5-1.5 6M12 10.5l3 2.25 2.25-.75M9 12.75l-2.25 2.25"
        />
      </svg>
    ),
  },
];

const displacementTypes = [
  {
    value: "tent",
    label: "خيمة",
  },
  {
    value: "shelter",
    label: "مركز إيواء",
  },
  {
    value: "relatives",
    label: "بيت أقارب",
  },
];

function HousingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    previousLocation: "",
    housingType: "",
    displacementType: "",
    currentAddress: "",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setIsSaved(false);
  };

  const handleHousingTypeChange = (housingType) => {
    setFormData((currentData) => ({
      ...currentData,
      housingType,
      displacementType:
        housingType === "displaced" ? currentData.displacementType : "",
    }));

    setIsSaved(false);
  };

  const handleDisplacementTypeChange = (displacementType) => {
    setFormData((currentData) => ({
      ...currentData,
      displacementType,
    }));

    setIsSaved(false);
  };

  const handleDraftSave = () => {
    setIsSaved(true);
  };

  const handleSaveAndContinue = () => {
    navigate("/family/children");
  };

  return (
    <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#031632] md:text-2xl">
              بيانات السكن
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              أدخل بيانات السكن السابق والحالي بدقة.
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
                  <circle cx="12" cy="12" r="9" />
                </>
              )}
            </svg>

            {isSaved ? "تم حفظ التغييرات" : "لم تحفظ التغييرات"}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <div>
            <label
              htmlFor="previousLocation"
              className="mb-2 block text-sm font-semibold text-[#031632]"
            >
              السكن سابقًا <span className="text-red-500">*</span>
            </label>

            <select
              id="previousLocation"
              name="previousLocation"
              value={formData.previousLocation}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 md:max-w-xl"
            >
              <option value="">اختر المنطقة</option>
              <option value="north-gaza">شمال غزة</option>
              <option value="gaza">غزة</option>
              <option value="middle-area">المنطقة الوسطى</option>
              <option value="south-gaza">جنوب غزة</option>
            </select>
          </div>

          <div className="my-8 border-t border-slate-200" />

          <div>
            <h2 className="text-sm font-semibold text-[#031632]">
              طبيعة السكن الحالي <span className="text-red-500">*</span>
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {housingTypes.map((type) => {
                const isActive = formData.housingType === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleHousingTypeChange(type.value)}
                    className={`flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-xl border-2 px-5 py-6 text-sm font-semibold transition ${
                      isActive
                        ? "border-[#031632] bg-[#f5f3ed] text-[#031632] shadow-sm"
                        : "border-slate-200 bg-[#fafafe] text-slate-600 hover:border-[#d8ad55] hover:bg-white"
                    }`}
                  >
                    <span
                      className={
                        isActive ? "text-[#031632]" : "text-slate-500"
                      }
                    >
                      {type.icon}
                    </span>

                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {formData.housingType === "displaced" && (
            <>
              <div className="my-8 border-t border-slate-200" />

              <div>
                <h2 className="text-sm font-semibold text-[#031632]">
                  نوع السكن أثناء النزوح{" "}
                  <span className="text-red-500">*</span>
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {displacementTypes.map((type) => {
                    const isActive =
                      formData.displacementType === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          handleDisplacementTypeChange(type.value)
                        }
                        className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${
                          isActive
                            ? "border-[#031632] bg-[#031632] text-white shadow-sm"
                            : "border-slate-200 bg-[#fafafe] text-[#031632] hover:border-[#d8ad55] hover:bg-white"
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="my-8 border-t border-slate-200" />

          <div>
            <label
              htmlFor="currentAddress"
              className="mb-2 block text-sm font-semibold text-[#031632]"
            >
              عنوان السكن الحالي <span className="text-red-500">*</span>
            </label>

            <textarea
              id="currentAddress"
              name="currentAddress"
              value={formData.currentAddress}
              onChange={handleChange}
              rows={4}
              placeholder="اكتب المنطقة والحي والشارع وأقرب نقطة دالة."
              className="w-full resize-none rounded-xl border border-slate-200 bg-[#fafafe] px-4 py-3 text-sm leading-7 text-[#031632] outline-none transition placeholder:text-slate-400 focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10"
            />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/family/wives"
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
    </section>
  );
}

export default HousingPage;