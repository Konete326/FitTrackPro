# Project Rules
This document contains strict coding and formatting rules that any AI Agent MUST follow during development. These rules are mandatory to prevent common AI mistakes and ensure scalable architecture.

## 1. Modular Architecture & File Size Limits
* **Strict Structural Organization:** Work must follow the existing folder structures strictly (`client/` and `server/`). Everything must be appropriately categorized (e.g., proper routes, proper models, proper controllers).
* **Frontend Components:** Always split frontend code into proper, reusable React components. Never write massive components or files containing 1200-1300 lines of code. Every distinct UI part should be its own component.
* **Global Shared Components:** If a component, hook, utility, or UI element is used in **2 or more places**, it MUST be extracted into a **global shared location** (`client/src/components/common/`, `client/src/hooks/`, `client/src/utils/`). Never duplicate the same component across multiple pages or folders. Create it once globally and import it wherever needed. This keeps the app smooth, reduces bundle size, and prevents maintenance nightmares.
* **Server File Organization:** Backend logic must be properly divided into specific files. As a general rule, a single server file **should not exceed 120 lines**. Only exceed this limit if absolutely necessary and unavoidable.

## 2. Fully Functional & Secure Implementations
* **No Dummy Code:** Everything you implement must be **properly functional**. Do not use dummy data, placeholder functions, or fake UI elements.
* **Security & Stability:** Ensure that there are absolutely no security vulnerabilities or logical issues in the code. Code must be safe and production-ready to prevent future breaks.

## 3. Clean Code Requirements
* **No Comments:** Absolutely **no comments** should be written in the generated code.

## 4. UI & Design Standards
* **Professional Icons:** Do not use generic icons that look "AI-generated" or amateurish. Ensure all icons and UI aesthetics feel professional and premium.
* **Tailwind CSS Only:** Use Tailwind CSS exclusively for all styling. No Material UI (MUI), no Bootstrap, no inline styles.
* **Fully Responsive:** Every page and component must be fully responsive on mobile (320px+), tablet (768px+), and desktop (1024px+).
* **Dark Theme Primary:** The app uses a dark theme as the default. Use appropriate contrast ratios for accessibility.

## 5. Tech Stack Enforcement
* **Frontend (client/):** React (latest) with Vite (latest), React Router DOM (latest), Tailwind CSS (latest), Axios (latest), React Hook Form + Yup (no Formik), Chart.js (no Recharts/D3), Framer Motion (latest), React Icons (latest), date-fns (latest).
* **Backend (server/):** Node.js (latest LTS), Express (latest), Mongoose (latest), JWT (latest), bcryptjs (latest), Cloudinary SDK (latest).
* **Database:** MongoDB Atlas (cloud only). Never use local MongoDB.
* **Image Storage:** Cloudinary only. Never store images locally or in the repository. Only the Cloudinary URL is saved in MongoDB Atlas.
* **Credentials:** All secrets, keys, URLs, and configuration values must be stored in `.env` files — `server/.env` for backend and `client/.env` for frontend (prefixed with `VITE_`). Never hardcode credentials in source code.

## 6. Authentication & Authorization
* **JWT-based Auth:** Use httpOnly cookies for token storage. Bearer token as fallback.
* **Role-Based Access:** Three roles only — User, Trainer, Admin. Every protected route must enforce role checks.
* **Protected Routes:** Frontend must use ProtectedRoute component with role arrays. Never render protected content without role verification.
* **Password Security:** bcryptjs with 12 salt rounds. Never store or return plain-text passwords.

## 7. API & Data Standards
* **RESTful Conventions:** Follow standard REST methods — GET (read), POST (create), PUT (update), DELETE (delete).
* **Response Format:** All API responses must follow: `{ success: boolean, message?: string, data?: any, count?: number, total?: number }`.
* **Pagination:** All list endpoints must support `page` and `limit` query params with safe maximum caps (50 items per page).
* **Input Validation:** Every endpoint must validate inputs server-side (express-validator) and client-side (React Hook Form + Yup).
* **Error Handling:** All controllers must use try/catch with proper HTTP status codes. Frontend must display toast notifications on errors.

## 8. Code Quality Rules
* **No Console.log in Production:** Remove all debug console.log statements before shipping.
* **No Hardcoded Values:** Use environment variables (.env) for all configuration — URLs, secrets, keys, limits.
* **No Unused Imports:** Every import must be used. Remove dead code immediately.
* **No Duplicate Logic:** Extract shared logic into utility functions or custom hooks.
* **Lean Queries:** Use `.lean()` on all Mongoose read queries for performance.
* **Async/Await:** Always use async/await. Never use raw callbacks or .then() chains.

## 9. File Naming Conventions
* **Backend Files:** PascalCase with underscores — `User_Model.js`, `Auth_Controller.js`, `Workout_Routes.js`
* **Frontend Files:** PascalCase for components — `UserDashboard.jsx`, `WorkoutList.jsx`. camelCase for utilities — `authService.js`, `formatDate.js`
* **Folders:** PascalCase for feature groups — `Controllers/`, `Models/`, `Routes/`. camelCase for frontend — `components/`, `pages/`, `services/`

## 10. Component Structure (Frontend)
* **One Component per File:** Each React component lives in its own `.jsx` file.
* **Separation of Concerns:** Keep API calls in `services/` files, not inside components.
* **Reusable Global Components:** Create common UI components (Button, Card, Modal, Input, Badge, Table, Sidebar, Navbar, StatCard, DataTable, FormField, EmptyState, PageHeader) in `client/src/components/common/` and reuse them across all panels and pages. If a component pattern appears in more than one page, it MUST be made global — never duplicate.
* **Loading States:** Every data-fetching component must show a skeleton loader or spinner while loading.
* **Empty States:** Every list page must show a meaningful empty state when no data exists.

## 11. Database Rules
* **Schema Validation:** Every Mongoose model must have proper validation rules (required, min, max, enum, match).
* **Indexes:** Add indexes on frequently queried fields (UserId, Date, Status, Type).
* **Timestamps:** All models must use `{ timestamps: true }`.
* **Virtual Fields:** Use Mongoose virtuals for computed properties (never store derived data).
* **Pre-save Hooks:** Use pre-save middleware for auto-calculations (totals, progress, duration).

## 12. Proactive Suggestions & Issue Reporting
* **End of Task Reports:** After finishing any task, the Agent MUST suggest related new features or improvements.
* **Troubleshooting Suggestions:** If the Agent identifies potential bugs or improvements while working on a task, it MUST report them — even if they are unrelated to the current task.
* **Dependency Audit:** Before adding any new npm package, check if an existing dependency already provides the needed functionality. Never add redundant packages.
* **Performance Warnings:** Flag any N+1 queries, missing indexes, or unoptimized aggregations.
