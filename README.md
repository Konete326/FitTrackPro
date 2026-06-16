<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=FitTrack%20Pro&fontSize=70&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Your%20All-in-One%20Fitness%20Companion&descAlignY=60&descSize=20" width="100%"/>

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

<br/>

> **31 pages · 3 role-based panels · 13 REST API modules · Full CRUD across 11 data models**

</div>

---

## What is FitTrack Pro?

Most fitness apps force you to juggle 4–5 different tools — one for workouts, another for diet, a third for sleep. FitTrack Pro solves that by bringing **everything into one platform**, built on the MERN stack with three fully separate panels for Users, Trainers, and Admins.

---

## 3 Panels, Built from Scratch

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FitTrack Pro                               │
│                                                                     │
│   👤 USER PANEL          🏅 TRAINER PANEL        🛡️ ADMIN PANEL    │
│   ──────────────         ──────────────────       ────────────────  │
│   18 pages               5 pages                  8 pages          │
│   Own data only          Clients + own data        Full access      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite | UI framework & build tool |
| **Routing** | React Router v7 | Client-side routing |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **Animation** | Framer Motion | Page & component transitions |
| **Charts** | Chart.js + react-chartjs-2 | Data visualization |
| **Forms** | React Hook Form + Yup | Form state & validation |
| **HTTP** | Axios | API requests with interceptors |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB Atlas + Mongoose | Cloud database |
| **Auth** | JWT + bcryptjs | Token-based auth + password hashing |
| **Images** | Cloudinary + Multer | Cloud image storage |
| **Security** | Helmet, Rate Limit, HPP, Mongo Sanitize | API hardening |
| **Logging** | Morgan | HTTP request logging |

---

## Project Structure

```
FitTrackPro/
│
├── client/                          # React + Vite frontend
│   └── src/
│       ├── components/common/       # Button, Card, Modal, Input, StatCard...
│       ├── contexts/                # AuthContext (global auth state)
│       ├── hooks/                   # useAsync, useDebounce
│       ├── layouts/                 # PublicLayout, DashboardLayout, AdminLayout, TrainerLayout
│       ├── pages/
│       │   ├── public/              # Home, About, Contact, Login, Register, ForgotPassword
│       │   ├── user/                # Dashboard, Workouts, Nutrition, Water, Sleep, Progress, Goals
│       │   ├── trainer/             # Dashboard, MyClients, ClientDetails, Templates
│       │   └── admin/               # Dashboard, UserMgmt, TrainerMgmt, Requests, Feedbacks
│       ├── partials/                # Sidebar, AdminSidebar, TrainerSidebar, Header
│       └── services/                # authService, workoutService, nutritionService... (13 modules)
│
├── server/                          # Node.js + Express backend
│   ├── Controllers/                 # Business logic (13 controllers)
│   ├── Models/                      # Mongoose schemas (11 models)
│   ├── Routes/                      # Express routes (13 route files)
│   ├── Middleware/                  # Auth, ErrorHandler, Multer, Validator
│   ├── Database/                    # db.js (Atlas connection), seedAdmin.js
│   ├── Utils/                       # Cloudinary config, JWT token helper
│   └── server.js                   # App entry point
│
└── docs/                            # PRD, SRD, TRD, Design System docs
```

---

## Features by Panel

<details>
<summary><b>👤 User Panel — 18 Pages</b></summary>

| # | Page | What it does |
|---|------|-------------|
| 1 | Splash Screen | Animated intro, auto-redirects to Home |
| 2 | Home | Landing page — hero, features, testimonials |
| 3 | About | Project info, mission statement |
| 4 | Contact | Submit feedback form |
| 5 | Register | Signup with profile picture upload to Cloudinary |
| 6 | Login | JWT auth, token stored in cookie |
| 7 | Forgot Password | Generates reset link via notification |
| 8 | Reset Password | Token-based password update |
| 9 | Dashboard | Overview cards + charts (workouts, calories, streak, water, sleep) |
| 10 | Workout List | Filter, paginate, favorite, clone, delete workouts |
| 11 | Log Workout | Create workout with exercises (sets, reps, weight, duration) |
| 12 | Workout Details | View/edit workout, mark exercises complete, track mood |
| 13 | Nutrition Log | Log meals, macro breakdown, food search, weekly trends |
| 14 | Water Log | Quick-add buttons, progress ring, hydration streak |
| 15 | Progress Tracking | Body measurements, photos (Cloudinary), weight chart, BMI |
| 16 | Sleep Log | Sleep/wake times, quality rating, REM tracking, recommendations |
| 17 | Browse Trainers | View trainers, send connection requests |
| 18 | Profile + Settings | Edit profile, change password, notification & theme preferences |

</details>

<details>
<summary><b>🏅 Trainer Panel — 5 Pages</b></summary>

| # | Page | What it does |
|---|------|-------------|
| 1 | Dashboard | Client activity stats, workout completion rates |
| 2 | My Clients | List assigned clients, search, remove |
| 3 | Client Details | View client profile, assign workouts/goals, add notes, message |
| 4 | Workout Templates | Create reusable templates, mark public, assign to clients |
| 5 | Profile + Settings | Edit profile, update specialization |

</details>

<details>
<summary><b>🛡️ Admin Panel — 8 Pages</b></summary>

| # | Page | What it does |
|---|------|-------------|
| 1 | Dashboard | System-wide stats — users, trainers, workouts, growth rate |
| 2 | User Management | Full CRUD + bulk actions + toggle active/inactive |
| 3 | Trainer Management | View trainers, client counts, promote/demote roles |
| 4 | Create Trainer | Register new trainer with specialization |
| 5 | Trainer Requests | Approve/reject user-submitted trainer requests |
| 6 | Assigned Trainers | View all trainer-client assignments |
| 7 | Feedbacks | View all feedback, mark as read |
| 8 | Profile + Settings | Edit admin profile |

</details>

---

## Shared Systems

- **🔔 Notifications** — Badge count, read/unread toggle, 30-day auto-expiry TTL index
- **🏆 Achievements** — Points-based gamification, 7 categories, auto-triggered by milestones
- **💬 Feedback Loop** — User submits → Admin views → marks read → user notified

---

## API Modules (13 Total)

```
/api/auth              /api/workouts          /api/nutrition
/api/water             /api/sleep             /api/progress
/api/goals             /api/achievements      /api/notifications
/api/trainers          /api/trainer-requests  /api/admin
/api/feedback
```

---

## Getting Started

**Prerequisites:** Node.js v18+, MongoDB Atlas account, Cloudinary account

```bash
# 1. Clone
git clone https://github.com/Konete326/FitTrackPro.git
cd FitTrackPro

# 2. Backend
cd server
npm install
npm run dev          # runs on http://localhost:5000

# 3. Frontend (new terminal)
cd client
npm install
npm run dev          # runs on http://localhost:5173
```

### Environment Variables

**`server/.env`**
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

---

## Data Models (11 Mongoose Schemas)

```
User → Workout → Exercise (embedded)
     → Nutrition → FoodItems (embedded)
     → Progress → BodyMeasurements, PerformanceMetrics, Photos (embedded)
     → Goal → Milestones, Reminders (embedded)
     → Water
     → Sleep
     → Achievement
     → Notification
     → Feedback
     → TrainerRequest ←→ Trainer (User ref)

Food → standalone food database
```

---

## Team

| Student ID | Name | Contact |
|------------|------|---------|
| Student1550980 | Muhammad Sameer | sameerdevexpert@gmail.com · 0321-3265524 |
| Student1552027 | Muhammad Sheryar | — |
| Student1436664 | Maaz Bin Asad | — |
| Student1566221 | Muhammad Basiq | — |
| Student1501325 | Abdul Hadi | — |

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

**FitTrack Pro** — Built for academics, designed for real use.

</div>
