# Development & Guardrail Prompts Log

This document records the structured prompts, architectural guardrails, and Test-Driven Development (TDD) iterations used during the development of the Car Dealership Inventory System.

---

## 1. Environment & Architecture Setup
- **Prompt**: Configured dual-server workspace scripts in root `package.json`, enabled backend CORS middleware, updated Vite proxy configuration target to `http://127.0.0.1:5000` to prevent IPv4/IPv6 `ECONNRESET` resolution errors.
- **Outcome**: Seamless dev environment with automated relative API proxying `/api` for local development.

---

## 2. Authentication & Admin Authorization Flow
- **Prompt**: Implement user registration, login, JWT token issuance, password hashing via `bcryptjs`, and protected routing. Ensure JWT payload includes `role`, `name`, and `email` so `AuthContext` restores admin permissions on page reload.
- **TDD Cycle**:
  - **RED**: Created failing tests in `backend/tests/auth.test.js`, `backend/tests/authMiddleware.test.js`, and `frontend/src/tests/AuthPages.test.jsx`.
  - **GREEN**: Implemented `authController.js`, `authMiddleware.js`, `User.js`, `AuthContext.jsx`, `Login.jsx`, `Register.jsx`, and `ProtectedRoute.jsx`.

---

## 3. Inventory Management (CRUD & Admin Controls)
- **Prompt**: Build inventory listing grid, creation modal, update modal, and deletion trigger. Ensure fields (`year`, `price`, `quantity`) are parsed as numbers and `vin` uniqueness is validated with meaningful `400` error responses.
- **TDD Cycle**:
  - **RED**: Created failing tests in `backend/tests/car.test.js` and `frontend/src/tests/AdminInventory.test.jsx`.
  - **GREEN**: Implemented `carController.js`, `carRoutes.js`, `Car.js`, `CarList.jsx`, and `CarModal.jsx`.

---

## 4. Vehicle Purchase & Restock Endpoints
- **Prompt**: Add purchase (`POST /api/vehicles/:id/purchase`) and restock (`POST /api/vehicles/:id/restock`) endpoints. Ensure purchase decrements `quantity` by 1 (returning `400` when `quantity === 0`), and restock increments `quantity` (admin-only).
- **TDD Cycle**:
  - **RED**: Created failing integration tests in `backend/tests/vehiclePurchaseRestock.test.js`.
  - **GREEN**: Implemented `purchaseCar` and `restockCar` in `carController.js` and mounted routes on both `/api/cars` and `/api/vehicles`.

---

## 5. Vehicle Search & Filter API
- **Prompt**: Add `GET /api/vehicles/search` endpoint supporting query parameters `make`, `model`, `category`, `minPrice`, and `maxPrice`.
- **TDD Cycle**:
  - **RED**: Created failing integration tests in `backend/tests/vehicleSearch.test.js`.
  - **GREEN**: Implemented case-insensitive regex matching and numeric range queries in `searchCars` controller.

---

## 6. Frontend Search & Purchase Integration
- **Prompt**: Update `CarList.jsx` with search bar controls (make/model search input, category dropdown, price range inputs), Purchase button with zero-quantity disabled state, and Restock trigger for Admins.
- **TDD Cycle**:
  - **RED**: Created failing component tests in `frontend/src/tests/SearchPurchase.test.jsx`.
  - **GREEN**: Connected search filtering and purchase/restock actions in `CarList.jsx`.

---

## 7. UI/UX Polish & Tailwind CSS v4 Configuration
- **Prompt**: Configure `@tailwindcss/vite` plugin in `vite.config.js`, add backdrop overlay to `CarModal`, add `isSubmitting` state to buttons, add dismissible alert banners, and add 3-card pulse skeleton loader.
- **Outcome**: Modern, fully styled production UI passing all unit, integration, and E2E test suites.
