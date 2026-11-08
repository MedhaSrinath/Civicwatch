# CivicWatch 🏛️

> **Smart Civic Issue Reporting and Resolution Platform**  
> Developed for **CS3301 Full Stack Development** at RV University.

CivicWatch connects citizens, municipal authorities, and field officers to simplify the reporting, direct assignment, transparent tracking, and verified resolution of civic issues (potholes, garbage, broken streetlights, water leakage, and drainage).

---

## 🌟 Central USP: "Know Why, Not Just What"

CivicWatch moves beyond static status labels. Every complaint features **dynamic, contextual explanations** of its current status:
- `Pending` → *"Your complaint has been submitted and is awaiting review by the administration."*
- `Assigned` → *"Assigned to the responsible officer for Roads & Infrastructure."*
- `In Progress` → *"Work in progress – Road repair crew dispatched."*
- `Resolved` → *"Work completed by officer. Awaiting citizen confirmation."*
- `Reopened` → *"Citizen disputed the resolution: 'Pothole only half filled'."*
- `Closed` → *"Citizen verified and closed the complaint."*

---

## 👥 Three Distinct User Roles

| Role | Capabilities | Demo Account |
|---|---|---|
| **Citizen** | Report issues with photos & location, track status history, verify resolutions (confirm or dispute) | `priya.sharma@email.com` / `password` |
| **Officer** | View assigned complaints, update progress remarks, upload resolution evidence photos, mark resolved | `rajan.kumar@civic.gov.in` / `password` |
| **Admin** | Full complaint lifecycle management, directly assign department + officer, set priority, manage users/departments/categories, view analytics | `admin@civic.gov.in` / `password` |

---

## 🛠️ Technology Stack

### Frontend
- **React 18** (Functional components, custom hooks, context API)
- **TypeScript** (Strict type safety)
- **Vite 6** (Modern build tooling)
- **React Router DOM 7** (Protected role-based routing)
- **Tailwind CSS v4** (Responsive municipal UI design system)
- **Axios** (JWT interceptor request pipeline)
- **React Hot Toast** (User feedback notifications)

### Backend
- **Node.js & Express.js** (RESTful API architecture)
- **MongoDB & Mongoose** (Relational schemas, indexing, populate queries)
- **JSON Web Tokens (JWT)** (Stateless authentication)
- **bcryptjs** (Salted password hashing)
- **Multer** (Multipart photo evidence upload with type & size validation)
- **express-validator** (Request input validation)
- **CORS & dotenv** (Environment security)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or MongoDB Atlas URI)
- Git

### 1. Clone & Setup Backend

```bash
cd server
npm install

# Copy environment variables template
cp .env.example .env
# Edit .env with your MongoDB URI and JWT Secret
```

**.env Configuration:**
```env
MONGO_URI=mongodb://localhost:27017/civicwatch
JWT_SECRET=civicwatch_super_secret_jwt_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 2. Seed Initial Database Data

```bash
npm run seed
```

This creates:
- 6 standard departments (Roads, Water, Sanitation, Electricity, Parks, Public Health)
- 6 standard civic issue categories (Potholes, Garbage, Streetlights, Drainage, Water Leakage, Damaged Roads)
- Default demo accounts: Admin, 2 Officers, and 1 Citizen (all passwords: `password`)

### 3. Start Backend Server

```bash
npm run dev   # or: npm start
# Server runs on http://localhost:5000
```

### 4. Setup & Start Frontend

```bash
cd ../civicwatch-landing-login
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📡 REST API Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Citizen self-registration
- `POST /api/auth/login` – Authenticate user and issue JWT
- `GET /api/auth/me` – Fetch logged-in user profile (Protected)

### Complaints (`/api/complaints`)
- `GET /api/complaints` – Role-scoped complaints list
- `POST /api/complaints` – Citizen reports issue with photo upload (Multer)
- `GET /api/complaints/:id` – Detailed complaint view with lifecycle timeline
- `PUT /api/complaints/:id/assign` – Admin directly assigns department + officer + priority
- `PUT /api/complaints/:id/status` – Officer updates status + remarks + resolution photo
- `PUT /api/complaints/:id/feedback` – Citizen confirms or disputes resolution
- `GET /api/complaints/stats` – Centralized admin analytics

### Departments & Categories (`/api/departments`, `/api/categories`)
- `GET /` – List all active departments/categories
- `POST /` – Admin creates department/category
- `PUT /:id` – Admin updates department/category
- `DELETE /:id` – Admin deletes department/category

### Users (`/api/users`)
- `GET /api/users` – Admin lists users (filterable by role)
- `POST /api/users` – Admin creates officer/admin accounts
- `PUT /api/users/:id` – Admin updates user details / active status
- `DELETE /api/users/:id` – Admin removes user

---

## 🔒 Security & Authorization

1. **Role-Based Access Control (RBAC):** Backend endpoints verify `protect` (JWT verification) and `authorize('role')` independently of frontend route guards.
2. **Data Isolation:** Citizens can only retrieve and view their own complaints; officers only see complaints directly assigned to them; admins see all.
3. **Password Security:** Salted SHA-256 bcrypt hashing with `pre('save')` hooks. Passwords are never returned in JSON output (`select: false`).
4. **Upload Validation:** Strict MIME-type filtering (JPEG, PNG, WebP) and 5MB size limit enforced on backend via Multer.

---

## 🚢 Deployment

- **Frontend:** Ready for Netlify or Vercel (`_redirects` and `vercel.json` included for SPA routing).
- **Backend:** Ready for Render / Railway (`render.yaml` included).

---

## 📄 License
Academic project for CS3301 Full Stack Development course, RV University.
