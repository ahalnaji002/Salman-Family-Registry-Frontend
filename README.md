# 👨‍👩‍👧‍👦 Salman Family Registry — Frontend

**English** | [العربية](README.ar.md)

## Project Overview

A responsive, Arabic-first web interface for the Salman Family Registry. It allows heads of households to create accounts, enter and review family information, and gives administrators tools to manage records, settings, and exports.

## Features

- Account registration, sign-in, and WhatsApp support for forgotten passwords.
- Complete family profiles covering basic information, housing, wives, children, married daughters, and special cases.
- Completion tracking and final review before submission.
- Administration dashboard for statistics, families, and supervisors.
- Registration-period and editing-permission controls.
- Data filtering and Excel export.
- Responsive Arabic interface with RTL support.

## Dependencies

- React 19
- React Router 8
- Vite 8
- Tailwind CSS 4
- Oxlint

## Requirements

- A recent Node.js version compatible with Vite 8.
- npm.
- A running instance of the project API.

## Setup

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

## Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run code-quality checks
```

## Main Routes

- `/` home page.
- `/login` sign in.
- `/register` account registration.
- `/forgot-password` contact technical support through WhatsApp for account recovery.
- `/family/*` family data pages.
- `/admin/*` administration dashboard.

## Deployment

The project is configured for Vercel. The included `vercel.json` rewrites single-page application routes to `index.html`.

Before deployment, set `VITE_API_BASE_URL` to the production API URL.
