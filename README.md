# 👨‍👩‍👧‍👦 Salman Family Registry — Frontend

**English** | [العربية](README.ar.md)

## Overview
A responsive, Arabic-first web interface for the Salman Family Registry. Heads of households can register, manage family information, and review their records. Administrators can manage families, supervisors, settings, and exports.

## Features
- Account registration, sign-in, and WhatsApp support for forgotten passwords.
- Family profiles covering household details, housing, wives, children, married daughters, and special cases.
- Completion tracking and final review.
- Administrative statistics, family and supervisor management, registration/editing controls, filtering, and Excel exports.
- Responsive right-to-left Arabic interface.

## Tech Stack
- **Frontend:** React 19, React Router 8, Vite 8, Tailwind CSS 4.
- **Code quality:** Oxlint.
- **Backend:** Separate REST API (see [Backend repository](https://github.com/ahalnaji002/Salman-Family-Registry-Backend)).
- **Database:** MySQL, managed by the backend.

## Project Structure
The following is a high-level overview of the main project directories and entry files.

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

The main application renders `AppRoutes` from `src/App.jsx`. The routing includes `/`, `/login`, `/register`, `/forgot-password`, `/family/*`, and `/admin/*`.

## Getting Started
Requires Node.js compatible with Vite 8, npm, and a running backend API.

```bash
npm install
```

Create `.env` in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start development:

```bash
npm run dev
```

## Testing
The repository defines build and lint checks, but no dedicated `test` script in `package.json`.

```bash
npm run lint
npm run build
npm run preview
```

## Documentation
- [Arabic README](README.ar.md)
- [Backend repository](https://github.com/ahalnaji002/Salman-Family-Registry-Backend)
- **Deployment:** `vercel.json` rewrites SPA routes to `index.html`. Set `VITE_API_BASE_URL` to the production API endpoint when deploying to Vercel.
