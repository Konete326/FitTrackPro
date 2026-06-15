# FitTrack Pro — Technical Requirements Document (TRD)

## 1. Technology Stack

### Frontend (client/)
| Technology | Version | Purpose |
|-----------|---------|--------|
| React | Latest | UI framework |
| Vite | Latest | Build tool & dev server |
| Tailwind CSS | Latest | Utility-first CSS framework |
| React Router DOM | Latest | Client-side routing |
| Axios | Latest | HTTP client with interceptors |
| React Hook Form | Latest | Form handling |
| Yup | Latest | Form validation schemas |
| Chart.js + react-chartjs-2 | Latest | Data visualization |
| Framer Motion | Latest | Animations & transitions |
| React Hot Toast | Latest | Toast notifications |
| React Icons | Latest | Professional icon set |
| date-fns | Latest | Date formatting & manipulation |

### Backend (server/)
| Technology | Version | Purpose |
|-----------|---------|--------|
| Node.js | Latest LTS | Runtime |
| Express.js | Latest | Web framework |
| MongoDB (Atlas) | Latest | Cloud database |
| Mongoose | Latest | ODM for MongoDB |
| JWT (jsonwebtoken) | Latest | Token-based authentication |
| bcryptjs | Latest | Password hashing (12 salt rounds) |
| Cloudinary | Latest | Image upload & CDN hosting |
| Multer | Latest | Multipart form parsing (for Cloudinary pipeline) |
| express-validator | Latest | Server-side input validation |
| Helmet | Latest | Security headers |
| express-rate-limit | Latest | API rate limiting |
| CORS | Latest | Cross-origin resource sharing |
| Compression | Latest | Response compression |
| Morgan | Latest | HTTP request logger |
| express-mongo-sanitize | Latest | NoSQL injection prevention |
| xss-clean | Latest | XSS attack prevention |
| hpp | Latest | HTTP parameter pollution prevention |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React + Tailwind)             │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐ │
│  │ Auth     │  │ Protected    │  │ Public            │ │
│  │ Context  │  │ Routes       │  │ Pages             │ │
│  │ (Axios)  │  │ (Role-based) │  │ (Home/About/etc)  │ │
│  └────┬─────┘  └──────┬───────┘  └───────────────────┘ │
└───────┼────────────────┼────────────────────────────────┘
        │  HTTPS         │  HTTPS
┌───────┼────────────────┼────────────────────────────────┐
│       ▼                ▼        SERVER (Express.js)      │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Middleware Pipeline                  │   │
│  │  Helmet → CORS → RateLimit → BodyParser →        │   │
│  │  CookieParser → MongoSanitize → XSS → HPP →      │   │
│  │  Compression → Morgan → Auth(protect/authorize)  │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Routes → Controllers → Models → MongoDB Atlas   │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────┼───────────────────────────┐   │
│  │  Cloudinary ◄────────┘  (Image uploads)          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema (MongoDB Atlas)

### 3.1 Collections

| Collection | Model File | Key Fields | Indexes |
|-----------|-----------|-----------|---------|
| `users` | User_Model.js | Username, Email, Password(hashed), Role, Profile, Settings, Stats, TrainerId | Role, TrainerId, Profile.Name(text), createdAt |
| `workouts` | Workout_Model.js | UserId, Title, Type, Exercises[], Duration, CaloriesBurned, Tags | UserId+createdAt, Type, Difficulty, Tags, IsPublic |
| `nutritions` | Nutrition_Model.js | UserId, MealType, FoodItems[], Date, TotalCalories/Protein/Carbs/Fat | UserId+Date, UserId+MealType, FoodItems.Name(text) |
| `progress` | Progress_Model.js | UserId, Date, Weight, BodyFat%, BodyMeasurements, PerformanceMetrics, Photos[] | UserId+Date, UserId+IsMilestone |
| `goals` | Goal_Model.js | UserId, Title, Type, TargetValue, CurrentValue, Progress, Status, Milestones[], Reminders[] | UserId+Status, UserId+Type, UserId+EndDate |
| `waters` | Water_Model.js | UserId, Date, Amount, Time | UserId+Date |
| `sleeps` | Sleep_Model.js | UserId, Date, SleepTime, WakeTime, Duration, Quality, DeepSleep, LightSleep, RemSleep | UserId+Date, UserId+Quality |
| `achievements` | Achievement_Model.js | UserId, Type, Title, Icon, Points, Criteria, EarnedAt | UserId+Type, UserId+EarnedAt |
| `notifications` | Notification_Model.js | UserId, Type, Title, Message, IsRead, Priority, ExpiresAt(TTL) | UserId+IsRead+createdAt, ScheduledFor, ExpiresAt(TTL) |
| `feedbacks` | Feedback_Model.js | UserId, Name, Email, Message, IsRead, AdminResponse | None (admin reads all) |
| `trainerrequests` | TrainerRequest_Model.js | UserId, TrainerId, Message, Status, AdminNotes | UserId+TrainerId+Status(unique pending) |
| `foods` | Food_Model.js | Name, Brand, Barcode, ServingSize, Calories, Macros, Category, IsVerified | Name+Brand(text), Category, IsVerified |

### 3.2 Key Relationships
- **User → Trainer:** `User.TrainerId` refs `User._id` (self-reference)
- **User → Workouts/Nutrition/Progress/Goals/Water/Sleep/Achievements/Notifications:** `UserId` field
- **Virtual Population:** `User.Clients` virtual populates all users where `TrainerId = user._id`

---

## 4. API Endpoints (Complete Map)

### 4.1 Auth Routes (`/api/auth`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| POST | `/register` | registration | Public | Register new user (multipart with Cloudinary image) |
| POST | `/login` | login | Public | Login with email + password |
| POST | `/logout` | logout | Protected | Clear cookie + logout |
| GET | `/me` | get_user | Protected | Get current user profile |
| PUT | `/update-profile` | update_Profile | Protected + Multer | Update profile (with optional image) |
| PUT | `/update-password` | Update_Password | Protected | Change password |
| POST | `/forgot-password` | Forgot_Password | Public | Generate reset token |
| PUT | `/reset-password/:resetToken` | reset_Password | Public | Reset password with token |
| DELETE | `/delete-account` | delete_Account | Protected | Deactivate account |

### 4.2 Workout Routes (`/api/workouts`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| POST | `/` | createWorkout | Protected | Create workout |
| GET | `/` | getWorkouts | Protected | List workouts (filter/paginate) |
| GET | `/:id` | getWorkout | Protected | Get single workout |
| PUT | `/:id` | updateWorkout | Protected | Update workout |
| DELETE | `/:id` | deleteWorkout | Protected | Delete workout |
| PUT | `/:id/start` | startWorkout | Protected | Mark workout started |
| PUT | `/:id/complete-exercise` | completeExercise | Protected | Complete an exercise |
| PUT | `/:id/favorite` | toggleFavorite | Protected | Toggle favorite |
| GET | `/favorites/mine` | getFavoriteWorkouts | Protected | List favorites |
| GET | `/templates/public` | getPublicTemplates | Protected | Browse public templates |
| POST | `/:id/clone` | cloneWorkout | Protected | Clone a workout |
| GET | `/search` | searchWorkouts | Protected | Search workouts |
| GET | `/analytics/summary` | getWorkoutAnalytics | Protected | Workout analytics |

### 4.3 Nutrition Routes (`/api/nutrition`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| POST | `/` | create_Nutrition | Protected | Log meal |
| GET | `/` | get_Nutritions | Protected | List entries |
| GET | `/:id` | getNutritionEntry | Protected | Get single entry |
| PUT | `/:id` | updateNutrition | Protected | Update entry |
| DELETE | `/:id` | deleteNutrition | Protected | Delete entry |
| GET | `/foods/search` | searchFoods | Protected | Search food database |
| POST | `/foods` | createFood | Protected | Add custom food |
| GET | `/stats/summary` | getNutritionStats | Protected | 7-day stats |
| GET | `/daily-summary/:date?` | getDailySummary | Protected | Daily totals |

### 4.4 Progress Routes (`/api/progress`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| POST | `/` | createProgress | Protected | Log progress |
| GET | `/` | getProgress | Protected | List entries |
| GET | `/:id` | getProgressEntry | Protected | Get single entry |
| PUT | `/:id` | updateProgress | Protected | Update entry |
| DELETE | `/:id` | deleteProgress | Protected | Delete entry |
| GET | `/stats/summary` | getProgressStats | Protected | Weight/measurement trends |
| GET | `/trends/:metric?` | getProgressTrends | Protected | Specific metric trend |
| GET | `/measurements/summary` | getMeasurementsSummary | Protected | Latest measurements |
| GET | `/milestones` | getMilestones | Protected | Milestone entries |

### 4.5 Goal Routes (`/api/goals`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| POST | `/` | create_Goal | Protected | Create goal |
| GET | `/` | get_Goals | Protected | List goals |
| GET | `/:id` | get_Goal | Protected | Get single goal |
| PUT | `/:id` | update_Goal | Protected | Update goal |
| DELETE | `/:id` | delete_Goal | Protected | Delete goal |
| PUT | `/:id/progress` | update_GoalProgress | Protected | Update progress value |
| PUT | `/:id/complete` | completeGoal | Protected | Mark completed |
| PUT | `/:id/activate` | activateGoal | Protected | Reactivate goal |
| PUT | `/:id/pause` | pauseGoal | Protected | Pause goal |
| GET | `/stats/summary` | getGoalStats | Protected | Goal statistics |
| GET | `/insights/summary` | get_GoalInsights | Protected | Goal insights by type |

### 4.6 Water Routes (`/api/water`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| POST | `/` | log_Water | Protected | Log water intake |
| GET | `/` | get_waterIntake | Protected | List entries |
| GET | `/:id` | getWaterEntry | Protected | Get single entry |
| PUT | `/:id` | update_Water | Protected | Update entry |
| DELETE | `/:id` | delete_Water | Protected | Delete entry |
| GET | `/daily-summary/:date?` | getDailySummary | Protected | Daily summary |
| GET | `/stats/summary` | get_HydrationStats | Protected | 30-day stats + streak |
| GET | `/streak` | getHydrationStreak | Protected | Current streak |

### 4.7 Sleep Routes (`/api/sleep`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| POST | `/` | logSleep | Protected | Log sleep |
| GET | `/` | getSleepLogs | Protected | List sleep logs |
| GET | `/:id` | getSleepEntry | Protected | Get single entry |
| PUT | `/:id` | updateSleep | Protected | Update entry |
| DELETE | `/:id` | deleteSleep | Protected | Delete entry |
| GET | `/daily-summary/:date?` | getDailySummary | Protected | Daily summary |
| GET | `/stats/summary` | getSleepStats | Protected | 30-day stats + weekly averages |
| GET | `/trends` | getSleepTrends | Protected | Daily trends |
| GET | `/recommendations` | generateSleepRecommendations | Protected | AI-style recommendations |

### 4.8 Notification Routes (`/api/notifications`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| GET | `/` | getNotifications | Protected | List (filter/paginate) |
| PUT | `/:id/read` | markAsRead | Protected | Mark single read |
| PUT | `/read-all` | markAllAsRead | Protected | Mark all read |
| DELETE | `/:id` | deleteNotification | Protected | Delete single |
| DELETE | `/` | clearAllNotifications | Protected | Clear all |
| GET | `/stats/summary` | getNotificationStats | Protected | Stats by type + hourly |

### 4.9 Achievement Routes (`/api/achievements`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| GET | `/` | getAchievements | Protected | List achievements |
| GET | `/:id` | getAchievement | Protected | Get single |
| GET | `/stats/summary` | getAchievementStats | Protected | Stats + progress |
| GET | `/leaderboard` | getLeaderboard | Protected | Top 20 + current rank |
| POST | `/check` | checkNewAchievements | Protected | Check & award new badges |

### 4.10 Admin Routes (`/api/admin`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| GET | `/users` | getAllUsers | Admin | List all users |
| GET | `/users/:id` | getUserById | Admin | User detail + stats |
| POST | `/users` | createUser | Admin | Create user |
| PUT | `/users/:id` | updateUser | Admin | Update user |
| PUT | `/users/:id/role` | updateUserRole | Admin | Change role |
| PUT | `/users/:userId/assign-trainer/:trainerId` | assignTrainer | Admin | Assign trainer |
| PUT | `/users/:id/toggle-active` | toggleUserActive | Admin | Activate/deactivate |
| DELETE | `/users/:id` | deleteUser | Admin | Delete user + data |
| POST | `/users/bulk-actions` | bulkActions | Admin | Bulk ops |
| GET | `/stats` | getSystemStats | Admin | System-wide stats |
| GET | `/activity-logs` | getActivityLogs | Admin | Activity logs |
| GET | `/assignments` | getCoachingAssignments | Admin | All assignments |

### 4.11 Trainer Routes (`/api/trainer`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| GET | `/clients` | getClients | Trainer | List clients |
| GET | `/clients/:id` | getClientDetails | Trainer | Client detail |
| POST | `/clients/:id/workouts` | assignWorkout | Trainer | Assign workout |
| POST | `/clients/:id/goals` | setClientGoal | Trainer | Set goal for client |
| POST | `/clients/:id/notes` | addClientNote | Trainer | Add note |
| GET | `/clients/:id/progress` | getClientProgress | Trainer | View progress |
| POST | `/clients/:id/message` | sendMessageToClient | Trainer | Send message |
| DELETE | `/clients/:id` | removeClient | Trainer | Remove assignment |
| POST | `/workout-templates` | createWorkoutTemplate | Trainer | Create template |
| GET | `/workout-templates` | getWorkoutTemplates | Trainer | List templates |
| DELETE | `/workout-templates/:id` | deleteWorkoutTemplate | Trainer | Delete template |
| GET | `/dashboard-stats` | getTrainerDashboardStats | Trainer | Dashboard stats |

### 4.12 Trainer Request Routes (`/api/trainer-requests`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| POST | `/` | createRequest | Protected (User) | Request trainer |
| GET | `/` | getAllRequests | Admin | List all requests |
| GET | `/my-requests` | getMyRequests | Protected (User) | My requests |
| PUT | `/:id` | updateRequestStatus | Admin | Approve/reject |
| GET | `/available-trainers` | getAvailableTrainers | Protected (User) | Browse trainers |

### 4.13 Feedback Routes (`/api/feedbacks`)
| Method | Endpoint | Controller | Auth | Description |
|--------|---------|-----------|------|-------------|
| POST | `/submit` | submitFeedback | Protected | Submit feedback |
| GET | `/` | getAllFeedbacks | Admin | List all feedbacks |
| PUT | `/:id/read` | markAsRead | Admin | Mark as read |

---

## 5. Authentication & Authorization Flow

### 5.1 Registration Flow
```
User fills form → Frontend validates (Yup) → POST /api/auth/register (multipart) 
→ Server validates → Checks duplicate → Creates user (bcrypt hash) → 
Upload image to Cloudinary → Store URL in DB → Generate JWT → 
Set httpOnly cookie → Return {token, user} → Frontend stores user in AuthContext
```

### 5.2 Login Flow
```
User enters email+password → POST /api/auth/login → Server finds user → 
bcrypt.compare() → Check IsActive → Update LastLogin → Generate JWT → 
Set httpOnly cookie → Return {token, user} → Frontend redirects by role
```

### 5.3 Protected Route Flow
```
User navigates → ProtectedRoute checks AuthContext → 
If no user → Redirect /home → If wrong role → Redirect /unauthorized → 
If valid → Render component → Component fetches data with cookie credentials
```

### 5.4 Middleware Chain (Per Request)
```
Request → Helmet (headers) → CORS → RateLimit → JSON/URL Parser → 
CookieParser → MongoSanitize → XSS → HPP → Compression → Morgan → 
protect (JWT verify + user lookup) → authorize (role check) → Controller
```

---

## 6. Image Upload Strategy (Cloudinary)

### Upload Pipeline
```
client/ → multipart/form-data → server/ Multer (memory storage) → 
Cloudinary upload via SDK → Return secure_url → Store URL in MongoDB Atlas → 
Cloudinary CDN serves image globally
```

### Cloudinary Config
```
- Folder structure: fittrack-pro/profiles/, fittrack-pro/progress/
- Allowed formats: jpg, jpeg, png, webp, gif
- Max file size: 5MB
- Transformations: auto-quality, responsive breakpoints
```

---

## 7. Security Measures

| Layer | Implementation |
|-------|---------------|
| **Authentication** | JWT with httpOnly cookie (30-day expiry) + Bearer token fallback |
| **Password Storage** | bcryptjs with 12 salt rounds |
| **Input Validation** | express-validator (server) + Yup (client) |
| **NoSQL Injection** | express-mongo-sanitize strips `$` and `.` from keys |
| **XSS Protection** | xss-clean middleware sanitizes all input |
| **HTTP Parameter Pollution** | hpp prevents duplicate query params |
| **Security Headers** | Helmet (CSP, X-Frame-Options, HSTS, etc.) |
| **Rate Limiting** | Global: 200 req/15min, Auth: 20 req/15min |
| **CORS** | Whitelisted origins only |
| **File Upload** | MIME type + extension whitelist, size limit 5MB |
| **Authorization** | Role-based (Admin/Trainer/User) + ownership checks |
| **Token Expiry** | Reset password tokens expire in 1 hour |
| **Account Deactivation** | Soft-delete (IsActive: false) instead of hard delete |

---

## 8. Frontend Folder Structure (client/)

```
client/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI (Button, Card, Modal, Input, Badge, Table)
│   │   ├── charts/          # Chart wrapper components
│   │   ├── layout/          # Navbar, Sidebar, Footer per panel
│   │   └── loading/         # Skeleton loaders, spinners
│   ├── pages/
│   │   ├── public/          # Home, About, Contact, Unauthorized
│   │   ├── auth/            # Login, Register, ForgotPassword, ResetPassword, Splash
│   │   ├── user/            # Dashboard, WorkoutList, LogWorkout, WorkoutDetails,
│   │   │                    # NutritionLog, WaterLog, Progress, SleepLog,
│   │   │                    # BrowseTrainers, ProfilePage, Settings
│   │   ├── trainer/         # Dashboard, MyClients, ClientDetails, Templates, Settings
│   │   └── admin/           # Dashboard, UserManagement, TrainerManagement,
│   │                        # CreateTrainer, TrainerRequests, AssignedTrainers, Feedbacks
│   ├── hooks/               # Custom hooks (useApi, useDebounce, useLocalStorage)
│   ├── services/            # Axios instance + API service functions per module
│   ├── context/             # AuthContext, ThemeContext
│   ├── utils/               # Helpers (formatDate, calculateBMI, etc.)
│   ├── routes/              # ProtectedRoute + route config
│   ├── App.jsx              # Root component + route definitions
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind base + custom utilities
├── .env                     # Frontend environment variables (VITE_*)
├── vite.config.js           # Vite configuration
└── package.json
```

---

## 9. Backend Folder Structure (server/)

```
server/
├── Controllers/         # Business logic per module (max ~120 lines each)
├── Models/              # Mongoose schemas & models
├── Routes/              # Express route definitions
├── Middleware/          # Auth, Error handling, Multer, Validator
├── Database/            # DB connection (MongoDB Atlas)
├── Utils/               # Cloudinary config, email helper, token utils
├── server.js            # Express app setup + graceful shutdown
├── .env                 # Backend environment variables (credentials)
└── package.json
```

---

## 10. Environment Variables

All credentials are managed through `.env` files — separate files for `server/` and `client/`.

### server/.env
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=<frontend-url>
DATABASE_URL=<mongodb-atlas-connection-string>
JWT_SECRET=<jwt-secret>
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
UPLOAD_MAX_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

### client/.env
```env
VITE_API_URL=<backend-url>/api
VITE_CLOUDINARY_CLOUD_NAME=<cloud-name>
```

---

## 11. Performance Considerations

| Strategy | Implementation |
|----------|---------------|
| **Pagination** | All list endpoints support `page` + `limit` with safe caps (max 50) |
| **Lean Queries** | `.lean()` used on read queries to skip Mongoose document overhead |
| **Aggregation Pipelines** | Stats/trends calculated server-side with `$group`, `$lookup` |
| **Indexing** | Compound indexes on UserId+Date, UserId+Status, text indexes on search fields |
| **Compression** | gzip compression on responses > 100KB |
| **Image CDN** | Cloudinary serves images via global CDN with auto-optimization |
| **Connection Pooling** | Mongoose default pool + `keepAlive: true` |
| **Graceful Shutdown** | SIGTERM/SIGINT handlers close server + DB connection cleanly |

---

## 12. Project Root Structure

```
fittrack-pro/
├── client/              # React + Tailwind frontend (Vite)
│   ├── src/
│   ├── .env
│   ├── vite.config.js
│   └── package.json
├── server/              # Express + MongoDB backend
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── Middleware/
│   ├── Database/
│   ├── Utils/
│   ├── server.js
│   ├── .env
│   └── package.json
├── PRD.md
├── TRD.md
├── SRD.md
└── rules.md
```

---

## 13. Deployment Architecture

```
┌────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│   client/      │     │   server/            │     │   MongoDB Atlas  │
│   (Vercel/     │────►│   (Render/Railway)   │────►│   (Cloud DB)     │
│    Netlify)    │     │                      │     │                  │
└────────────────┘     └──────────┬──────────┘     └──────────────────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │   Cloudinary     │
                        │   (Image CDN)    │
                        └──────────────────┘
```
