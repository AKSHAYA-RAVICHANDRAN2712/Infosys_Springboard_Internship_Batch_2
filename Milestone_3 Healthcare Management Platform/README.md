# MediSphere — React.js Edition

Full React.js migration of the MediSphere Enterprise Hospital Management System.
This is a **1:1 technology migration** — every page, feature, and interaction from
the original static HTML/CSS/JS build was reimplemented as React functional
components using hooks, React Router, and Context API. No DOM manipulation
(`getElementById`, `querySelector`, `innerHTML`) is used anywhere in the app.

## Stack

- **React 19** (functional components + hooks only)
- **React Router v7** for client-side routing & role-based route protection
- **React Context API** for auth session, toast notifications, and modal dialogs
  (replacing the old `MediStorage.currentUser`, `MediToast`, and `MediModal`
  globals)
- **Vite** for the build tooling
- Plain CSS (the original stylesheets, imported globally) — chosen deliberately
  over CSS Modules/styled-components/Tailwind to guarantee the UI stays
  **pixel-identical** to the original design system (colors, glassmorphism,
  animations, spacing) without any class-name remapping risk.

## Project Structure

```
src/
 ├── assets/styles/     Original CSS ported verbatim, imported via index.css
 ├── components/
 │    ├── common/       DataTable, Charts, Badge, StatCard, GlobalSearch
 │    ├── forms/        All modal forms (Add Patient/Doctor/User, Book
 │    │                 Appointment, Record Vitals, Consultation, Care Plan,
 │    │                 Edit Digital Twin, Appointment Slip, ...)
 │    └── layout/       TopHeader, Sidebar, ProtectedLayout (RBAC route guard)
 ├── context/           AuthContext, ToastContext, ModalContext
 ├── hooks/              (reserved for future custom hooks)
 ├── pages/             One component per route (16 pages)
 ├── services/          storage.js (mock backend/data layer) & utils.js
 ├── utils/             rbac.js (page permission matrix)
 ├── App.jsx            Router setup
 └── main.jsx           Entry point
```

## Functionality preserved 1:1

- Role-based authentication (Admin / Doctor / Patient / Receptionist / Medical
  Staff) with the same demo credentials and localStorage-backed mock database
  (auto-seeded with 50 doctors, 300 patients, 1,000 appointments, 500 FHIR
  resources, 500 Kafka events, activity logs)
- Patient self-registration flow
- Role-based sidebar navigation & page-level access control (redirects +
  "Access Denied" toast, exactly like the original `app.js` guard)
- Sortable / searchable / paginated data tables with CSV export, on every
  directory page (Users, Doctors, Patients, Staff, Appointments, Logs, FHIR
  resources, Kafka events)
- All modal workflows: create user/doctor/patient, book appointment, record
  vitals, doctor consultation notes, care plan dispatch, edit digital twin,
  printable appointment slip
- Canvas-based line/bar charts (Dashboard, Analytics) and the interactive
  organ-risk heatmap canvas
- FHIR module: connect/disconnect toggle, drag-and-drop upload simulation with
  progress bar, resource inspector
- Kafka module: live-streaming simulated vitals telemetry (auto-refreshing
  every 3s), retry/delete actions
- Reports & Analytics generators, CSV/PDF (print-preview) export
- Toast notification system and global search (patients/doctors/appointments/
  FHIR resources)
- Settings page with mock-dataset reset

## Running locally

```bash
npm install
npm run dev       # http://localhost:3000 (or the port Vite selects)
npm run build      # production build to dist/
npm run preview    # preview the production build
npm start           #to run backend
```

## Demo credentials

| Role         | User ID    | Password       |
|--------------|-----------|----------------|
| Admin        | ADMIN001  | admin123       |
| Doctor       | DOC1001   | doctor123      |
| Patient      | PAT1001   | patient123     |
| Receptionist | REC1001   | reception123   |
| Medical Staff| EMP1001   | employee123    |

(One-click preset buttons are also available on the login screen.)

## Startup

### Frontend
```bash
npm install
npm run dev
```

### Backend
Open a second terminal:
```bash
cd backend
npm install
npm start
```

The frontend entry point is `src/main.tsx`.
