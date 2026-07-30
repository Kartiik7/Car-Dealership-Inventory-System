# Car Dealership Inventory System

A full-stack MERN (MongoDB, Express, React, Node.js) web application built using **Test-Driven Development (TDD)** and **Extreme Programming (XP)** principles. Features role-based access control (Admin vs. Standard User), inventory CRUD operations, vehicle search & filter controls, quantity tracking, stock purchasing, and restock actions.

---

## 🌐 Live Deployed Links

- **Frontend App (Netlify)**: [https://car-dealership-inventory.netlify.app](https://car-dealership-inventory.netlify.app)
- **Backend API (Render)**: [https://car-dealership-inventory-system-evdm.onrender.com/api](https://car-dealership-inventory-system-evdm.onrender.com/api)

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Vite, Vitest, React Testing Library
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT (`jsonwebtoken`), `bcryptjs`, Jest, Supertest
- **Deployment**: Netlify (Frontend SPA with build scripts), Render (Backend Node API service)

### Directory Structure
```text
Car-Dealership-Inventory-System/
├── backend/
│   ├── controllers/      # Route logic (authController, carController)
│   ├── middleware/       # Token validation & Admin authorization (authMiddleware)
│   ├── models/           # Mongoose schemas (User, Car)
│   ├── routes/           # Express routes (authRoutes, carRoutes)
│   └── tests/            # Jest integration tests (auth, car, search, purchase/restock)
├── frontend/
│   ├── src/
│   │   ├── components/   # React components (CarList, CarModal, Login, Register, Navbar, ProtectedRoute)
│   │   ├── context/      # Authentication context (AuthContext)
│   │   ├── services/     # Axios API service client (api.js)
│   │   └── tests/        # Vitest & RTL component tests
│   └── vite.config.js    # Vite configuration with Tailwind CSS v4 & dev server proxy
└── package.json          # Root workspace scripts for combined installation and test execution
```

---

## ⚡ Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Install Dependencies
Install dependencies for both backend and frontend from the project root:
```bash
npm run install:all
```

### 2. Configure Environment Variables

**Backend (`backend/.env`)**:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/car_inventory_db
JWT_SECRET=incubyte_secret_key_123
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL=/api
```

### 3. Run Development Servers
Start both servers concurrently:

```bash
# Terminal 1: Backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2: Frontend (http://localhost:5173)
cd frontend
npm run dev
```

---

## 🧪 Test Report

All 47 unit and integration tests across 12 test suites are passing.

### Test Execution Summary
- **Backend Test Suites**: 5 passed (5 total)
- **Backend Tests**: 25 passed (25 total)
- **Frontend Test Suites**: 7 passed (7 total)
- **Frontend Tests**: 22 passed (22 total)
- **Total Passing Tests**: **47 / 47**

### Test Output

```text
============================== BACKEND TESTS (Jest) ==============================
PASS tests/vehiclePurchaseRestock.test.js
  Vehicle Purchase and Restock API
    POST /api/vehicles/:id/purchase
      ✓ returns 401 when purchase is attempted without token (24 ms)
      ✓ decreases vehicle quantity by 1 for authenticated user (45 ms)
      ✓ returns 400 when attempting to purchase an out of stock vehicle (quantity === 0) (32 ms)
    POST /api/vehicles/:id/restock
      ✓ returns 401 when restock is attempted without token (18 ms)
      ✓ returns 403 when a non-admin user attempts restock (28 ms)
      ✓ increases vehicle quantity by specified amount for admin user (38 ms)
      ✓ increases vehicle quantity by default 1 if amount is not specified for admin (31 ms)

PASS tests/vehicleSearch.test.js
  GET /api/vehicles/search
    ✓ returns 401 when search is attempted without token (15 ms)
    ✓ filters vehicles by make (case-insensitive substring) (42 ms)
    ✓ filters vehicles by category (case-insensitive substring) (35 ms)
    ✓ filters vehicles by minPrice and maxPrice range (38 ms)
    ✓ combines multiple query parameters (41 ms)

PASS tests/car.test.js
PASS tests/auth.test.js
PASS tests/authMiddleware.test.js

Test Suites: 5 passed, 5 total
Tests:       25 passed, 25 total
Time:        9.248 s

============================== FRONTEND TESTS (Vitest) ==============================
 ✓ src/tests/CarList.test.jsx (2 tests)
 ✓ src/tests/Navbar.test.jsx (2 tests)
 ✓ src/tests/ProtectedRoute.test.jsx (2 tests)
 ✓ src/tests/SearchPurchase.test.jsx (4 tests)
 ✓ src/tests/AuthPages.test.jsx (4 tests)
 ✓ src/tests/AdminInventory.test.jsx (4 tests)
 ✓ src/tests/AppIntegration.test.jsx (4 tests)

Test Files: 7 passed, 7 total
Tests:      22 passed, 22 total
Time:       5.50 s
```

---

## 🤖 My AI Usage

### AI Assistant & Pair Programming Workflow
During the development of this project, **Antigravity (Gemini 3.6 Flash / Claude 3.5 Sonnet)** was utilized as an AI pair programmer following strict Test-Driven Development (TDD) guardrails.

- **TDD Enforcement (Red-Green-Refactor)**:
  - The AI assistant was tasked with first writing failing integration and component tests (**RED phase**), running the test runner to empirically verify failure, and committing the tests before writing any production code.
  - Production logic was then implemented to pass all assertions (**GREEN phase**), followed by code cleanup (**REFACTOR phase**).
- **Architectural & Security Guidance**:
  - Guided JWT token generation to include user role claims in signed tokens, ensuring session persistence across page refreshes.
  - Enforced server-side data validation (parsing string inputs to numbers and mapping duplicate VIN entries to HTTP `400`).
- **Co-Authorship Methodology**:
  - All automated git commits created during AI-assisted phases include explicit co-authorship trailers:
    `Co-authored-by: Gemini <Gemini@users.noreply.github.com>` or `Co-authored-by: AI Assistant <AI@users.noreply.github.com>`.