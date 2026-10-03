# Salman Family Registry — Frontend

[العربية](#العربية) · [English](#english)

## العربية

## نظرة عامة

واجهة ويب عربية متجاوبة لنظام سجل عائلة سلمان. تتيح لأرباب الأسر إنشاء حساباتهم وإدخال بيانات الأسرة ومراجعتها، وتوفر لوحة إدارة لمتابعة السجلات والإعدادات والتصدير.

## الميزات

- تسجيل حسابات أرباب الأسر وتسجيل الدخول والتواصل مع الدعم الفني عبر واتساب عند نسيان كلمة المرور.
- ملف متكامل للأسرة يشمل البيانات الأساسية والسكن والزوجات والأبناء والبنات المتزوجات والحالات الخاصة.
- متابعة نسبة اكتمال البيانات ومراجعتها قبل الإرسال النهائي.
- لوحة إدارة لعرض الإحصاءات وإدارة الأسر والمشرفين.
- التحكم بفترة التسجيل وصلاحية تعديل البيانات.
- تصفية البيانات وتصديرها إلى Excel.
- واجهة عربية متجاوبة تدعم اتجاه RTL.

## التقنيات والاعتماديات

- React 19
- React Router 8
- Vite 8
- Tailwind CSS 4
- Oxlint

## متطلبات التشغيل

- Node.js إصدار حديث متوافق مع Vite 8.
- npm.
- نسخة عاملة من API الخاص بالمشروع.

## الإعداد والتشغيل

```bash
npm install
```

أنشئ ملف `.env` في جذر المشروع وحدد رابط الـAPI:

```env
VITE_API_BASE_URL=http://localhost:5000
```

ثم شغّل بيئة التطوير:

```bash
npm run dev
```

## الأوامر المتاحة

```bash
npm run dev       # تشغيل بيئة التطوير
npm run build     # إنشاء نسخة الإنتاج
npm run preview   # معاينة نسخة الإنتاج محليًا
npm run lint      # فحص جودة الكود
```

## المسارات الرئيسية

- `/` الصفحة الرئيسية.
- `/login` تسجيل الدخول.
- `/register` إنشاء حساب.
- `/forgot-password` التواصل مع الدعم الفني لاستعادة الحساب عبر واتساب.
- `/family/*` صفحات بيانات الأسرة.
- `/admin/*` لوحة الإدارة.

## النشر

المشروع مهيأ للنشر على Vercel، ويحتوي `vercel.json` على إعداد إعادة توجيه مسارات تطبيق الصفحة الواحدة إلى `index.html`.

قبل النشر، اضبط `VITE_API_BASE_URL` على رابط خادم الـAPI الفعلي.

---

## English

### Project Overview

A responsive, Arabic-first web interface for the Salman Family Registry. It allows heads of households to create accounts, enter and review family information, and gives administrators tools to manage records, settings, and exports.

### Features

- Account registration, sign-in, and WhatsApp support for forgotten passwords.
- Complete family profiles covering basic information, housing, wives, children, married daughters, and special cases.
- Completion tracking and final review before submission.
- Administration dashboard for statistics, families, and supervisors.
- Registration-period and editing-permission controls.
- Data filtering and Excel export.
- Responsive Arabic interface with RTL support.

### Dependencies

- React 19
- React Router 8
- Vite 8
- Tailwind CSS 4
- Oxlint

### Requirements

- A recent Node.js version compatible with Vite 8.
- npm.
- A running instance of the project API.

### Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and set the API URL:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

### Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run code-quality checks
```

### Main Routes

- `/` home page.
- `/login` sign in.
- `/register` account registration.
- `/forgot-password` contact technical support through WhatsApp for account recovery.
- `/family/*` family data pages.
- `/admin/*` administration dashboard.

### Deployment

The project is configured for Vercel. The included `vercel.json` rewrites single-page application routes to `index.html`.

Before deployment, set `VITE_API_BASE_URL` to the production API URL.
