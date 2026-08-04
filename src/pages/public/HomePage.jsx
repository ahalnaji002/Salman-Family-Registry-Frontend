function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <section className="mx-auto grid min-h-[calc(100vh-89px)] max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
            التسجيل متاح الآن
          </span>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            أهلاً بك في سجل
            <span className="block text-blue-950">عائلة سلمان</span>
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            يمكنك تسجيل بيانات الأسرة، إضافة الزوجات والأبناء والحالات الخاصة،
            ثم مراجعة المعلومات قبل اعتمادها.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              className="rounded-xl bg-blue-950 px-7 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-900"
            >
              بدء التسجيل
            </button>

            <button
              type="button"
              className="rounded-xl bg-amber-400 px-7 py-3.5 font-bold text-blue-950 transition hover:bg-amber-500"
            >
              متابعة طلب سابق
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900">خطوات التسجيل</h3>

          <div className="mt-6 space-y-5">
            {[
              "البيانات الأساسية",
              "بيانات الزوجة والسكن",
              "الأبناء والبنات المتزوجات",
              "الحالات الخاصة والمراجعة",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-blue-950">
                  {index + 1}
                </span>

                <span className="font-medium text-slate-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
