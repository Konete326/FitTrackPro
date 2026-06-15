# FitTrack Pro — Product Requirements Document (PRD)

## 1. Introduction & Background

In recent years, there has been a significant surge in health and fitness consciousness among individuals worldwide. With the advent of technology and the proliferation of smartphones, people are increasingly turning to digital solutions to help them manage and monitor their fitness journeys. The demand for comprehensive fitness tracking applications has grown exponentially, leading to opportunities for innovative solutions that cater to the diverse needs of fitness enthusiasts.

The Fitness Tracker application is needed to help users track their fitness activities, such as workouts, nutrition, and progress over time.

### Problem Statement
Most fitness apps are fragmented — requiring separate tools for workouts, nutrition, sleep, and hydration. FitTrack Pro unifies all tracking in one platform with 3 role-based panels, cloud image hosting (Cloudinary), cloud database (MongoDB Atlas), and a fully responsive Tailwind CSS interface.

---

## 2. Product Overview

**Product Name:** FitTrack Pro  
**Stack:** MERN (MongoDB Atlas, Express.js, React + Tailwind CSS, Node.js)  
**Type:** Full-stack Fitness Tracking Web Application  
**Image Storage:** Cloudinary (URLs stored in MongoDB Atlas)  
**Responsive:** Fully responsive on all devices  

FitTrack Pro is a comprehensive fitness tracking platform with **3 separate panels** — User, Trainer, and Admin — each having its own dashboard, sidebar, navbar, and feature set.

---

## 3. Panels Overview

| Panel | Role | Access Level |
|-------|------|-------------|
| **User Panel** | User | Own data only |
| **Trainer Panel** | Trainer | Own data + assigned clients |
| **Admin Panel** | Admin | Full system access |

---

## 4. User Panel — Detailed Pages & Features

### 3.1 Splash Screen
- **Route:** `/`
- **Purpose:** Animated brand intro with app logo and tagline. Auto-redirects to `/home` after 3 seconds.
- **CRUD:** None (display only).

### 3.2 Home (Public)
- **Route:** `/home`
- **Purpose:** Landing page with hero section, feature highlights, testimonials, CTA buttons (Login/Register).
- **CRUD:** None.
- **Linked from:** Navbar (public), Splash screen.

### 3.3 About (Public)
- **Route:** `/about`
- **Purpose:** Company/project info, team section, mission statement.
- **CRUD:** None.

### 3.4 Contact (Public)
- **Route:** `/contact`
- **Purpose:** Contact form with name, email, message. Background video.
- **CRUD:** Create → submits feedback to backend `POST /api/feedbacks/submit`.

### 3.5 Registration
- **Route:** `/register`
- **Purpose:** New user signup form.
- **Fields:** Username, Email, Password, Name, Age, Gender, Height, Weight, Fitness Level, Goals, Profile Picture.
- **CRUD:** Create → `POST /api/auth/register` (multipart/form-data with image).
- **Image:** Profile picture uploaded to **Cloudinary**, URL stored in MongoDB.
- **Validation:** Client-side (Formik + Yup) + server-side (express-validator).

### 3.6 Login
- **Route:** `/login`
- **Purpose:** Email + password login.
- **CRUD:** Read → `POST /api/auth/login`. Returns JWT token stored in cookie + state.
- **Linked to:** Forgot Password, Register.

### 3.7 Forgot Password
- **Route:** `/forgot-password`
- **Purpose:** Enter email to receive reset link.
- **CRUD:** Create → `POST /api/auth/forgot-password`. Creates a notification with reset link.

### 3.8 Reset Password
- **Route:** `/reset-password/:token`
- **Purpose:** Set new password using token from URL.
- **CRUD:** Update → `PUT /api/auth/reset-password/:resetToken`.

### 3.9 User Dashboard
- **Route:** `/dashboard`
- **Purpose:** Central hub showing overview cards — total workouts, calories burned, current streak, active goals, water intake today, sleep summary. Charts for weekly workout frequency, calorie trends, progress graph.
- **Data Sources:** Multiple GET endpoints aggregated.
- **Linked to:** All feature pages (Workouts, Nutrition, Progress, Water, Sleep, Goals).

### 3.10 Workout List
- **Route:** `/workouts`
- **Purpose:** Display all user workouts in card/list view with filters (type, status, date range) and pagination.
- **CRUD:** Read → `GET /api/workouts` (with query params).
- **Actions:** View details, delete, toggle favorite, clone.
- **Linked to:** Log Workout, Workout Details.

### 3.11 Log Workout
- **Route:** `/workouts/log`
- **Purpose:** Form to create a new workout with exercises.
- **Fields:** Title, Type, Difficulty, Duration, Location, Exercises (Name, Category, Sets, Reps, Weight, Duration, Notes), Tags.
- **CRUD:** Create → `POST /api/workouts`.
- **Linked from:** Workout List, Sidebar.

### 3.12 Workout Details
- **Route:** `/workouts/:id`
- **Purpose:** View/edit a single workout. Mark exercises complete, start/complete workout, view mood before/after.
- **CRUD:** Read → `GET /api/workouts/:id`, Update → `PUT /api/workouts/:id`, Complete exercise → `PUT /api/workouts/:id/complete-exercise`, Start → `PUT /api/workouts/:id/start`.
- **Linked from:** Workout List.

### 3.13 Nutrition Log
- **Route:** `/nutrition`
- **Purpose:** Log daily meals with food items. View nutrition entries by date with macro breakdown (calories, protein, carbs, fat). Search food database.
- **CRUD:** Create → `POST /api/nutrition`, Read → `GET /api/nutrition`, Update → `PUT /api/nutrition/:id`, Delete → `DELETE /api/nutrition/:id`. Food search → `GET /api/nutrition/foods/search`.
- **Charts:** Daily calorie pie chart, macro distribution, weekly trends.

### 3.14 Water Log
- **Route:** `/water`
- **Purpose:** Track daily water intake with quick-add buttons (250ml, 500ml, 1L). Visual progress ring showing daily goal (2000ml). Weekly hydration chart.
- **CRUD:** Create → `POST /api/water`, Read → `GET /api/water`, Update → `PUT /api/water/:id`, Delete → `DELETE /api/water/:id`.
- **Stats:** Daily summary, hydration streak, weekly stats → `GET /api/water/stats/summary`.

### 3.15 Progress Tracking
- **Route:** `/progress`
- **Purpose:** Log body measurements (weight, body fat %, chest, waist, hips, arms, thighs, calves, neck), performance metrics, progress photos. View weight trend chart, measurement comparisons.
- **CRUD:** Create → `POST /api/progress`, Read → `GET /api/progress`, Update → `PUT /api/progress/:id`, Delete → `DELETE /api/progress/:id`.
- **Photos:** Progress photos uploaded to **Cloudinary**, URLs stored in MongoDB.
- **Charts:** Weight trend line graph, body measurement radar chart, BMI calculator.

### 3.16 Sleep Log
- **Route:** `/sleep`
- **Purpose:** Log sleep/wake times, sleep quality, deep/light/REM sleep durations. View sleep trends and recommendations.
- **CRUD:** Create → `POST /api/sleep`, Read → `GET /api/sleep`, Update → `PUT /api/sleep/:id`, Delete → `DELETE /api/sleep/:id`.
- **Stats:** Sleep trends → `GET /api/sleep/trends`, Recommendations → `GET /api/sleep/recommendations`.

### 3.17 Browse Trainers
- **Route:** `/browse-trainers`
- **Purpose:** View available trainers, see their specializations and client counts. Send trainer request with message.
- **CRUD:** Read → `GET /api/trainer-requests/available-trainers`, Create request → `POST /api/trainer-requests`.

### 3.18 Profile Page
- **Route:** `/profile`
- **Purpose:** View user profile — picture, bio, stats (total workouts, streak, calories), goals, achievements badges.
- **CRUD:** Read → `GET /api/auth/me`.

### 3.19 Edit Profile / Settings
- **Route:** `/settings`
- **Purpose:** Edit profile info, change password, update notification preferences, theme settings, measurement units, privacy settings.
- **CRUD:** Update profile → `PUT /api/auth/update-profile`, Update password → `PUT /api/auth/update-password`.

---

## 5. Trainer Panel — Detailed Pages & Features

### 4.1 Trainer Dashboard
- **Route:** `/trainer/dashboard`
- **Purpose:** Overview of assigned clients, client activity, workout completion rates, recent assignments.
- **Data:** `GET /api/trainer/dashboard-stats`.

### 4.2 My Clients
- **Route:** `/trainer/clients`
- **Purpose:** List all assigned clients with search, last workout info, active goals count.
- **CRUD:** Read → `GET /api/trainer/clients`.
- **Actions:** View details, remove client.

### 4.3 Client Details
- **Route:** `/trainer/clients/:id`
- **Purpose:** Detailed client view — profile, recent workouts, progress entries, active goals. Add trainer notes, assign workouts, set goals, send messages.
- **CRUD:** Read client → `GET /api/trainer/clients/:id`, Assign workout → `POST /api/trainer/clients/:id/workouts`, Set goal → `POST /api/trainer/clients/:id/goals`, Add note → `POST /api/trainer/clients/:id/notes`, Send message → `POST /api/trainer/clients/:id/message`.

### 4.4 Workout Templates
- **Route:** `/trainer/templates`
- **Purpose:** Create reusable workout templates. Mark as public for community sharing. Assign to clients.
- **CRUD:** Create → `POST /api/trainer/workout-templates`, Read → `GET /api/trainer/workout-templates`, Delete → `DELETE /api/trainer/workout-templates/:id`.

### 4.5 Trainer Settings / Profile
- **Route:** `/trainer/settings`, `/trainer/profile`
- **Purpose:** Same as user settings — edit profile, change password, update specialization.

---

## 6. Admin Panel — Detailed Pages & Features

### 5.1 Admin Dashboard
- **Route:** `/admin/dashboard`
- **Purpose:** System-wide statistics — total users, active users, trainers, workouts, growth rate, top trainers, recent activity feed.
- **Data:** `GET /api/admin/stats`.

### 5.2 User Management
- **Route:** `/admin/users`
- **Purpose:** View all users (paginated, searchable, filterable by role/status). Create, edit, deactivate/activate, delete users. Assign trainers. Bulk actions.
- **CRUD:** Read → `GET /api/admin/users`, Create → `POST /api/admin/users`, Update → `PUT /api/admin/users/:id`, Delete → `DELETE /api/admin/users/:id`, Toggle active → `PUT /api/admin/users/:id/toggle-active`, Assign trainer → `PUT /api/admin/users/:userId/assign-trainer/:trainerId`, Bulk actions → `POST /api/admin/users/bulk-actions`.

### 5.3 Trainer Management
- **Route:** `/admin/trainers`
- **Purpose:** View all trainers, their client counts, performance. Promote/demote roles.
- **CRUD:** Uses same user management endpoints with role filter.

### 5.4 Create Trainer
- **Route:** `/admin/create-trainer`
- **Purpose:** Dedicated form to register a new trainer with specialization fields.
- **CRUD:** Create → `POST /api/auth/register` (with Role: "Trainer").

### 5.5 Trainer Requests
- **Route:** `/admin/trainer-requests`
- **Purpose:** View pending trainer requests from users. Approve or reject with admin notes.
- **CRUD:** Read → `GET /api/trainer-requests`, Update → `PUT /api/trainer-requests/:id` (approve/reject).

### 5.6 Assigned Trainers
- **Route:** `/admin/assigned-trainers`
- **Purpose:** View all trainer-client assignments across the platform.
- **CRUD:** Read → `GET /api/admin/assignments`.

### 5.7 Feedbacks
- **Route:** `/admin/feedbacks`
- **Purpose:** View all user feedback submissions. Mark as read.
- **CRUD:** Read → `GET /api/feedbacks`, Mark read → `PUT /api/feedbacks/:id/read`.

### 5.8 Admin Profile / Settings
- **Route:** `/admin/profile`, `/admin/settings`
- **Purpose:** Same as user settings.

---

## 7. Shared Features Across Panels

### 6.1 Notifications System
- **Badge count** on navbar bell icon.
- **Read/Unread** toggle, mark all read, delete, clear all.
- **Types:** Workout reminders, goal achievements, streak milestones, system messages, trainer messages, feedback responses, password reset.
- **Auto-expiry:** 30 days (TTL index).

### 6.2 Achievement System
- **Points-based** gamification with leaderboard.
- **Categories:** Workout, Nutrition, Progress, Consistency, Community, Challenge, Milestone.
- **Auto-check:** Triggered by workout count, streak milestones.
- **Rank calculation** based on total points.

### 6.3 Feedback System
- Users submit feedback → Admins see all feedbacks → Mark as read → User notified.

---

## 8. Data Relationships (Entity Map)

```
User (User_Model)
├── Workouts (Workout_Model) → UserId
│   └── Exercises (embedded)
├── Nutrition (Nutrition_Model) → UserId
│   └── FoodItems (embedded)
├── Progress (Progress_Model) → UserId
│   ├── BodyMeasurements (embedded)
│   ├── PerformanceMetrics (embedded)
│   └── Photos (embedded)
├── Goals (Goal_Model) → UserId
│   ├── Milestones (embedded)
│   └── Reminders (embedded)
├── Water (Water_Model) → UserId
├── Sleep (Sleep_Model) → UserId
├── Achievements (Achievement_Model) → UserId
├── Notifications (Notification_Model) → UserId
├── Feedback (Feedback_Model) → UserId
├── TrainerRequests (TrainerRequest_Model) → UserId + TrainerId
└── TrainerId → ref User (self-reference for trainer assignment)

Food (Food_Model) → standalone food database
```

---

## 9. What Should Be Improved / Removed

### Remove (Unnecessary Features)
| Feature | Reason |
|---------|--------|
| `react-quill` (rich text editor) | Not used anywhere in the app currently |
| `socket.io-client` | No real-time backend exists; unused dependency |
| `html2canvas` + `jspdf` | Report export not implemented; either implement properly or remove |
| `lodash` | Overkill for this project; use native JS methods |
| `uuid` | MongoDB `_id` is already unique; unnecessary |
| `react-helmet-async` | Minimal SEO benefit for a dashboard app |
| `file-saver` | No file download functionality implemented |
| `recharts` | Already using `chart.js` + `react-chartjs-2`; having two chart libs is redundant |
| `formik` | Replace with React Hook Form (lighter, better performance) |

### Improve
| Area | Current Issue | Suggestion |
|------|--------------|------------|
| **Image Upload** | Local Multer → `uploads/` folder | Switch to **Cloudinary** for scalable image hosting |
| **Database** | Local MongoDB `localhost:27017` | Switch to **MongoDB Atlas** connection string |
| **Theme** | MUI dark theme only | Full Tailwind CSS with dark/light toggle |
| **Auth Context** | Uses `fetch` without base URL | Use **Axios** with interceptors for token refresh |
| **Notifications** | No real-time | Add **Socket.io** backend + frontend for live notifications |
| **Password Reset** | Simulated via notification (no email) | Integrate **Nodemailer** for real email delivery |
| **Water Goal** | Hardcoded 2000ml, `setWaterGoal` doesn't persist | Store goal in User model settings |
| **BMI Calculation** | Virtual returns `null` | Calculate properly using user height from profile |
| **Error Handling** | Frontend lacks global error boundary | Add React Error Boundary component |
| **Loading States** | Inconsistent across pages | Create skeleton loading components |
| **Search** | Basic regex in controllers | Implement proper text search with indexes |
| **Rate Limiting** | No per-user tracking | Add Redis-based rate limiting |

---

## 10. New Features to Add

### High Priority
1. **Goal Management Page (User)** — Dedicated goals page with CRUD, milestones, reminders, progress visualization
2. **Achievement/Badges Page (User)** — View earned badges, points, leaderboard
3. **Dark/Light Theme Toggle** — Persisted in user settings
4. **Data Export** — Export workouts, nutrition, progress as CSV/PDF
5. **Email Verification** — Send verification email on registration
6. **Push Notifications** — Browser notifications for reminders
7. **Workout Timer** — In-workout stopwatch/rest timer

### Medium Priority
8. **Social Feed** — Share workouts publicly, like/comment
9. **Challenge System** — Create/join fitness challenges with deadlines
10. **Meal Plan Generator** — Based on goals and dietary preferences
11. **AI Workout Suggestions** — Recommend workouts based on progress
12. **Weekly/Monthly Reports** — Auto-generated fitness summary
13. **Body Measurement Comparison** — Side-by-side photo comparison tool
14. **Water Intake Reminders** — Configurable interval reminders

### Low Priority
15. **PWA Support** — Make app installable on mobile
16. **Multi-language** — i18n support
17. **Wearable Integration** — Sync with Google Fit / Apple Health APIs
18. **Community Forum** — Discussion boards for users

---

## 11. Panel-wise Page Count Summary

### User Panel: 14 pages
| # | Page | CRUD Operations |
|---|------|----------------|
| 1 | Splash Screen | None |
| 2 | Home | None |
| 3 | About | None |
| 4 | Contact | Create (feedback) |
| 5 | Register | Create (user) |
| 6 | Login | Read (auth) |
| 7 | Forgot/Reset Password | Update (password) |
| 8 | Dashboard | Read (aggregated) |
| 9 | Workout List | Read, Delete |
| 10 | Log Workout | Create |
| 11 | Workout Details | Read, Update, Delete |
| 12 | Nutrition Log | Full CRUD |
| 13 | Water Log | Full CRUD |
| 14 | Progress | Full CRUD |
| 15 | Sleep Log | Full CRUD |
| 16 | Browse Trainers | Read, Create (request) |
| 17 | Profile | Read |
| 18 | Settings | Update |

### Trainer Panel: 5 pages
| # | Page | CRUD Operations |
|---|------|----------------|
| 1 | Dashboard | Read (stats) |
| 2 | My Clients | Read, Delete (remove) |
| 3 | Client Details | Read, Create (workout/goal/note/message) |
| 4 | Workout Templates | Create, Read, Delete |
| 5 | Settings/Profile | Read, Update |

### Admin Panel: 8 pages
| # | Page | CRUD Operations |
|---|------|----------------|
| 1 | Dashboard | Read (system stats) |
| 2 | User Management | Full CRUD + Bulk actions |
| 3 | Trainer Management | Read, Update (role) |
| 4 | Create Trainer | Create |
| 5 | Trainer Requests | Read, Update (approve/reject) |
| 6 | Assigned Trainers | Read |
| 7 | Feedbacks | Read, Update (mark read) |
| 8 | Settings/Profile | Read, Update |
