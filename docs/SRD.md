# FitTrack Pro — Software Requirements Document (SRD)

## 1. Introduction

The thirst for learning, upgrading technical skills and applying the concepts in real life environment at a fast pace is what the industry demands from IT professionals today. However busy work schedules, far-flung locations, unavailability of convenient time-slots pose as major barriers when it comes to applying the concepts into realism. And hence the need to look out for alternative means of implementation in the form of laddered approach.

The above truly pose as constraints especially for students! With their busy schedules, it is indeed difficult to keep up with the genuine and constant need for integrated application which can be seen live especially so in the field of IT education where technology can change on the spur of a moment. Well, technology does come to our rescue at such times!!

Keeping the above in mind and in tune with the constant endeavour to use Technology in the training model, Aptech has thought of revolutionizing the way students learn and implement the concepts using tools themselves by providing a live and synchronous eProject learning environment!

### What is an eProject?

eProject is a step by step learning environment that closely simulates the classroom and Lab based learning environment into actual implementation. It is a project implementation at your fingertips!! An electronic, live juncture on the machine that allows you to:

- Practice step by step i.e. laddered approach
- Build a larger more robust application
- Usage of certain utilities in applications designed by user
- Single program to unified code leading to a complete application
- Learn implementation of concepts in a phased manner
- Enhance skills and add value
- Work on real life projects
- Give a real life scenario and help to create applications more complicated and useful
- Mentoring through email support

The students at the centre are expected to complete this eProject and send complete documentation with source code to eProjects Team.

---

## 2. Objectives of the Project

The objective of this program is to give a sample project to work on real life projects. These applications help you build a larger more robust application.

The objective is not to teach you the concepts but to provide you with a real life scenario and help you create applications using the tools.

**Specific Objectives:**
- Build a comprehensive fitness tracking web application using the MERN stack
- Provide role-based access for Users, Trainers, and Administrators
- Enable users to track workouts, nutrition, progress, sleep, and hydration
- Provide trainers with tools to manage assigned clients and create workout templates
- Give administrators full system oversight with stats, user management, and feedback handling
- Use modern cloud technologies (MongoDB Atlas, Cloudinary) for scalable deployment
- Implement responsive design using Tailwind CSS for all device sizes

---

## 3. Background & Problem Statement

In recent years, there has been a significant surge in health and fitness consciousness among individuals worldwide. With the advent of technology and the proliferation of smartphones, people are increasingly turning to digital solutions to help them manage and monitor their fitness journeys. The demand for comprehensive fitness tracking applications has grown exponentially, leading to opportunities for innovative solutions that cater to the diverse needs of fitness enthusiasts.

The Fitness Tracker application is needed to help users track their fitness activities, such as workouts, nutrition, and progress over time.

### Problem Statement

Most existing fitness applications suffer from one or more of the following issues:
1. **Fragmented Tracking** — Users need separate apps for workouts, nutrition, sleep, and water intake
2. **No Trainer Integration** — Lack of proper trainer-client management and assignment tools
3. **Poor Admin Oversight** — No system-level dashboards for platform management
4. **Local Storage Limits** — Profile pictures and progress photos stored locally don't scale
5. **Non-Responsive Design** — Many fitness web apps fail on mobile devices
6. **Weak Security** — Insufficient authentication, authorization, and input validation

**FitTrack Pro** solves all of these by providing a unified, cloud-hosted, fully responsive platform with 3 dedicated panels, Cloudinary image hosting, MongoDB Atlas cloud database, and enterprise-grade security.

---

## 4. Purpose & Scope

### 4.1 Purpose
This document defines the complete software requirements for **FitTrack Pro**, a MERN-stack fitness tracking web application. It covers functional requirements, non-functional requirements, system interfaces, and constraints for development.

### 4.2 Scope
FitTrack Pro provides a unified platform for fitness enthusiasts (Users), fitness professionals (Trainers), and system administrators (Admins) to manage fitness activities, nutrition, progress, goals, sleep, hydration, and coaching relationships — all through role-based dashboards.

---

## 5. Definitions & Acronyms
| Term | Definition |
|------|-----------|
| MERN | MongoDB + Express.js + React + Node.js |
| JWT | JSON Web Token — used for stateless authentication |
| CRUD | Create, Read, Update, Delete |
| RBAC | Role-Based Access Control |
| SPA | Single Page Application |
| CDN | Content Delivery Network |
| TTL | Time To Live (for auto-expiring documents) |

---

## 6. Overall Description

### 6.1 Product Perspective
FitTrack Pro is a standalone web application with no external system dependencies beyond MongoDB Atlas (database) and Cloudinary (image storage). It operates as a client-server SPA.

### 6.2 User Classes

| User Class | Description | Privileges |
|-----------|-------------|-----------|
| **Guest** | Unauthenticated visitor | View public pages (Home, About, Contact), Register, Login |
| **User** | Registered fitness enthusiast | Full CRUD on own data, browse trainers, submit feedback |
| **Trainer** | Fitness professional | Manage assigned clients, create templates, assign workouts/goals |
| **Admin** | System administrator | Full system access, user management, role assignment, system stats |

### 6.3 Operating Environment
- **Client:** Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Server:** Node.js Latest LTS on Linux/Windows
- **Database:** MongoDB Atlas (cloud)
- **Image Storage:** Cloudinary (cloud)

### 6.4 Design Constraints
- Must be fully responsive (mobile, tablet, desktop)
- Must use Tailwind CSS exclusively
- Must follow modular component architecture (max 120 lines per backend file)
- No comments in code
- All images stored on Cloudinary, URLs in MongoDB Atlas
- Project structure: `client/` (frontend) and `server/` (backend)
- All credentials managed through `.env` files (separate for client and server)

---

## 7. Functional Requirements

### 7.1 Authentication & User Management

#### FR-AUTH-01: User Registration
- **Input:** Username (3-30 chars, alphanumeric+underscore), Email (valid format), Password (min 8 chars), Profile Name, Age (13-120), Gender, Height, Weight, Fitness Level, Goals, Profile Picture (image file, max 5MB)
- **Process:** Validate inputs → Check duplicate email/username → Hash password (bcrypt, 12 rounds) → Upload image to Cloudinary → Create user record → Generate JWT → Set httpOnly cookie → Send welcome notification
- **Output:** `{ success: true, token, user }` with HTTP 201
- **Error Cases:** Duplicate email/username (409), Missing fields (400), Invalid image (400)

#### FR-AUTH-02: User Login
- **Input:** Email, Password
- **Process:** Find user by email → Compare password (bcrypt) → Check IsActive → Update LastLogin → Generate JWT → Set cookie → Send login notification
- **Output:** `{ success: true, token, user }` with HTTP 200
- **Error Cases:** Invalid credentials (401), Deactivated account (403)

#### FR-AUTH-03: User Logout
- **Process:** Clear httpOnly cookie (expires immediately) → Send logout notification
- **Output:** `{ success: true, message }` with HTTP 200

#### FR-AUTH-04: Get Current User
- **Process:** Extract JWT from cookie/Bearer header → Verify → Fetch user from DB → Return safe user object (no password)
- **Output:** `{ success: true, user }` with HTTP 200

#### FR-AUTH-05: Update Profile
- **Input:** Any subset of profile fields + optional new profile picture
- **Process:** Verify ownership → If image: delete old from Cloudinary, upload new → Merge fields → Save → Notify
- **Output:** `{ success: true, user }` with HTTP 200

#### FR-AUTH-06: Update Password
- **Input:** currentPassword, newPassword
- **Process:** Verify current password → Hash new password → Save → Generate new JWT → Set new cookie → Notify
- **Output:** `{ success: true, token, user }` with HTTP 200

#### FR-AUTH-07: Forgot Password
- **Input:** Email
- **Process:** Find user → Generate crypto token (20 bytes hex) → Hash token (SHA-256) → Store hash + expiry (1 hour) → Create password-reset notification with link
- **Output:** `{ success: true, message }` with HTTP 200

#### FR-AUTH-08: Reset Password
- **Input:** Reset token (URL param), New Password
- **Process:** Hash token → Find user with matching hash + non-expired → Set new password → Clear reset fields → Generate JWT → Notify
- **Output:** `{ success: true, token, user }` with HTTP 200

#### FR-AUTH-09: Delete/Deactivate Account
- **Process:** Set IsActive = false (soft delete) → Delete profile picture from Cloudinary → Notify
- **Output:** `{ success: true, message }` with HTTP 200

---

### 7.2 Workout Management

#### FR-WRK-01: Create Workout
- **Input:** Title, Type (Weightlifting/Cardio/HIIT/Yoga/etc), Difficulty, Exercises[] (Name, Category, MuscleGroups, Sets, Reps, Weight, Duration, Notes), Duration, Location, Tags
- **Process:** Attach UserId → Create document → Auto-calculate CompletionRate (0%) → Send notification
- **Output:** `{ success: true, data: workout }` with HTTP 201

#### FR-WRK-02: List Workouts
- **Filters:** type, status (planned/in-progress/completed), startDate, endDate, page, limit (max 50)
- **Process:** Build filter with UserId → Paginate → Aggregate stats (total workouts, duration, calories, completed)
- **Output:** `{ success: true, count, total, totalPages, currentPage, stats, data[] }`

#### FR-WRK-03: Get Single Workout
- **Process:** Find by _id + UserId → Return full document
- **Output:** `{ success: true, data: workout }`

#### FR-WRK-04: Update Workout
- **Process:** Verify ownership → Apply $set update → If completed: send notification, update CompletedAt
- **Output:** `{ success: true, data: workout }`

#### FR-WRK-05: Delete Workout
- **Process:** FindOneAndDelete with UserId check
- **Output:** `{ success: true, message }`

#### FR-WRK-06: Start Workout
- **Process:** Set StartedAt = now()
- **Output:** Updated workout with status "In-progress"

#### FR-WRK-07: Complete Exercise
- **Input:** exerciseIndex (0-based)
- **Process:** Set Exercises[index].Completed = true → Recalculate CompletionRate → If all complete: auto-complete workout + notify
- **Output:** Updated workout

#### FR-WRK-08: Toggle Favorite
- **Process:** Flip IsFavorite boolean
- **Output:** Updated workout

#### FR-WRK-09: Clone Workout
- **Process:** Copy workout (own or public) → Prefix title "Copy of" → Set IsTemplate=false, IsPublic=false → Save as new
- **Output:** New cloned workout

#### FR-WRK-10: Search Workouts
- **Input:** query (searches Title, Description, Tags), type, difficulty
- **Process:** Regex match with case-insensitive flag
- **Output:** Paginated results

#### FR-WRK-11: Workout Analytics
- **Process:** Aggregate last 30 days — daily workout count, total duration, total calories
- **Output:** Array of daily summaries

---

### 7.3 Nutrition Management

#### FR-NUT-01: Create Nutrition Entry
- **Input:** MealType (Breakfast/Lunch/Dinner/Snack/Pre-workout/Post-workout), Date, Time, FoodItems[] (Name, Quantity, Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium), WaterIntake, Notes, Location, Mood
- **Process:** Pre-save hook auto-calculates TotalCalories/Protein/Carbs/Fat from FoodItems → Notify
- **Output:** `{ success: true, data: nutrition }` with HTTP 201

#### FR-NUT-02: List Nutrition Entries
- **Filters:** date, mealType, startDate, endDate, page, limit
- **Process:** Paginate + aggregate daily totals
- **Output:** Entries + dailyTotals array

#### FR-NUT-03: Update Nutrition Entry
- **Process:** Verify ownership → Apply update → Recalculate totals on save
- **Output:** Updated entry

#### FR-NUT-04: Delete Nutrition Entry
- **Process:** FindOneAndDelete with UserId
- **Output:** Success message

#### FR-NUT-05: Search Foods
- **Input:** query (text search on Name + Brand), category
- **Process:** MongoDB $text search on Food collection
- **Output:** Paginated food items

#### FR-NUT-06: Add Custom Food
- **Input:** Name, Brand, ServingSize, Calories, macros, Category
- **Process:** Auto-title-case name → Set IsVerified=false, AddedBy=userId
- **Output:** New food document

#### FR-NUT-07: Nutrition Stats (7-day)
- **Process:** Aggregate avg daily calories/macros + find top 10 frequent foods
- **Output:** Summary + frequentFoods array

#### FR-NUT-08: Daily Summary
- **Process:** Aggregate all entries for specific date → Sum calories/macros
- **Output:** Daily totals object

---

### 7.4 Progress Tracking

#### FR-PRG-01: Create Progress Entry
- **Input:** Date, Weight, BodyFatPercentage, MuscleMass, BodyMeasurements (Chest/Waist/Hips/Arms/Thighs/Calves/Neck with units), PerformanceMetrics[], EnergyLevel (1-10), SleepQuality (1-10), StressLevel (1-10), Notes, Photos[] (uploaded to Cloudinary), IsMilestone
- **Process:** Attach UserId → Create → If milestone: send celebration notification
- **Output:** `{ success: true, data: progress }` with HTTP 201

#### FR-PRG-02: List Progress Entries
- **Filters:** startDate, endDate, isMilestone, page, limit
- **Output:** Paginated entries

#### FR-PRG-03: Update Progress Entry
- **Process:** Verify ownership → Apply update
- **Output:** Updated entry

#### FR-PRG-04: Delete Progress Entry
- **Process:** FindOneAndDelete with UserId
- **Output:** Success message

#### FR-PRG-05: Progress Stats (90-day)
- **Process:** Weight trend (daily), measurement trend (chest/waist/hips), latest vs first entry comparison
- **Output:** weightTrend[], measurementsTrend[], latest, first, totalEntries, milestones count

#### FR-PRG-06: Progress Trends
- **Input:** metric (e.g., "Weight.Value", "BodyFatPercentage")
- **Process:** Aggregate specific metric over time
- **Output:** Array of {date, value}

---

### 7.5 Goal Management

#### FR-GOAL-01: Create Goal
- **Input:** Title, Description, Type (Weight-loss/Muscle-building/Endurance/etc), TargetValue, Unit, EndDate, Frequency, Milestones[], Reminders[]
- **Process:** Attach UserId → Pre-save calculates Progress (0%) → Set Status "Active" → Notify
- **Output:** `{ success: true, data: goal }` with HTTP 201

#### FR-GOAL-02: List Goals
- **Filters:** status (Active/Completed/Failed/Paused), type, page, limit
- **Process:** Aggregate stats by status (count + avg progress)
- **Output:** Goals array + stats

#### FR-GOAL-03: Update Goal
- **Process:** Verify ownership → If status changes to Completed: notify
- **Output:** Updated goal

#### FR-GOAL-04: Update Goal Progress
- **Input:** currentValue
- **Process:** Set CurrentValue → Pre-save recalculates Progress % → If ≥100%: auto-complete + notify
- **Output:** Updated goal with new progress

#### FR-GOAL-05: Complete/Activate/Pause Goal
- **Process:** Change Status field → Save → Notify on completion
- **Output:** Updated goal

#### FR-GOAL-06: Delete Goal
- **Process:** FindOneAndDelete with UserId
- **Output:** Success message

#### FR-GOAL-07: Goal Stats & Insights
- **Process:** Aggregate total/active/completed goals, avg progress, avg duration, success rate by type
- **Output:** Overall stats + per-type breakdown

#### FR-GOAL-08: Milestones CRUD
- **Process:** Add/Update/Delete milestones within a goal → Auto-detect achievement when CurrentValue ≥ milestone TargetValue
- **Output:** Updated milestones array

---

### 7.6 Water Intake Tracking

#### FR-WAT-01: Log Water
- **Input:** Amount (Value + Unit: ml/l/cup/oz), Date, Time, Notes
- **Process:** Create entry → Calculate today's total (unit conversion) → If ≥2000ml: send hydration goal notification
- **Output:** Entry + todayTotal object

#### FR-WAT-02: List Water Entries
- **Filters:** date (default: today), startDate, endDate, page, limit
- **Process:** Sort by Time ascending → Include weekly stats aggregation
- **Output:** Entries + todayTotal + weeklyStats[]

#### FR-WAT-03: Update/Delete Water Entry
- **Process:** Standard ownership check → Recalculate todayTotal after operation
- **Output:** Updated entry/deletion confirmation + todayTotal

#### FR-WAT-04: Hydration Streak
- **Process:** Count consecutive days (backward from today) where total ≥ 2000ml
- **Output:** Streak count (integer)

#### FR-WAT-05: Hydration Stats (30-day)
- **Process:** Average daily intake, days met target, best day
- **Output:** Summary + bestDay + streak

---

### 7.7 Sleep Tracking

#### FR-SLP-01: Log Sleep
- **Input:** Date, SleepTime (HH:MM), WakeTime (HH:MM), Quality (1-10), DeepSleep/LightSleep/RemSleep (minutes), AwakeCount, Notes
- **Process:** Pre-save auto-calculates Duration from SleepTime/WakeTime (handles overnight) → If ≥7hrs + quality≥7: send "great sleep" notification
- **Output:** Sleep entry with calculated Duration

#### FR-SLP-02: List Sleep Logs
- **Filters:** date, startDate, endDate, page, limit
- **Process:** Aggregate avg duration, quality, efficiency for filtered period
- **Output:** Entries + period stats

#### FR-SLP-03: Sleep Stats (30-day)
- **Process:** Daily trends (duration, quality, deep/light/REM) + weekly averages by day-of-week
- **Output:** trends[] + weeklyAverages[]

#### FR-SLP-04: Sleep Recommendations
- **Process:** Analyze avg duration/quality/efficiency → Generate prioritized recommendations
- **Output:** Array of {type, message, priority}

---

### 7.8 Notification System

#### FR-NOT-01: List Notifications
- **Filters:** type, isRead, page, limit (max 50)
- **Process:** Count unread → Paginate sorted by createdAt desc
- **Output:** Notifications + unreadCount

#### FR-NOT-02: Mark as Read (Single/All)
- **Process:** Set IsRead=true → Return updated count
- **Output:** Confirmation with updated unreadCount

#### FR-NOT-03: Delete/Clear Notifications
- **Process:** Delete single or all for user
- **Output:** Deleted count

#### FR-NOT-04: Auto-Expiry
- **Process:** TTL index on ExpiresAt field (default: 30 days from creation)
- **Output:** MongoDB automatically removes expired documents

---

### 7.9 Achievement System

#### FR-ACH-01: List Achievements
- **Filters:** type, isHidden, page, limit
- **Process:** Calculate total points → Paginate
- **Output:** Achievements + totalPoints

#### FR-ACH-02: Achievement Stats
- **Process:** Group by type (count + points) → Map all 7 categories → Recent achievements (7 days)
- **Output:** Stats + achievementProgress[] + recentAchievements[]

#### FR-ACH-03: Leaderboard
- **Process:** Aggregate all users' points → Top 20 with user details (lookup) → Find current user's rank
- **Output:** Leaderboard[] + currentUser stats + currentRank

#### FR-ACH-04: Check New Achievements
- **Input:** checkType ("workout"/"streak"), checkData
- **Process:** Check thresholds (10 workouts, 7-day streak) → If met + not already earned: create achievement
- **Output:** newAchievements[]

---

### 7.10 Admin Operations

#### FR-ADM-01: User Management
- **List:** Paginated, searchable (Username/Email/Name), filterable (role, isActive)
- **Create:** Admin creates user with IsVerified=true
- **Update:** Modify any user field
- **Change Role:** User ↔ Admin ↔ Trainer
- **Assign Trainer:** Link User.TrainerId to a Trainer → Notify both parties
- **Toggle Active:** Activate/deactivate (cannot self-deactivate)
- **Delete:** Hard delete user + all associated data (workouts, nutrition, progress, goals, notifications, achievements) + profile picture from Cloudinary
- **Bulk Actions:** Activate/deactivate/promote/demote multiple users at once → Batch notifications

#### FR-ADM-02: System Statistics
- **Process:** Parallel count queries across all collections + 30-day new users + top 5 trainers by client count + recent activity feed
- **Output:** overview, content, growth, trainers, activity objects

#### FR-ADM-03: Activity Logs
- **Process:** Aggregate Notifications collection with user lookup → Filter by type/date range → Paginate
- **Output:** Activity log entries with user info

#### FR-ADM-04: Trainer Request Management
- **List:** All requests with populated User + Trainer details
- **Approve:** Set User.TrainerId → Notify user + trainer → Set Status="Approved"
- **Reject:** Set Status="Rejected" + AdminNotes → Notify user with reason

---

### 7.11 Trainer Operations

#### FR-TRN-01: Client Management
- **List Clients:** Find users where TrainerId = trainer._id → Enrich with last workout, progress count, active goals
- **Client Details:** Full profile + recent workouts (10) + recent progress (5) + active goals + trainer notes + stats
- **Remove Client:** Set User.TrainerId = null → Notify client

#### FR-TRN-02: Assign Workout to Client
- **Input:** title, type, exercises[], difficulty, duration, notes
- **Process:** Verify client is assigned → Create workout with client's UserId → Notify client
- **Output:** New workout document

#### FR-TRN-03: Set Goal for Client
- **Input:** title, type, targetValue, unit, endDate, description
- **Process:** Verify client → Create goal with client's UserId → Notify client
- **Output:** New goal document

#### FR-TRN-04: Add Trainer Note
- **Input:** note (text)
- **Process:** Append to client's TrainerNotes[] with trainerId + trainerName + timestamp
- **Output:** New note object

#### FR-TRN-05: Workout Templates
- **Create:** IsTemplate=true, optional IsPublic=true
- **List:** Filter by UserId + IsTemplate=true, optional type/difficulty
- **Delete:** Only own templates
- **Output:** Template CRUD responses

#### FR-TRN-06: Send Message to Client
- **Input:** message text
- **Process:** Create notification of type "Message" on client → Include trainer info in Data
- **Output:** Notification document

#### FR-TRN-07: Dashboard Stats
- **Process:** totalClients, activeClients, assignedWorkouts, completion rate, top clients by workout count, recent activity
- **Output:** overview + topClients[] + recentActivity[] + performance

---

### 7.12 Feedback System

#### FR-FBK-01: Submit Feedback
- **Input:** Message
- **Process:** Auto-fill Name + Email from user profile → Create feedback → Notify all admins
- **Output:** Feedback document

#### FR-FBK-02: Admin View Feedbacks
- **Process:** List all feedbacks with populated user details → Sorted by newest
- **Output:** Feedbacks array

#### FR-FBK-03: Mark Feedback as Read
- **Process:** Set IsRead=true → Notify user "feedback processed"
- **Output:** Confirmation

---

## 8. Non-Functional Requirements

### 8.1 Performance
| Requirement | Target |
|------------|--------|
| API Response Time | < 500ms for simple queries, < 2s for aggregations |
| Frontend First Paint | < 1.5s on 4G connection |
| Frontend Interactive | < 3s on 4G connection |
| Database Query | < 100ms with proper indexes |
| Concurrent Users | Support 500+ simultaneous users |
| File Upload | Max 5MB, processed within 5s |

### 8.2 Security
| Requirement | Implementation |
|------------|---------------|
| Data Encryption at Rest | MongoDB Atlas encryption (default) |
| Data Encryption in Transit | HTTPS/TLS (enforced by hosting) |
| Password Storage | bcryptjs, 12 salt rounds |
| Token Security | httpOnly, secure, sameSite cookies |
| Input Sanitization | mongo-sanitize, xss-clean, express-validator |
| Rate Limiting | 200 req/15min global, 20 req/15min auth |
| CORS | Whitelisted origins only |
| File Upload | MIME + extension whitelist, Cloudinary processing |

### 8.3 Reliability
| Requirement | Target |
|------------|--------|
| Uptime | 99%+ (MongoDB Atlas SLA) |
| Error Rate | < 1% of requests |
| Data Backup | MongoDB Atlas automated daily backups |
| Graceful Shutdown | Clean close of HTTP server + DB connection |

### 8.4 Scalability
| Requirement | Strategy |
|------------|----------|
| Horizontal Scaling | Stateless API (JWT), stateless sessions |
| Database Scaling | MongoDB Atlas auto-scaling, sharding ready |
| Image Scaling | Cloudinary auto-optimization + CDN |
| Frontend Scaling | Vite code splitting, lazy loading routes |

### 8.5 Usability
| Requirement | Implementation |
|------------|---------------|
| Responsive Design | Tailwind responsive utilities (sm/md/lg/xl/2xl) |
| Accessibility | Semantic HTML, ARIA labels, keyboard navigation, focus states |
| Loading States | Skeleton loaders for all data-fetching pages |
| Error Feedback | Toast notifications for all API errors |
| Form Validation | Real-time inline validation (React Hook Form + Yup) |

### 8.6 Compatibility
| Requirement | Target |
|------------|--------|
| Browsers | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Screen Sizes | 320px (mobile) to 2560px (ultrawide) |
| Devices | Desktop, tablet, smartphone |
| Network | Works on 3G+ (graceful degradation) |

### 8.7 Maintainability
| Requirement | Implementation |
|------------|---------------|
| Code Organization | Modular MVC pattern, max 120 lines per backend file |
| No Comments | Clean self-documenting code |
| Version Control | Git with meaningful commit messages |
| Documentation | PRD, TRD, SRD, rules.md |

---

## 9. External Interface Requirements

### 9.1 User Interfaces
- **Layout System:** 5 layouts — WebsiteLayout (public), AuthLayout (auth pages), UserLayout, AdminLayout, TrainerLayout
- **Navigation:** Each panel has dedicated Navbar (top) + Sidebar (left)
- **Theme:** Dark theme primary with Tailwind utility classes
- **Icons:** React Icons library (professional, consistent)
- **Charts:** Chart.js for all data visualizations (line, bar, pie, radar, doughnut)
- **Animations:** Framer Motion for page transitions and micro-interactions

### 9.2 Software Interfaces
| Interface | Protocol | Direction |
|-----------|----------|-----------|
| Frontend ↔ Backend | HTTPS REST | Bidirectional |
| Backend ↔ MongoDB Atlas | MongoDB Wire Protocol | Bidirectional |
| Backend ↔ Cloudinary | HTTPS API | Upload/Transform |
| Browser ↔ Frontend | HTTPS | Serve static SPA |

### 9.3 Communication Interfaces
| Interface | Details |
|-----------|---------|
| HTTP | REST API with JSON request/response bodies |
| Authentication | JWT in httpOnly cookie + Authorization Bearer header |
| File Upload | multipart/form-data via Axios |
| CORS | Configured for specific frontend origin |

---

## 10. Data Requirements

### 10.1 Data Retention
- **User Accounts:** Soft-deleted (IsActive: false), hard-deleted only by admin
- **Notifications:** Auto-expire after 30 days (TTL index)
- **Workout/Nutrition/Progress:** Retained until user/admin deletes
- **Achievements:** Permanent

### 10.2 Data Integrity
- **Ownership:** Every data query includes UserId filter to prevent cross-user access
- **Validation:** Mongoose schema validators on all required fields
- **Cascade Delete:** Admin user deletion removes all associated data across collections
- **Unique Constraints:** Username, Email (user), Barcode (food), UserId+TrainerId+PendingStatus (trainer request)

### 10.3 Data Privacy
- **Password:** Never returned in API responses (select: false + getSafeUser method)
- **Reset Tokens:** Never exposed (hashed in DB, raw in URL only)
- **Profile Visibility:** Configurable (Public/Friends-only/Private) per data type
- **GDPR Compliance:** Users can deactivate accounts, request data export

---

## 11. System Constraints

| Constraint | Details |
|-----------|---------|
| **Language** | JavaScript (ES6+) for both frontend and backend |
| **Framework** | React (latest) frontend, Express (latest) backend |
| **Database** | MongoDB Atlas only (no SQL) |
| **Image Storage** | Cloudinary only (no local file storage in production) |
| **CSS** | Tailwind CSS only (no MUI, no Bootstrap) |
| **File Size** | Max 120 lines per backend file (unless absolutely necessary) |
| **Comments** | Zero comments in production code |
| **Icons** | React Icons only (professional, no AI-looking generic icons) |
| **Forms** | React Hook Form + Yup (no Formik) |
| **Charts** | Chart.js only (no recharts, no d3) |
| **Project Structure** | `client/` (frontend) + `server/` (backend) — all credentials in `.env` |

---

## 12. Assumptions & Dependencies

### 12.1 Assumptions
1. Users have a stable internet connection
2. Users have a modern browser with JavaScript enabled
3. MongoDB Atlas free/shared tier is sufficient for initial deployment
4. Cloudinary free tier (25GB storage, 25GB bandwidth/month) is sufficient
5. Single server instance is sufficient for initial load

### 12.2 Dependencies
| Dependency | Version | Critical |
|-----------|---------|--------|
| React | Latest | Yes |
| React Router DOM | Latest | Yes |
| Axios | Latest | Yes |
| Tailwind CSS | Latest | Yes |
| Express | Latest | Yes |
| Mongoose | Latest | Yes |
| jsonwebtoken | Latest | Yes |
| bcryptjs | Latest | Yes |
| Cloudinary SDK | Latest | Yes |
| Chart.js | Latest | No (graceful degradation) |
| Framer Motion | Latest | No (graceful degradation) |

---

## 13. Verification & Acceptance Criteria

### 13.1 Authentication
- [ ] User can register with all required fields + profile picture → redirects to dashboard
- [ ] User can login with valid credentials → redirected by role
- [ ] User cannot access protected routes without authentication
- [ ] User with wrong role sees unauthorized page
- [ ] Password reset flow works end-to-end
- [ ] Deactivated user cannot login

### 13.2 Workout Module
- [ ] User can create workout with multiple exercises
- [ ] User can start, track exercises, and complete workout
- [ ] Completion rate auto-calculates
- [ ] Workout can be cloned from public templates
- [ ] Search works on title, description, tags

### 13.3 Nutrition Module
- [ ] User can log meals with multiple food items
- [ ] Total calories/macros auto-calculate
- [ ] Food search returns results from database
- [ ] Daily summary shows correct totals

### 13.4 Progress Module
- [ ] User can log weight, measurements, photos
- [ ] Weight trend chart displays correctly over 90 days
- [ ] Milestone entries are highlighted

### 13.5 Goal Module
- [ ] User can create goal with milestones
- [ ] Progress auto-calculates percentage
- [ ] Goal auto-completes when progress ≥ 100%
- [ ] Overdue goals auto-mark as Failed

### 13.6 Water & Sleep
- [ ] Water intake converts units correctly (ml/l/cup/oz)
- [ ] Hydration streak counts consecutive days ≥ 2000ml
- [ ] Sleep duration auto-calculates from sleep/wake times
- [ ] Sleep recommendations generated from patterns

### 13.7 Admin Panel
- [ ] Admin can CRUD all users
- [ ] Admin can assign trainers to users
- [ ] Bulk actions work correctly with notifications
- [ ] System stats display accurate counts

### 13.8 Trainer Panel
- [ ] Trainer can view assigned clients
- [ ] Trainer can assign workouts/goals to clients
- [ ] Client receives notifications for assignments
- [ ] Trainer can create and manage templates

### 13.9 Responsive Design
- [ ] All pages render correctly on 320px-2560px widths
- [ ] Sidebar collapses to hamburger on mobile
- [ ] Tables become scrollable horizontally on small screens
- [ ] Forms stack vertically on mobile

---

## 14. Hardware & Software Requirements

### 14.1 Hardware Requirements
| Component | Minimum | Recommended |
|-----------|--------|-------------|
| **Processor** | Pentium 166 or better | Intel i5 / AMD Ryzen 5 or better |
| **RAM** | 128 MB | 8 GB or more |
| **Storage** | 500 MB free space | 10 GB SSD |
| **Network** | Broadband connection | High-speed internet for Cloudinary/Atlas |
| **Display** | 1024x768 | 1920x1080 (Full HD) |

### 14.2 Software Requirements
| Software | Version | Purpose |
|----------|--------|--------|
| **Operating System** | Windows 10/11, macOS, Linux | Development environment |
| **Node.js** | Latest LTS | Backend runtime |
| **MongoDB Atlas** | Latest (Cloud) | Database |
| **Express.js** | Latest | Backend web framework |
| **React** | Latest | Frontend UI framework |
| **Vite** | Latest | Frontend build tool |
| **Tailwind CSS** | Latest | Styling framework |
| **Mongoose** | Latest | MongoDB ODM |
| **Cloudinary** | Latest SDK | Image upload & CDN |
| **Git** | Latest | Version control |
| **VS Code** | Latest | Code editor / IDE |
| **Postman** | Latest | API testing |
| **Chrome/Firefox** | Latest | Browser testing |
