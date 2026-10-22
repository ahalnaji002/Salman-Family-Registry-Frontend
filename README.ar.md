# 👨‍👩‍👧‍👦 سجل عائلة سلمان — الواجهة الأمامية

[English](README.md) | **العربية**

## نبذة عن المشروع
واجهة ويب عربية متجاوبة لنظام سجل عائلة سلمان. تتيح لأرباب الأسر تسجيل الحسابات وإدارة بيانات الأسرة ومراجعتها، وتوفر للمشرفين لوحة لإدارة السجلات والإعدادات والتصدير.

## المميزات
- إنشاء الحساب وتسجيل الدخول والتواصل عبر واتساب عند نسيان كلمة المرور.
- إدارة بيانات الأسرة والسكن والزوجات والأبناء والبنات المتزوجات والحالات الخاصة.
- متابعة اكتمال البيانات ومراجعتها قبل الإرسال النهائي.
- لوحة إدارة للإحصاءات والأسر والمشرفين وإعدادات التسجيل والتعديل والتصفية والتصدير إلى Excel.
- واجهة عربية متجاوبة باتجاه RTL.

## التقنيات المستخدمة
- **الواجهة الأمامية:** React 19، React Router 8، Vite 8، Tailwind CSS 4.
- **جودة الكود:** Oxlint.
- **الواجهة الخلفية:** REST API مستقل، موضح في [مستودع Backend](https://github.com/ahalnaji002/Salman-Family-Registry-Backend).
- **قاعدة البيانات:** MySQL، وتُدار من خلال Backend.

## هيكلية المشروع
توضح الشجرة التالية المجلدات الأساسية وملفات الدخول والإعدادات الرئيسية دون سرد جميع الملفات الداخلية.

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── layouts/
│   ├── pages/
│   │   ├── admin/
│   │   ├── family/
│   │   └── public/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── README.md
└── README.ar.md
```

يعرض `src/App.jsx` مكوّن `AppRoutes`. وتشمل المسارات الرئيسية `/` و`/login` و`/register` و`/forgot-password` و`/family/*` و`/admin/*`.

## التشغيل المحلي
يتطلب Node.js متوافقًا مع Vite 8 وnpm وBackend API قيد التشغيل.

```bash
npm install
```

أنشئ ملف `.env` في جذر المشروع:

```env
VITE_API_BASE_URL=http://localhost:5000
```

ثم شغّل:

```bash
npm run dev
```

## الاختبارات والتحقق
يحتوي `package.json` على أوامر للفحص والبناء، ولا يتضمن أمر `test` مستقلًا.

```bash
npm run lint
npm run build
npm run preview
```

## التوثيق
- [النسخة الإنجليزية](README.md)
- [مستودع الواجهة الخلفية](https://github.com/ahalnaji002/Salman-Family-Registry-Backend)
- **النشر:** يحتوي `vercel.json` على إعداد إعادة كتابة مسارات تطبيق الصفحة الواحدة إلى `index.html`. اضبط `VITE_API_BASE_URL` على رابط API الفعلي عند النشر على Vercel.
