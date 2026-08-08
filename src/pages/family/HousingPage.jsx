import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import SaveStatusBadge from "../../components/SaveStatusBadge";

const API_BASE_URL = "http://localhost:5000";

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

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    localStorage.removeItem("user");
    localStorage.removeItem("family");

    navigate("/login", {
      replace: true,
    });
  };

  const mapPreviousAreaFromApi = (value) => {
    const map = {
      north_gaza: "north-gaza",
      gaza: "gaza",
      middle_area: "middle-area",
      south_gaza: "south-gaza",
    };

    return map[value] || "";
  };

  const mapPreviousAreaToApi = (value) => {
    const map = {
      "north-gaza": "north_gaza",
      gaza: "gaza",
      "middle-area": "middle_area",
      "south-gaza": "south_gaza",
    };

    return map[value] || "";
  };

  const mapHousingTypeFromApi = (value) => {
    const map = {
      owned: "owned",
      rented: "rent",
      displaced: "displaced",
    };

    return map[value] || "";
  };

  const mapHousingTypeToApi = (value) => {
    const map = {
      owned: "owned",
      rent: "rented",
      displaced: "displaced",
    };

    return map[value] || "";
  };

  const mapDisplacementTypeFromApi = (value) => {
    const map = {
      tent: "tent",
      shelter_center: "shelter",
      relatives_house: "relatives",
    };

    return map[value] || "";
  };

  const mapDisplacementTypeToApi = (value) => {
    const map = {
      tent: "tent",
      shelter: "shelter_center",
      relatives: "relatives_house",
    };

    return map[value] || "";
  };

  useEffect(() => {
    const loadHousing = async () => {
      if (!token) {
        handleUnauthorized();
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/family/housing`, {
          headers: getAuthHeaders(),
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "تعذر تحميل بيانات السكن.");
        }

        const housing = data.data?.housing || data.housing || null;

        if (housing) {
          setFormData({
            previousLocation: mapPreviousAreaFromApi(housing.previous_area),

            housingType: mapHousingTypeFromApi(housing.current_housing_type),

            displacementType: mapDisplacementTypeFromApi(
              housing.displacement_type,
            ),

            currentAddress: housing.current_address || "",
          });

          setIsSaved(true);
        }
      } catch (requestError) {
        if (requestError instanceof TypeError) {
          setError("تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل.");
        } else {
          setError(requestError.message || "حدث خطأ أثناء تحميل بيانات السكن.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadHousing();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setIsSaved(false);
    setError("");
    setSuccessMessage("");
  };

  const handleHousingTypeChange = (housingType) => {
    setFormData((currentData) => ({
      ...currentData,

      housingType,

      displacementType:
        housingType === "displaced" ? currentData.displacementType : "",
    }));

    setIsSaved(false);
    setError("");
    setSuccessMessage("");
  };

  const handleDisplacementTypeChange = (displacementType) => {
    setFormData((currentData) => ({
      ...currentData,
      displacementType,
    }));

    setIsSaved(false);
    setError("");
    setSuccessMessage("");
  };

  const validateForm = () => {
    if (!formData.previousLocation) {
      return "يرجى اختيار منطقة السكن السابق.";
    }

    if (!formData.housingType) {
      return "يرجى اختيار طبيعة السكن الحالي.";
    }

    if (formData.housingType === "displaced" && !formData.displacementType) {
      return "يرجى اختيار نوع السكن أثناء النزوح.";
    }

    if (!formData.currentAddress.trim()) {
      return "يرجى إدخال عنوان السكن الحالي.";
    }

    return "";
  };

  const saveHousing = async () => {
    const validationError = validateForm();

    if (validationError) {
      throw new Error(validationError);
    }

    const response = await fetch(`${API_BASE_URL}/api/family/housing`, {
      method: "PUT",

      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        previous_area: mapPreviousAreaToApi(formData.previousLocation),

        current_housing_type: mapHousingTypeToApi(formData.housingType),

        displacement_type:
          formData.housingType === "displaced"
            ? mapDisplacementTypeToApi(formData.displacementType)
            : null,

        current_address: formData.currentAddress.trim(),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error("انتهت جلسة تسجيل الدخول.");
    }

    if (!response.ok) {
      throw new Error(data.message || "تعذر حفظ بيانات السكن.");
    }

    setIsSaved(true);

    return data;
  };

  const handleDraftSave = async () => {
    if (saving) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await saveHousing();

      setSuccessMessage("تم حفظ بيانات السكن بنجاح.");
    } catch (requestError) {
      setError(requestError.message || "حدث خطأ أثناء حفظ بيانات السكن.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (saving) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await saveHousing();

      navigate("/family/children");
    } catch (requestError) {
      setError(requestError.message || "حدث خطأ أثناء حفظ بيانات السكن.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto flex min-h-[420px] w-full max-w-6xl items-center justify-center">
          <div className="text-center">
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#031632]" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              جاري تحميل بيانات السكن...
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
          {/* Header - نفس Basic Info */}
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#031632] md:text-2xl">
                بيانات السكن
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                أدخل بيانات السكن السابق والحالي بدقة.
              </p>
            </div>

            <SaveStatusBadge isSaved={isSaved} saving={saving} />
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700"
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-7 text-green-700">
              {successMessage}
            </div>
          )}

          {/* السكن سابقًا */}
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
              disabled={saving}
              className="h-12 w-full rounded-xl border border-slate-200 bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:cursor-not-allowed disabled:opacity-60 md:max-w-xl"
            >
              <option value="">اختر المنطقة</option>
              <option value="north-gaza">شمال غزة</option>
              <option value="gaza">غزة</option>
              <option value="middle-area">المنطقة الوسطى</option>
              <option value="south-gaza">جنوب غزة</option>
            </select>
          </div>

          <div className="my-8 border-t border-slate-200" />

          {/* طبيعة السكن الحالي */}
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
                    disabled={saving}
                    onClick={() => handleHousingTypeChange(type.value)}
                    className={`flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-xl border-2 px-5 py-6 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isActive
                        ? "border-[#031632] bg-[#f5f3ed] text-[#031632] shadow-sm"
                        : "border-slate-200 bg-[#fafafe] text-slate-600 hover:border-[#d8ad55] hover:bg-white"
                    }`}
                  >
                    <span
                      className={isActive ? "text-[#031632]" : "text-slate-500"}
                    >
                      {type.icon}
                    </span>

                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* نوع السكن أثناء النزوح */}
          {formData.housingType === "displaced" && (
            <>
              <div className="my-8 border-t border-slate-200" />

              <div>
                <h2 className="text-sm font-semibold text-[#031632]">
                  نوع السكن أثناء النزوح <span className="text-red-500">*</span>
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {displacementTypes.map((type) => {
                    const isActive = formData.displacementType === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        disabled={saving}
                        onClick={() => handleDisplacementTypeChange(type.value)}
                        className={`h-12 rounded-xl border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
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

          {/* العنوان الحالي */}
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
              disabled={saving}
              rows={4}
              placeholder="اكتب المنطقة والحي والشارع وأقرب نقطة دالة."
              className="w-full resize-none rounded-xl border border-slate-200 bg-[#fafafe] px-4 py-3 text-sm leading-7 text-[#031632] outline-none transition placeholder:text-slate-400 focus:border-[#d8ad55] focus:bg-white focus:ring-4 focus:ring-[#d8ad55]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* الأزرار */}
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
                disabled={saving}
                className="h-11 whitespace-nowrap rounded-xl border border-[#031632] bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ كمسودة"}
              </button>

              <button
                type="button"
                onClick={handleSaveAndContinue}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ والمتابعة"}

                {!saving && <span aria-hidden="true">←</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HousingPage;
