import { useMemo, useState } from "react";

const families = [
  {
    id: 1,
    headName: "أحمد محمود خليل",
    nationalId: "802345678",
    phone: "+970 59 123 4567",
    region: "غزة",
    membersCount: 5,
    status: "مكتملة",
    registeredAt: "2023-10-15",
    birthDate: "1980-05-12",
    bloodType: "O+",
    maritalStatus: "متزوج",
    incomeLevel: "متوسط",
    workStatus: "موظف",
    jobType: "قطاع حكومي",
    previousResidence: "شمال غزة",
    housingType: "نازح",
    displacementType: "مركز إيواء",
    currentAddress: "الرمال، شارع النصر",
    wives: [
      {
        name: "فاطمة حسن عبد الله",
        nationalId: "987654321",
        birthDate: "1985-03-20",
        phone: "0599112233",
        previousFamily: "عائلة المصري",
        employmentStatus: "ربة منزل",
      },
    ],
    children: [
      {
        name: "محمود أحمد خليل",
        nationalId: "201234567",
        birthDate: "2005-10-10",
        education: "طالب مدرسي",
      },
      {
        name: "سارة أحمد خليل",
        nationalId: "102345678",
        birthDate: "2013-11-15",
        education: "طالب مدرسي",
      },
      {
        name: "عمر أحمد خليل",
        nationalId: "034567890",
        birthDate: "2018-02-28",
        education: "رياض أطفال",
      },
    ],
    marriedDaughters: [
      {
        name: "ليلى أحمد محمود خليل",
        nationalId: "405678901",
        phone: "0599000111",
        husbandName: "محمد إبراهيم حسن",
        husbandPhone: "0599222333",
      },
    ],
    specialCases: [
      {
        personName: "أحمد محمود علي خليل",
        relation: "رب الأسرة",
        caseType: "مريض مزمن",
        details: "يعاني من ضغط الدم والسكري",
      },
    ],
  },
  {
    id: 2,
    headName: "سالم علي إبراهيم",
    nationalId: "912345670",
    phone: "+970 59 987 6543",
    region: "المنطقة الوسطى",
    membersCount: 3,
    status: "غير مكتملة",
    registeredAt: "2023-10-18",
    birthDate: "1986-07-04",
    bloodType: "A+",
    maritalStatus: "متزوج",
    incomeLevel: "ضعيف",
    workStatus: "لا يعمل",
    jobType: "لا يوجد",
    previousResidence: "الوسطى",
    housingType: "نازح",
    displacementType: "خيمة",
    currentAddress: "دير البلح",
    wives: [],
    children: [],
    marriedDaughters: [],
    specialCases: [],
  },
];

function IconButton({ label, children, danger = false, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
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

        <span className="flex h-9 w-9 text-sm items-center justify-center rounded-lg bg-[#031632] text-white">
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
      <span className="font-semibold text-[#111c2c]">{value || "—"}</span>
    </div>
  );
}

function FamiliesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedFamilyId, setSelectedFamilyId] = useState(families[0].id);

  const filteredFamilies = useMemo(() => {
    const normalizedSearch = searchTerm.trim();

    return families.filter((family) => {
      const matchesSearch =
        !normalizedSearch ||
        family.headName.includes(normalizedSearch) ||
        family.nationalId.includes(normalizedSearch) ||
        family.phone.includes(normalizedSearch);

      const matchesRegion =
        regionFilter === "الكل" || family.region === regionFilter;

      const matchesStatus =
        statusFilter === "الكل" || family.status === statusFilter;

      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [searchTerm, regionFilter, statusFilter]);

  const selectedFamily =
    families.find((family) => family.id === selectedFamilyId) || families[0];

  return (
    <section className="space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#031632]">الأسر المسجلة</h1>

          <p className="mt-2 text-slate-500">
            إدارة والبحث في سجلات الأسر المسجلة في النظام
          </p>
        </div>

        <button
          type="button"
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
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
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
                onChange={(event) => setSearchTerm(event.target.value)}
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
                <path d="m20 20-4-4" strokeLinecap="round" />
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
              onChange={(event) => setRegionFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
            >
              <option value="الكل">الكل</option>
              <option value="غزة">غزة</option>
              <option value="المنطقة الوسطى">المنطقة الوسطى</option>
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
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-[#f8f9fd] px-4 py-3 outline-none focus:border-[#031632]"
            >
              <option value="الكل">الكل</option>
              <option value="مكتملة">مكتملة</option>
              <option value="غير مكتملة">غير مكتملة</option>
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
              {filteredFamilies.map((family) => (
                <tr
                  key={family.id}
                  className={`border-b border-slate-100 last:border-b-0 ${
                    selectedFamilyId === family.id ? "bg-[#fbfcff]" : ""
                  }`}
                >
                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedFamilyId(family.id)}
                      className="flex items-center gap-3 text-right"
                    >
                      <span className="flex h-9 w-9 text-sm shrink-0 items-center justify-center rounded-full bg-[#dbe6ff] font-bold text-[#031632]">
                        {family.headName
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("")}
                      </span>

                      <span className="font-semibold text-[#111c2c]">
                        {family.headName}
                      </span>
                    </button>
                  </td>

                  <td className="px-3 py-4 text-slate-600">
                    {family.nationalId}
                  </td>

                  <td className="px-3 py-4 text-slate-600">{family.phone}</td>

                  <td className="px-3 py-4 text-slate-600">{family.region}</td>

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
                        onClick={() => setSelectedFamilyId(family.id)}
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
                          <circle cx="12" cy="12" r="2.5" />
                        </svg>
                      </IconButton>

                      <IconButton label="تعديل الأسرة">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path d="M12 20h9" strokeLinecap="round" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                        </svg>
                      </IconButton>

                      <IconButton label="إغلاق التعديل">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <rect x="5" y="10" width="14" height="10" rx="2" />
                          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                      </IconButton>

                      <IconButton label="حذف الأسرة" danger>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
                        </svg>
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row">
          <p>
            عرض 1-{filteredFamilies.length} من {families.length}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2ff] text-[#031632]"
            >
              ‹
            </button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2ff] text-[#031632]"
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

      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#031632] text-lg font-bold text-white">
              {selectedFamily.headName
                .split(" ")
                .slice(0, 2)
                .map((word) => word[0])
                .join("")}
            </span>

            <div>
              <p className="text-sm text-slate-500">أسرة:</p>

              <h2 className="text-2xl font-bold text-[#031632]">
                {selectedFamily.headName}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                رقم هوية رب الأسرة: {selectedFamily.nationalId}
              </p>

              <p className="mt-1 text-sm">
                حالة التعديل:
                <span className="mr-2 font-semibold text-green-700">مفتوح</span>
              </p>
            </div>
          </div>

          <button
            type="button"
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
              <path d="M12 20h9" strokeLinecap="round" />
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
            <InfoRow label="الاسم الرباعي" value={selectedFamily.headName} />
            <InfoRow label="رقم الهوية" value={selectedFamily.nationalId} />
            <InfoRow label="تاريخ الميلاد" value={selectedFamily.birthDate} />
            <InfoRow label="رقم الجوال" value={selectedFamily.phone} />
            <InfoRow label="فصيلة الدم" value={selectedFamily.bloodType} />
            <InfoRow
              label="الحالة الاجتماعية"
              value={selectedFamily.maritalStatus}
            />
            <InfoRow label="فئة الدخل" value={selectedFamily.incomeLevel} />
            <InfoRow label="حالة العمل" value={selectedFamily.workStatus} />
            <InfoRow label="نوع الوظيفة" value={selectedFamily.jobType} />
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
              selectedFamily.wives.map((wife) => (
                <div
                  key={wife.nationalId}
                  className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4"
                >
                  <p className="font-bold text-[#031632]">{wife.name}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    الهوية: {wife.nationalId}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    تاريخ الميلاد: {wife.birthDate}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    الجوال: {wife.phone}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    العائلة السابقة: {wife.previousFamily}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    الحالة الوظيفية: {wife.employmentStatus}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">لا توجد بيانات زوجات.</p>
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
                    key={child.nationalId}
                    className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4"
                  >
                    <p className="font-bold text-[#031632]">{child.name}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      الهوية: {child.nationalId}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      تاريخ الميلاد: {child.birthDate}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      الحالة التعليمية: {child.education}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">لا توجد بيانات أبناء.</p>
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
                selectedFamily.specialCases.map((specialCase) => (
                  <div
                    key={`${specialCase.personName}-${specialCase.caseType}`}
                    className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4"
                  >
                    <p className="font-bold text-[#031632]">
                      {specialCase.personName}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      صلة القرابة: {specialCase.relation}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      نوع الحالة: {specialCase.caseType}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      التفاصيل: {specialCase.details}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">لا توجد حالات خاصة.</p>
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
              {selectedFamily.marriedDaughters.length ? (
                selectedFamily.marriedDaughters.map((daughter) => (
                  <div
                    key={daughter.nationalId}
                    className="rounded-xl border border-[#d7e2ff] bg-[#f4f6ff] p-4"
                  >
                    <p className="font-bold text-[#031632]">{daughter.name}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      الهوية: {daughter.nationalId}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      الجوال: {daughter.phone}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      اسم الزوج: {daughter.husbandName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      جوال الزوج: {daughter.husbandPhone}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">لا توجد بنات متزوجات.</p>
              )}
            </DetailCard>
          </div>
        </div>
      </section>
    </section>
  );
}

export default FamiliesPage;
