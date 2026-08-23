import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import SaveStatusBadge from "../../components/SaveStatusBadge";
import { API_BASE_URL } from "../../config/api";

const initialSpecialCaseForm = {
  caseType: "",
  selectedPersonKey: "",
  fullName: "",
  nationalId: "",
  dateOfBirth: "",
  relationship: "",
  details: "",
};

function SpecialCasesPage() {
  const navigate = useNavigate();

  const [isDeceasedSpouseMode, setIsDeceasedSpouseMode] = useState(false);

  const [specialCases, setSpecialCases] = useState([]);
  const [hasSpecialCases, setHasSpecialCases] = useState(null);
  const [savingHasSpecialCases, setSavingHasSpecialCases] = useState(false);

  const [familyHead, setFamilyHead] = useState(null);
  const [familyInfo, setFamilyInfo] = useState(null);
  const [wives, setWives] = useState([]);
  const [children, setChildren] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState(null);

  const [specialCaseForm, setSpecialCaseForm] = useState(
    initialSpecialCaseForm,
  );

  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingCase, setSavingCase] = useState(false);
  const [deletingCaseId, setDeletingCaseId] = useState(null);

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

  const normalizeDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    return String(dateValue).split("T")[0];
  };

  const mapSpecialCaseFromApi = (specialCase) => ({
    id: specialCase.id,
    fullName: specialCase.full_name || "",
    nationalId: String(specialCase.national_id || ""),
    dateOfBirth: normalizeDate(specialCase.date_of_birth),
    relationship: specialCase.relationship || "",
    caseType: specialCase.case_type || "",
    details: specialCase.case_details || "",
  });

  const mapWifeFromApi = (wife) => ({
    key: `wife-${wife.id}`,
    sourceType: "wife",
    id: wife.id,
    fullName: wife.full_name || "",
    nationalId: String(wife.national_id || ""),
    dateOfBirth: normalizeDate(wife.date_of_birth),
    relationship: "زوجة",
    gender: "female",
  });

  const mapChildFromApi = (child) => ({
    key: `child-${child.id}`,
    sourceType: "child",
    id: child.id,
    fullName: child.full_name || "",
    nationalId: String(child.national_id || ""),
    dateOfBirth: normalizeDate(child.date_of_birth),
    relationship: child.gender === "female" ? "ابنة" : "ابن",
    gender: child.gender || "",
  });

  const mapFamilyHeadFromApi = (family) => ({
    key: `family-head-${family.id}`,
    sourceType: "family_head",
    id: family.id,
    fullName: family.full_name || "",
    nationalId: String(family.national_id || ""),
    dateOfBirth: normalizeDate(family.date_of_birth),
    relationship: "رب الأسرة",
    gender: family.gender || "",
  });

  const loadPageData = async () => {
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const [
        specialCasesResponse,
        wivesResponse,
        childrenResponse,
        familyResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/api/family/special-cases`, {
          headers: getAuthHeaders(),
        }),

        fetch(`${API_BASE_URL}/api/family/wives`, {
          headers: getAuthHeaders(),
        }),

        fetch(`${API_BASE_URL}/api/family/children`, {
          headers: getAuthHeaders(),
        }),

        fetch(`${API_BASE_URL}/api/family`, {
          headers: getAuthHeaders(),
        }),
      ]);

      if (
        specialCasesResponse.status === 401 ||
        wivesResponse.status === 401 ||
        childrenResponse.status === 401 ||
        familyResponse.status === 401
      ) {
        handleUnauthorized();
        return;
      }

      const [specialCasesData, wivesData, childrenData, familyData] =
        await Promise.all([
          specialCasesResponse.json().catch(() => ({})),
          wivesResponse.json().catch(() => ({})),
          childrenResponse.json().catch(() => ({})),
          familyResponse.json().catch(() => ({})),
        ]);

      if (!specialCasesResponse.ok) {
        throw new Error(
          specialCasesData.message || "تعذر تحميل الحالات الخاصة.",
        );
      }

      if (!wivesResponse.ok) {
        throw new Error(wivesData.message || "تعذر تحميل بيانات الزوجات.");
      }

      if (!childrenResponse.ok) {
        throw new Error(childrenData.message || "تعذر تحميل بيانات الأبناء.");
      }

      if (!familyResponse.ok) {
        throw new Error(familyData.message || "تعذر تحميل بيانات رب الأسرة.");
      }

      const apiSpecialCases =
        specialCasesData.data?.special_cases ||
        specialCasesData.special_cases ||
        [];

      const apiWives = wivesData.data?.wives || wivesData.wives || [];

      const apiChildren =
        childrenData.data?.children || childrenData.children || [];

      const apiFamily = familyData.data?.family || familyData.family || null;

      setSpecialCases(apiSpecialCases.map(mapSpecialCaseFromApi));

      setWives(apiWives.map(mapWifeFromApi));

      setChildren(apiChildren.map(mapChildFromApi));

      if (apiFamily) {
        setFamilyHead(mapFamilyHeadFromApi(apiFamily));
      } else {
        setFamilyHead(null);
      }

      setFamilyInfo(apiFamily || null);
      const savedHasSpecialCases =
        apiFamily?.has_special_cases === null ||
        apiFamily?.has_special_cases === undefined
          ? null
          : Boolean(apiFamily.has_special_cases);

      setHasSpecialCases(savedHasSpecialCases);

      setIsSaved(
        savedHasSpecialCases === false ||
          (savedHasSpecialCases === true && apiSpecialCases.length > 0),
      );
    } catch (requestError) {
      if (requestError instanceof TypeError) {
        setPageError("تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل.");
      } else {
        setPageError(requestError.message || "حدث خطأ أثناء تحميل الصفحة.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHasSpecialCasesChange = async (value) => {
    if (savingHasSpecialCases) {
      return;
    }

    // لا نسمح باختيار "لا" مع وجود حالات مسجلة
    if (value === false && specialCases.length > 0) {
      setPageError(
        "لا يمكنك اختيار (لا) بوجود حالات خاصة مسجلة. احذف الحالات الخاصة أولًا ثم غيّر الإجابة.",
      );
      return;
    }

    setSavingHasSpecialCases(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/family`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          has_special_cases: value,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "تعذر حفظ إجابة سؤال الحالات الخاصة.");
      }

      setHasSpecialCases(value);
      setIsSaved(true);

      setSuccessMessage(
        value
          ? "تم حفظ الإجابة: توجد حالات خاصة."
          : "تم حفظ الإجابة: لا توجد حالات خاصة.",
      );

      window.dispatchEvent(new Event("family-data-updated"));
    } catch (requestError) {
      setPageError(
        requestError.message || "حدث خطأ أثناء حفظ إجابة سؤال الحالات الخاصة.",
      );
    } finally {
      setSavingHasSpecialCases(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const selectablePeople = useMemo(() => {
    if (specialCaseForm.caseType === "pregnant") {
      return wives;
    }

    if (
      ["patient", "injured", "disability"].includes(specialCaseForm.caseType)
    ) {
      return [...(familyHead ? [familyHead] : []), ...wives, ...children];
    }

    return [];
  }, [specialCaseForm.caseType, familyHead, wives, children]);

  const isWidowed = familyInfo?.marital_status === "widowed";

  const deceasedSpouseFromSalman =
    familyInfo?.deceased_spouse_from_salman === null ||
    familyInfo?.deceased_spouse_from_salman === undefined
      ? null
      : Boolean(familyInfo.deceased_spouse_from_salman);

  const requiredDeceasedSpouseCaseType =
    familyInfo?.deceased_spouse_case_type || "";

  const requiredDeceasedSpouseRelationship =
    familyInfo?.gender === "female" ? "زوج" : "زوجة";

  const hasRequiredDeceasedSpouseCase =
    isWidowed &&
    deceasedSpouseFromSalman === true &&
    requiredDeceasedSpouseCaseType
      ? specialCases.some(
          (item) =>
            item.caseType === requiredDeceasedSpouseCaseType &&
            item.relationship === requiredDeceasedSpouseRelationship,
        )
      : false;

  const isMartyr = specialCaseForm.caseType === "martyr";
  const isDeceased = specialCaseForm.caseType === "deceased";

  const requiresManualPerson = isMartyr || isDeceased;

  const requiresExistingPerson =
    specialCaseForm.caseType && !requiresManualPerson;

  const getCaseTypeLabel = (caseType) => {
    const labels = {
      patient: "مريض",
      injured: "جريح",
      disability: "ذوي إعاقة",
      martyr: "شهيد",
      deceased: "متوفى",
      pregnant: "حامل",
    };

    return labels[caseType] || "";
  };

  const getPersonOptionLabel = (person) => {
    return `${person.fullName} - ${person.relationship}`;
  };

  const findPersonByNationalId = (nationalId, caseType) => {
    const normalizedNationalId = String(nationalId || "");

    const source =
      caseType === "pregnant"
        ? wives
        : [...(familyHead ? [familyHead] : []), ...wives, ...children];

    return source.find(
      (person) => String(person.nationalId) === normalizedNationalId,
    );
  };

  const handleAddSpecialCase = () => {
    setEditingCaseId(null);
    setSpecialCaseForm(initialSpecialCaseForm);
    setErrors({});
    setPageError("");
    setSuccessMessage("");
    setModalError("");
    setIsModalOpen(true);
    setIsDeceasedSpouseMode(false);
  };

  const handleAddDeceasedSpouseCase = () => {
    if (
      !isWidowed ||
      deceasedSpouseFromSalman !== true ||
      !requiredDeceasedSpouseCaseType
    ) {
      return;
    }

    setIsDeceasedSpouseMode(true);

    setEditingCaseId(null);

    setSpecialCaseForm({
      ...initialSpecialCaseForm,
      caseType: requiredDeceasedSpouseCaseType,
      relationship: requiredDeceasedSpouseRelationship,
    });

    setErrors({});
    setPageError("");
    setSuccessMessage("");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (savingCase) {
      return;
    }

    setIsModalOpen(false);
    setEditingCaseId(null);
    setSpecialCaseForm(initialSpecialCaseForm);
    setErrors({});
    setModalError("");
    setIsDeceasedSpouseMode(false);
  };

  const handleCaseTypeChange = (event) => {
    const caseType = event.target.value;

    setSpecialCaseForm((currentForm) => ({
      ...currentForm,
      caseType,
      selectedPersonKey: "",
      fullName: "",
      nationalId: "",
      dateOfBirth: "",
      relationship: "",
    }));

    setErrors({});
    setPageError("");
    setModalError("");
    setSuccessMessage("");
    setIsSaved(false);
  };

  const handlePersonChange = (event) => {
    const selectedPersonKey = event.target.value;

    const selectedPerson = selectablePeople.find(
      (person) => person.key === selectedPersonKey,
    );

    if (!selectedPerson) {
      setSpecialCaseForm((currentForm) => ({
        ...currentForm,
        selectedPersonKey: "",
        fullName: "",
        nationalId: "",
        dateOfBirth: "",
        relationship: "",
      }));

      return;
    }

    setSpecialCaseForm((currentForm) => ({
      ...currentForm,
      selectedPersonKey,
      fullName: selectedPerson.fullName,
      nationalId: selectedPerson.nationalId,
      dateOfBirth: selectedPerson.dateOfBirth,
      relationship: selectedPerson.relationship,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      selectedPersonKey: "",
      fullName: "",
      nationalId: "",
      dateOfBirth: "",
      relationship: "",
    }));

    setPageError("");
    setSuccessMessage("");
    setIsSaved(false);
  };

  const handleSpecialCaseFormChange = (event) => {
    const { name, value } = event.target;

    let finalValue = value;

    if (name === "nationalId") {
      finalValue = value.replace(/\D/g, "").slice(0, 9);
    }

    setSpecialCaseForm((currentForm) => ({
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

  const validateSpecialCaseForm = () => {
    const newErrors = {};

    if (!specialCaseForm.caseType) {
      newErrors.caseType = "يرجى اختيار نوع الحالة.";
    }

    if (requiresExistingPerson && !specialCaseForm.selectedPersonKey) {
      newErrors.selectedPersonKey =
        specialCaseForm.caseType === "pregnant"
          ? "يرجى اختيار الزوجة."
          : "يرجى اختيار صاحب الحالة.";
    }

    if (requiresManualPerson) {
      if (!specialCaseForm.fullName.trim()) {
        newErrors.fullName = isMartyr
          ? "يرجى إدخال اسم الشهيد."
          : "يرجى إدخال اسم المتوفى.";
      }

      if (!/^\d{9}$/.test(specialCaseForm.nationalId)) {
        newErrors.nationalId = "يرجى إدخال رقم هوية مكون من 9 أرقام.";
      }

      if (!specialCaseForm.dateOfBirth) {
        newErrors.dateOfBirth = "يرجى اختيار تاريخ الميلاد.";
      }

      if (!specialCaseForm.relationship.trim()) {
        newErrors.relationship = "يرجى إدخال صلة القرابة.";
      }
    }

    if (requiresExistingPerson && specialCaseForm.selectedPersonKey) {
      if (!specialCaseForm.fullName) {
        newErrors.selectedPersonKey = "تعذر جلب بيانات الشخص المحدد.";
      }

      if (!/^\d{9}$/.test(specialCaseForm.nationalId)) {
        newErrors.selectedPersonKey = "رقم هوية الشخص المحدد غير مكتمل.";
      }

      if (!specialCaseForm.dateOfBirth) {
        newErrors.selectedPersonKey = "تاريخ ميلاد الشخص المحدد غير موجود.";
      }
    }

    if (!specialCaseForm.details.trim()) {
      newErrors.details = "يرجى إدخال تفاصيل الحالة.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSpecialCase = async (event) => {
    event.preventDefault();
    setModalError("");
    setSuccessMessage("");

    if (!validateSpecialCaseForm() || savingCase) {
      return;
    }

    setSavingCase(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const isEditing = Boolean(editingCaseId);

      const url = isEditing
        ? `${API_BASE_URL}/api/family/special-cases/${editingCaseId}`
        : `${API_BASE_URL}/api/family/special-cases`;

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",

        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          full_name: specialCaseForm.fullName.trim(),

          national_id: specialCaseForm.nationalId,

          date_of_birth: specialCaseForm.dateOfBirth,

          relationship: specialCaseForm.relationship.trim(),

          case_type: specialCaseForm.caseType,

          case_details: specialCaseForm.details.trim(),
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
              ? "تعذر تعديل الحالة الخاصة."
              : "تعذر إضافة الحالة الخاصة."),
        );
      }

      await loadPageData();

      setIsModalOpen(false);
      setEditingCaseId(null);
      setSpecialCaseForm(initialSpecialCaseForm);
      setErrors({});
      setIsSaved(true);

      setSuccessMessage(
        isEditing
          ? "تم تعديل الحالة الخاصة بنجاح."
          : "تمت إضافة الحالة الخاصة بنجاح.",
      );
    } catch (requestError) {
      setModalError(requestError.message || "حدث خطأ أثناء حفظ الحالة الخاصة.");
    } finally {
      setSavingCase(false);
    }
  };

  const handleEditSpecialCase = (specialCase) => {
    const matchingPerson = ["martyr", "deceased"].includes(specialCase.caseType)
      ? null
      : findPersonByNationalId(specialCase.nationalId, specialCase.caseType);

    setEditingCaseId(specialCase.id);

    setSpecialCaseForm({
      caseType: specialCase.caseType || "",

      selectedPersonKey: matchingPerson?.key || "",

      fullName: matchingPerson?.fullName || specialCase.fullName || "",

      nationalId: matchingPerson?.nationalId || specialCase.nationalId || "",

      dateOfBirth: matchingPerson?.dateOfBirth || specialCase.dateOfBirth || "",

      relationship:
        matchingPerson?.relationship || specialCase.relationship || "",

      details: specialCase.details || "",
    });

    setErrors({});
    setPageError("");
    setModalError("");
    setSuccessMessage("");
    const isRequiredDeceasedSpouseCase =
      isWidowed &&
      deceasedSpouseFromSalman === true &&
      specialCase.caseType === requiredDeceasedSpouseCaseType &&
      specialCase.relationship === requiredDeceasedSpouseRelationship;

    setIsDeceasedSpouseMode(isRequiredDeceasedSpouseCase);
    setIsModalOpen(true);
  };

  const handleDeleteSpecialCase = async (caseId) => {
    if (deletingCaseId) {
      return;
    }

    const specialCaseToDelete = specialCases.find(
      (specialCase) => specialCase.id === caseId,
    );

    const isRequiredDeceasedSpouseCase =
      isWidowed &&
      deceasedSpouseFromSalman === true &&
      specialCaseToDelete &&
      specialCaseToDelete.caseType === requiredDeceasedSpouseCaseType &&
      specialCaseToDelete.relationship === requiredDeceasedSpouseRelationship;

    if (isRequiredDeceasedSpouseCase) {
      setPageError(
        "لا يمكن حذف بيانات الزوج/الزوجة المتوفى/ة طالما أن الحالة الاجتماعية أرمل/أرملة وتم تحديد أن المتوفى/ة من عائلة سلمان. غيّر البيانات الأساسية أولًا إذا لزم.",
      );
      return;
    }

    const confirmed = window.confirm("هل أنت متأكد من حذف هذه الحالة الخاصة؟");

    if (!confirmed) {
      return;
    }

    setDeletingCaseId(caseId);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/family/special-cases/${caseId}`,
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
        throw new Error(data.message || "تعذر حذف الحالة الخاصة.");
      }

      setSpecialCases((currentCases) =>
        currentCases.filter((specialCase) => specialCase.id !== caseId),
      );

      setIsSaved(true);

      setSuccessMessage("تم حذف الحالة الخاصة بنجاح.");
    } catch (requestError) {
      setPageError(requestError.message || "حدث خطأ أثناء حذف الحالة الخاصة.");
    } finally {
      setDeletingCaseId(null);
    }
  };

  const handleDraftSave = () => {
    setIsSaved(true);

    setSuccessMessage("تم حفظ بيانات الحالات الخاصة.");
  };

  const handleSaveAndContinue = () => {
    if (hasSpecialCases === null) {
      setPageError("يرجى الإجابة عن سؤال وجود الحالات الخاصة قبل المتابعة.");
      return;
    }

    if (hasSpecialCases === true && specialCases.length === 0) {
      setPageError("يرجى إضافة حالة خاصة واحدة على الأقل قبل المتابعة.");
      return;
    }

    setPageError("");
    navigate("/family/married-daughters");
  };

  const inputClassName = (fieldName) =>
    `w-full rounded-xl border bg-[#fafafe] px-4 text-sm text-[#031632] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
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
              جاري تحميل الحالات الخاصة...
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
                الحالات الخاصة
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                أضف بيانات الحالات الخاصة الموجودة داخل الأسرة.
              </p>
            </div>

            <SaveStatusBadge isSaved={isSaved} saving={savingCase} />
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

          <div className="mb-6 rounded-2xl border border-slate-200 bg-[#fafafe] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-[#031632]">
                  هل توجد حالات خاصة داخل الأسرة؟
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  تشمل الحالات الخاصة: المرضى، الجرحى، ذوي الإعاقة، الشهداء،
                  المتوفين، والحوامل.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={savingHasSpecialCases}
                  onClick={() => handleHasSpecialCasesChange(true)}
                  className={`min-w-[90px] rounded-xl border px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    hasSpecialCases === true
                      ? "border-[#031632] bg-[#031632] text-white"
                      : "border-slate-200 bg-white text-[#031632] hover:border-[#d8ad55]"
                  }`}
                >
                  نعم
                </button>

                <button
                  type="button"
                  disabled={
                    savingHasSpecialCases ||
                    (isWidowed && deceasedSpouseFromSalman === true)
                  }
                  onClick={() => handleHasSpecialCasesChange(false)}
                  className={`min-w-[90px] rounded-xl border px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    hasSpecialCases === false
                      ? "border-[#031632] bg-[#031632] text-white"
                      : "border-slate-200 bg-white text-[#031632] hover:border-[#d8ad55]"
                  }`}
                >
                  لا
                </button>

                {isWidowed && deceasedSpouseFromSalman === true && (
                  <p className="mt-3 text-xs font-medium text-amber-700">
                    تم تحديد أن الزوج/الزوجة المتوفى/ة من عائلة سلمان، لذلك
                    تعتبر الحالات الخاصة موجودة تلقائيًا.
                  </p>
                )}
              </div>
            </div>

            {hasSpecialCases === null && (
              <p className="mt-4 text-sm font-semibold text-amber-600">
                يرجى الإجابة عن هذا السؤال للمتابعة.
              </p>
            )}
          </div>

          {isWidowed &&
            deceasedSpouseFromSalman === true &&
            requiredDeceasedSpouseCaseType &&
            !hasRequiredDeceasedSpouseCase && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-sm font-bold text-amber-900">
                  يجب إضافة بيانات{" "}
                  {requiredDeceasedSpouseRelationship === "زوج"
                    ? "الزوج المتوفى"
                    : "الزوجة المتوفاة"}{" "}
                  من عائلة سلمان.
                </h3>

                <p className="mt-2 text-sm leading-7 text-amber-800">
                  تم تحديد أن{" "}
                  {requiredDeceasedSpouseRelationship === "زوج"
                    ? "الزوج المتوفى"
                    : "الزوجة المتوفاة"}{" "}
                  من عائلة سلمان، ونوع الوفاة هو{" "}
                  {requiredDeceasedSpouseCaseType === "martyr"
                    ? "استشهاد"
                    : "وفاة أخرى"}
                  . يرجى إضافة بياناته/ا ضمن الحالات الخاصة قبل إكمال النموذج.
                </p>

                <button
                  type="button"
                  onClick={handleAddDeceasedSpouseCase}
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-[#031632] px-5 text-sm font-semibold text-white transition hover:bg-[#020f23]"
                >
                  إضافة بيانات{" "}
                  {requiredDeceasedSpouseRelationship === "زوج"
                    ? "الزوج المتوفى"
                    : "الزوجة المتوفاة"}
                </button>
              </div>
            )}

          {hasSpecialCases === true && (
            <>
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-bold text-[#031632]">
                  الحالات الخاصة المضافة
                </h2>

                <span className="w-fit rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-semibold text-[#031632]">
                  عدد الحالات: {specialCases.length}
                </span>
              </div>

              {specialCases.length === 0 ? (
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
                        d="M9 3.75h6a1.5 1.5 0 0 1 1.5 1.5v2.25H18a2.25 2.25 0 0 1 2.25 2.25v9A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 6 7.5h1.5V5.25A1.5 1.5 0 0 1 9 3.75Z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 7.5h6M12 11.25v6m-3-3h6"
                      />
                    </svg>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-[#031632]">
                    لم تتم إضافة أي حالة خاصة حتى الآن.
                  </h3>

                  <p className="mt-2 max-w-lg text-sm leading-7 text-slate-500">
                    اضغط على الزر أدناه لإضافة بيانات حالة خاصة داخل الأسرة.
                  </p>

                  <button
                    type="button"
                    onClick={handleAddSpecialCase}
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
                    إضافة حالة خاصة
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {specialCases.map((specialCase, index) => (
                      <div
                        key={specialCase.id}
                        className="rounded-2xl border border-slate-200 bg-[#fafafe] p-5"
                      >
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                          <div>
                            <span className="text-xs font-semibold text-[#d8ad55]">
                              الحالة الخاصة {index + 1}
                            </span>

                            <h3 className="mt-1 text-base font-bold text-[#031632]">
                              {specialCase.fullName}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditSpecialCase(specialCase)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#031632] transition hover:border-[#d8ad55] hover:bg-[#f5f3ed]"
                              aria-label="تعديل الحالة الخاصة"
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
                              disabled={deletingCaseId === specialCase.id}
                              onClick={() =>
                                handleDeleteSpecialCase(specialCase.id)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="حذف الحالة الخاصة"
                            >
                              {deletingCaseId === specialCase.id ? (
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
                              {specialCase.nationalId}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              تاريخ الميلاد
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#031632]">
                              {specialCase.dateOfBirth}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              صلة القرابة
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#031632]">
                              {specialCase.relationship}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">نوع الحالة</p>

                            <span className="mt-2 inline-flex rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#031632]">
                              {getCaseTypeLabel(specialCase.caseType)}
                            </span>
                          </div>

                          <div className="sm:col-span-2">
                            <p className="text-xs text-slate-500">
                              تفاصيل الحالة
                            </p>

                            <p className="mt-1 text-sm leading-7 text-[#031632]">
                              {specialCase.details}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSpecialCase}
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
                    إضافة حالة خاصة أخرى
                  </button>
                </div>
              )}
            </>
          )}

          <div className="mt-7 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/family/children"
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
                  {editingCaseId ? "تعديل الحالة الخاصة" : "إضافة حالة خاصة"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  اختر نوع الحالة ثم حدد صاحب الحالة.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={savingCase}
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

            <form onSubmit={handleSaveSpecialCase} className="p-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="caseType"
                    className="mb-2 block text-sm font-semibold text-[#031632]"
                  >
                    نوع الحالة <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="caseType"
                    name="caseType"
                    value={specialCaseForm.caseType}
                    onChange={handleCaseTypeChange}
                    disabled={savingCase || isDeceasedSpouseMode}
                    className={`${inputClassName("caseType")} h-12`}
                  >
                    <option value="">اختر نوع الحالة...</option>

                    <option value="patient">مريض</option>

                    <option value="injured">جريح</option>

                    <option value="disability">ذوي إعاقة</option>

                    <option value="martyr">شهيد</option>

                    <option value="deceased">متوفى</option>

                    <option value="pregnant">حامل</option>
                  </select>

                  {errors.caseType && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.caseType}
                    </p>
                  )}
                </div>

                {requiresExistingPerson && (
                  <div>
                    <label
                      htmlFor="selectedPersonKey"
                      className="mb-2 block text-sm font-semibold text-[#031632]"
                    >
                      {specialCaseForm.caseType === "pregnant"
                        ? "اختيار الزوجة"
                        : "صاحب الحالة"}{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="selectedPersonKey"
                      name="selectedPersonKey"
                      value={specialCaseForm.selectedPersonKey}
                      onChange={handlePersonChange}
                      disabled={savingCase}
                      className={`${inputClassName("selectedPersonKey")} h-12`}
                    >
                      <option value="">
                        {specialCaseForm.caseType === "pregnant"
                          ? "اختر الزوجة..."
                          : "اختر صاحب الحالة..."}
                      </option>

                      {selectablePeople.map((person) => (
                        <option key={person.key} value={person.key}>
                          {getPersonOptionLabel(person)}
                        </option>
                      ))}
                    </select>

                    {errors.selectedPersonKey && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {errors.selectedPersonKey}
                      </p>
                    )}

                    {selectablePeople.length === 0 && (
                      <p className="mt-2 text-xs leading-6 text-amber-700">
                        {specialCaseForm.caseType === "pregnant"
                          ? "لا توجد زوجة مسجلة حاليًا. أضف بيانات الزوجة أولًا."
                          : "لا يوجد أشخاص مسجلون للاختيار منهم."}
                      </p>
                    )}
                  </div>
                )}

                {requiresExistingPerson &&
                  specialCaseForm.selectedPersonKey && (
                    <div className="rounded-2xl border border-[#d8ad55]/30 bg-[#fffaf0] p-4">
                      <p className="mb-4 text-sm font-bold text-[#031632]">
                        بيانات صاحب الحالة
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-500">الاسم</p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {specialCaseForm.fullName}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">رقم الهوية</p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {specialCaseForm.nationalId}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            تاريخ الميلاد
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {specialCaseForm.dateOfBirth}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">صلة القرابة</p>

                          <p className="mt-1 text-sm font-semibold text-[#031632]">
                            {specialCaseForm.relationship}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {requiresManualPerson && (
                  <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                        {isMartyr
                          ? "بيانات الشهيد يتم إدخالها يدويًا."
                          : "بيانات المتوفى يتم إدخالها يدويًا."}{" "}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="specialCaseFullName"
                        className="mb-2 block text-sm font-semibold text-[#031632]"
                      >
                        {isMartyr ? "اسم الشهيد" : "اسم المتوفى"}{" "}
                        <span className="text-red-500">*</span>{" "}
                      </label>

                      <input
                        id="specialCaseFullName"
                        name="fullName"
                        type="text"
                        value={specialCaseForm.fullName}
                        onChange={handleSpecialCaseFormChange}
                        disabled={savingCase}
                        placeholder={
                          isMartyr ? "أدخل اسم الشهيد" : "أدخل اسم المتوفى"
                        }
                        className={`${inputClassName("fullName")} h-12`}
                      />

                      {errors.fullName && (
                        <p className="mt-2 text-xs font-medium text-red-500">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="specialCaseNationalId"
                        className="mb-2 block text-sm font-semibold text-[#031632]"
                      >
                        رقم الهوية <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="specialCaseNationalId"
                        name="nationalId"
                        type="text"
                        inputMode="numeric"
                        maxLength={9}
                        value={specialCaseForm.nationalId}
                        onChange={handleSpecialCaseFormChange}
                        disabled={savingCase}
                        placeholder="أدخل رقم الهوية"
                        className={`${inputClassName(
                          "nationalId",
                        )} h-12 text-left placeholder:text-right`}
                      />

                      {errors.nationalId && (
                        <p className="mt-2 text-xs font-medium text-red-500">
                          {errors.nationalId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="specialCaseDateOfBirth"
                        className="mb-2 block text-sm font-semibold text-[#031632]"
                      >
                        تاريخ الميلاد <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="specialCaseDateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={specialCaseForm.dateOfBirth}
                        onChange={handleSpecialCaseFormChange}
                        disabled={savingCase}
                        className={`${inputClassName("dateOfBirth")} h-12`}
                      />

                      {errors.dateOfBirth && (
                        <p className="mt-2 text-xs font-medium text-red-500">
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="specialCaseRelationship"
                        className="mb-2 block text-sm font-semibold text-[#031632]"
                      >
                        صلة القرابة <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="specialCaseRelationship"
                        name="relationship"
                        type="text"
                        value={specialCaseForm.relationship}
                        onChange={handleSpecialCaseFormChange}
                        disabled={savingCase || isDeceasedSpouseMode}
                        placeholder="مثال: ابن، ابنة، أخ..."
                        className={`${inputClassName("relationship")} h-12`}
                      />

                      {errors.relationship && (
                        <p className="mt-2 text-xs font-medium text-red-500">
                          {errors.relationship}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {specialCaseForm.caseType && (
                  <div>
                    <label
                      htmlFor="caseDetails"
                      className="mb-2 block text-sm font-semibold text-[#031632]"
                    >
                      تفاصيل الحالة <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      id="caseDetails"
                      name="details"
                      value={specialCaseForm.details}
                      onChange={handleSpecialCaseFormChange}
                      disabled={savingCase}
                      rows={5}
                      placeholder="اكتب تفاصيل الحالة بشكل واضح."
                      className={`${inputClassName(
                        "details",
                      )} resize-none py-3 leading-7`}
                    />

                    {errors.details && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {errors.details}
                      </p>
                    )}
                  </div>
                )}
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
                  disabled={savingCase}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-[#031632] transition hover:bg-[#f8f8fe] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={savingCase || !specialCaseForm.caseType}
                  className="h-11 rounded-xl bg-[#031632] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020f23] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingCase
                    ? "جاري الحفظ..."
                    : editingCaseId
                      ? "حفظ التعديلات"
                      : "حفظ الحالة الخاصة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default SpecialCasesPage;
